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

# ──────────────────────────────────────────────────────
# UPLOAD FLOW — 3 steps called in sequence by the app
# ──────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_bill(request):
    """
    STEP 1 — POST /api/bills/upload/

    Receives the image file from the app and uploads it to Firebase Storage.
    No duplicate check here anymore — that happens after OCR in process_bill.

    Request: multipart/form-data
        image       — the image file
        upload_type — 'receipt' or 'warranty'

    Response:
        { firebase_url, image_hash }
    """
    image_file = request.FILES.get('image')
    if not image_file:
        return Response(
            {'error': 'No image provided. Include the image as multipart/form-data with key "image".'},
            status=status.HTTP_400_BAD_REQUEST
        )

    upload_type = request.data.get('upload_type', 'receipt')

    try:
        # Upload to Firebase and get public URL
        firebase_url = firebase_service.upload_bill_image(
            str(request.user.id),
            image_file,
            image_file.name
        )

        return Response({
            'firebase_url': firebase_url,
        })

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

    Receives the firebase_url from step 1.
    Runs OCR, classifies items, then checks for duplicates using the
    extracted data (merchant + date + total + items).

    Request body (JSON):
        firebase_url  — the URL returned from upload_bill
        language      — 'english', 'sinhala', or 'tamil'
        upload_type   — 'receipt' or 'warranty'

    Response (duplicate found):
        { is_duplicate: true, existing_bill: { ...full bill data } }

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
    language = request.data.get('language', 'english')
    upload_type = request.data.get('upload_type', 'receipt')

    if not firebase_url:
        return Response(
            {'error': 'firebase_url is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Run OCR — send image URL to Google Vision, get back raw text
        ocr_text = ocr_service.extract_text_from_url(firebase_url, language)

        # Standalone warranty card scan — no duplicate check needed, return early
        if upload_type == 'warranty':
            parsed = ocr_service.parse_warranty_data(ocr_text)
            return Response({
                'is_duplicate': False,
                **parsed
            })

        # Receipt — parse bill fields
        parsed = ocr_service.parse_bill_data(ocr_text)

        # Classify each item
        classified_items = []
        for item in parsed.get('items', []):
            classification = classifier_service.classify_item(
                item.get('name', ''),
                parsed.get('merchant', '')
            )
            classified_items.append({**item, **classification})

        # Check for duplicate using real extracted data + items list
        # This is more reliable than image hashing — same bill scanned at
        # different angles will still have the same merchant/date/total/items
        duplicate = duplicate_service.check_duplicate_by_data(
            user_id=request.user.id,
            merchant=parsed.get('merchant', ''),
            bill_date=parsed.get('bill_date'),
            total_amount=parsed.get('total_amount'),
            items=classified_items,
        )

        if duplicate:
            return Response({
                'is_duplicate': True,
                'existing_bill': BillSerializer(duplicate).data,
            })

        # No duplicate — return all extracted and classified data
        return Response({
            'is_duplicate': False,
            'merchant': parsed.get('merchant', ''),
            'bill_date': parsed.get('bill_date'),
            'total_amount': parsed.get('total_amount'),
            'language': language,
            'items': classified_items,
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

    Receives the final reviewed/edited data from the bill review screen.
    Creates Bill, BillItem, and Warranty rows in the database.

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
                    name:                 str,
                    price:                float,
                    category:             str,
                    category_confidence:  float,
                    warranty_detected:    bool,
                    warranty_confidence:  float,
                    warranty: {            <- optional, only if user added warranty details
                        item_name:               str,
                        merchant:                str,
                        purchase_date:           str (YYYY-MM-DD),
                        warranty_period_months:  int,
                        notes:                   str
                    }
                }
            ],
            warranty: {    <- only for standalone warranty scans (no items)
                item_name, merchant, purchase_date, warranty_period_months, notes
            }
        }

    Response:
        { success: true, bill_id, item_count, warranty_count }
    """
    data = request.data

    try:
        # Create the Bill row
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

        # Create a BillItem row for each item in the list
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

            # If user added warranty details for this item, create a Warranty row
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
                    # expiry_date is auto-calculated in Warranty.save()
                )
                warranty_count += 1

        # Handle standalone warranty scan (upload_type == 'warranty', no items array)
        standalone_warranty = data.get('warranty')
        if standalone_warranty and not data.get('items'):
            Warranty.objects.create(
                bill=bill,
                bill_item=None,
                item_name=standalone_warranty.get('item_name', ''),
                merchant=standalone_warranty.get('merchant') or bill.merchant,
                purchase_date=standalone_warranty.get('purchase_date') or None,
                warranty_period_months=standalone_warranty.get('warranty_period_months', 12),
                notes=standalone_warranty.get('notes', ''),
            )
            warranty_count += 1

        return Response({
            'success': True,
            'bill_id': str(bill.id),
            'item_count': len(data.get('items', [])),
            'warranty_count': warranty_count,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Save failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ──────────────────────────────────────────────────────
# GET endpoints — used by home screen and bill detail
# ──────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bills(request):
    """
    GET /api/bills/

    Returns all bills for the logged-in user, newest first.
    Uses the lightweight BillListSerializer (no nested items) to keep it fast.
    Used by the home screen Recent Uploads section.
    """
    bills = Bill.objects.filter(user=request.user).order_by('-created_at')
    return Response(BillListSerializer(bills, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bill_detail(request, id):
    """
    GET /api/bills/<id>/

    Returns one bill with all its items nested inside.
    Used when the user taps a bill to view it.
    """
    try:
        bill = Bill.objects.get(id=id, user=request.user)
    except Bill.DoesNotExist:
        return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(BillSerializer(bill).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_warranty(request, id):
    """
    POST /api/bills/<id>/warranty/

    Adds a warranty to a specific bill item after the bill has already been saved.
    Used when the user scans a warranty card from inside the bill detail screen.

    Request body (JSON):
        {
            bill_item_id:            str (UUID),
            item_name:               str,
            merchant:                str,
            purchase_date:           str (YYYY-MM-DD),
            warranty_period_months:  int,
            notes:                   str
        }
    """
    try:
        bill = Bill.objects.get(id=id, user=request.user)
    except Bill.DoesNotExist:
        return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    bill_item = None

    bill_item_id = data.get('bill_item_id')
    if bill_item_id:
        try:
            bill_item = BillItem.objects.get(id=bill_item_id, bill=bill)
        except BillItem.DoesNotExist:
            return Response({'error': 'BillItem not found'}, status=status.HTTP_404_NOT_FOUND)

    purchase_date_str = request.data.get('purchase_date')
    purchase_date = datetime.strptime(purchase_date_str, '%Y-%m-%d').date()

    warranty = Warranty.objects.create(
        bill=bill,
        bill_item=bill_item,
        item_name=data.get('item_name', ''),
        merchant=data.get('merchant', bill.merchant),
        purchase_date = purchase_date,
        warranty_period_months=data.get('warranty_period_months', 12),
        notes=data.get('notes', ''),
    )

    return Response(WarrantySerializer(warranty).data, status=status.HTTP_201_CREATED)


# ──────────────────────────────────────────────────────
# WARRANTIES — used by home screen warranty tracker
# ──────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_warranties(request):
    """
    GET /api/warranties/

    Returns all warranties for the logged-in user,
    ordered by expiry_date ascending so the soonest expiry shows first.
    Used by the home screen Warranty Tracker section.
    """
    warranties = Warranty.objects.filter(
        bill__user=request.user
    ).order_by('expiry_date')

    return Response(WarrantySerializer(warranties, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_warranty_detail(request, id):
    """
    GET /api/warranties/<id>/

    Returns a single warranty's full details.
    """
    try:
        warranty = Warranty.objects.get(id=id, bill__user=request.user)
    except Warranty.DoesNotExist:
        return Response({'error': 'Warranty not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(WarrantySerializer(warranty).data)