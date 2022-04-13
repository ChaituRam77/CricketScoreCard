import { computed } from '@vue/runtime-core'

<template>
  <div class="container">
    <table class="table table-borderless table-striped table-sm">
      <thead>
        <tr class="bg-dark text-white">
          <th scope="col">Team</th>
          <th scope="col">Points</th>
        </tr>
      </thead>
      <tbody class="team" v-for="team in teamWiseTotalPoints" :key="team">
        <tr>
          <td><p>{{ team.name }}</p></td>
          <td><p>{{ team.totalPoints }}</p></td>
        </tr>
      </tbody>
  </table>
  </div>
</template>

<script>

import { getOwnerNames, getFullData, getTeamWiseTotalPoints }  from "../final-api-wrapper"

export default {
  data() {
    return {
      teamWiseTotalPoints: []
    }
  },
  mounted() {
    this.fetchScores()
  },
  methods: {
    async fetchScores() {
      let totalPoints = await getTeamWiseTotalPoints()
      console.log(totalPoints)
      this.teamWiseTotalPoints = totalPoints
    }
  }
};
</script>

<style>

  div {
    margin-bottom: 10px;
  }

</style>
