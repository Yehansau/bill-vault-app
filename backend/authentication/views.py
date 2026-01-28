#from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint to test if API is working
    """
    return Response({
        'status': 'success',
        'message': 'BillVault API is running!',
        'version': '1.0.0'
    })