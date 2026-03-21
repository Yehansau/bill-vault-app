// utils/warrantyCalculations.ts

import { WarrantyStatus } from '../types/warranty.types';

// Calculates how many days are left until the warranty expires
// Returns a negative number if already expired
export const calculateDaysRemaining = (expiryDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

// Takes a purchase date + duration in months, returns the expiry date
export const calculateExpiryDate = (
  purchaseDate: Date,
  durationMonths: number
): Date => {
  const expiryDate = new Date(purchaseDate);
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
  return expiryDate;
};

// Decides the status label based on days remaining
// > 10 days  → active
// 1–10 days  → expiring_soon
// 0 or less  → expired
export const getWarrantyStatus = (daysRemaining: number): WarrantyStatus => {
  if (daysRemaining <= 0) {
    return 'expired';
  } else if (daysRemaining <= 10) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
};

// Returns a color hex code matching the status
// Green = active, Orange = expiring soon, Red = expired
export const getStatusColor = (status: WarrantyStatus): string => {
  switch (status) {
    case 'active':
      return '#4CAF50';
    case 'expiring_soon':
      return '#FF9800';
    case 'expired':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

// Returns a readable label for the status
export const getStatusText = (status: WarrantyStatus): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'expiring_soon':
      return 'Expiring Soon';
    case 'expired':
      return 'Expired';
    default:
      return 'Unknown';
  }
};

// Converts days remaining into a human-friendly string
// Examples:
//   400 → "1 year 35 days"
//   30  → "30 days"
//   1   → "1 day"
//   0   → "Expires today"
//  -5   → "Expired"
export const formatDaysRemaining = (daysRemaining: number): string => {
  if (daysRemaining < 0) {
    return 'Expired';
  } else if (daysRemaining === 0) {
    return 'Expires today';
  } else if (daysRemaining === 1) {
    return '1 day';
  } else if (daysRemaining <= 365) {
    return `${daysRemaining} days`;
  } else {
    const years = Math.floor(daysRemaining / 365);
    const remainingDays = daysRemaining % 365;
    if (remainingDays === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${years} year${years > 1 ? 's' : ''} ${remainingDays} days`;
  }
};

// Formats a Date object into a readable string like "24 Nov 2026"
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-GB', options);
};