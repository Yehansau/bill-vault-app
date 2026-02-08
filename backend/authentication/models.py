from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, *, account_type=None, **extra_fields):
        """
        Create and save a user with the given email and account type.
        """
        if not email:
            raise ValueError("Email is required")
        if not account_type:
            raise ValueError("Account type is required")

        user = self.model(
            email=self.normalize_email(email),
            account_type=account_type,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # Pass account_type via extra_fields
        extra_fields.setdefault('account_type', 'individual')

        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    # Common fields
    email = models.EmailField(unique=True)
    account_type = models.CharField(
        max_length=20,
        choices=[('individual', 'Individual'), ('business', 'Business')]
    )
    phone_number = models.CharField(max_length=15, blank=True)
    
    # Individual account fields
    full_name = models.CharField(max_length=255, blank=True)
    
    # Business account fields
    business_name = models.CharField(max_length=255, blank=True)
    business_type = models.CharField(max_length=100, blank=True)
    business_address = models.TextField(blank=True)

    # System fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # Only email is required for createsuperuser

    def __str__(self):
        if self.account_type == 'business':
            return f"{self.business_name} ({self.email})"
        return f"{self.full_name} ({self.email})" if self.full_name else self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"