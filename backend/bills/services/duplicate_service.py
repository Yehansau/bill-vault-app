def check_duplicate_by_data(user_id, merchant, bill_date, total_amount, items):
    """
    Check if this user already has a bill with the same merchant, date,
    total amount, and items list.

    All 4 must match to be considered a duplicate:
        - merchant (case insensitive)
        - bill_date
        - total_amount
        - sorted list of item names (case insensitive)

    Returns the existing Bill if a duplicate is found, otherwise None.
    """
    from bills.models import Bill, BillItem

    # If we don't have enough data to compare, let it through
    if not merchant or not bill_date or not total_amount:
        return None

    # Step 1 — find bills with matching merchant + date + total
    candidate_bills = Bill.objects.filter(
        user_id=user_id,
        merchant__iexact=merchant,
        bill_date=bill_date,
        total_amount=total_amount,
        status='completed'
    )

    if not candidate_bills.exists():
        return None

    # Step 2 — build sorted list of new item names for comparison
    new_item_names = sorted([
        item.get('name', '').lower().strip()
        for item in items
        if item.get('name', '').strip()
    ])

    # Step 3 — compare items list against each candidate bill
    for bill in candidate_bills:
        existing_item_names = sorted([
            item.name.lower().strip()
            for item in BillItem.objects.filter(bill=bill)
        ])

        if new_item_names == existing_item_names:
            return bill  # all 4 layers match — definite duplicate

    # Merchant + date + total matched but items were different — not a duplicate
    return None