from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserModelTests(TestCase):

    def test_create_individual_user(self):
        """Test creating an individual user"""
        user = User.objects.create_user(
            email="testuser@example.com",
            password="testpassword123",
            account_type="individual",
            full_name="John Doe"
        )

        self.assertEqual(user.email, "testuser@example.com")
        self.assertEqual(user.account_type, "individual")
        self.assertTrue(user.check_password("testpassword123"))
        self.assertEqual(user.full_name, "John Doe")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)

    def test_create_business_user(self):
        """Test creating a business user"""
        user = User.objects.create_user(
            email="business@example.com",
            password="securepass",
            account_type="business",
            business_name="Tech Corp",
            business_type="IT",
            business_address="123 Tech Street"
        )

        self.assertEqual(user.account_type, "business")
        self.assertEqual(user.business_name, "Tech Corp")
        self.assertEqual(user.business_type, "IT")

    def test_create_superuser(self):
        """Test creating a superuser"""
        admin = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpass"
        )

        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.account_type, "individual")

    def test_email_required(self):
        """Test that email is required"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email="",
                password="test123",
                account_type="individual"
            )

    def test_account_type_required(self):
        """Test that account type is required"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email="test@test.com",
                password="test123",
                account_type=None
            )

    def test_user_string_representation(self):
        """Test __str__ method"""
        user = User.objects.create_user(
            email="john@example.com",
            password="testpass",
            account_type="individual",
            full_name="John Doe"
        )

        self.assertEqual(str(user), "John Doe (john@example.com)")

    def test_authentication(self):
        user = User.objects.create_user(
            email="login@test.com",
            password="mypassword",
            account_type="individual"
        )

        auth_user = authenticate(email="login@test.com", password="mypassword")

        self.assertIsNotNone(auth_user)

    def test_register_with_existing_email(self):
        """Test that creating a user with an existing email fails"""

        # Create first user
        User.objects.create_user(
            email="duplicate@test.com",
            password="password123",
            account_type="individual",
            full_name="First User"
        )

        # Try creating second user with same email
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                email="duplicate@test.com",
                password="password456",
                account_type="individual",
                full_name="Second User"
            )

    def test_register_with_weak_password(self):
        """Test that weak passwords are rejected"""

        weak_password = "123"

        with self.assertRaises(ValidationError):
            validate_password(weak_password)

    def test_login_with_wrong_password(self):
        """Test login fails with incorrect password"""

        User.objects.create_user(
            email="login@test.com",
            password="correctpassword",
            account_type="individual"
        )

        user = authenticate(email="login@test.com", password="wrongpassword")

        self.assertIsNone(user)