import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Bill(models.Model):
    """Main bill/receipt model - stores information about a receipt/bill"""
    
    # Primary key - unique identifier for each bill
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Link to the user who owns this bill
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bills')
    
    # Store/merchant information
    merchant_name = models.CharField(max_length=255, help_text="Name of the store/merchant")
    
    # Financial information
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        help_text="Total bill amount"
    )
    
    # Date of purchase
    purchase_date = models.DateField(help_text="Date when the purchase was made")
    
    # Image storage (Firebase)
    image_url = models.URLField(max_length=500, help_text="URL to bill image in Firebase Storage")
    image_hash = models.CharField(
        max_length=64, 
        db_index=True, 
        help_text="SHA-256 hash for duplicate detection"
    )
    
    # OCR extracted text
    ocr_text = models.TextField(blank=True, help_text="Full text extracted from OCR")
    
    # Warranty tracking
    has_warranty_items = models.BooleanField(default=False, help_text="Does this bill have any items with warranty?")
    warranty_items_count = models.IntegerField(
        default=0, 
        validators=[MinValueValidator(0)],
        help_text="Number of items with warranty"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-purchase_date', '-created_at']  # Newest first
        indexes = [
            models.Index(fields=['-purchase_date']),
            models.Index(fields=['user', '-purchase_date']),
            models.Index(fields=['image_hash']),
        ]

    def __str__(self):
        """String representation for admin panel"""
        return f"{self.merchant_name} - {self.purchase_date} (${self.total_amount})"

    def update_warranty_counts(self):
        """Update warranty-related counts based on items"""
        warranty_count = self.items.filter(has_warranty=True).count()
        self.warranty_items_count = warranty_count
        self.has_warranty_items = warranty_count > 0
        self.save(update_fields=['warranty_items_count', 'has_warranty_items', 'updated_at'])


class BillItem(models.Model):
    """Individual items/products in a bill"""
    
    # Category choices for items
    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'),
        ('appliances', 'Appliances'),
        ('furniture', 'Furniture'),
        ('clothing', 'Clothing'),
        ('groceries', 'Groceries'),
        ('health', 'Health & Beauty'),
        ('sports', 'Sports & Outdoors'),
        ('toys', 'Toys & Games'),
        ('books', 'Books & Media'),
        ('automotive', 'Automotive'),
        ('home', 'Home & Garden'),
        ('other', 'Other'),
    ]

    # Primary key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Link to parent bill
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='items')
    
    # Item details
    name = models.CharField(max_length=255, help_text="Product/item name")
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        help_text="Price per unit"
    )
    total_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        help_text="Total price (quantity × unit_price)"
    )
    
    # Category classification
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        default='other',
        help_text="Item category"
    )
    
    # ML prediction fields for category
    ml_predicted_category = models.CharField(
        max_length=50, 
        blank=True, 
        help_text="Category predicted by ML model"
    )
    ml_category_confidence = models.FloatField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="ML confidence score for category (0-1)"
    )
    category_corrected_by_user = models.BooleanField(
        default=False, 
        help_text="Did user manually change the category?"
    )
    
    # ML prediction fields for warranty
    ml_predicted_warranty = models.BooleanField(
        default=False, 
        help_text="Does ML predict this item has warranty?"
    )
    ml_warranty_confidence = models.FloatField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="ML confidence score for warranty prediction (0-1)"
    )
    warranty_corrected_by_user = models.BooleanField(
        default=False, 
        help_text="Did user manually change warranty status?"
    )
    
    # Actual warranty status
    has_warranty = models.BooleanField(default=False, help_text="Does this item have a warranty?")

    class Meta:
        ordering = ['bill', 'name']
        indexes = [
            models.Index(fields=['bill', 'has_warranty']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        """String representation for admin panel"""
        return f"{self.name} x{self.quantity} - ${self.total_price}"

    def save(self, *args, **kwargs):
        """Auto-calculate total_price if not provided"""
        if not self.total_price:
            self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)


class Warranty(models.Model):
    """Warranty information for bill items"""
    
    # Period unit choices
    PERIOD_UNIT_CHOICES = [
        ('days', 'Days'),
        ('months', 'Months'),
        ('years', 'Years'),
    ]

    # Source of warranty information
    SOURCE_CHOICES = [
        ('auto_detected', 'Auto-detected from OCR'),
        ('user_manual', 'User Manual Entry'),
        ('verbal', 'Verbal/Store Policy'),
    ]

    # Primary key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # One-to-one relationship with BillItem
    bill_item = models.OneToOneField(
        BillItem, 
        on_delete=models.CASCADE, 
        related_name='warranty'
    )
    
    # Warranty duration
    period = models.IntegerField(
        validators=[MinValueValidator(1)], 
        help_text="Warranty duration number"
    )
    period_unit = models.CharField(
        max_length=10, 
        choices=PERIOD_UNIT_CHOICES, 
        default='months',
        help_text="Unit of warranty period"
    )
    
    # Warranty dates
    start_date = models.DateField(help_text="Warranty start date")
    expiry_date = models.DateField(help_text="Warranty expiration date")
    
    # Warranty documentation
    source = models.CharField(
        max_length=20, 
        choices=SOURCE_CHOICES, 
        default='user_manual',
        help_text="How was this warranty information obtained?"
    )
    notes = models.TextField(blank=True, help_text="Additional warranty notes")
    
    # Warranty card/document storage
    warranty_card_url = models.URLField(
        max_length=500, 
        blank=True, 
        help_text="URL to warranty card image in Firebase"
    )
    warranty_card_path = models.CharField(
        max_length=500, 
        blank=True, 
        help_text="Firebase storage path for warranty card"
    )
    has_warranty_card = models.BooleanField(
        default=False, 
        help_text="Is there a warranty card uploaded?"
    )
    
    # Reminder tracking
    reminder_sent_30_days = models.BooleanField(default=False, help_text="30-day reminder sent?")
    reminder_sent_7_days = models.BooleanField(default=False, help_text="7-day reminder sent?")
    reminder_sent_1_day = models.BooleanField(default=False, help_text="1-day reminder sent?")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['expiry_date']
        indexes = [
            models.Index(fields=['expiry_date']),
            models.Index(fields=['start_date']),
        ]

    def __str__(self):
        """String representation for admin panel"""
        return f"{self.bill_item.name} - {self.period} {self.period_unit} (expires {self.expiry_date})"

    @property
    def is_expired(self):
        """Check if warranty has expired"""
        from django.utils import timezone
        return timezone.now().date() > self.expiry_date

    @property
    def days_until_expiry(self):
        """Calculate days remaining until expiry"""
        from django.utils import timezone
        delta = self.expiry_date - timezone.now().date()
        return delta.days

    def save(self, *args, **kwargs):
        """Update related bill_item when warranty is saved"""
        super().save(*args, **kwargs)
        # Make sure the bill item knows it has a warranty
        if not self.bill_item.has_warranty:
            self.bill_item.has_warranty = True
            self.bill_item.save(update_fields=['has_warranty'])