import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD--ANH9DO7mI--yfnIR2zKrddLYqmsf0A",
  authDomain: "attendance-system-fb8ce.firebaseapp.com",
  projectId: "attendance-system-fb8ce",
  storageBucket: "attendance-system-fb8ce.firebasestorage.app",
  messagingSenderId: "97240371312",
  appId: "1:97240371312:web:de1b08376b7ed7e442e4b5",
  measurementId: "G-CRE2BQ25ES",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };
