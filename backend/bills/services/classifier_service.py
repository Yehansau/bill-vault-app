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