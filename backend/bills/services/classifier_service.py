# classifier_service.py
import os

def classify_item(item_name):
    use_ml = os.getenv('USE_ML_CLASSIFIER', 'False') == 'True'
    
    # Layer 1: merchant lookup (always runs, no ML needed)
    result = check_merchant_dict(item_name)
    if result:
        return result
    
    # Layer 2: keyword matching (always runs, no ML needed)
    result = check_keywords(item_name)
    if result:
        return result
    
    # Layer 3: ML fallback (only runs if USE_ML_CLASSIFIER=True)
    if use_ml:
        from transformers import pipeline
        classifier = pipeline("zero-shot-classification",
                             model="valhalla/distilbart-mnli-12-3")
        # ... ML classification
    else:
        # fallback when ML not available
        return {
            "category": "Others",
            "category_confidence": 0.5,
            "warranty_detected": False,
            "warranty_confidence": 0.0
        }