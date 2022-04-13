import db from "./firebase-config";
import {
    collection,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    getDocs,
  } from "firebase/firestore";

export async function getOwnerNames() {
    const DOC_REFERENCE = collection(db, "Owners");
    const DOC_SNAPSHOT = await getDocs(DOC_REFERENCE);
    
    let ownerDocsMap = new Map();
    DOC_SNAPSHOT.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));

    let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));
    return ownerTeamsMap.get("Names");
}

export async function getTeamWiseTotalPoints() {
    const DOC_REFERENCE = collection(db, "Owners");
    const DOC_SNAPSHOT = await getDocs(DOC_REFERENCE);
    
    let ownerDocsMap = new Map();
    DOC_SNAPSHOT.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));

    let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));
    
    let owners = ownerTeamsMap.get("Names");
    let teamWiseTotalPoints = []
    for (let i = 0; i < owners.length; i++) {
        let ownerName = owners[i]
        const matchScoresdocRef = doc(db, "Owners", ownerName);
        
        let ownerMatchScoresMap = new Map();
        ownerMatchScoresMap = new Map(
            Object.entries((await getDoc(matchScoresdocRef)).data())
        );
        
        let totalPoints = ownerMatchScoresMap.get("1total");
        let teamScore = { name: ownerName, totalPoints: totalPoints}
        teamWiseTotalPoints.push(teamScore)
    }

    return teamWiseTotalPoints
}

export async function getFullData() {

    const docRef = collection(db, "Owners");
    const docSnaps = await getDocs(docRef);
    let ownerDocsMap = new Map();
    
    docSnaps.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));
    
    let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));
    let ownersArr = ownerTeamsMap.get("Names");
    
    for (let i = 0; i < ownersArr.length; i++) {
      let ownerMatchScoresMap = new Map();
      const owner = ownersArr[i];
      console.log("owner : " + owner);
      const matchScoresdocRef = doc(db, "Owners", owner);
      ownerMatchScoresMap = new Map(
        Object.entries((await getDoc(matchScoresdocRef)).data())
      );
      
      let totalPoints = ownerMatchScoresMap.get("1total");
      ownerMatchScoresMap.delete("1total");
      for (let [match, value] of ownerMatchScoresMap) {
        let matchScoresMap = new Map(Object.entries(value));
        console.log("..." + match + " : " + matchScoresMap.get("1total"));
      }
      console.log("..Total : " + totalPoints);
    }
}