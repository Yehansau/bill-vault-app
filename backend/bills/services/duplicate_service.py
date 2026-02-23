import imagehash
import requests
from PIL import Image
from io import BytesIO


def calculate_image_hash(image_url: str) -> str:
    """
    Download the image at image_url and return its perceptual hash string.
    This hash is stored in Bill.image_hash and used to detect duplicate uploads.
    Two photos of the same receipt will produce very similar hashes even
    if taken at slightly different angles or lighting.
    """
    response = requests.get(image_url, timeout=15)
    response.raise_for_status()
    img = Image.open(BytesIO(response.content))
    return str(imagehash.phash(img))


def check_duplicate(user_id, new_hash: str):
    """
    Compare new_hash against all existing bill hashes for this user.
    Returns the existing Bill if a duplicate is found, otherwise None.

    A hash difference below 10 means the images are considered duplicates.
    Lower threshold = stricter matching.
    """
    # Imported here to avoid circular imports at module load time
    from bills.models import Bill

    existing_bills = Bill.objects.filter(
        user_id=user_id
    ).exclude(image_hash='')

    for bill in existing_bills:
        try:
            diff = imagehash.hex_to_hash(new_hash) - imagehash.hex_to_hash(bill.image_hash)
            if diff < 10:
                return bill  # duplicate found — return the existing bill
        except Exception:
            continue  # skip bills with malformed hashes

    return None  # no duplicate found