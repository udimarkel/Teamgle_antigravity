// Firebase Configuration and Initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvyTB636tDSYNK3sUYlWTnMrqsRjGhf_0",
  authDomain: "teamgle-9b1c5.firebaseapp.com",
  databaseURL:
    "https://teamgle-9b1c5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "teamgle-9b1c5",
  storageBucket: "teamgle-9b1c5.firebasestorage.app",
  messagingSenderId: "640402208616",
  appId: "1:640402208616:web:82592df2ff39c36b3408dd",
  measurementId: "G-3FEYQQ7GD6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
