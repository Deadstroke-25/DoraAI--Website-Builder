// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dora-ai-cd26a.firebaseapp.com",
  projectId: "dora-ai-cd26a",
  storageBucket: "dora-ai-cd26a.firebasestorage.app",
  messagingSenderId: "774438834279",
  appId: "1:774438834279:web:f2b85ea5cdc71dc4b284c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}