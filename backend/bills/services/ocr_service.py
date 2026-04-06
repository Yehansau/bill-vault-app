import re
import os
import base64
import json
from datetime import datetime


def get_vision_client():
    """
    Build and return a Google Cloud Vision client using the same
    service account credentials as Firebase (FIREBASE_CREDENTIALS_B64).
    Falls back to Application Default Credentials in local dev.
    """
    from google.cloud import vision
    import google.oauth2.service_account

    creds_b64 = os.getenv('FIREBASE_CREDENTIALS_B64')
    if creds_b64:
        # Decode base64 credentials and build Vision client explicitly
        creds_dict = json.loads(base64.b64decode(creds_b64).decode('utf-8'))
        creds = google.oauth2.service_account.Credentials.from_service_account_info(
            creds_dict,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        return vision.ImageAnnotatorClient(credentials=creds)

    # Local dev fallback — uses Application Default Credentials
    return vision.ImageAnnotatorClient()


def extract_text_from_url(image_url: str, language: str) -> str:
    """
    Send image URL to Google Cloud Vision API and return extracted text.
    language can be 'english', 'sinhala', or 'tamil'
    """
    from google.cloud import vision

    client = get_vision_client()
    image = vision.Image()
    image.source.image_uri = image_url

    image_context = vision.ImageContext(
        language_hints=[language[:2].lower()]
    )

    response = client.text_detection(
        image=image,
        image_context=image_context
    )

    if response.error.message:
        raise Exception(f'Google Vision API error: {response.error.message}')

    if response.text_annotations:
        return response.text_annotations[0].description

    return ''


def extract_date(text: str) -> str:
    """
    Find and return the first date found in the OCR text.
    Handles common Sri Lankan receipt date formats.
    """
    patterns = [
        r'\d{2}/\d{2}/\d{4}',           # 23/02/2026
        r'\d{1,2}/\d{1,2}/\d{4}',       # 2/28/2026
        r'\d{2}-\d{2}-\d{4}',           # 23-02-2026
        r'\d{2}\.\d{2}\.\d{4}',         # 23.02.2026
        r'\d{4}/\d{2}/\d{2}',           # 2026/02/23
        r'\d{2}-[A-Za-z]{3}-\d{2}',     # 25-Feb-26
        r'\d{1,2}\s[A-Za-z]{3}\s\d{4}', # 31 Jan 2026
        r'[A-Za-z]{3}\s\d{1,2}\s\d{4}', # Jan 31 2026
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group()

    return ''


def extract_total(text: str) -> str:
    """
    Find and return the total amount from OCR text.
    Tries Grand Total first, then Net Amount, SUB TOTAL then TOTAL.
    """
    patterns = [
        r'Grand\s*Total\s*[:\s]*\(?(?:LKR)?\)?\s*([\d,]+\.?\d{0,2})',  # Grand Total (LKR)2,400.00
        r'GRAND\s*TOTAL\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'Net\s*Amount\s*[:\s]*([\d,]+\.?\d{0,2})',                     # Net Amount 570.00
        r'NET\s*AMOUNT\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'Net\s*Total\s*[:\s]*([\d,]+\.?\d{0,2})',                      # Net Total 285.00
        r'NET\s*TOTAL\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'SUB\s*TOTAL\s*[:\s]*([\d,]+\.?\d{0,2})',                      # SUB TOTAL 490.00
        r'Sub\s*Total\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'TOTAL\s*:?\s*(\d[\d,]*\.?\d{0,2})',                           # TOTAL: 250.00
        r'Total\s*:?\s*(\d[\d,]*\.?\d{0,2})',
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            value = match.group(1).replace(',', '').strip('.')
            if value and float(value) > 0:
                return value

    return ''


def extract_items(lines: list) -> list:
    """
    Extract item names and prices from receipt lines.
    Handles multiple Sri Lankan receipt formats.
    """
    items = []

    # Matches decimal numbers like 285.00 or 1,700.00
    price_pattern = re.compile(r'(\d[\d,]*\.\d{2})')

    skip_keywords = [
        'total', 'subtotal', 'sub total', 'grand total',
        'tax', 'vat', 'cash', 'change', 'thank', 'welcome',
        'telephone', 'phone', 'hotline', 'address', 'date',
        'receipt', 'invoice', 'discount', 'party', 'qty',
        'rate', 'amount', 'lkr', 'card', 'cashier', 'table',
        'steward', 'units', 'gross', 'service charge',
        'surcharge', 'balance', 'net total', 'net amount',
        'net', 'paid', 'payment', 'tendered', 'salesman',
        'order', 'important', 'notice', 'software', 'system',
        'powered', 'loyalty', 'points', 'earned', 'star',
        'visa', 'no of', 'exchange', 'frozen', 'barcode',
        'time end', 'time:', 'user:', 'type', 'method',
        'received', 'count', 'pieces', 'pcs',
    ]

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # ── Skip empty lines ──────────────────────────────────────
        if not line:
            i += 1
            continue

        # ── Skip keyword lines ────────────────────────────────────
        if any(kw in line.lower() for kw in skip_keywords):
            i += 1
            continue

        # ── Skip separator lines (----, ====, ...) ────────────────
        if re.match(r'^[-=*_\.\s]+$', line):
            i += 1
            continue

        # ── Skip pure number / barcode lines ─────────────────────
        # e.g. "11300074" or "1.000" alone on a line
        if re.match(r'^[\d\s\.\,\*\/\(\)]+$', line):
            i += 1
            continue

        numbers_in_line = price_pattern.findall(line)

        # ═══════════════════════════════════════════════════════════
        # CASE 1 — Name and price on the SAME line
        # Examples:
        #   "Rice Basmathi 1kg        450.00"
        #   "Chicken Burger  1  650.00  650.00"
        #   "SW488 flower sausage bun  1 x 250.00  250.00"
        #   "(1) RICHLIFE SET KIRI  (110.00 * 1.000)  110.00"
        # ═══════════════════════════════════════════════════════════
        if numbers_in_line:
            # Everything before the first decimal number = name
            name = price_pattern.split(line)[0].strip()

            # Clean up name
            name = re.sub(r'^\(\d+\)\s*', '', name)        # remove (1) prefix
            name = re.sub(r'^\d+\s+', '', name)             # remove "1 " prefix
            name = re.sub(r'\s+\d+\s*[xX]\s*$', '', name)  # remove "1 x" suffix
            name = re.sub(r'\s+\d+\s*$', '', name)          # remove trailing quantity
            name = name.strip()

            # Last decimal number = price
            price = numbers_in_line[-1].replace(',', '')

            # Only add if name is real text and price > 0
            if (name
                    and not re.match(r'^[\d\s\.\,xX\*\(\)]+$', name)
                    and float(price) > 0):
                items.append({'name': name, 'price': price})

            i += 1

        # ═══════════════════════════════════════════════════════════
        # CASE 2 — Name on one line, price on the NEXT line
        # Examples:
        #   "VIM LIQUID DISHWASH"  →  "HHE0160  1.000  285.00  285.00"
        #   "Chicken Pizza"        →  "240.00 X 5 : 1200.00"
        #   "BIO CLEAN TOILET"     →  "1.000  250.00  0.00  250.00"
        # ═══════════════════════════════════════════════════════════
        else:
            potential_name = line

            # Clean up name prefixes
            potential_name = re.sub(r'^\(\d+\)\s*', '', potential_name)
            potential_name = re.sub(r'^\d+\s+', '', potential_name)
            potential_name = potential_name.strip()

            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                next_numbers = price_pattern.findall(next_line)

                # Next line must have decimal numbers
                # and must not be a summary/keyword line
                if next_numbers and not any(
                    kw in next_line.lower() for kw in skip_keywords
                ):
                    price = next_numbers[-1].replace(',', '')

                    if float(price) > 0 and potential_name:
                        items.append({
                            'name': potential_name,
                            'price': price
                        })
                    i += 2  # consumed both name line and price line
                    continue

            i += 1

    return items


def parse_bill_data(ocr_text: str) -> dict:
    """
    Parse raw OCR text from a receipt into structured data.
    Returns merchant, bill_date, total_amount and items.
    """
    lines = ocr_text.split('\n')
    lines = [line for line in lines if line.strip()]

    merchant = lines[0].strip() if lines else ''

    raw_date     = extract_date(ocr_text)
    bill_date    = convert_to_iso_date(raw_date)
    total_amount = extract_total(ocr_text)
    items        = extract_items(lines)

    # If only one item was found and its price looks wrong, use total
    if len(items) == 1 and total_amount:
        items[0]['price'] = total_amount

    return {
        'merchant':     merchant,
        'bill_date':    bill_date,
        'total_amount': total_amount,
        'items':        items,
    }


def parse_warranty_data(ocr_text: str) -> dict:
    """
    Parse raw OCR text from a warranty card into structured data.
    Returns item_name, merchant and warranty_period_months.
    """
    lines = ocr_text.split('\n')
    lines = [line for line in lines if line.strip()]

    item_name = lines[0].strip() if lines else ''
    merchant  = lines[1].strip() if len(lines) > 1 else ''
    warranty_period_months = extract_warranty_period(ocr_text)

    return {
        'item_name':              item_name,
        'merchant':               merchant,
        'warranty_period_months': warranty_period_months,
    }


def extract_warranty_period(text: str) -> int:
    """
    Find warranty period from warranty card text.
    Returns number of months as integer. Defaults to 12.
    """
    month_pattern = r'(\d+)\s*month'
    year_pattern  = r'(\d+)\s*year'

    match = re.search(month_pattern, text.lower())
    if match:
        return int(match.group(1))

    match = re.search(year_pattern, text.lower())
    if match:
        return int(match.group(1)) * 12

    return 12


def convert_to_iso_date(date_str: str) -> str:
    """
    Convert any detected date string to YYYY-MM-DD format for Django.
    Returns empty string if conversion fails.
    """
    if not date_str:
        return ''

    formats = [
        '%d/%m/%Y',   # 23/02/2026
        '%m/%d/%Y',   # 02/23/2026
        '%d-%m-%Y',   # 23-02-2026
        '%d.%m.%Y',   # 23.02.2026
        '%Y/%m/%d',   # 2026/02/23
        '%d-%b-%y',   # 25-Feb-26
        '%d-%b-%Y',   # 25-Feb-2026
        '%d %b %Y',   # 31 Jan 2026
        '%b %d %Y',   # Jan 31 2026
    ]

    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue

    return ''