import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';

// Register new user
export const registerUser = async (
  email: string, 
  password: string, 
  fullName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    // Update user profile with name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login existing user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
