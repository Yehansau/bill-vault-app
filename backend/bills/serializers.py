from rest_framework import serializers
from .models import Bill, BillItem, Warranty


class WarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model = Warranty
        fields = '__all__'


class BillItemSerializer(serializers.ModelSerializer):
    # Nest warranty inside each item if one exists
    # related_name on Warranty.bill_item is 'warranties' (defined in models.py)
    warranties = WarrantySerializer(many=True, read_only=True)

    class Meta:
        model = BillItem
        fields = '__all__'


class BillSerializer(serializers.ModelSerializer):
    # Nest items array inside each bill
    items = BillItemSerializer(many=True, read_only=True)

    class Meta:
        model = Bill
        fields = '__all__'


class BillListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer used for the home screen bills list.
    Does NOT nest items — keeps the list response fast.
    """
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = [
            'id', 'upload_type', 'language', 'merchant',
            'bill_date', 'total_amount', 'firebase_image_url',
            'status', 'created_at', 'item_count',
        ]

    def get_item_count(self, obj):
        return obj.items.count()
