// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc, getDocs, updateDoc, setDoc,SetOptions } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCkmxCvw2Pe3ASRCBSgcKwXfwqOtOW3Hi4",
  authDomain: "cricketscoredb.firebaseapp.com",
  projectId: "cricketscoredb",
  storageBucket: "cricketscoredb.appspot.com",
  messagingSenderId: "430514396947",
  appId: "1:430514396947:web:69ac68199c6a3143bec4e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
const db = getFirestore()
const ownersCollection =  collection(db,'Owners')
export default db;
