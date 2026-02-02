from rest_framework import serializers
from .models import User
import re

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    account_type = serializers.ChoiceField(choices=['individual', 'business'])
    full_name = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    business_name = serializers.CharField(required=False, allow_blank=True)
    business_type = serializers.CharField(required=False, allow_blank=True)
    business_address = serializers.CharField(required=False, allow_blank=True)
    
    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("This email is already registered")
        return value.lower()
    
    def validate_password(self, value):
        """Validate password strength"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number")
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError("Password must contain at least one letter")
        return value
    
    def create(self, validated_data):
        """Create user"""
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user