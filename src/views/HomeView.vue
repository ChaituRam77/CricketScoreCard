import { computed } from '@vue/runtime-core'
<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <counter />
    <counter-squared />
    <buttons />
    <color-code /> -->
  </div>
</template>

<script>
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
      let matchTotalPoints = 0;
      ownerTeamsMap.delete("Names");
      // ownerTeamsMap.forEach((values, keys) => {
      for (let [keys, values] of ownerTeamsMap) {
        //key : OwnerNames values : team players
        console.log(keys + " : " + values);
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
