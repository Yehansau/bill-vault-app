import re
from google.cloud import vision
from datetime import datetime


def extract_text_from_url(image_url: str, language: str) -> str:
    """Send image URL to Google Cloud Vision API and return extracted text.
    language can be 'english', 'sinhala', or 'tamil'
    """
    client = vision.ImageAnnotatorClient()
    
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
    """Find and return the first date found in the OCR text.
    Handles common Sri Lankan receipt date formats.
    """
    patterns = [
        r'\d{2}/\d{2}/\d{4}',
        r'\d{1,2}/\d{1,2}/\d{4}',
        r'\d{2}-\d{2}-\d{4}',
        r'\d{2}\.\d{2}\.\d{4}',
        r'\d{4}/\d{2}/\d{2}',
        r'[A-Za-z]{3}\s\d{2}\s\d{4}',
        r'\d{2}\s[A-Za-z]{3}\s\d{4}',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group()
    
    return ''


def extract_total(text: str) -> str:
    patterns = [
        r'Grand\s*Total\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'GRAND\s*TOTAL\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'Sub\s*Total\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'TOTAL\s*:?\s*(\d+[\.,]\d{2})',
        r'TOTAL\s*:?\s*Rs\.?\s*(\d+[\.,]\d{2})',
        r'Total\s*:?\s*(\d+[\.,]\d{2})',
        r'AMOUNT\s*:?\s*(\d+[\.,]\d{2})',
        r'NET TOTAL\s*:?\s*(\d+[\.,]\d{2})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).replace(',', '')
    
    return ''


def extract_items(lines: list) -> list:
    items = []
    
    price_pattern = re.compile(r'(\d+[\.,]\d{2})')
    numbers_only = re.compile(r'^[\d\s\.,]+$')
    
    skip_keywords = [
        'total', 'subtotal', 'sub total', 'grand total', 'tax', 'vat',
        'cash', 'change', 'thank', 'welcome', 'tel', 'phone', 'address',
        'date', 'receipt', 'invoice', 'bill', 'discount', 'party',
        'name', 'qty', 'rate', 'amount', 'lkr', 'rs', 'card',
        'cashier', 'table', 'steward', 'ref', 'items', 'units',
        'gross', 'item', 'service charge', 'service', 'surcharge',
        'balance', 'net total', 'net'
    ]
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        
        # Skip empty lines
        if not line:
            i += 1
            continue
        
        # Skip lines with non-item keywords
        if any(keyword in line.lower() for keyword in skip_keywords):
            i += 1
            continue
        
        # Skip lines that are only dashes or special characters
        if re.match(r'^[-=*_\s]+$', line):
            i += 1
            continue
        
        numbers_in_line = price_pattern.findall(line)
        
        # Case 1 — line has name AND numbers
        # Example: "Chicken Burger    1    650.00    650.00"
        if numbers_in_line:
            # Step 1 - get the name first
            name = price_pattern.split(line)[0].strip()
            
            # Step 2 - remove trailing quantity number
            # "Chicken Burger    1" → "Chicken Burger"
            name = re.sub(r'\s+\d+\s*$', '', name).strip()
            
            # Step 3 - get the price (last number on line)
            price = numbers_in_line[-1].replace(',', '.')
            
            # Step 4 - append if valid
            if name and not re.match(r'^[\d\s]+$', name) and float(price) > 0:
                items.append({
                    'name': name,
                    'price': price
                })
            i += 1
        
        # Case 2 — line has NO numbers, next line has numbers
        # Example: "Pancakes" on one line, "2  90.00  180.00" on next
        else:
            potential_name = line
            
            # Check if next line exists and has numbers
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                next_numbers = price_pattern.findall(next_line)
                
                if next_numbers and numbers_only.match(next_line.replace(',', '.')):
                    price = next_numbers[-1].replace(',', '.')
                    
                    if float(price) > 0:
                        items.append({
                            'name': potential_name,
                            'price': price
                        })
                    i += 2  # skip both lines
                    continue
            
            i += 1
    
    return items


def parse_bill_data(ocr_text: str) -> dict:
    """
    Parse raw OCR text from a receipt into structured data.
    Returns a dictionary with merchant, date, total and items.
    """
    lines = ocr_text.split('\n')
    
    # Remove empty lines
    lines = [line for line in lines if line.strip()]
    
    # First line is almost always the merchant name
    merchant = lines[0].strip() if lines else ''
    
    # Extract structured fields
    raw_date = extract_date(ocr_text)
    bill_date = convert_to_iso_date(raw_date)
    total_amount = extract_total(ocr_text)
    items = extract_items(lines)
    
    # If single item with wrong price, use total
    if len(items) == 1 and total_amount:
        items[0]['price'] = total_amount

    return {
        'merchant': merchant,
        'bill_date': bill_date,
        'total_amount': total_amount,
        'items': items
    }


def parse_warranty_data(ocr_text: str) -> dict:
    """
    Parse raw OCR text from a warranty card into structured data.
    Returns a dictionary with item name, merchant and warranty period.
    """
    lines = ocr_text.split('\n')
    lines = [line for line in lines if line.strip()]
    
    item_name = lines[0].strip() if lines else ''
    merchant = lines[1].strip() if len(lines) > 1 else ''
    warranty_period_months = extract_warranty_period(ocr_text)
    
    return {
        'item_name': item_name,
        'merchant': merchant,
        'warranty_period_months': warranty_period_months,
    }


def extract_warranty_period(text: str) -> int:
    """
    Find warranty period from warranty card text.
    Returns number of months as integer.
    """
    month_pattern = r'(\d+)\s*month'
    year_pattern = r'(\d+)\s*year'
    
    match = re.search(month_pattern, text.lower())
    if match:
        return int(match.group(1))
    
    match = re.search(year_pattern, text.lower())
    if match:
        return int(match.group(1)) * 12
    
    return 12


def convert_to_iso_date(date_str: str) -> str:
    """
    Convert any detected date format to YYYY-MM-DD for Django.
    Returns empty string if conversion fails.
    """
    if not date_str:
        return ''
    
    formats = [
        '%m/%d/%Y',
        '%d/%m/%Y',
        '%d-%m-%Y',
        '%d.%m.%Y',
        '%Y/%m/%d',
        '%b %d %Y',
        '%d %b %Y',
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    return ''