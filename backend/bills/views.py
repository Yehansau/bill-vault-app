from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Bill, BillItem, Warranty
from .serializers import (
    BillSerializer, BillListSerializer,
    BillItemSerializer, WarrantySerializer
)
from .services import firebase_service, duplicate_service, ocr_service, classifier_service

from datetime import datetime

# UPLOAD FLOW  —  3 steps called in strict sequence by the mobile app
#
# Step 1  upload_bill    → push image to Firebase, get back a URL
# Step 2  process_bill   → OCR + ML classification + duplicate detection
# Step 3  save_bill      → write reviewed data permanently to the database
#
# Splitting into three steps lets the client show per-step progress and
# gives the user a chance to review / correct OCR results before anything
# is written to the database.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_bill(request):
    """
    STEP 1 — POST /api/bills/upload/

    Receives the image file from the app and uploads it to Firebase Storage.
    No duplicate check here — that happens after OCR in process_bill, where
    we have real structured data to compare against (more reliable than hashing).

    Request: multipart/form-data
        image       — the image file
        upload_type — 'receipt' or 'warranty'

    Response:
        { firebase_url }
    """
    image_file = request.FILES.get('image')

    # Guard: reject the request immediately if no image was attached
    if not image_file:
        return Response(
            {'error': 'No image provided. Include the image as multipart/form-data with key "image".'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Default to 'receipt' if the client omits upload_type
    upload_type = request.data.get('upload_type', 'receipt')

    try:
        # Push the image to Firebase Storage under the user's own folder
        # and get back the public download URL for subsequent steps
        firebase_url = firebase_service.upload_bill_image(
            str(request.user.id),
            image_file,
            image_file.name
        )

        return Response({'firebase_url': firebase_url})

    except Exception as e:
        return Response(
            {'error': f'Upload failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_bill(request):
    """
    STEP 2 — POST /api/bills/process/

    Receives the firebase_url returned by Step 1.
    Runs OCR on the image, classifies each line item, then checks whether
    this bill already exists in the database using the extracted structured
    data (merchant + date + total + items) rather than image hashing —
    the same bill scanned at different angles will produce the same text.

    Request body (JSON):
        firebase_url  — URL returned by upload_bill
        language      — 'english' | 'sinhala' | 'tamil'
        upload_type   — 'receipt' | 'warranty'

    Response (duplicate found):
        { is_duplicate: true, existing_bill: { ...full bill } }

    Response for receipt (no duplicate):
        {
            is_duplicate: false,
            merchant, bill_date, total_amount, language,
            items: [{ name, price, category, category_confidence,
                      warranty_detected, warranty_confidence }]
        }

    Response for warranty scan:
        { is_duplicate: false, item_name, merchant, warranty_period_months }
    """
    firebase_url = request.data.get('firebase_url')
    language     = request.data.get('language', 'english')
    upload_type  = request.data.get('upload_type', 'receipt')

    # Guard: firebase_url is the only required field at this step
    if not firebase_url:
        return Response(
            {'error': 'firebase_url is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # OCR
        # Send the Firebase image URL to Google Vision and get back raw text.
        # Language hint improves recognition accuracy for non-Latin scripts.
        ocr_text = ocr_service.extract_text_from_url(firebase_url, language)

        # Warranty card fast-path 
        # Warranty scans don't need item classification or duplicate checking —
        # parse the warranty fields and return early.
        if upload_type == 'warranty':
            parsed = ocr_service.parse_warranty_data(ocr_text)
            return Response({'is_duplicate': False, **parsed})

        # Receipt path 

        # Extract structured bill fields (merchant, date, total, raw items)
        parsed = ocr_service.parse_bill_data(ocr_text)

        # Classify each line item into a product category.
        # Merchant name is passed as context — the same item name can belong
        # to different categories depending on the store type.
        classified_items = []
        for item in parsed.get('items', []):
            classification = classifier_service.classify_item(
                item.get('name', ''),
                parsed.get('merchant', '')
            )
            # Merge the original item fields with the classification output
            classified_items.append({**item, **classification})

        # Duplicate detection
        # Compare against existing bills using extracted data rather than image
        # hashing — rotation or lighting differences won't cause false negatives.
        duplicate = duplicate_service.check_duplicate_by_data(
            user_id=request.user.id,
            merchant=parsed.get('merchant', ''),
            bill_date=parsed.get('bill_date'),
            total_amount=parsed.get('total_amount'),
            items=classified_items,
        )

        if duplicate:
            # Return the full existing bill so the client can show the user
            # what was previously saved for this receipt
            return Response({
                'is_duplicate': True,
                'existing_bill': BillSerializer(duplicate).data,
            })

        # No duplicate found — return all extracted and classified data for
        # the user to review on the bill review screen before saving
        return Response({
            'is_duplicate':  False,
            'merchant':      parsed.get('merchant', ''),
            'bill_date':     parsed.get('bill_date'),
            'total_amount':  parsed.get('total_amount'),
            'language':      language,
            'items':         classified_items,
        })

    except Exception as e:
        return Response(
            {'error': f'Processing failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_bill(request):
    """
    STEP 3 — POST /api/bills/save/

    Receives the final reviewed / user-edited data from the bill review screen
    and permanently writes Bill, BillItem, and Warranty rows to the database.
    This is the only step that writes to the database.

    Request body (JSON):
        {
            firebase_url:   str,
            upload_type:    'receipt' | 'warranty',
            language:       str,
            merchant:       str,
            bill_date:      str  (YYYY-MM-DD, optional),
            total_amount:   float (optional),
            items: [
                {
                    name, price, category,
                    category_confidence, warranty_detected, warranty_confidence,
                    warranty: {           <- optional, only if user added warranty details
                        item_name, merchant, purchase_date (YYYY-MM-DD),
                        warranty_period_months, notes
                    }
                }
            ],
            warranty: {    <- only for standalone warranty scans (no items array)
                item_name, merchant, purchase_date, warranty_period_months, notes
            }
        }

    Response:
        { success: true, bill_id, item_count, warranty_count }
    """
    data = request.data

    try:
        # Create Bill row
        # `or None` converts empty strings from the request body to NULL in the
        # database, keeping optional fields clean rather than storing blank strings
        bill = Bill.objects.create(
            user=request.user,
            upload_type=data.get('upload_type', 'receipt'),
            language=data.get('language', 'english'),
            merchant=data.get('merchant', ''),
            bill_date=data.get('bill_date') or None,
            total_amount=data.get('total_amount') or None,
            firebase_image_url=data.get('firebase_url', ''),
            status='completed',
        )

        warranty_count = 0

        # Create BillItem rows
        for item_data in data.get('items', []):
            item = BillItem.objects.create(
                bill=bill,
                name=item_data.get('name', ''),
                price=item_data.get('price') or None,
                category=item_data.get('category', 'Others'),
                category_confidence=item_data.get('category_confidence', 0.5),
                warranty_detected=item_data.get('warranty_detected', False),
                warranty_confidence=item_data.get('warranty_confidence', 0.0),
            )

            # Per-item warranty (optional)
            # Only created when the user explicitly added warranty details for
            # this item on the review screen.
            # Falls back to the parent bill's merchant / date when the warranty
            # card didn't include those fields separately.
            # expiry_date is NOT set here — it is auto-calculated in Warranty.save()
            warranty_data = item_data.get('warranty')
            if warranty_data:
                Warranty.objects.create(
                    bill=bill,
                    bill_item=item,
                    item_name=warranty_data.get('item_name') or item.name,
                    merchant=warranty_data.get('merchant') or bill.merchant,
                    purchase_date=warranty_data.get('purchase_date') or bill.bill_date,
                    warranty_period_months=warranty_data.get('warranty_period_months', 12),
                    notes=warranty_data.get('notes', ''),
                )
                warranty_count += 1

        # Standalone warranty (no items array)
        # Handles the case where the user scanned a warranty card directly
        # without an accompanying receipt — bill_item is left NULL intentionally.
        standalone_warranty = data.get('warranty')
        if standalone_warranty and not data.get('items'):
            Warranty.objects.create(
                bill=bill,
                bill_item=None,     # no line item to link — warranty is bill-level
                item_name=standalone_warranty.get('item_name', ''),
                merchant=standalone_warranty.get('merchant') or bill.merchant,
                purchase_date=standalone_warranty.get('purchase_date') or None,
                warranty_period_months=standalone_warranty.get('warranty_period_months', 12),
                notes=standalone_warranty.get('notes', ''),
            )
            warranty_count += 1

        return Response({
            'success':       True,
            'bill_id':       str(bill.id),
            'item_count':    len(data.get('items', [])),
            'warranty_count': warranty_count,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Save failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# BILL RETRIEVAL  —  home screen list and bill detail screen

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bills(request):
    """
    GET /api/bills/

    Returns all bills for the logged-in user, newest first.
    Uses BillListSerializer (lightweight — no nested items or warranties)
    to keep list responses fast for the home screen Recent Uploads section.
    """
    # Filter strictly to the requesting user — users must never see each other's bills
    bills = Bill.objects.filter(user=request.user).order_by('-created_at')
    return Response(BillListSerializer(bills, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bill_detail(request, id):
    """
    GET /api/bills/<id>/

    Returns one bill with all its items and warranties fully nested.
    Uses the heavier BillSerializer — only called when the user taps a bill,
    so the extra payload size is acceptable here.
    """
    try:
        # Filtering on both id AND user prevents one user from accessing
        # another user's bills by guessing UUIDs
        bill = Bill.objects.get(id=id, user=request.user)
    except Bill.DoesNotExist:
        # Return 404 rather than 403 — avoids leaking whether the bill exists
        return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(BillSerializer(bill).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_warranty(request, id):
    """
    POST /api/bills/<id>/warranty/

    Attaches a new warranty to a specific bill item after the bill has already
    been saved. Used when the user scans a warranty card from inside the bill
    detail screen rather than during the original upload flow.

    bill_item_id is optional — omitting it creates a bill-level warranty
    with no specific line item linked (bill_item = NULL).

    Request body (JSON):
        {
            bill_item_id:            str (UUID, optional),
            item_name:               str,
            merchant:                str,
            purchase_date:           str (YYYY-MM-DD),
            warranty_period_months:  int,
            notes:                   str
        }
    """
    try:
        # Ownership check: ensure the bill belongs to the requesting user
        bill = Bill.objects.get(id=id, user=request.user)
    except Bill.DoesNotExist:
        return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)

    data     = request.data
    bill_item = None

    # Resolve the optional bill_item_id to a BillItem row.
    # Also verifies the item actually belongs to this bill (prevents cross-bill writes).
    bill_item_id = data.get('bill_item_id')
    if bill_item_id:
        try:
            bill_item = BillItem.objects.get(id=bill_item_id, bill=bill)
        except BillItem.DoesNotExist:
            return Response({'error': 'BillItem not found'}, status=status.HTTP_404_NOT_FOUND)

    # Parse purchase_date string into a Python date object.
    # Strict format enforced — invalid dates will raise ValueError and bubble
    # up to the outer try/except if one were present (consider adding one).
    purchase_date_str = request.data.get('purchase_date')
    purchase_date     = datetime.strptime(purchase_date_str, '%Y-%m-%d').date()

    # expiry_date is auto-calculated in Warranty.save() from purchase_date
    # + warranty_period_months — do not pass it here
    warranty = Warranty.objects.create(
        bill=bill,
        bill_item=bill_item,                                      # NULL if no item selected
        item_name=data.get('item_name', ''),
        merchant=data.get('merchant', bill.merchant),             # fall back to bill's merchant
        purchase_date=purchase_date,
        warranty_period_months=data.get('warranty_period_months', 12),
        notes=data.get('notes', ''),
    )

    return Response(WarrantySerializer(warranty).data, status=status.HTTP_201_CREATED)

# WARRANTY RETRIEVAL  —  home screen warranty tracker

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_warranties(request):
    """
    GET /api/warranties/

    Returns all warranties for the logged-in user ordered by expiry_date
    ascending — soonest-to-expire warranties appear first so the home screen
    tracker can immediately highlight items needing attention.
    """
    # Traverse the bill FK to filter by user without exposing a direct
    # user field on the Warranty model
    warranties = Warranty.objects.filter(
        bill__user=request.user
    ).order_by('expiry_date')

    return Response(WarrantySerializer(warranties, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_warranty_detail(request, id):
    """
    GET /api/warranties/<id>/

    Returns full details for a single warranty.
    Filtering on bill__user enforces ownership — users cannot read
    each other's warranties by guessing IDs.
    """
    try:
        warranty = Warranty.objects.get(id=id, bill__user=request.user)
    except Warranty.DoesNotExist:
        # 404 rather than 403 — avoids leaking whether the warranty exists
        return Response({'error': 'Warranty not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(WarrantySerializer(warranty).data)