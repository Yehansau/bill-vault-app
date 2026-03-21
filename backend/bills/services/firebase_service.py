import uuid
from firebase_admin import storage


def upload_bill_image(user_id: str, image_file, filename: str) -> str:
    """
    Upload a bill image to Firebase Storage.
    Stores under bills/{user_id}/{uuid}_{filename}.
    Returns the public URL.
    """
    bucket = storage.bucket()
    path = f'bills/{user_id}/{uuid.uuid4()}_{filename}'
    blob = bucket.blob(path)
    blob.upload_from_file(image_file, content_type='image/jpeg')
    blob.make_public()
    return blob.public_url


def upload_warranty_image(user_id: str, image_file, filename: str) -> str:
    """
    Upload a warranty card image to Firebase Storage.
    Stores under warranties/{user_id}/{uuid}_{filename}.
    Returns the public URL.
    """
    bucket = storage.bucket()
    path = f'warranties/{user_id}/{uuid.uuid4()}_{filename}'
    blob = bucket.blob(path)
    blob.upload_from_file(image_file, content_type='image/jpeg')
    blob.make_public()
    return blob.public_url
