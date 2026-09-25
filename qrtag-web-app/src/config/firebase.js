// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Your web app's Firebase configuration loaded from environment variables
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "",
  mapKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || ""
};

export const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY || "";

// Initialize Firebase safely
export const Firebase = getApps().length
  ? getApp()
  : firebaseConfig.apiKey
  ? initializeApp(firebaseConfig)
  : null;

export const messaging = typeof window !== "undefined" && Firebase
  ? getMessaging(Firebase)
  : null;

