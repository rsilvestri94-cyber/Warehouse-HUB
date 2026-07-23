import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Public client config for the vestas-warehouse-hub Firebase project — not a
// secret (same values that shipped in the legacy static index.html).
const firebaseConfig = {
  apiKey: "AIzaSyD7_vI1SXOZwfYNcFpU1DTFFBMHJqc3rGE",
  authDomain: "vestas-warehouse-hub.firebaseapp.com",
  projectId: "vestas-warehouse-hub",
  storageBucket: "vestas-warehouse-hub.firebasestorage.app",
  messagingSenderId: "277162989901",
  appId: "1:277162989901:web:e2f737b6ccc77554c1bf04",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
