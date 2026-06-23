import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAZ41AbAm8lhMgiQVEd0J83VyU7MDtqh0",
  authDomain: "liveride-app.firebaseapp.com",
  projectId: "liveride-app",
  storageBucket: "liveride-app.firebasestorage.app",
  messagingSenderId: "1043382716553",
  appId: "1:1043382716553:web:3dc5e7d02407d93201de58",
  measurementId: "G-YHNFMK4NX3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
