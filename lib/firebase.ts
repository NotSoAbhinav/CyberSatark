import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-l-epF4tWqxewBGV0el-RgmVHyTdcOtw",
  authDomain: "cybersatark.firebaseapp.com",
  projectId: "cybersatark",
  storageBucket: "cybersatark.firebasestorage.app",
  messagingSenderId: "830489971610",
  appId: "1:830489971610:web:033b73783ba2f4dce9c823",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);