import db from "./firebase-config";
import { getDataFromDoc } from "./firebase-config";
import {
  collection,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  getDocs
} from "firebase/firestore";

let matchWisePoints = new Map();

export async function getOwnerNames() {
  const DOC_REFERENCE = collection(db, "Owners");
  const DOC_SNAPSHOT = await getDocs(DOC_REFERENCE);

  let ownerDocsMap = new Map();
  DOC_SNAPSHOT.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));

  let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));

  let owners = ownerTeamsMap.get("Names");
  return owners
}

export async function getMatches() {
  const manOfTheMatchList = await getDataFromDoc("MatchScores")
  let allMatches = []
  for(const [k] of manOfTheMatchList.entries()) {
    let matchSplit = k.split('_')
    let matchId = matchSplit[0]
    let matchVsTeams = matchSplit[1]
    allMatches.push({
      'id': matchId,
      'teams': matchVsTeams,
      'matchNo': (matchId - 45881) / 5
    })
    allMatches.sort((a, b) => parseFloat(a.matchNo) - parseFloat(b.matchNo)); 
  }
  return allMatches;
}

export async function getLastMatchInfo() {
  let allMatches = await getMatches();
  return allMatches[allMatches.length - 2]
}

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
    let map1 = new Map([...ownerMatchScoresMap.entries()].sort());
    let map2 = new Map(Object.entries(Array.from(map1.values()).pop()));
    // let lastKeyInMap = Array.from(map1.keys()).pop();
    let lastMatchTotal = map2.get("1total")
    if(lastMatchTotal==undefined)
      lastMatchTotal = 0
    let teamScore = { name: ownerName, lastMatchPoints : lastMatchTotal,totalPoints: totalPoints };
    teamWiseTotalPoints.push(teamScore);
    
  }
  // console.log(teamWiseTotalPoints)
  teamWiseTotalPoints.sort((a, b) => parseFloat(b.totalPoints) - parseFloat(a.totalPoints));
  for (const [i] of teamWiseTotalPoints.entries()) {
    if(i < 3) {
      teamWiseTotalPoints[i].no = '💵'
    } else {
      teamWiseTotalPoints[i].no = i+1
    }
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
      let matchNo = (matchId - 45881) / 5;
      let teamTotalPoints = matchScoresMap.get("1total");
      let matchWiseTeamPoints = {
        matchId: matchId,
        matchVs: matchVs,
        matchNo: matchNo,
        points: teamTotalPoints == undefined ? "---" : teamTotalPoints,
      };
      
      matchWisePoints.get(owner).push(matchWiseTeamPoints);
    }
    matchWisePoints.get(owner).sort((a, b) => parseFloat(a.matchNo) - parseFloat(b.matchNo));    
  }
  console.log(matchWisePoints)
}

export function getMatchWisePoints(teamName) {
  // console.log(`Get match wise points for team ${teamName}`)
  let points = matchWisePoints.get(teamName);
  return points;
}
