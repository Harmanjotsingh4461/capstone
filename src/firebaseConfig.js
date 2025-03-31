import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtnIxJ_9IEDWZ0ibzrnVmB_ruwdWaPkM0",
  authDomain: "website-21f23.firebaseapp.com",
  projectId: "website-21f23",
  storageBucket: "website-21f23.appspot.com",
  messagingSenderId: "311958127760",
  appId: "1:311958127760:web:1c183e3c5f0644a1418415",
  measurementId: "G-990T68X8MC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
