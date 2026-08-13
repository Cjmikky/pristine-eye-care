import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
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

console.log(
  "Firebase App Initialized Successfully"
);

/*
 * Firebase 12.17.0 does not expose
 * getReactNativePersistence in its TypeScript
 * declarations, even though the runtime supports it.
 *
 * We therefore load it dynamically.
 */
const firebaseAuth =
  require("firebase/auth") as any;

const getReactNativePersistence =
  firebaseAuth.getReactNativePersistence;

export const auth = initializeAuth(app, {
  persistence:
    typeof getReactNativePersistence === "function"
      ? getReactNativePersistence(AsyncStorage)
      : undefined,
});

console.log(
  "Firebase Authentication Initialized Successfully"
);

export const db = getFirestore(app);

console.log(
  "Firestore Initialized Successfully"
);

export const storage = getStorage(app);

console.log(
  "Firebase Storage Initialized Successfully"
);

export default app;