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

import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../../firebaseConfig';

import { Warranty, WarrantyFormData } from '../types/warranty.types';
import {
  calculateDaysRemaining,
  calculateExpiryDate,
  getWarrantyStatus,
} from '../utils/warrantyCalculations';

const COLLECTION_NAME = 'warranties';

// ─────────────────────────────────────────────────────
// Helper: Get current logged in user safely
// Waits for Firebase Auth to finish loading
// Returns the User object or null if not logged in
// This fixes the "Property uid does not exist on {}" error
// ─────────────────────────────────────────────────────
const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// ============================================================
// ADD WARRANTY
// ============================================================

export const addWarranty = async (
  warrantyData: WarrantyFormData
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Step 1: Wait for auth and get current user
    const currentUser = await getCurrentUser();
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
    // Firestore needs Timestamp instead of JS Date objects
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

export const getWarranties = async (): Promise<Warranty[]> => {
  try {
    // Wait for auth and get current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Build Firestore query
    // Only fetch warranties belonging to this user
    // Sorted by soonest expiry first
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', currentUser.uid),
      orderBy('expiryDate', 'asc')
    );

    const querySnapshot = await getDocs(q);

    // Convert each Firestore document into a Warranty object
    const warranties: Warranty[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Firestore stores dates as Timestamps
      // Convert back to JS Date objects
      const expiryDate = data.expiryDate.toDate();

      const warranty: Warranty = {
        id: doc.id,
        ...data,
        purchaseDate: data.purchaseDate.toDate(),
        expiryDate: expiryDate,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        // Recalculate fresh so days count is always accurate
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