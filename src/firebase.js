// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // 🔥 Real-time Database

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqAKrUpSZEEiTRQKGYdNan07nmcxwwnFU",
  authDomain: "iot-final-project-a354c.firebaseapp.com",
  
  // 🎯 INI YANG PENTING UNTUK REALTIME!
  // databaseURL ini menghubungkan ke Firebase Realtime Database
  // Yang memungkinkan data update otomatis tanpa refresh
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

// 🔥 Initialize Realtime Database
// Database instance ini yang digunakan untuk:
// 1. Listen perubahan data real-time (onValue)
// 2. Menulis data ke Firebase (set, update)
// 3. Sinkronisasi otomatis antara device IoT dan dashboard
const database = getDatabase(app);

export { database, analytics };
export default app;
