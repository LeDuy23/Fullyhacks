import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAuELpcComoeGsiwHno2HVmIvYjkXds_M",
  authDomain: "fire-insurance-claim-app.firebaseapp.com",
  databaseURL: "https://fire-insurance-claim-app-default-rtdb.firebaseio.com",
  projectId: "fire-insurance-claim-app",
  storageBucket: "fire-insurance-claim-app.firebasestorage.app",
  messagingSenderId: "1004766503579",
  appId: "1:1004766503579:web:64ab95880fa6d35aae1c3e",
  measurementId: "G-JY9GMMMS9F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

// Dynamically import Firebase Analytics only on the client side
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app); // Initialize analytics in the client side only
  });
}

// Export necessary Firebase functions
export { db, ref, set, get, analytics };
