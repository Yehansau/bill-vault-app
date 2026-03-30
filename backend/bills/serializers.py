from rest_framework import serializers
from .models import Bill, BillItem, Warranty


# WarrantySerializer
# Flat serializer for the Warranty model.
# Exposes all fields; consumed as a nested read-only block inside
# BillItemSerializer rather than as a standalone endpoint.
class WarrantySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Warranty
        fields = '__all__'


# BillItemSerializer 
# Serializer for individual line items on a bill.
# Nests any associated warranties so a single item response contains
# its full warranty history without a separate API call.
class BillItemSerializer(serializers.ModelSerializer):

    # Pull in all warranties linked to this item via the reverse relation.
    # `related_name='warranties'` must be set on Warranty.bill_item in models.py
    # for this accessor to resolve correctly.
    # read_only=True — warranties are managed through their own endpoint,
    # not written here.
    warranties = WarrantySerializer(many=True, read_only=True)

    class Meta:
        model  = BillItem
        fields = '__all__'


# BillSerializer
# Full serializer for a single Bill — used on the bill detail screen.
# Nests the complete list of line items so the client receives everything
# it needs in one response (bill metadata + all items + their warranties).
class BillSerializer(serializers.ModelSerializer):

    # Reverse relation: pulls all BillItem rows whose `bill` FK points here.
    # read_only=True — items are created/updated through their own endpoint.
    items = BillItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Bill
        fields = '__all__'


# BillListSerializer 
# Lightweight serializer used for the home screen / bills list endpoint.
# Intentionally excludes nested items and warranties to keep the list
# response small and fast — detail data is fetched only when a bill is opened.
class BillListSerializer(serializers.ModelSerializer):

    # Computed field: returns the number of line items on the bill.
    # Avoids sending the full items array in list responses while still
    # giving the UI enough information to render a summary card.
    item_count = serializers.SerializerMethodField()

    class Meta:
        model  = Bill
        # Explicit field list (no '__all__') keeps the payload minimal —
        # only the columns the home screen card actually needs are included.
        fields = [
            'id',
            'upload_type',
            'language',
            'merchant',
            'bill_date',
            'total_amount',
            'firebase_image_url',
            'status',
            'created_at',
            'item_count',       # computed — not a model field
        ]

    # SerializerMethodField convention: method must be named get_<field_name>
    # obj.items uses the reverse FK relation defined on BillItem.bill
    def get_item_count(self, obj):
        return obj.items.count()