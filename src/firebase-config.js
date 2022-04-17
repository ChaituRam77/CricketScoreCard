// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  updateDoc,
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

export async function getAllDocs() {
  try {
    const docSnaps = await getDocs(ownersCollection);
    let docMap = new Map();
    docSnaps.docs.map((doc) => docMap.set(doc.id, doc.data()));
    return docMap;
  } catch (error) {
    console.log("getAllDocs() error : " + error.message);
  }
}

export async function getDataFromDoc(docNm) {
  try {
    let docDataMap = new Map(Object.entries((await getAllDocs()).get(docNm)));
    return docDataMap;
  } catch (error) {
    console.log("getDataFromDoc() Error : " + error.message);
  }
}

export async function getFieldDataFromDoc(docNm, fieldNm) {
  try {
    let docDataMap = new Map(Object.entries((await getAllDocs()).get(docNm)));
    return docDataMap.get(fieldNm);
  } catch (error) {
    console.log("getFieldDataFromDoc() Error : " + error.message);
  }
}

export async function deleteOwnerDocs() {
  let ownerTeamsMap = new Map(
    Object.entries((await getAllDocs()).get("teams"))
  );
  let owners = ownerTeamsMap.get("Names");
  for (let i = 0; i < owners.length; i++) {
    let ownerName = owners[i];
    const ownerScoresdocRef = doc(db, "Owners", ownerName);
    await deleteDoc(ownerScoresdocRef);
    await setDoc(ownerScoresdocRef, {
      "1total": 0,
    }).catch((err) => {
      console.log(err.message);
    });
  }
  console.log("Deleted");
}
export async function deleteMatchScoreOfOwners(matchToDelete) {
  console.log("deleteMatchScore");
  let ownerMap = await getFieldDataFromDoc("teams", "Names");
  for (let i = 0; i < ownerMap.length; i++) {
    let ownerName = ownerMap[i];
    const ownerScoresdocRef = doc(db, "Owners", ownerName);
    await updateDoc(ownerScoresdocRef, {
      [matchToDelete]: deleteField(),
    });
  }
}
export async function addFieldToDB(documentNm, fieldNm, fieldObj) {
  const docRef = doc(db, "Owners", documentNm);
  // const obj = Object.fromEntries(fieldObj);
  await setDoc(
    docRef,
    {
      [fieldNm]: fieldObj,
    },
    { merge: true }
  ).catch((err) => {
    console.log("error: " + err.message);
  });
}
