from django.contrib import admin
from .models import Bill, BillItem, Warranty


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('merchant', 'bill_date', 'total_amount', 'upload_type', 'language', 'status', 'created_at')
    list_filter = ('upload_type', 'language', 'status', 'created_at')
    search_fields = ('merchant', 'image_hash')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(BillItem)
class BillItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'bill', 'price', 'category', 'warranty_detected')
    list_filter = ('category', 'warranty_detected')
    search_fields = ('name', 'bill__merchant')
    readonly_fields = ('id',)


@admin.register(Warranty)
class WarrantyAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'merchant', 'purchase_date', 'expiry_date', 'warranty_period_months')
    list_filter = ('purchase_date', 'expiry_date')
    search_fields = ('item_name', 'merchant')
    readonly_fields = ('id', 'created_at', 'expiry_date')