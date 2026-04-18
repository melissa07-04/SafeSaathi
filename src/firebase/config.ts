import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6o4Rh3r2DkEfKMDug8O3aRld_HgWxouI",
  authDomain: "safesaathi-c898b.firebaseapp.com",
  projectId: "safesaathi-c898b",
  storageBucket: "safesaathi-c898b.firebasestorage.app",
  messagingSenderId: "1038225502470",
  appId: "1:1038225502470:web:9cf4773aa3f6a669b4ae87",
  measurementId: "G-2GRXJ6WYC8"
};

// 🚀 Initialize Firebase
export const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 🧠 Firestore
export const db = getFirestore(app);

