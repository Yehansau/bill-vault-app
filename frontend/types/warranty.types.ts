// types/warranty.types.ts

export interface Warranty {
  id: string;
  userId: string;
  billId?: string;
  productName: string;
  productImage?: string;
  brand?: string;
  serialNumber?: string;
  purchaseDate: Date;
  warrantyDuration: number;
  expiryDate: Date;
  daysRemaining: number;
  status: WarrantyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired';

export interface WarrantyFormData {
  productName: string;
  productImage?: string;
  brand?: string;
  serialNumber?: string;
  purchaseDate: Date;
  warrantyDuration: number;
}

export type WarrantyFilter = 'all' | 'active' | 'expiring_soon' | 'expired';