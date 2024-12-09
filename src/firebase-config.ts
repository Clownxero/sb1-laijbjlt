import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0Xl3BZH1jRcPfbpF9P7ov9tY3rfnikuU",
  authDomain: "vendor-look-up.firebaseapp.com",
  projectId: "vendor-look-up",
  storageBucket: "vendor-look-up.firebasestorage.app",
  messagingSenderId: "897064389692",
  appId: "1:897064389692:web:451a0ca7d0657a3d728739",
  measurementId: "G-YRLGMRESN8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);