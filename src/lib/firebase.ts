import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyCgRouCHWgGETwVRokRsGtcYRg4tcOQgqE",
  authDomain: "domain-ff-store.firebaseapp.com",
  projectId: "domain-ff-store",
  storageBucket: "domain-ff-store.firebasestorage.app",
  messagingSenderId: "149391493134",
  appId: "1:149391493134:web:fa8b2eb488a6f19933145f",
  measurementId: "G-GKD36MCQTV"
};

// Initialize Firebase safely (Singleton Pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
