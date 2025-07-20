// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDCuRBS5cLsh4kEP07V4EYPkxs6h5hN38A",
    authDomain: "fintrack-ac1ae.firebaseapp.com",
    projectId: "fintrack-ac1ae",
    storageBucket: "fintrack-ac1ae.firebasestorage.app",
    messagingSenderId: "815117785535",
    appId: "1:815117785535:web:8678668f836e248516690a",
    measurementId: "G-E4FC4079QE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // ✅ Firestore

export { auth, provider, db };
