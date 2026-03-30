from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse
from django.db.models import Sum
from django.utils.dateparse import parse_date
from datetime import datetime
from bills.models import Bill, BillItem
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics(request):
    user = request.user

    # Get all bills for the user
    bills = Bill.objects.filter(user=user, status='completed')

    # If no bills, return a special message
    if not bills.exists():
        return Response({
            "message": "You haven't uploaded any bills yet. Upload bills to get started!",
            "totalSpending": 0,
            "numberOfBills": 0,
            "averageBillAmount": 0,
            "chartData": []
        })
    
    # Total spending
    total_spending = bills.aggregate(total=Sum('total_amount'))['total'] or 0

    # Category-wise amounts
    items = BillItem.objects.filter(bill__in=bills)
    category_totals = items.values('category').annotate(amount=Sum('price'))

    # Convert to chart data
    chart_data = []
    for cat in category_totals:
        amount = cat['amount'] or 0
        percentage = (amount / total_spending * 100) if total_spending else 0
        # Assign a color based on category (example)
        color_map = {
            'Groceries': '#00B700',
            'Restaurant': '#9E00C6',
            'Clothing': '#009DFF',
            'Travelling': '#34009C',
        }
        chart_data.append({
            'category': cat['category'],
            'amount': amount,
            'percentage': round(percentage, 2),
            'color': color_map.get(cat['category'], '#CCCCCC')
        })

    response = {
        'total_spending': total_spending,
        'chart_data': chart_data,
        'number_of_bills': bills.count(),
        'average_bill_amount': total_spending / bills.count() if bills.exists() else 0
    }

    return Response(response)