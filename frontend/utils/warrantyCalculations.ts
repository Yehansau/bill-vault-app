/**
 * ============================================================================
 * WARRANTY CALCULATION UTILITIES
 * ============================================================================
 * 
 * Pure utility functions for warranty calculations and formatting.
 * No side effects - just input → output transformations.
 * 
 */

import { WarrantyStatus } from '../types/warranty.types';

/**
 * Calculate days remaining until warranty expires
 * 
 * Uses UTC midnight to avoid timezone-related off-by-one errors.
 * Returns negative number if warranty has already expired.
 * 
 * @param expiryDate - Warranty expiration date
 * @returns Number of days remaining (negative if expired)
 * 
 * @example
 * const expiry = new Date('2026-12-31');
 * const days = calculateDaysRemaining(expiry);
 * console.log(days); // e.g., 730 days
 */
export const calculateDaysRemaining = (expiryDate: Date): number => {
  // Get today's date at midnight UTC
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get expiry date at midnight UTC
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  // Calculate difference in milliseconds
  const diffTime = expiry.getTime() - today.getTime();
  
  // Convert to days (round up)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Calculate warranty expiry date from purchase date and duration
 * 
 * Adds the specified number of months to the purchase date.
 * Handles edge cases like Feb 31 → Feb 28/29.
 * 
 * @param purchaseDate - Date when product was purchased
 * @param durationMonths - Warranty duration in months
 * @returns Calculated expiry date
 * 
 * @example
 * const purchase = new Date('2024-01-15');
 * const expiry = calculateExpiryDate(purchase, 24);
 * console.log(expiry); // 2026-01-15
 */
export const calculateExpiryDate = (
  purchaseDate: Date,
  durationMonths: number
): Date => {
  const expiryDate = new Date(purchaseDate);
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
  return expiryDate;
};

/**
 * Determine warranty status based on days remaining
 * 
 * Logic:
 * - > 10 days: active (green)
 * - 1-10 days: expiring_soon (orange) 
 * - ≤ 0 days: expired (red)
 * 
 * @param daysRemaining - Number of days until expiry
 * @returns WarrantyStatus enum value
 * 
 * @example
 * getWarrantyStatus(30);  // 'active'
 * getWarrantyStatus(5);   // 'expiring_soon'
 * getWarrantyStatus(-2);  // 'expired'
 */
export const getWarrantyStatus = (daysRemaining: number): WarrantyStatus => {
  if (daysRemaining <= 0) {
    return 'expired';
  } else if (daysRemaining <= 10) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
};

/**
 * Get hex color code for warranty status
 * 
 * Returns Material Design colors for consistent UI.
 * 
 * @param status - Current warranty status
 * @returns Hex color code string
 * 
 * Colors:
 * - active: Green (#4CAF50)
 * - expiring_soon: Orange (#FF9800)
 * - expired: Red (#F44336)
 */
export const getStatusColor = (status: WarrantyStatus): string => {
  switch (status) {
    case 'active':
      return '#4CAF50'; // Material Green 500
    case 'expiring_soon':
      return '#FF9800'; // Material Orange 500
    case 'expired':
      return '#F44336'; // Material Red 500
    default:
      return '#9E9E9E'; // Material Grey 500 (fallback)
  }
};

/**
 * Get human-readable text for warranty status
 * 
 * @param status - Current warranty status
 * @returns Display text string
 */
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

/**
 * Format days remaining into readable text
 * 
 * Handles singular/plural forms and year conversions.
 * 
 * @param daysRemaining - Number of days until expiry
 * @returns Formatted string
 * 
 * @example
 * formatDaysRemaining(730);  // "2 years"
 * formatDaysRemaining(45);   // "45 days"
 * formatDaysRemaining(1);    // "1 day"
 * formatDaysRemaining(0);    // "Expires today"
 * formatDaysRemaining(-5);   // "Expired"
 */
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
    // Convert to years + days
    const years = Math.floor(daysRemaining / 365);
    const remainingDays = daysRemaining % 365;
    
    if (remainingDays === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${years} year${years > 1 ? 's' : ''} ${remainingDays} days`;
  }
};

/**
 * Format date to readable string
 * 
 * Format: "24 Nov 2026"
 * 
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  return new Date(date).toLocaleDateString('en-GB', options);
};