// services/warrantyService.ts

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

import { db, auth } from '../firebaseConfig';

import { Warranty, WarrantyFormData } from '../types/warranty.types';
import {
  calculateDaysRemaining,
  calculateExpiryDate,
  getWarrantyStatus,
} from '../utils/warrantyCalculations';

const COLLECTION_NAME = 'warranties';

// ============================================================
// ADD WARRANTY
// ============================================================
// Call this when user saves a new warranty.
// It calculates expiry date, status, days remaining
// automatically — you only need to pass the form data.
//
// Example usage:
//   const result = await addWarranty({
//     productName: "Samsung TV",
//     purchaseDate: new Date(),
//     warrantyDuration: 24
//   });
//   if (result.success) { console.log("Saved!", result.id) }
// ============================================================

export const addWarranty = async (
  warrantyData: WarrantyFormData
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Step 1: Make sure user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Step 2: Calculate the expiry date from purchase date + duration
    const expiryDate = calculateExpiryDate(
      warrantyData.purchaseDate,
      warrantyData.warrantyDuration
    );

    // Step 3: Calculate how many days remain and what the status is
    const daysRemaining = calculateDaysRemaining(expiryDate);
    const status = getWarrantyStatus(daysRemaining);

    // Step 4: Build the full warranty object
    const warranty: Omit<Warranty, 'id'> = {
      userId: currentUser.uid,
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

    // Step 5: Save to Firestore
    // Note: Firestore needs Timestamp instead of JS Date objects
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...warranty,
      purchaseDate: Timestamp.fromDate(warranty.purchaseDate),
      expiryDate: Timestamp.fromDate(warranty.expiryDate),
      createdAt: Timestamp.fromDate(warranty.createdAt),
      updatedAt: Timestamp.fromDate(warranty.updatedAt),
    });

    console.log('✅ Warranty saved:', docRef.id);
    return { success: true, id: docRef.id };

  } catch (error: any) {
    console.error('❌ Error saving warranty:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================
// GET ALL WARRANTIES
// ============================================================
// Fetches all warranties belonging to the logged-in user.
// Ordered by expiry date (soonest expiring comes first).
// Also recalculates days remaining fresh each time,
// so the count is always accurate even days later.
//
// Example usage:
//   const warranties = await getWarranties();
//   console.log(warranties.length);
// ============================================================

export const getWarranties = async (): Promise<Warranty[]> => {
  try {
    // Step 1: Make sure user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Step 2: Build the Firestore query
    // - Only fetch warranties that belong to this user
    // - Sort by expiry date (soonest first)
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', currentUser.uid),
      orderBy('expiryDate', 'asc')
    );

    const querySnapshot = await getDocs(q);

    // Step 3: Convert each Firestore document into a Warranty object
    const warranties: Warranty[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Firestore stores dates as Timestamps — convert back to JS Date
      const expiryDate = data.expiryDate.toDate();

      const warranty: Warranty = {
        id: doc.id,
        ...data,
        purchaseDate: data.purchaseDate.toDate(),
        expiryDate: expiryDate,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        // Recalculate fresh so it's always accurate
        daysRemaining: calculateDaysRemaining(expiryDate),
        status: getWarrantyStatus(calculateDaysRemaining(expiryDate)),
      } as Warranty;

      warranties.push(warranty);
    });

    return warranties;

  } catch (error: any) {
    console.error('❌ Error fetching warranties:', error);
    return [];
  }
};

// ============================================================
// GET SINGLE WARRANTY BY ID
// ============================================================
// Fetches one warranty using its Firestore document ID.
// Used by the warranty-detail.tsx screen.
//
// Example usage:
//   const warranty = await getWarrantyById("abc123");
//   if (warranty) { console.log(warranty.productName) }
// ============================================================

export const getWarrantyById = async (
  warrantyId: string
): Promise<Warranty | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, warrantyId);
    const docSnap = await getDoc(docRef);

    // Return null if document doesn't exist
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const expiryDate = data.expiryDate.toDate();

    const warranty: Warranty = {
      id: docSnap.id,
      ...data,
      purchaseDate: data.purchaseDate.toDate(),
      expiryDate: expiryDate,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      daysRemaining: calculateDaysRemaining(expiryDate),
      status: getWarrantyStatus(calculateDaysRemaining(expiryDate)),
    } as Warranty;

    return warranty;

  } catch (error: any) {
    console.error('❌ Error fetching warranty by ID:', error);
    return null;
  }
};

// ============================================================
// DELETE WARRANTY
// ============================================================
// Permanently deletes a warranty from Firestore.
// Called from the detail screen when user confirms deletion.
//
// Example usage:
//   const result = await deleteWarranty("abc123");
//   if (result.success) { router.back() }
// ============================================================

export const deleteWarranty = async (
  warrantyId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, warrantyId);
    await deleteDoc(docRef);

    console.log('✅ Warranty deleted');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Error deleting warranty:', error);
    return { success: false, error: error.message };
  }
};