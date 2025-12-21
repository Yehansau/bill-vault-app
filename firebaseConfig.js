import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDB7z_lzumvYbSiJ165Pay6iBwDs1Bm-oU",
  authDomain: "bill-vault-dc594.firebaseapp.com",
  projectId: "bill-vault-dc594",
  storageBucket: "bill-vault-dc594.firebasestorage.app",
  messagingSenderId: "354567306002",
  appId: "1:354567306002:web:6e87f52140052e3bd0d1cb",
  measurementId: "G-5WC5PM7GNN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
