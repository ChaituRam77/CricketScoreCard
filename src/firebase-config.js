// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCkmxCvw2Pe3ASRCBSgcKwXfwqOtOW3Hi4",
  authDomain: "cricketscoredb.firebaseapp.com",
  projectId: "cricketscoredb",
  storageBucket: "cricketscoredb.appspot.com",
  messagingSenderId: "430514396947",
  appId: "1:430514396947:web:69ac68199c6a3143bec4e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
const db = getFirestore();
const ownersCollection = collection(db, "Owners");
export default db;

export async function deleteOwnerDocs() {
  const DOC_REFERENCE = collection(db, "Owners");
  const DOC_SNAPSHOT = await getDocs(DOC_REFERENCE);
  let ownerDocsMap = new Map();
  DOC_SNAPSHOT.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));
  let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));
  let owners = ownerTeamsMap.get("Names");
  for (let i = 0; i < owners.length; i++) {
    let ownerName = owners[i];
    console.log(ownerName);
    const ownerScoresdocRef = doc(db, "Owners", ownerName);
    await deleteDoc(ownerScoresdocRef);
    console.log("Deleted");
    await setDoc(ownerScoresdocRef, {
      "1total": 0,
    }).catch((err) => {
      console.log(err.message);
    });
  }
}

export async function getDataFromDoc(docNm, fieldNm) {
  const DOC_REFERENCE = collection(db, "Owners");
  const DOC_SNAPSHOT = await getDocs(DOC_REFERENCE);
  let ownerDocsMap = new Map();
  DOC_SNAPSHOT.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));
  let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get(docNm)));
  return ownerTeamsMap.get(fieldNm);
}
