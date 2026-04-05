/**
 * ============================================================================
 * WARRANTY SERVICE
 * ============================================================================
 * 
 * Handles all Firebase Firestore operations for warranties.
 * Separates database logic from UI components.
 * 
 */

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

// Import Firebase instances
import { db, auth } from '../firebaseConfig';

// Import types and utilities
import { Warranty, WarrantyFormData } from '../types/warranty.types';
import { 
  calculateDaysRemaining, 
  calculateExpiryDate, 
  getWarrantyStatus 
} from '../utils/warrantyCalculations';

/**
 * Firestore collection name for warranties
 */
const COLLECTION_NAME = 'warranties';

/**
 * Add a new warranty to Firestore
 * 
 * Process:
 * 1. Validate user is authenticated
 * 2. Calculate expiry date from purchase date + duration
 * 3. Calculate days remaining and status
 * 4. Save to Firestore with all fields
 * 
 * @param warrantyData - Form data from OCR or manual input
 * @returns Promise with success status and warranty ID
 * 
 * @example
 * const result = await addWarranty({
 *   productName: "iPhone 17 Pro",
 *   purchaseDate: new Date('2024-11-24'),
 *   warrantyDuration: 24
 * });
 * 
 * if (result.success) {
 *   console.log("Warranty added:", result.id);
 * }
 */
export const addWarranty = async (
  warrantyData: WarrantyFormData
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // 1. Verify user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    const userId = currentUser.uid;

    // 2. Calculate expiry date
    const expiryDate = calculateExpiryDate(
      warrantyData.purchaseDate,
      warrantyData.warrantyDuration
    );

    // 3. Calculate derived fields
    const daysRemaining = calculateDaysRemaining(expiryDate);
    const status = getWarrantyStatus(daysRemaining);

    // 4. Build warranty object
    const warranty: Omit<Warranty, 'id'> = {
      userId,
      productName: warrantyData.productName,
      productImage: warrantyData.productImage || undefined,
      brand: warrantyData.brand || undefined,
      serialNumber: warrantyData.serialNumber || undefined,
      purchaseDate: warrantyData.purchaseDate,
      warrantyDuration: warrantyData.warrantyDuration,
      expiryDate,
      daysRemaining,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 5. Save to Firestore (convert Date objects to Timestamps)
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...warranty,
      purchaseDate: Timestamp.fromDate(warranty.purchaseDate),
      expiryDate: Timestamp.fromDate(warranty.expiryDate),
      createdAt: Timestamp.fromDate(warranty.createdAt),
      updatedAt: Timestamp.fromDate(warranty.updatedAt),
    });

    console.log('✅ Warranty added successfully:', docRef.id);
    return { success: true, id: docRef.id };

  } catch (error: any) {
    console.error('❌ Error adding warranty:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all warranties for the currently logged-in user
 * 
 * Features:
 * - Filters by userId automatically
 * - Orders by expiry date (soonest first)
 * - Recalculates days remaining on each load
 * - Converts Firestore Timestamps to Date objects
 * 
 * @returns Promise with array of warranties
 * 
 * @example
 * const warranties = await getWarranties();
 * console.log(`Found ${warranties.length} warranties`);
 */
export const getWarranties = async (): Promise<Warranty[]> => {
  try {
    // 1. Verify user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('⚠️ No user authenticated - returning empty array');
      return [];
    }

    // 2. Build Firestore query
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', currentUser.uid),
      orderBy('expiryDate', 'asc') // Soonest expiry first
    );

    // 3. Execute query
    const querySnapshot = await getDocs(q);

    // 4. Map Firestore documents to Warranty objects
    const warranties: Warranty[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Convert Firestore Timestamps to JavaScript Date objects
      const expiryDate = data.expiryDate.toDate();
      
      // Build warranty object with recalculated fields
      const warranty: Warranty = {
        id: doc.id,
        userId: data.userId,
        billId: data.billId,
        productName: data.productName,
        productImage: data.productImage,
        brand: data.brand,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate.toDate(),
        warrantyDuration: data.warrantyDuration,
        expiryDate: expiryDate,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        // Recalculate these in case the date has changed since last save
        daysRemaining: calculateDaysRemaining(expiryDate),
        status: getWarrantyStatus(calculateDaysRemaining(expiryDate)),
      };

      warranties.push(warranty);
    });

    console.log(`✅ Fetched ${warranties.length} warranties`);
    return warranties;

  } catch (error: any) {
    console.error('❌ Error fetching warranties:', error);
    return [];
  }
};

/**
 * Get a single warranty by its Firestore document ID
 * 
 * @param warrantyId - Firestore document ID
 * @returns Promise with warranty data or null if not found
 * 
 * @example
 * const warranty = await getWarrantyById("abc123");
 * if (warranty) {
 *   console.log(warranty.productName);
 * } else {
 *   console.log("Warranty not found");
 * }
 */
export const getWarrantyById = async (warrantyId: string): Promise<Warranty | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, warrantyId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`⚠️ Warranty not found: ${warrantyId}`);
      return null;
    }

    const data = docSnap.data();
    const expiryDate = data.expiryDate.toDate();
    
    const warranty: Warranty = {
      id: docSnap.id,
      userId: data.userId,
      billId: data.billId,
      productName: data.productName,
      productImage: data.productImage,
      brand: data.brand,
      serialNumber: data.serialNumber,
      purchaseDate: data.purchaseDate.toDate(),
      warrantyDuration: data.warrantyDuration,
      expiryDate: expiryDate,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      daysRemaining: calculateDaysRemaining(expiryDate),
      status: getWarrantyStatus(calculateDaysRemaining(expiryDate)),
    };

    return warranty;

  } catch (error: any) {
    console.error('❌ Error fetching warranty by ID:', error);
    return null;
  }
};

/**
 * Delete a warranty from Firestore
 * 
 * @param warrantyId - Firestore document ID to delete
 * @returns Promise with success status
 * 
 * @example
 * const result = await deleteWarranty("abc123");
 * if (result.success) {
 *   console.log("Warranty deleted");
 * }
 */
export const deleteWarranty = async (
  warrantyId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, warrantyId);
    await deleteDoc(docRef);

    console.log('✅ Warranty deleted successfully');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Error deleting warranty:', error);
    return { success: false, error: error.message };
  }
};