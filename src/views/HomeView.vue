import { computed } from '@vue/runtime-core'

<template>
  <div class="text-center">
    <h1>Scores</h1>
    <div id="score-table" align="center">
      <table>
        <thead>
          <tr>
            <th class="text-h5">Team</th>
            <th class="text-h5">Points</th>
          </tr>
        </thead>
        <tbody class="team" v-for="team in teamWiseTotalPoints" :key="team">
          <tr>
            <td>{{ team.name }}</td>
            <td>{{ team.totalPoints }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
