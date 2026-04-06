from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date

from .models import Bill, BillItem, Warranty

User = get_user_model()


class BillModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

    def test_create_bill(self):
        bill = Bill.objects.create(
            user=self.user,
            upload_type="receipt",
            language="english",
            merchant="Cargills",
            bill_date=date.today(),
            total_amount=500.00
        )
        self.assertEqual(bill.merchant, "Cargills")
        self.assertEqual(bill.status, "processing")


class BillItemTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="123")
        self.bill = Bill.objects.create(user=self.user, upload_type="receipt", language="english")

    def test_create_bill_item(self):
        item = BillItem.objects.create(
            bill=self.bill,
            name="Milk",
            price=200.00
        )
        self.assertEqual(item.name, "Milk")


class WarrantyTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="123")
        self.bill = Bill.objects.create(user=self.user, upload_type="receipt", language="english")

    def test_warranty_expiry_auto_calculated(self):
        warranty = Warranty.objects.create(
            bill=self.bill,
            item_name="Laptop",
            purchase_date=date(2025, 1, 1),
            warranty_period_months=12
        )
        self.assertIsNotNone(warranty.expiry_date)


# 🔥 API TESTS

class BillAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="123456")
        self.client.login(username="testuser", password="123456")

    def test_get_bills_empty(self):
        response = self.client.get('/api/bills/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_save_bill(self):
        data = {
            "firebase_url": "http://test.com/image.jpg",
            "upload_type": "receipt",
            "language": "english",
            "merchant": "Food City",
            "bill_date": "2025-01-01",
            "total_amount": 1000,
            "items": [
                {
                    "name": "Rice",
                    "price": 500,
                    "category": "Groceries",
                    "category_confidence": 0.9,
                    "warranty_detected": False,
                    "warranty_confidence": 0.0
                }
            ]
        }

        response = self.client.post('/api/bills/save/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])


class WarrantyAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="123456")
        self.client.login(username="testuser", password="123456")

        self.bill = Bill.objects.create(
            user=self.user,
            upload_type="receipt",
            language="english"
        )

    def test_add_warranty(self):
        data = {
            "item_name": "Phone",
            "merchant": "Singer",
            "purchase_date": "2025-01-01",
            "warranty_period_months": 12,
            "notes": "Test warranty"
        }

        response = self.client.post(f'/api/bills/{self.bill.id}/warranty/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)