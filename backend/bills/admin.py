from django.contrib import admin
from .models import Bill, BillItem, Warranty


class BillItemInline(admin.TabularInline):
    """Shows bill items inside the bill edit page"""
    model = BillItem
    extra = 1  # Shows 1 empty form to add new items
    fields = ('name', 'quantity', 'unit_price', 'total_price', 'category', 'has_warranty')
    readonly_fields = ('total_price',)


class WarrantyInline(admin.StackedInline):
    """Shows warranty info inside the bill item edit page"""
    model = Warranty
    extra = 0  # Don't show empty form
    fields = (
        'period', 'period_unit', 'start_date', 'expiry_date', 
        'source', 'has_warranty_card', 'notes'
    )


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    """Configuration for Bill model in admin panel"""
    
    # What columns to show in the list view
    list_display = (
        'merchant_name', 'purchase_date', 'total_amount', 
        'user', 'has_warranty_items', 'warranty_items_count', 'created_at'
    )
    
    # Filters on the right sidebar
    list_filter = ('has_warranty_items', 'purchase_date', 'created_at')
    
    # Search bar fields
    search_fields = ('merchant_name', 'user__username', 'ocr_text')
    
    # Fields that cannot be edited
    readonly_fields = ('id', 'created_at', 'updated_at', 'image_hash')
    
    # Date drill-down navigation
    date_hierarchy = 'purchase_date'
    
    # Show bill items inside the bill page
    inlines = [BillItemInline]
    
    # Organize fields into sections
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'merchant_name', 'total_amount', 'purchase_date')
        }),
        ('Image & OCR', {
            'fields': ('image_url', 'image_hash', 'ocr_text')
        }),
        ('Warranty Information', {
            'fields': ('has_warranty_items', 'warranty_items_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # This section starts collapsed
        }),
    )


@admin.register(BillItem)
class BillItemAdmin(admin.ModelAdmin):
    """Configuration for BillItem model in admin panel"""
    
    # What columns to show in the list view
    list_display = (
        'name', 'bill', 'quantity', 'unit_price', 'total_price', 
        'category', 'has_warranty', 'ml_predicted_warranty'
    )
    
    # Filters on the right sidebar
    list_filter = (
        'category', 'has_warranty', 'ml_predicted_warranty', 
        'category_corrected_by_user', 'warranty_corrected_by_user'
    )
    
    # Search bar fields
    search_fields = ('name', 'bill__merchant_name')
    
    # Fields that cannot be edited
    readonly_fields = ('id', 'total_price')
    
    # Show warranty info inside the item page
    inlines = [WarrantyInline]
    
    # Organize fields into sections
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'bill', 'name', 'quantity', 'unit_price', 'total_price')
        }),
        ('Category', {
            'fields': (
                'category', 'ml_predicted_category', 'ml_category_confidence', 
                'category_corrected_by_user'
            )
        }),
        ('Warranty Status', {
            'fields': (
                'has_warranty', 'ml_predicted_warranty', 'ml_warranty_confidence', 
                'warranty_corrected_by_user'
            )
        }),
    )


@admin.register(Warranty)
class WarrantyAdmin(admin.ModelAdmin):
    """Configuration for Warranty model in admin panel"""
    
    # What columns to show in the list view
    list_display = (
        'bill_item', 'period', 'period_unit', 'start_date', 
        'expiry_date', 'is_expired', 'days_until_expiry', 'source'
    )
    
    # Filters on the right sidebar
    list_filter = ('period_unit', 'source', 'has_warranty_card', 'expiry_date')
    
    # Search bar fields
    search_fields = ('bill_item__name', 'notes')
    
    # Fields that cannot be edited
    readonly_fields = ('id', 'created_at', 'updated_at', 'is_expired', 'days_until_expiry')
    
    # Date drill-down navigation
    date_hierarchy = 'expiry_date'
    
    # Organize fields into sections
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'bill_item')
        }),
        ('Warranty Period', {
            'fields': ('period', 'period_unit', 'start_date', 'expiry_date', 'is_expired', 'days_until_expiry')
        }),
        ('Documentation', {
            'fields': ('source', 'notes', 'has_warranty_card', 'warranty_card_url', 'warranty_card_path')
        }),
        ('Reminders', {
            'fields': ('reminder_sent_30_days', 'reminder_sent_7_days', 'reminder_sent_1_day'),
            'classes': ('collapse',)  # This section starts collapsed
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # This section starts collapsed
        }),
    )

    # Custom column display methods
    def is_expired(self, obj):
        """Display if warranty is expired with icon"""
        return obj.is_expired
    is_expired.boolean = True  # Shows as a checkmark/X icon
    is_expired.short_description = 'Expired?'

    def days_until_expiry(self, obj):
        """Display days until expiry in human-readable format"""
        days = obj.days_until_expiry
        if days < 0:
            return f"Expired {abs(days)} days ago"
        elif days == 0:
            return "Expires today!"
        else:
            return f"{days} days remaining"
    days_until_expiry.short_description = 'Days Until Expiry'