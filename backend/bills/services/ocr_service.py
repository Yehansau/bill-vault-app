import re
from google.cloud import vision
from datetime import datetime


def extract_text_from_url(image_url: str, language: str) -> str:
    """Send image URL to Google Cloud Vision API and return extracted text.
    language can be 'english', 'sinhala', or 'tamil'
    """
    client = vision.ImageAnnotatorClient() #creates a connection to Google's Vision API
    
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
        r'\d{2}/\d{2}/\d{4}',   # 12/10/2024
        r'\d{1,2}/\d{1,2}/\d{4}',    # 2/28/2026
        r'\d{2}-\d{2}-\d{4}',   # 12-10-2024
        r'\d{2}\.\d{2}\.\d{4}', # 12.10.2024
        r'\d{4}/\d{2}/\d{2}',   # 2024/10/12
        r'[A-Za-z]{3}\s\d{2}\s\d{4}', # Dec 10 2024
        r'\d{2}\s[A-Za-z]{3}\s\d{4}', # 10 Dec 2024
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group()
    
    return ''

def extract_total(text: str) -> str:
    patterns = [
        r'Grand\s*Total\s*[:\s]*([\d,]+\.?\d{0,2})',   # Grand Total  1,700.00
        r'GRAND\s*TOTAL\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'Sub\s*Total\s*[:\s]*([\d,]+\.?\d{0,2})',
        r'TOTAL\s*:?\s*(\d+[\.,]\d{2})',     # TOTAL: 1250.00
        r'TOTAL\s*:?\s*Rs\.?\s*(\d+[\.,]\d{2})', # TOTAL: Rs. 1250.00
        r'Total\s*:?\s*(\d+[\.,]\d{2})',      # Total: 1250.00
        r'AMOUNT\s*:?\s*(\d+[\.,]\d{2})',     # AMOUNT: 1250.00
        r'NET TOTAL\s*:?\s*(\d+[\.,]\d{2})',  # NET TOTAL: 1250.00
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).replace(',', '')
    
    return ''

def extract_items(lines: list) -> list:
    items = []
    

    # Pattern: find all numbers on the line, take the last one as price
    price_pattern = re.compile(r'(\d+[\.,]\d{2})')
    
    skip_keywords = [
        'total', 'subtotal', 'sub total', 'grand total', 'tax', 'vat', 
        'cash', 'change', 'thank', 'welcome', 'tel', 'phone', 'address', 
        'date', 'receipt', 'invoice', 'bill', 'discount', 'party',
        'name', 'qty', 'rate', 'amount'

    ]
    
    # Pattern for a line that is ONLY numbers/spaces (qty rate amount line)
    numbers_only = re.compile(r'^[\d\s\.,]+$')
    
    # Pattern for amount at end of line
    amount_pattern = re.compile(r'([\d,]+\.\d{2})\s*$')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        
        if not line:
            continue
            
        if any(keyword in line.lower() for keyword in skip_keywords):
            continue
        
        # Find all numbers in the line
        all_numbers = price_pattern.findall(line)
        
        if all_numbers:
            # Last number is always the amount/price
            price = all_numbers[-1].replace(',', '.')
            
            # Item name is everything before the first number
            name = price_pattern.split(line)[0].strip()
            
            if name and float(price) > 0:
                items.append({
                    'name': name,
                    'price': price
                })
    
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
    raw_date = extract_date(ocr_text)        # e.g. "2/28/2026"
    bill_date = convert_to_iso_date(raw_date) # e.g. "2026-02-28"
    total_amount = extract_total(ocr_text)
    items = extract_items(lines)
    
    # After building items list, if single item with wrong price, use total
    if len(items) == 1 and total_amount:
        items[0]['price'] = total_amount

    return {
        'merchant': merchant,
        'bill_date': bill_date,         # now always YYYY-MM-DD or ''
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
    
    # First line is usually the product or brand name
    item_name = lines[0].strip() if lines else ''
    
    # Second line is usually the merchant or manufacturer
    merchant = lines[1].strip() if len(lines) > 1 else ''
    
    # Extract warranty period in months
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
    # Match patterns like "12 months", "1 year", "2 years"
    month_pattern = r'(\d+)\s*month'
    year_pattern = r'(\d+)\s*year'
    
    # Check for months first
    match = re.search(month_pattern, text.lower())
    if match:
        return int(match.group(1))
    
    # Check for years and convert to months
    match = re.search(year_pattern, text.lower())
    if match:
        return int(match.group(1)) * 12
    
    # Default to 12 months if nothing found
    return 12


def convert_to_iso_date(date_str: str) -> str:
    """
    Convert any detected date format to YYYY-MM-DD for Django.
    Returns empty string if conversion fails.
    """
    if not date_str:
        return ''
    
    # List of formats to try
    formats = [
        '%m/%d/%Y',   # 2/28/2026
        '%d/%m/%Y',   # 28/02/2026
        '%d-%m-%Y',   # 28-02-2026
        '%d.%m.%Y',   # 28.02.2026
        '%Y/%m/%d',   # 2026/02/28
        '%b %d %Y',   # Feb 28 2026
        '%d %b %Y',   # 28 Feb 2026
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    return ''  # if nothing matched, return empty so Django doesn't crash