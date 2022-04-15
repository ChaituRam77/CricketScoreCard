<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offser-md-3">
        <h2>Introduce match details</h2>
      </div>
      <form @submit.prevent="validsecretkeyAndProceed">
        <div class="form-group row">
          <label for="inputMatchID" class="col-sm-2 col-form-label"
            >Match ID</label
          >
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              id="inputMatchID"
              placeholder="00000"
              v-model="matchID"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="inputTeam1" class="col-sm-2 col-form-label">Team 1</label>
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              id="inputTeam1"
              placeholder="team1"
              v-model="team1"
            />
          </div>
        </div>

        <div class="form-group row">
          <label for="inputTeam2" class="col-sm-2 col-form-label">Team 2</label>
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              id="inputTeam2"
              placeholder="team2"
              v-model="team2"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="inputMom" class="col-sm-2 col-form-label">MoM</label>
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              id="inputMom"
              placeholder="MoM"
              v-model="mom"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="secretKey" class="col-sm-2 col-form-label"
            >Secret Key</label
          >
          <div class="col-sm-10">
            <input
              type="password"
              class="form-control"
              id="inputPassword"
              placeholder="*******"
              v-model="secretKey"
            />
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import db, { deleteOwnerDocs } from "../firebase-config";
import { getDataFromDoc, deleteMatchScoreOfOwners } from "../firebase-config";
import {
  collection,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import axios from "axios";

export default {
  data() {
    return {
      matchID: null,
      matchNm: null,
      team1: null,
      team2: null,
      mom: null,
      secretKey: null,
      showlogs: null,
      useAPI: null,
      writeToDB: null,
      playersScore: new Map(),
      playersBowling: new Map(),
      playersCatchingStumping: new Map(),
      playersRunOuts: new Map(),
      playersBowlingBowledLbw: new Map(),
      playersNickName: new Map(),
      playersNickNameAsValue: new Map(),
      playersSubstitute: [],
      apiScore: {},
      obj: {},
      switchValues: {
        runs: "runs",
        fours: "fours",
        sixes: "sixes",
        Bowling: "wickets",
        BowledLbw: "bowledNlbw",
        CatchingStumping: "catchNstump",
        RunOuts: "runout",
        Substitute: "in11",
        mom: "mom",
      },
    };
  },
  methods: {
    async validsecretkeyAndProceed() {
      if (this.secretKey == "HailKing") {
        this.showlogs = true;
        this.useAPI = true;
        this.writeToDB = true;
        this.matchNm = this.matchID + "_" + this.team1 + "vs" + this.team2;
        console.log("this.matchNm : " + this.matchNm);
        let matchExistsInDB = await getDataFromDoc(
          "ApiScoreCard",
          this.matchNm
        );
        if (this.writeToDB && matchExistsInDB !== undefined) {
          alert("Match ID already introduced!!!");
          return undefined;
        }
        this.introduceMatchScore();
      } else {
        alert("Invalid Secret Key");
        return undefined;
      }
    },
    async introduceMatchScore() {
      let scorecard = new Map();
      let matchScoreJSON = require("../data/test.json");
      // let matchScoreJSON = await getDataFromDoc(
      //   "ApiScoreCard",
      //   ""
      // );
      let playersMatch = new Map();
      let matchScoreTotalPoints = 0;
      let ownerMatchTotalPoints = new Map();
      let ownerTotalPoints = new Map();
      console.log("Introducing match score");
      playersMatch.set(this.matchID, this.mom);
      console.log("ShowLogs : " + this.showlogs);
      if (this.showlogs) console.log("logs : " + this.matchID + this.mom);

      const options = {
        method: "GET",
        url: "https://unofficial-cricbuzz.p.rapidapi.com/matches/get-scorecard",
        params: { matchId: this.matchID },
        headers: {
          "X-RapidAPI-Host": "unofficial-cricbuzz.p.rapidapi.com",
          "X-RapidAPI-Key":
            "427451b511msh07056d18c6e0adcp1dae07jsn577cf6594d98",
        },
      };

      if (this.useAPI) {
        await axios
          .request(options)
          .then((response) => {
            this.apiScore = response.data;
            scorecard = this.apiScore.scorecard;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.apiScore = matchScoreJSON;
        scorecard = matchScoreJSON.scorecard;
      }
      console.log(this.apiScore);
      if (this.showlogs) {
        console.log(scorecard);
      }
      console.log(scorecard);
      // const matchNm = this.matchId + "_" + match[0] + "vs" + match[1];
      /***
       * Fetch scores of players & assign to playersScore map
       */
      let m = 1;
      Object.entries(scorecard).forEach((item) => {
        console.log("Innings : " + m + "....................");
        m++;
        if (item.batsman !== null) {
          Object.entries(item[1].batsman).forEach((batsman) => {
            let playerScoreSubMap = new Map();
            let plyrNm = batsman[1].name;
            playerScoreSubMap.set(
              this.switchValues.runs,
              this.getValidScore(batsman[1].runs)
            );
            playerScoreSubMap.set(
              this.switchValues.sixes,
              this.getValidScore(batsman[1].sixes)
            );
            playerScoreSubMap.set(
              this.switchValues.fours,
              this.getValidScore(batsman[1].fours)
            );
            this.playersScore.set(plyrNm, playerScoreSubMap);
            let plyrNickNm = batsman[1].nickName;
            if (plyrNickNm !== undefined) {
              // playerScoreSubMap.set("nickName", plyrNickNm);
              this.playersNickName.set(plyrNickNm, plyrNm);
              this.playersNickNameAsValue.set(plyrNm, plyrNickNm);
            }
            if (this.showlogs)
              console.log("Out Desc : " + plyrNm + " - " + batsman[1].outDec);
            this.addOutDescrition(batsman[1].outDec);
          });
        } else {
          console.log("In Else" + item);
        }
      });
      if (this.showlogs) {
        console.log("NickNames Map : " + [...this.playersNickName.entries()]);
        console.log("Bowling Map : " + [...this.playersBowling.entries()]);
      }
      this.adjustNameNAssignToPlayerScore(
        this.playersBowling,
        this.switchValues.Bowling
      );
      if (this.showlogs) {
        console.log(
          "CatchStumpMap : " + [...this.playersCatchingStumping.entries()]
        );
      }
      this.adjustNameNAssignToPlayerScore(
        this.playersCatchingStumping,
        this.switchValues.CatchingStumping
      );
      if (this.showlogs) {
        console.log("RunOutsMap : " + [...this.playersRunOuts.entries()]);
      }
      this.adjustNameNAssignToPlayerScore(
        this.playersRunOuts,
        this.switchValues.RunOuts
      );
      if (this.showlogs) {
        console.log(
          "BowledLbwMap : " + [...this.playersBowlingBowledLbw.entries()]
        );
      }
      this.adjustNameNAssignToPlayerScore(
        this.playersBowlingBowledLbw,
        this.switchValues.BowledLbw
      );
      if (this.showlogs) {
        console.log(
          "playersSubstituteMap : " + [...this.playersSubstitute.entries()]
        );
      }
      this.adjustNameNAssignToPlayerScore(
        this.playersSubstitute,
        this.switchValues.BowledLbw
      );
      this.playersScore.forEach((values, keys) => {
        let playerScoreValues = new Map();
        playerScoreValues = this.playersScore.get(keys);
        if (playerScoreValues.get(this.switchValues.Bowling) == undefined) {
          playerScoreValues.set(this.switchValues.Bowling, 0);
        }
        if (playerScoreValues.get(this.switchValues.BowledLbw) == undefined) {
          playerScoreValues.set(this.switchValues.BowledLbw, 0);
        }
        if (
          playerScoreValues.get(this.switchValues.CatchingStumping) == undefined
        ) {
          playerScoreValues.set(this.switchValues.CatchingStumping, 0);
        }
        if (playerScoreValues.get(this.switchValues.RunOuts) == undefined) {
          playerScoreValues.set(this.switchValues.RunOuts, 0);
        }
        if (playerScoreValues.get(this.switchValues.Substitute) == undefined) {
          playerScoreValues.set(this.switchValues.Substitute, "Y");
        }
      });
      // this.playersScore.forEach((values, keys) => {
      for (let [key, value] of this.playersScore) {
        let subMap = new Map();
        subMap = value;
        if (key == this.mom) {
          value.set(this.switchValues.mom, "Y");
        } else {
          value.set(this.switchValues.mom, "N");
        }
        value.set("1total", this.claculateTotal(subMap));
        const conMap = Object.fromEntries(value);
        // console.log([...[value].entries()]);
        matchScoreTotalPoints = matchScoreTotalPoints + value.get("1total");
        /**
         * DB write MatchScores
         * Doc : MatchScores
         */
        if (this.writeToDB) {
          await this.assignToDB(
            "MatchScores",
            this.matchNm,
            matchScoreTotalPoints,
            key,
            conMap,
            false
          );
          const matchScoreApidocRef = doc(db, "Owners", "ApiScoreCard");
          await setDoc(
            matchScoreApidocRef,
            {
              [this.matchNm]: this.apiScore,
            },
            { merge: true }
          ).catch((err) => {
            console.log("error: " + err.message);
          });
        }
        if (this.showlogs) {
          console.log("Player : " + key);
          console.log(conMap);
        }
      }
      /**
       * DB write MoM to MatchScores
       * Doc : MatchScores
       */
      if (this.writeToDB) {
        const matchScoresdocRef = doc(db, "Owners", "MatchScores");
        await setDoc(
          matchScoresdocRef,
          {
            [this.matchNm]: { "0MoM": this.mom },
          },
          { merge: true }
        );
      }

      const docRef = collection(db, "Owners");
      const docSnaps = await getDocs(docRef);
      let ownerDocsMap = new Map();
      docSnaps.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));
      let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));
      let matchTotalPoints = 0;
      ownerTeamsMap.delete("Names");
      // ownerTeamsMap.forEach((values, keys) => {
      for (let [keys, values] of ownerTeamsMap) {
        //key : OwnerNames values : team players
        let ownerPlayersArr = values;
        let ownerName = keys;
        if (this.showlogs) {
          console.log("Owner Name 1 : " + ownerName);
          console.log(ownerPlayersArr);
        }
        let ownerTeamsTotalPoints = new Map(
          Object.entries(ownerDocsMap.get(ownerName))
        );
        /**
         * DB write 1Total to match name of Owner Name
         * Doc : ownerName
         */
        if (this.writeToDB) {
          await this.assignToDB(ownerName, this.matchNm, 0, NaN, NaN, true);
        }
        ownerMatchTotalPoints.set(ownerName, 0);
        ownerTotalPoints.set(ownerName, ownerTeamsTotalPoints.get("1total"));
        for (let i = 0; i < ownerPlayersArr.length; i++) {
          const element = ownerPlayersArr[i];
          for (let [keys, values] of this.playersScore) {
            // keys : match played players & values :their scores
            let playerPoints = new Map();
            playerPoints = values;
            let playerTotalPoints = playerPoints.get("1total");
            if (
              this.playersNickNameAsValue.has(element) &&
              this.playersNickNameAsValue.get(element) == keys
            ) {
              if (element !== keys) {
                element == this.playersNickNameAsValue.get(element);
                console.log(
                  "Nick Name " +
                    element +
                    " as Player Name of Owner" +
                    ownerName
                );
              }
            }
            if (element == keys) {
              let ownerMatchPoints = ownerMatchTotalPoints.get(ownerName);
              let player1TotalPoints = playerPoints.get("1total");
              let newPoints = ownerMatchPoints + player1TotalPoints;
              ownerMatchTotalPoints.set(ownerName, newPoints);
              let ownerNewPoints = ownerMatchTotalPoints.get(ownerName);
              let playerPointsMap = Object.fromEntries(playerPoints);
              /**
               * DB write player score to Owner Name
               * Doc : ownerName
               */
              if (this.writeToDB) {
                await this.assignToDB(
                  ownerName,
                  this.matchNm,
                  ownerNewPoints,
                  keys,
                  playerPointsMap,
                  false
                );
              }
              if (this.showlogs) {
                console.log(
                  ownerName +
                    " | " +
                    keys +
                    " | " +
                    playerPoints.get("1total") +
                    " | " +
                    ownerNewPoints
                );
                console.log(playerPoints);
              }
            }
          }
        }
      }
      if (this.showlogs) console.log(ownerMatchTotalPoints);
      /**
       * DB write overall 1Total Owner Name
       * Doc : ownerName
       */
      if (this.writeToDB) {
        for (let [key, value] of ownerMatchTotalPoints) {
          const docRef = doc(db, "Owners", key);
          await updateDoc(docRef, {
            "1total": value + ownerTotalPoints.get(key),
          });
        }
      }
      alert("Updated successfully");
    },

    claculateTotal(scoreMap) {
      let battingPoints = 0;
      let bowlingPoints = 0;
      let catchingPoints = 0;
      let runOutPoints = 0;
      let totalPoints = 0;
      let runs = scoreMap.get(this.switchValues.runs);
      battingPoints = runs > 49 ? runs + (runs > 99 ? 20 : 10) : runs;
      battingPoints =
        battingPoints +
        scoreMap.get(this.switchValues.fours) * 1 +
        scoreMap.get(this.switchValues.sixes) * 2;
      // console.log("battingPoints : " + battingPoints);
      let wickets = scoreMap.get(this.switchValues.Bowling);
      bowlingPoints =
        wickets > 2 ? wickets * 20 + (wickets > 4 ? 20 : 10) : wickets * 20;
      bowlingPoints =
        bowlingPoints + scoreMap.get(this.switchValues.BowledLbw) * 5;
      // console.log("bowlingPoints : " + bowlingPoints);
      catchingPoints = scoreMap.get(this.switchValues.CatchingStumping) * 10;
      // console.log("catchingPoints : " + catchingPoints);
      runOutPoints = scoreMap.get(this.switchValues.RunOuts) * 10;
      // console.log("runOutPoints : " + runOutPoints);
      totalPoints =
        battingPoints +
        bowlingPoints +
        catchingPoints +
        runOutPoints +
        (scoreMap.get(this.switchValues.Substitute) == "Y" ? 2 : 0) +
        (scoreMap.get(this.switchValues.mom) == "Y" ? 30 : 0);
      // console.log("totalPoints : " + totalPoints);
      return totalPoints;
    },
    async createFieldInDb(document, matchNm) {
      const docRef = doc(db, "Owners", document);
      await updateDoc(docRef, {
        [matchNm]: { "1total": 0 },
      }).catch((err) => {
        console.log("error: " + err.message);
      });
    },
    async assignToDB(
      document,
      matchNm,
      totalPoints,
      k,
      v,
      createTotalOnlyFlag
    ) {
      const docRef = doc(db, "Owners", document);
      this.obj = v;
      if (createTotalOnlyFlag == true) {
        return await setDoc(
          docRef,
          {
            [matchNm]: { "1total": totalPoints },
          },
          { merge: true }
        ).catch((err) => {
          console.log("error: " + err.message);
        });
      } else {
        return await setDoc(
          docRef,
          {
            [matchNm]: { "1total": totalPoints, [k]: this.obj },
          },
          { merge: true }
        ).catch((err) => {
          console.log("error: " + err.message);
        });
      }
    },
    getValidScore(value) {
      return value == undefined ? 0 : value;
    },
    addOutDescrition(outDesc) {
      /**
       * To Do :
       * c player b player - Done
       * c & b player
       * bowled
       * stumping
       * run out 2players & direct hit
       * different players - Done
       * lbw
       * hit wicket
       */

      if (outDesc !== undefined && outDesc !== "not out") {
        let od = "" + outDesc;
        let outDescValidation = 0;
        od = od.trim();
        if (od.indexOf(" b ") !== -1 && od.substring(0, 2) == "c ") {
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          if (this.showlogs) console.log("bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
          const catcher = od.substring(2, od.indexOf(" b "));
          if (this.showlogs) console.log("catcher : " + catcher);
          this.increamentMapValue(this.playersCatchingStumping, catcher, "N");
          outDescValidation++;
        }
        if (od.includes("c and b")) {
          const player = od.substring(od.indexOf(" b ") + 3, od.length);
          if (this.showlogs) console.log("c&B player : " + player);
          this.increamentMapValue(this.playersBowling, player, "N");
          this.increamentMapValue(this.playersCatchingStumping, player, "N");
          outDescValidation++;
        }
        if (od.substring(0, 2) == "b ") {
          const bowler = od.substring(od.indexOf("b ") + 2, od.length);
          if (this.showlogs) console.log("playersBowlingBowled : " + bowler);
          this.increamentMapValue(this.playersBowlingBowledLbw, bowler, "N");
          if (this.showlogs) console.log("bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
          outDescValidation++;
        }
        if (od.includes("lbw ")) {
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          if (this.showlogs) console.log("playersBowlingLbw : " + bowler);
          this.increamentMapValue(this.playersBowlingBowledLbw, bowler, "N");
          if (this.showlogs) console.log("bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
          outDescValidation++;
        }
        if (od.includes("st ")) {
          const keeper = od.substring(3, od.indexOf(" b"));
          if (this.showlogs) console.log("keeper : " + keeper);
          this.increamentMapValue(this.playersCatchingStumping, keeper, "N");
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          if (this.showlogs) console.log("bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
          outDescValidation++;
        }
        if (od.includes("hit wicket")) {
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          if (this.showlogs) console.log("hit wicket bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
          outDescValidation++;
        }
        if (od.includes("run out")) {
          if (od.includes("/")) {
            const thrower1 = od.substring(od.indexOf("(") + 1, od.indexOf("/"));
            if (this.showlogs) console.log("thrower1 : " + thrower1);
            this.increamentMapValue(this.playersRunOuts, thrower1, "Y");
            const thrower2 = od.substring(od.indexOf("/") + 1, od.indexOf(")"));
            if (this.showlogs) console.log("thrower2 : " + thrower2);
            this.increamentMapValue(this.playersRunOuts, thrower2, "Y");
            outDescValidation++;
          } else {
            const thrower = od.substring(od.indexOf("(") + 1, od.length - 1);
            if (this.showlogs) console.log("thrower : " + thrower);
            this.increamentMapValue(this.playersRunOuts, thrower, "N");
            outDescValidation++;
          }
        }
        if (outDescValidation == 0 || outDescValidation > 1) {
          alert(
            "Out Description" +
              batsman[1].outDec +
              " not handled! DB updated exited"
          );
          return false;
        }
        return true;
      }
    },
    increamentMapValue(m, key, runoutFlag) {
      const value = runoutFlag == "N" ? 1 : 0.5;
      if (key.indexOf("(sub)") !== -1) {
        key = key.replace("(sub)", "");
        this.playersSubstitute.push(key);
      }
      if (m.has(key)) {
        m.set(key, m.get(key) + value);
      } else if (m.size == 0) {
        m.set(key, value);
      } else {
        m.set(key, value);
      }
    },
    adjustNameNAssignToPlayerScore(playerMap, type) {
      playerMap.forEach((values, keys) => {
        const playerNm =
          this.playersNickName.get(keys) !== undefined
            ? this.playersNickName.get(keys)
            : keys;
        if (playerNm != keys) {
          playerMap.set(playerNm, values);
          playerMap.delete(keys);
        }
      });
      playerMap.forEach((values, keys) => {
        let playerScoreSubMap = new Map();
        playerScoreSubMap = this.playersScore.get(keys);
        switch (type) {
          case this.switchValues.Bowling:
            // console.log("inside bowling");
            playerScoreSubMap.set(this.switchValues.Bowling, values);
            break;
          case this.switchValues.BowledLbw:
            // console.log("inside bowledNlbw");
            playerScoreSubMap.set(this.switchValues.BowledLbw, values);
            break;
          case this.switchValues.CatchingStumping:
            // console.log("inside catchNstump");
            playerScoreSubMap.set(this.switchValues.CatchingStumping, values);
            break;
          case this.switchValues.RunOuts:
            console.log("inside runouts : " + values);
            playerScoreSubMap.set(this.switchValues.RunOuts, values);
            break;
          case this.switchValues.Substitute:
            // console.log("inside Substitute");
            if (this.playersSubstitute.get(keys) !== undefined) {
              playerScoreSubMap.set(this.switchValues.Substitute, "Y");
            } else {
              playerScoreSubMap.set(this.switchValues.Substitute, "N");
            }
            break;
          default:
            break;
        }
      });
    },
  },
};
</script>

<style></style>
