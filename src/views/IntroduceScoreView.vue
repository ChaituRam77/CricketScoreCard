<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offser-md-3">
        <h2>Introduce match details</h2>
      </div>
      <form @submit.prevent="introduceMatchScore">
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
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import db from "../firebase-config";
import { getDoc, setDoc, doc } from "firebase/firestore";
import axios from "axios";

export default {
  data() {
    return {
      matchID: null,
      team1: null,
      team2: null,
      mom: null,
      playersScore: new Map(),
      playersBowling: new Map(),
      playersCatchingStumping: new Map(),
      playersRunOuts: new Map(),
      playersBowlingBowledLbw: new Map(),
      playersNickName: new Map(),
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
    async introduceMatchScore() {
      const dataSquad = require("../data/squads.json");
      console.log(dataSquad);
      let playersMatch = new Map();
      console.log("Introducing match score");
      playersMatch.set(this.matchID, this.mom);
      // console.log(this.matchID + this.mom);
      const matchScore = {
        scorecard: [
          {
            inningsId: 1,
            batsman: [
              {
                id: 11813,
                balls: 4,
                strkRate: "0",
                name: "Ruturaj Gaikwad",
                outDec: "c Nitish Rana b Umesh",
              },
              {
                id: 9838,
                balls: 8,
                runs: 3,
                strkRate: "37.5",
                name: "Conway",
                outDec: "c Shreyas Iyer b Umesh",
              },
              {
                id: 527,
                balls: 21,
                runs: 28,
                fours: 2,
                sixes: 2,
                strkRate: "133.33",
                name: "Uthappa",
                outDec: "st Jackson b Chakaravarthy",
              },
              {
                id: 6311,
                balls: 17,
                runs: 15,
                fours: 1,
                sixes: 1,
                strkRate: "88.24",
                name: "Rayudu",
                outDec: "run out (Shreyas Iyer/Narine) ",
              },
              {
                id: 587,
                balls: 28,
                runs: 26,
                sixes: 1,
                strkRate: "92.86",
                name: "Ravindra Jadeja",
                isCaptain: true,
                outDec: "not out",
              },
              {
                id: 11195,
                balls: 6,
                runs: 3,
                strkRate: "50",
                name: "Shivam Dube",
                outDec: "c Narine b Russell",
              },
              {
                id: 265,
                balls: 38,
                runs: 50,
                fours: 7,
                sixes: 1,
                strkRate: "131.58",
                name: "Dhoni",
                isKeeper: true,
                outDec: "not out",
              },
              {
                id: 242,
                strkRate: "0",
                name: "DJ Bravo",
              },
              {
                id: 10100,
                strkRate: "0",
                name: "Santner",
              },
              {
                id: 7625,
                strkRate: "0",
                name: "Milne",
              },
              {
                id: 11307,
                strkRate: "0",
                name: "Tushar Deshpande",
              },
            ],
            bowler: [
              {
                id: 1858,
                overs: "4",
                wickets: 2,
                runs: 20,
                economy: "5",
                name: "Umesh",
              },
              {
                id: 12345,
                overs: "4",
                runs: 35,
                economy: "8.8",
                name: "Shivam Mavi",
              },
              {
                id: 12926,
                overs: "4",
                wickets: 1,
                runs: 23,
                economy: "5.8",
                name: "Chakaravarthy",
              },
              {
                id: 2276,
                overs: "4",
                runs: 15,
                economy: "3.8",
                name: "Narine",
              },
              {
                id: 7736,
                overs: "4",
                wickets: 1,
                runs: 38,
                economy: "9.5",
                name: "Russell",
              },
            ],
            fow: [
              {
                fow: [
                  {
                    batsmanId: 11813,
                    batsmanName: "Ruturaj Gaikwad",
                    overNbr: 0.3,
                    runs: 2,
                    ballNbr: 3,
                  },
                  {
                    batsmanId: 9838,
                    batsmanName: "Conway",
                    overNbr: 4.1,
                    runs: 28,
                    ballNbr: 41,
                  },
                  {
                    batsmanId: 527,
                    batsmanName: "Uthappa",
                    overNbr: 7.5,
                    runs: 49,
                    ballNbr: 75,
                  },
                  {
                    batsmanId: 6311,
                    batsmanName: "Rayudu",
                    overNbr: 8.4,
                    runs: 52,
                    ballNbr: 84,
                  },
                  {
                    batsmanId: 11195,
                    batsmanName: "Shivam Dube",
                    overNbr: 10.5,
                    runs: 61,
                    ballNbr: 105,
                  },
                ],
              },
            ],
            extras: {
              wides: 4,
              noBalls: 2,
              total: 6,
            },
            pp: [
              {
                powerPlay: [
                  {
                    id: 41,
                    ovrFrom: 0.1,
                    ovrTo: 6.0,
                    ppType: "mandatory",
                    run: 35,
                  },
                ],
              },
            ],
            score: 131,
            wickets: 5,
            overs: 20.0,
            runRate: 6.55,
            batTeamName: "Chennai Super Kings",
            batTeamSName: "CSK",
            ballNbr: 120,
            rpb: 0.66,
          },
          {
            inningsId: 2,
            batsman: [
              {
                id: 1447,
                balls: 34,
                runs: 44,
                fours: 6,
                sixes: 1,
                strkRate: "129.41",
                name: "Ajinkya Rahane",
                nickName: "Rahane",
                outDec: "c Ravindra Jadeja b Santner",
              },
              {
                id: 10917,
                balls: 16,
                runs: 16,
                fours: 2,
                strkRate: "100",
                name: "Venkatesh Iyer",
                nickName: "Venkatesh Iyer",
                outDec: "c Dhoni b DJ Bravo",
              },
              {
                id: 9204,
                balls: 17,
                runs: 21,
                fours: 2,
                sixes: 1,
                strkRate: "123.53",
                name: "Nitish Rana",
                nickName: "Nitish Rana",
                outDec: "c Rayudu b DJ Bravo",
              },
              {
                id: 9428,
                balls: 19,
                runs: 20,
                fours: 1,
                strkRate: "105.26",
                name: "Shreyas Iyer",
                nickName: "Shreyas Iyer",
                isCaptain: true,
                outDec: "not out",
              },
              {
                id: 7990,
                balls: 22,
                runs: 25,
                fours: 1,
                sixes: 1,
                strkRate: "113.64",
                name: "Sam Billings",
                nickName: "Billings",
                outDec: "c Tushar Deshpande b DJ Bravo",
              },
              {
                id: 8846,
                balls: 3,
                runs: 3,
                strkRate: "100",
                name: "Sheldon Jackson",
                nickName: "Jackson",
                isKeeper: true,
                outDec: "not out",
              },
              {
                id: 7736,
                strkRate: "0",
                name: "Andre Russell",
                nickName: "Russell",
              },
              {
                id: 2276,
                strkRate: "0",
                name: "Sunil Narine",
                nickName: "Narine",
              },
              {
                id: 1858,
                strkRate: "0",
                name: "Umesh Yadav",
                nickName: "Umesh",
              },
              {
                id: 12345,
                strkRate: "0",
                name: "Shivam Mavi",
                nickName: "Shivam Mavi",
              },
              {
                id: 12926,
                strkRate: "0",
                name: "Varun Chakaravarthy",
                nickName: "Chakaravarthy",
              },
            ],
            bowler: [
              {
                id: 11307,
                overs: "3",
                runs: 23,
                economy: "7.7",
                name: "Tushar Deshpande",
                nickName: "Tushar Deshpande",
              },
              {
                id: 7625,
                overs: "2.3",
                runs: 19,
                economy: "7.6",
                name: "Adam Milne",
                nickName: "Milne",
              },
              {
                id: 10100,
                overs: "4",
                wickets: 1,
                runs: 31,
                economy: "7.8",
                name: "Mitchell Santner",
                nickName: "Santner",
              },
              {
                id: 242,
                overs: "4",
                wickets: 3,
                runs: 20,
                economy: "5",
                name: "Dwayne Bravo",
                nickName: "DJ Bravo",
              },
              {
                id: 11195,
                overs: "1",
                runs: 11,
                economy: "11",
                name: "Shivam Dube",
                nickName: "Shivam Dube",
              },
              {
                id: 587,
                overs: "4",
                runs: 25,
                economy: "6.2",
                name: "Ravindra Jadeja",
                nickName: "Ravindra Jadeja",
                isCaptain: true,
              },
            ],
            fow: [
              {
                fow: [
                  {
                    batsmanId: 10917,
                    batsmanName: "Venkatesh Iyer",
                    overNbr: 6.2,
                    runs: 43,
                    ballNbr: 62,
                  },
                  {
                    batsmanId: 9204,
                    batsmanName: "Nitish Rana",
                    overNbr: 9.6,
                    runs: 76,
                    ballNbr: 96,
                  },
                  {
                    batsmanId: 1447,
                    batsmanName: "Ajinkya Rahane",
                    overNbr: 11.4,
                    runs: 87,
                    ballNbr: 114,
                  },
                  {
                    batsmanId: 7990,
                    batsmanName: "Sam Billings",
                    overNbr: 17.3,
                    runs: 123,
                    ballNbr: 173,
                  },
                ],
              },
            ],
            extras: {
              byes: 4,
              total: 4,
            },
            pp: [
              {
                powerPlay: [
                  {
                    id: 42,
                    ovrFrom: 0.1,
                    ovrTo: 6.0,
                    ppType: "mandatory",
                    run: 43,
                  },
                ],
              },
            ],
            score: 133,
            wickets: 4,
            overs: 18.3,
            runRate: 7.19,
            batTeamName: "Kolkata Knight Riders",
            batTeamSName: "KKR",
            ballNbr: 111,
            rpb: 0.73,
          },
        ],
        isMatchComplete: true,
        appIndex: {
          seoTitle:
            "Cricket scorecard - CSK vs KKR 1st Match,Indian Premier League 2022 | Cricbuzz.com",
          webURL:
            "http://www.cricbuzz.com/live-cricket-scorecard/45886/csk-vs-kkr-1st-match-indian-premier-league-2022",
        },
        status: "Kolkata Knight Riders won by 6 wkts",
        responseLastUpdated: "1648837358",
      };

      // const options = {
      //   method: "GET",
      //   url: "https://unofficial-cricbuzz.p.rapidapi.com/matches/get-scorecard",
      //   params: { matchId: this.matchID },
      //   headers: {
      //     "X-RapidAPI-Host": "unofficial-cricbuzz.p.rapidapi.com",
      //     "X-RapidAPI-Key":
      //       "427451b511msh07056d18c6e0adcp1dae07jsn577cf6594d98",
      //   },
      // };
      // await axios
      //   .request(options)
      //   .then((response) => {
      //     this.apiScore = response.data;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      // console.log("matchscore : " + this.apiScore);
      // const match = this.apiScore.appIndex.seoTitle
      //   .split(",")[0]
      //   .split("-")[1]
      //   .split(" ");
      const matchNm = this.matchId + "_" + this.team1 + "vs" + this.team2;
      // const matchNm = this.matchId + "_" + match[0] + "vs" + match[1];
      console.log("matchNm : " + matchNm);
      Object.entries(matchScore.scorecard).forEach((item) => {
        if (item.batsman !== null) {
          Object.entries(item[1].batsman).forEach((batsman) => {
            let playerScoreSubMap = new Map();
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
            this.playersScore.set(batsman[1].name, playerScoreSubMap);
            if (batsman[1].nickName !== undefined) {
              this.playersNickName.set(batsman[1].nickName, batsman[1].name);
            }
            this.addOutDescrition(batsman[1].outDec);
          });
        } else {
          console.log("In Else" + item);
        }
      });
      this.adjustNameNAssignToPlayerScore(
        this.playersBowling,
        this.switchValues.Bowling
      );
      this.adjustNameNAssignToPlayerScore(
        this.playersCatchingStumping,
        this.switchValues.CatchingStumping
      );
      this.adjustNameNAssignToPlayerScore(
        this.playersRunOuts,
        this.switchValues.RunOuts
      );
      this.adjustNameNAssignToPlayerScore(
        this.playersBowlingBowledLbw,
        this.switchValues.BowledLbw
      );
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

      this.playersScore.forEach((values, keys) => {
        let subMap = new Map();
        subMap = values;
        if (keys == this.mom) {
          values.set(this.switchValues.mom, "Y");
        } else {
          values.set(this.switchValues.mom, "N");
        }
        values.set("1total", this.claculateTotal(subMap));
        const conMap = Object.fromEntries(values);
        // console.log([...[values].entries()]);
        // this.assignToDB(matchNm, 0, keys, conMap);
        // console.log("Player : " + keys);
        // console.log(conMap);
      });

      const docRef = doc(db, "Owners", "teams");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const ownerTeamsMap = new Map(Object.entries(docSnap.data()));
        console.log(ownerTeamsMap);
        ownerTeamsMap.forEach((values, keys) => {
          //key : OwnerNames values : team players
          let matchTotalPoints = 0;
          const ownerPlayersArr = values;
          const ownerName = keys;
          ownerPlayersArr.forEach(
            (
              element //element owner team each player
            ) =>
              this.playersScore.forEach((values, keys) => {
                // keys : match played players & values :their scores
                let playerPoints = new Map();
                playerPoints = values;
                console.log("Player : " + keys);
                console.log("Total : " + [...[values].entries()]);
                console.log(playerPoints);
                matchTotalPoints =
                  matchTotalPoints + playerPoints.get("1total");
                if (element == keys) {
                  // this.assignToDB(
                  //   ownerName,
                  //   matchNm,
                  //   matchTotalPoints,
                  //   keys,
                  //   playerScoreValues
                  // );
                  console.log(
                    ownerName +
                      ": " +
                      "matchNm" +
                      ": " +
                      matchTotalPoints +
                      ": " +
                      keys +
                      ": " +
                      playerPoints
                  );
                }
              })
          );
        });
        // console.log("Names:" + ownerTeamsMap.get("Names"));
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
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
    assignToDB(document, matchNm, totalPoints, k, v) {
      const docRef = doc(db, "Owners", document);
      this.obj = v;
      setDoc(
        docRef,
        {
          [matchNm]: { "1total": totalPoints, [k]: this.obj },
        },
        { merge: true }
      ).catch((err) => {
        console.log("error: " + err.message);
      });
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
        const od = "" + outDesc;
        if (od.indexOf(" b ") !== -1 && od.substring(0, 2) == "c ") {
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          // console.log("bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
          const catcher = od.substring(2, od.indexOf(" b "));
          // console.log("catcher : " + catcher);
          this.increamentMapValue(this.playersCatchingStumping, catcher, "N");
        }
        if (od.substring(0, 7) == "c and b") {
          const player = od.substring(od.indexOf(" b ") + 3, od.length);
          // console.log("c&B player : " + player);
          this.increamentMapValue(this.playersBowling, player, "N");
          this.increamentMapValue(this.playersCatchingStumping, player, "N");
        }
        if (od.substring(0, 2) == "b ") {
          const bowler = od.substring(od.indexOf("b ") + 2, od.length);
          // console.log("playersBowlingBowled : " + bowler);
          this.increamentMapValue(this.playersBowlingBowledLbw, bowler, "N");
        }
        if (od.substring(0, 3) == "lbw ") {
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          // console.log("playersBowlingLbw : " + bowler);
          this.increamentMapValue(this.playersBowlingBowledLbw, bowler, "N");
        }
        if (od.substring(0, 3) == "st ") {
          const keeper = od.substring(3, od.indexOf(" b"));
          // console.log("keeper : " + keeper);
          this.increamentMapValue(this.playersCatchingStumping, keeper, "N");
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          // console.log("bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
        }
        if (od.indexOf("hit wicket") !== -1) {
          const bowler = od.substring(od.indexOf(" b ") + 3, od.length);
          // console.log("hit wicket bowler : " + bowler);
          this.increamentMapValue(this.playersBowling, bowler, "N");
        }
        if (od.indexOf("run out") !== -1) {
          if (od.indexOf("/") !== -1) {
            const thrower1 = od.substring(od.indexOf("(") + 1, od.indexOf("/"));
            // console.log("thrower1 : " + thrower1);
            this.increamentMapValue(this.playersRunOuts, thrower1, "Y");
            const thrower2 = od.substring(od.indexOf("/") + 1, od.indexOf(")"));
            // console.log("thrower2 : " + thrower2);
            this.increamentMapValue(this.playersRunOuts, thrower2, "Y");
          } else {
            const thrower = od.substring(od.indexOf("(") + 1, od.length - 1);
            // console.log("thrower : " + thrower);
            this.increamentMapValue(this.playersRunOuts, thrower, "N");
          }
        }
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
            // console.log("inside runouts");
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
