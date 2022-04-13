<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offser-md-3">
        <h2>Introduce match details</h2>
      </div>
      <form @submit.prevent="getDataFromDB">
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import db from "../firebase-config";
import {
  collection,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
export default {
  // name: 'HomeView',
  // components: {
  //   'counter': require('@/components/Counter.vue').default,
  //   'counter-squared': require('@/components/CounterSquared.vue').default,
  //   'buttons': require('@/components/Buttons.vue').default,
  //   'color-code': require('@/components/ColorCode.vue').default
  // }
  methods: {
    async getDataFromDB() {
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
    },
  },
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
