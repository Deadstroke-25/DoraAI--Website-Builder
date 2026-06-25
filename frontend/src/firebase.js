import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTYGK45wUNnz4Se6HLjlCbKTule4dahTs",
  authDomain: "dora-a9144.firebaseapp.com",
  projectId: "dora-a9144",
  storageBucket: "dora-a9144.firebasestorage.app",
  messagingSenderId: "301240835533",
  appId: "1:301240835533:web:1c45058ebbfa82ac07f884",
  measurementId: "G-00TTWM7C9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };