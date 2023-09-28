import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPsSfmaArdLj3j9oK2xm7U_2Kv5HdO2Yw",
  authDomain: "pustaka-anime-c06e8.firebaseapp.com",
  projectId: "pustaka-anime-c06e8",
  storageBucket: "pustaka-anime-c06e8.appspot.com",
  messagingSenderId: "518328768376",
  appId: "1:518328768376:web:3e3f54bd40da1c26fada8d",
  measurementId: "G-Z8M4XPTM00",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
