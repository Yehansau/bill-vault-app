from django.urls import path
from . import views

urlpatterns = [
    # Upload flow — 3 steps called in sequence
    path('upload/', views.upload_bill),       # Step 1: upload image + duplicate check
    path('process/', views.process_bill),     # Step 2: OCR + ML classification
    path('save/', views.save_bill),           # Step 3: save reviewed data to DB

    # Bill list and detail
    path('', views.get_bills),                # GET /api/bills/
    path('<uuid:id>/', views.get_bill_detail),              # GET /api/bills/<id>/
    path('<uuid:id>/warranty/', views.add_warranty),        # POST /api/bills/<id>/warranty/
]