from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"})

@api_view(['POST'])
def register(request):
    data = request.data

    email = data.get('email', '').strip()
    full_name = data.get('name', '').strip()
    phone_number = data.get('number', '').strip()
    password = data.get('password', '')
    confirm_password = data.get('confirmPassword', '')
    agree_terms = data.get('agreeTerms', False)

    # Initialize error dictionary
    errors = {}

    # 1️⃣ Email validation
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not email:
        errors['emailError'] = "Email is required"
    elif not re.match(email_regex, email):
        errors['emailError'] = "Please enter a valid email"
    elif User.objects.filter(email=email).exists():
        errors['emailError'] = "Email already registered"

    # 2️⃣ Password validation
    if not password:
        errors['passwordError'] = "Password is required"
    elif len(password) < 8:
        errors['passwordError'] = "Password must be at least 8 characters"

    # 3️⃣ Confirm password validation
    if not confirm_password:
        errors['confirmPasswordError'] = "Please confirm your password"
    elif password != confirm_password:
        errors['confirmPasswordError'] = "Passwords do not match"

    # 4️⃣ Terms & privacy agreement
    if not agree_terms:
        errors['termsError'] = "You must agree to the Terms of Service and Privacy Policy"

    # If there are errors, return them
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    User.objects.create_user(
        email=email,
        full_name=full_name,
        phone_number=phone_number,
        password=password
    )

    return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)

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

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number
        }
    })
