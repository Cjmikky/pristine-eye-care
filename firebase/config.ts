import { initializeApp } from "firebase/app";

import {
  initializeAuth,
} from "firebase/auth";

import {
  initializeFirestore,
} from "firebase/firestore";

import {
  getStorage,
} from "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyANIf5HnR397mG4XFMceQMaf_1LFTGspdU",
  authDomain: "pristine-eye-care.firebaseapp.com",
  projectId: "pristine-eye-care",
  storageBucket: "pristine-eye-care.firebasestorage.app",
  messagingSenderId: "442366281134",
  appId: "1:442366281134:web:9f27585febce5e606bb43f",
};

console.log(
  "===================================="
);

console.log(
  "Initializing Firebase..."
);

console.log(
  "Project:",
  firebaseConfig.projectId
);

console.log(
  "App ID:",
  firebaseConfig.appId
);

console.log(
  "===================================="
);

/*
 * ========================================
 * FIREBASE APP
 * ========================================
 */

const app =
  initializeApp(
    firebaseConfig
  );

console.log(
  "Firebase App Initialized Successfully"
);

/*
 * ========================================
 * FIREBASE AUTH
 * ========================================
 */

const firebaseAuth =
  require(
    "firebase/auth"
  ) as any;

const getReactNativePersistence =
  firebaseAuth
    .getReactNativePersistence;

export const auth =
  initializeAuth(
    app,
    {
      persistence:
        typeof getReactNativePersistence ===
        "function"
          ? getReactNativePersistence(
              AsyncStorage
            )
          : undefined,
    }
  );

console.log(
  "Firebase Authentication Initialized Successfully"
);

/*
 * ========================================
 * FIRESTORE
 * ========================================
 *
 * IMPORTANT:
 *
 * React Native can sometimes fail to maintain
 * Firestore's normal WebChannel connection.
 *
 * We explicitly force long polling so Firestore
 * uses normal HTTP request/response connections
 * instead.
 */

export const db =
  initializeFirestore(
    app,
    {
      experimentalForceLongPolling:
        true,

      experimentalAutoDetectLongPolling:
        false,
    }
  );

console.log(
  "Firestore Initialized Successfully"
);

console.log(
  "Firestore transport: ACTUAL Forced Long Polling"
);

/*
 * ========================================
 * FIREBASE STORAGE
 * ========================================
 */

export const storage =
  getStorage(app);

console.log(
  "Firebase Storage Initialized Successfully"
);

console.log(
  "===================================="
);

export default app;