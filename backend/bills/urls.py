from django.urls import path
from . import views

# Bills App URL Configuration
# All routes are mounted under /api/bills/ in the root urls.py.
# The upload flow follows a strict 3-step sequence; the remaining routes
# handle standard bill retrieval and warranty management.

urlpatterns = [

    # Upload Flow
    # These three endpoints must be called in order for every new bill upload.
    # Splitting into steps allows the client to show progress and lets the user
    # review OCR results before they are permanently saved to the database.

    # Step 1 — Accepts the raw image, runs a duplicate check, and returns a
    #           temporary reference ID for the next step.
    path('upload/', views.upload_bill),

    # Step 2 — Takes the temporary reference ID, runs OCR on the uploaded image,
    #           and applies ML classification to extract structured bill data.
    #           Returns a preview payload for the user to review.
    path('process/', views.process_bill),

    # Step 3 — Receives the reviewed (and optionally corrected) data from the
    #           client and permanently writes the bill + line items to the DB.
    path('save/', views.save_bill),


    # Bill Retrieval

    # GET /api/bills/
    # Returns a paginated list of the authenticated user's bills.
    # Uses BillListSerializer (lightweight — no nested items) for fast responses.
    path('', views.get_bills),

    # GET /api/bills/<id>/
    # Returns full detail for a single bill including nested items and warranties.
    # Uses BillSerializer (full nested tree) — called only when a bill is opened.
    # UUID primary key prevents sequential ID enumeration by unauthorised clients.
    path('<uuid:id>/', views.get_bill_detail),


    # Warranty Management 

    # POST /api/bills/<id>/warranty/
    # Attaches a new warranty record to a specific bill item within the given bill.
    # Scoped under the bill's UUID so the view can enforce ownership checks
    # before writing warranty data.
    path('<uuid:id>/warranty/', views.add_warranty),
]