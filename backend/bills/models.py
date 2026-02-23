import uuid
from django.db import models
from django.conf import settings
from dateutil.relativedelta import relativedelta


class Bill(models.Model):
    """Main bill model - one row per uploaded bill"""
    
    UPLOAD_TYPE_CHOICES = [
        ('receipt', 'Receipt'),
        ('warranty', 'Warranty'),
    ]
    
    LANGUAGE_CHOICES = [
        ('english', 'English'),
        ('sinhala', 'Sinhala'),
        ('tamil', 'Tamil'),
    ]
    
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bills')
    upload_type = models.CharField(max_length=20, choices=UPLOAD_TYPE_CHOICES)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    merchant = models.CharField(max_length=255, blank=True)
    bill_date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    firebase_image_url = models.URLField(blank=True)
    image_hash = models.CharField(max_length=64, blank=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['image_hash']),
        ]
    
    def __str__(self):
        return f"{self.merchant or 'Unknown'} - {self.bill_date or 'No date'} ({self.upload_type})"


class BillItem(models.Model):
    """Bill item model - one row per item on a bill"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=100, default='Others')
    category_confidence = models.FloatField(default=0.0)
    warranty_detected = models.BooleanField(default=False)
    warranty_confidence = models.FloatField(default=0.0)
    
    class Meta:
        ordering = ['bill', 'name']
        indexes = [
            models.Index(fields=['bill']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.bill.merchant}"


class Warranty(models.Model):
    """Warranty model - one row per warranty"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='warranties')
    bill_item = models.ForeignKey(BillItem, on_delete=models.CASCADE, null=True, blank=True, related_name='warranties')
    item_name = models.CharField(max_length=255)
    merchant = models.CharField(max_length=255, blank=True)
    purchase_date = models.DateField(null=True, blank=True)
    warranty_period_months = models.IntegerField(default=12)
    expiry_date = models.DateField(null=True, blank=True)
    notify_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    warranty_card_image_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['bill']),
            models.Index(fields=['expiry_date']),
        ]
    
    def __str__(self):
        return f"{self.item_name} - {self.warranty_period_months} months"
    
    def save(self, *args, **kwargs):
        if self.purchase_date and self.warranty_period_months:
            self.expiry_date = self.purchase_date + relativedelta(months=self.warranty_period_months)
        super().save(*args, **kwargs)