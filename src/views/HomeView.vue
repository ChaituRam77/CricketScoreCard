import { computed } from '@vue/runtime-core'

<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <counter />
    <counter-squared />
    <buttons />
    <color-code /> -->
    <h1>Scores</h1>
    <div id="scores-table">
      <div id="team-names"></div>
      <div id="match-wise-scores-h-scrollable"></div>
      <div id="team-scores"></div>
    </div>
  </div>
</template>

<script>

import {
  collection,
  getDocs,
} from "firebase/firestore";

import db from "../firebase-config";

export default {
  methods: {
    async getDataFromDB() {

      const docRef = collection(db, "Owners");
      const docSnaps = await getDocs(docRef);
      let ownerDocsMap = new Map();

      docSnaps.docs.map((doc) => ownerDocsMap.set(doc.id, doc.data()));

      let ownerTeamsMap = new Map(Object.entries(ownerDocsMap.get("teams")));
      let matchTotalPoints = 0;
      ownerTeamsMap.delete("Names");
      // ownerTeamsMap.forEach((values, keys) => {
      for (let [keys, values] of ownerTeamsMap) {
        console.log(keys + " : " + values);
      }
    },
  },
  beforeMount() {
    this.getDataFromDB()
  },
  data: ({
    computed: 
  })
};
</script>

<style>
div {
  margin-bottom: 10px;
}
.counter {
  font-size: 80px;
}
.buttons button {
  font-size: 40px;
  width: 100px;
  margin: 0 10px;
}
</style>
