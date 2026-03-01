# classifier_service.py
import os

MERCHANT_CATEGORIES = {
    'keells': 'Grocery',
    'cargills': 'Grocery',
    'arpico': 'Grocery',
    'abans': 'Electronics',
    'singer': 'Electronics',
    'softlogic': 'Electronics',
    'laugfs': 'Utilities',
    'mcdonalds': 'Restaurant',
    'kfc': 'Restaurant',
    'pizzahut': 'Restaurant',
    'osu': 'Healthcare',
    'hemas': 'Healthcare'
}
CATEGORY_KEYWORDS = {
    'Grocery': ['rice', 'milk', 'bread', 'sugar', 'flour', 'egg', 'butter', 
                'vegetable', 'fruit', 'chicken', 'fish', 'meat', 'oil', 'salt'],
    'Electronics': ['laptop', 'phone', 'mobile', 'hdmi', 'cable', 'charger', 
                    'battery', 'camera', 'printer', 'monitor', 'keyboard', 'mouse'],
    'Healthcare': ['tablet', 'syrup', 'medicine', 'vitamin', 'capsule', 
                   'bandage', 'cream', 'drops', 'injection', 'pharmacy'],
    'Restaurant': ['burger', 'pizza', 'rice', 'kottu', 'noodles', 'soup', 
                   'coffee', 'tea', 'juice', 'dessert', 'cake'],
    'Clothing': ['shirt', 'trouser', 'dress', 'shoes', 'socks', 'jacket', 
                 'skirt', 'jeans', 'sandal', 'cap', 'belt'],
    'Utilities': ['electricity', 'water', 'gas', 'internet', 'bill', 
                  'recharge', 'topup', 'subscription'],
}
WARRANTY_KEYWORDS = [
    'tv', 'television', 'laptop', 'computer', 'phone', 'mobile',
    'refrigerator', 'fridge', 'washing machine', 'washer',
    'air conditioner', 'ac', 'microwave', 'oven', 'camera',
    'printer', 'scanner', 'monitor', 'tablet', 'ipad',
    'water heater', 'iron', 'blender', 'mixer', 'fan',
]

#layer 1 - merchant based classification
def check_merchant(item_name, mechant):
    mrchant = mechant.lower()
    for key,catagory in MERCHANT_CATEGORIES.items():
        if key in mrchant:
            return
                {
                'category': catagory,
                'category_confidence': 0.95,
                'warranty_detected': check_warranty(item_name), #to check warranty layer
                'warranty_confidence': 0.80
            }
    return None
#layer 2 - keyword based classification
def check_keywords(item_name):
    item_lower = item_name.lower()
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in item_lower:
                return {
                    'category': category,
                    'category_confidence': 0.80,
                    'warranty_detected': check_warranty(item_name),
                    'warranty_confidence': 0.75
                }
    return None
#layer 3 - warranty detection
def check_warranty(item_name):
    item_lower = item_name.lower()
    for item in WARRANTY_KEYWORDS:
        if item in item_lower:
            return True
    return False
            