// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqAKrUpSZEEiTRQKGYdNan07nmcxwwnFU",
  authDomain: "iot-final-project-a354c.firebaseapp.com",
  databaseURL: "https://iot-final-project-a354c-default-rtdb.firebaseio.com",
  projectId: "iot-final-project-a354c",
  storageBucket: "iot-final-project-a354c.firebasestorage.app",
  messagingSenderId: "935352439578",
  appId: "1:935352439578:web:469f3787656b670163d2a3",
  measurementId: "G-65J8EY57K7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const db = getFirestore(app);

export { database, db, analytics };
export default app;
