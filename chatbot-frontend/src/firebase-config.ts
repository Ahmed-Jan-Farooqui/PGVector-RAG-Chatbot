// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgqpQ8FAlN7RBVJzvC4oAC3KlN53Hy3VQ",
  authDomain: "rag-chatbot-test.firebaseapp.com",
  projectId: "rag-chatbot-test",
  storageBucket: "rag-chatbot-test.appspot.com",
  messagingSenderId: "522517369193",
  appId: "1:522517369193:web:17cae6df957ea90cf56df8",
  measurementId: "G-9C70R15TJG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const backend_root = "http://localhost:8000";
