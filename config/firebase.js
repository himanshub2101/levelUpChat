import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBfIiQaNNHRogz4ywhgiMwSMjkLoy4njZw",
  authDomain: "levelupchat-4b076.firebaseapp.com",
  projectId: "levelupchat-4b076",
  storageBucket: "levelupchat-4b076.appspot.com",
  messagingSenderId: "798055991217",
  appId: "1:798055991217:web:1c48e30ee145701e8c9f90",
  measurementId: "G-4QYLL935MP"
};
// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); // Use getFirestore function

export { auth, firestore }; // Export auth and firestore
