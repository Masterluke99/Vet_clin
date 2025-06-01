// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Substitua pelos dados do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSFMdkVaQLkLr-5_Zs-CAd9T13cGd-9dg",
  authDomain: "vet-clin.firebaseapp.com",
  projectId: "vet-clin",
  storageBucket: "vet-clin.firebasestorage.app",
  messagingSenderId: "490916384902",
  appId: "1:490916384902:web:f85e64f35f5a0388c90107",
  measurementId: "G-JQYY784TEZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);

export { db, database };
