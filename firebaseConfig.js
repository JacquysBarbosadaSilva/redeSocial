// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, colection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH-IcQljecvCKzSrpkZ9uab6CJsWWv234",
  authDomain: "redesocial-3d386.firebaseapp.com",
  projectId: "redesocial-3d386",
  storageBucket: "redesocial-3d386.firebasestorage.app",
  messagingSenderId: "1056233924423",
  appId: "1:1056233924423:web:661b5523eceb34425e4e62",
  measurementId: "G-44TTCC2463"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, getDocs, getFirestore, colection, auth, app };