from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import re

from .models import User


@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"})


@api_view(['POST'])
def register(request):
    data = request.data

    # Common fields
    email = data.get('email', '').strip()
    password = data.get('password', '')
    confirm_password = data.get('confirmPassword', '')
    agree_terms = data.get('agreeTerms', False)
    account_type = data.get('accountType', '').lower()  # Frontend sends this!
    
    # Individual account fields
    full_name = data.get('name', '').strip()
    
    # Business account fields  
    business_name = data.get('businessName', '').strip()
    business_type = data.get('businessType', '').strip()
    business_address = data.get('businessAddress', '').strip()
    
    # Common optional field
    phone_number = data.get('number', '').strip()

    # Initialize error dictionary
    errors = {}

    # 1️⃣ Account type validation
    if not account_type or account_type not in ['individual', 'business']:
        errors['accountTypeError'] = "Please select an account type"

    # 2️⃣ Email validation
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not email:
        errors['emailError'] = "Email is required"
    elif not re.match(email_regex, email):
        errors['emailError'] = "Please enter a valid email"
    elif User.objects.filter(email=email).exists():
        errors['emailError'] = "Email already registered"

    # 3️⃣ Password validation
    if not password:
        errors['passwordError'] = "Password is required"
    elif len(password) < 8:
        errors['passwordError'] = "Password must be at least 8 characters"

    # 4️⃣ Confirm password validation
    if not confirm_password:
        errors['confirmPasswordError'] = "Please confirm your password"
    elif password != confirm_password:
        errors['confirmPasswordError'] = "Passwords do not match"

    # 5️⃣ Account type specific validation
    if account_type == 'business':
        if not business_name:
            errors['businessNameError'] = "Business name is required"
        if not business_type:
            errors['businessTypeError'] = "Business type is required"
    # For individual, full_name is optional based on your UI

    # 6️⃣ Terms & privacy agreement
    if not agree_terms:
        errors['termsError'] = "You must agree to the Terms of Service and Privacy Policy"

    # If there are errors, return them
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    # Create the user with appropriate fields based on account type
    if account_type == 'individual':
        user = User.objects.create_user(
            email=email,
            account_type=account_type,
            full_name=full_name,
            phone_number=phone_number,
            password=password
        )
    else:  # business
        user = User.objects.create_user(
            email=email,
            account_type=account_type,
            business_name=business_name,
            business_type=business_type,
            business_address=business_address,
            phone_number=phone_number,
            password=password
        )

    # Return response with appropriate user data
    response_data = {
        "message": "Account created successfully",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "account_type": user.account_type,
        }
    }
    
    if account_type == 'individual':
        response_data["user"]["full_name"] = user.full_name
        response_data["user"]["phone_number"] = user.phone_number
    else:
        response_data["user"]["business_name"] = user.business_name
        response_data["user"]["business_type"] = user.business_type
        response_data["user"]["phone_number"] = user.phone_number

    # Generate tokens so frontend can use API immediately after register
    refresh = RefreshToken.for_user(user)
    response_data["access"] = str(refresh.access_token)
    response_data["refresh"] = str(refresh)
    
    return Response(response_data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if not user:
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    # Return user data based on account type
    user_data = {
        "email": user.email,
        "account_type": user.account_type,
    }
    
    if user.account_type == 'individual':
        user_data["full_name"] = user.full_name
        user_data["phone_number"] = user.phone_number
    else:  # business
        user_data["business_name"] = user.business_name
        user_data["business_type"] = user.business_type
        user_data["business_address"] = user.business_address
        user_data["phone_number"] = user.phone_number

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": user_data
    })