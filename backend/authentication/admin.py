from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'email',
        'full_name',
        'phone_number',
        'is_staff',
        'is_active'
    )
    search_fields = ('email', 'full_name')
    list_filter = ('is_staff', 'is_active')
