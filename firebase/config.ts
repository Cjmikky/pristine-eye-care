import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyANIf5HnR397mG4XFMceQMaf_1LFTGspdU",
  authDomain: "pristine-eye-care.firebaseapp.com",
  projectId: "pristine-eye-care",
  storageBucket: "pristine-eye-care.firebasestorage.app",
  messagingSenderId: "442366281134",
  appId: "1:442366281134:web:9f27585febce5e606bb43f",
};

console.log("====================================");
console.log("Initializing Firebase...");
console.log("Project:", firebaseConfig.projectId);
console.log("App ID:", firebaseConfig.appId);
console.log("====================================");

const app = initializeApp(firebaseConfig);

console.log("Firebase App Initialized Successfully");

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

console.log("Firebase Authentication Initialized Successfully");

export const db = getFirestore(app);

console.log("Firestore Initialized Successfully");

export const storage = getStorage(app);

console.log("Firebase Storage Initialized Successfully");

export default app;