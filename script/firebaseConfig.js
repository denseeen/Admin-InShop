// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyD62vnksliMH1RsDnxiyZc3NN8RWh1S1FA",
    authDomain: "ecommerce-ee900.firebaseapp.com",
    projectId: "ecommerce-ee900",
    storageBucket: "ecommerce-ee900.appspot.com",
    messagingSenderId: "983245224301",
    appId: "1:983245224301:web:9b3891dbd482ae230b4264",
    measurementId: "G-GLFKN96SSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db };
