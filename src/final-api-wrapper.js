import db from "./firebase-config";
import {
  collection,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

let matchWisePoints = new Map();

export async function getTeamWiseTotalPoints() {
  const DOC_REFERENCE = collection(db, "Owners");
  const DOC_SNAPSHOT = await getDocs(DOC_REFERENCE);

  let ownerDocsMap = new Map();
  DOC_SNAPSHOT.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));

  let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));

  let owners = ownerTeamsMap.get("Names");
  let teamWiseTotalPoints = [];

  for (let i = 0; i < owners.length; i++) {
    let ownerName = owners[i];
    const matchScoresdocRef = doc(db, "Owners", ownerName);

    let ownerMatchScoresMap = new Map();
    ownerMatchScoresMap = new Map(
      Object.entries((await getDoc(matchScoresdocRef)).data())
    );

    let totalPoints = ownerMatchScoresMap.get("1total");
    let teamScore = { no: i + 1, name: ownerName, totalPoints: totalPoints };
    teamWiseTotalPoints.push(teamScore);
  }

  return teamWiseTotalPoints;
}

export async function fetchTeamWiseTotalPoints() {
  const docRef = collection(db, "Owners");
  const docSnaps = await getDocs(docRef);
  let ownerDocsMap = new Map();

  docSnaps.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));

  let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));
  let ownersArr = ownerTeamsMap.get("Names");

  for (let i = 0; i < ownersArr.length; i++) {
    let ownerMatchScoresMap = new Map();
    const owner = ownersArr[i];
    // console.log("owner : " + owner);
    const matchScoresdocRef = doc(db, "Owners", owner);
    ownerMatchScoresMap = new Map(
      Object.entries((await getDoc(matchScoresdocRef)).data())
    );

    ownerMatchScoresMap.delete("1total");
    matchWisePoints.set(owner, []);

    for (let [match, value] of ownerMatchScoresMap) {
      let matchScoresMap = new Map(Object.entries(value));
      let matchInfo = match.split("_");
      let matchId = matchInfo[0];
      let matchVs = matchInfo[1];
      let teamTotalPoints = matchScoresMap.get("1total");

      let matchWiseTeamPoints = {
        matchId: matchId,
        matchVs: matchVs,
        points: teamTotalPoints,
      };

      matchWisePoints.get(owner).push(matchWiseTeamPoints);
    }
  }
}

export function getMatchWisePoints(teamName) {
  // console.log(`Get match wise points for team ${teamName}`)
  let points = matchWisePoints.get(teamName);
  return points;
}
