import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANIf5HnR397mG4XFMceQMaf_1LFTGspdU",
  authDomain: "pristine-eye-care.firebaseapp.com",
  projectId: "pristine-eye-care",
  storageBucket: "pristine-eye-care.firebasestorage.app",
  messagingSenderId: "442366281134",
  appId: "1:442366281134:web:9f27585febce5e606bb43f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;