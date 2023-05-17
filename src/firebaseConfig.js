import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv7iK-cPyACW30DRhI0exJQ1a4HyMbXd8",
  authDomain: "project-managemnet-tool.firebaseapp.com",
  projectId: "project-managemnet-tool",
  storageBucket: "project-managemnet-tool.appspot.com",
  messagingSenderId: "405572277295",
  appId: "1:405572277295:web:25b46cb988845ef53762da",
  measurementId: "G-2H0B2Y92QH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


