from django.urls import path
from . import views


urlpatterns = [
    path('', views.get_warranties),
    path('<uuid:id>/', views.get_warranty_detail),
]