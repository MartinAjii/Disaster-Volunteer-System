import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyC_t0KGp9W7R9-i9aAsaYnU9W2dw7x5dVk",

  authDomain:
    "disaster-volunteer-system.firebaseapp.com",

  projectId:
    "disaster-volunteer-system",

  storageBucket:
    "disaster-volunteer-system.firebasestorage.app",

  messagingSenderId:
    "945813419464",

  appId:
    "1:945813419464:web:4b0e02620328b5186a3cfd"
};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

export { db };