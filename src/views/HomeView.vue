import { computed } from '@vue/runtime-core'

<template>
  <div v-if="teamWiseTotalPoints.length == 0">
    <div
      class="spinner-border"
      style="width: 3rem; height: 3rem"
      role="status"
    ></div>
  </div>
  <div class="container well" v-else>
    <table class="table table-borderless table-sm table-hover" id="scoresTable">
      <thead>
        <tr class="bg-dark text-white">
          <th scope="col">#</th>
          <th scope="col">Team</th>
          <th scope="col">Points</th>
        </tr>
      </thead>

      <tbody class="team" v-for="team in teamWiseTotalPoints" :key="team">
        <tr @click="dynamicHeading(team.name)">
          <th scope="row">{{ team.no }}</th>
          <td>
            <p>{{ team.name }}</p>
          </td>
          <td>
            <p>{{ team.totalPoints }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <h4>{{ greeting }}</h4>
  <br />
  <div
    class="container well"
    v-if="matchWisePoints.length == 0 && teamWiseTotalPoints.length == 0"
  ></div>
  <div
    class="container well"
    v-else-if="matchWisePoints.length == 0 && teamWiseTotalPoints.length > 0"
  >
    <h4>Click on a team</h4>
  </div>
  <div class="container well" v-else>
    <table
      class="table table-borderless table-sm table-hover"
      id="matchWiseScoresTable"
    >
      <thead>
        <tr class="bg-info text-white">
          <th scope="col">#</th>
          <th scope="col">Match</th>
          <th scope="col">Points</th>
        </tr>
      </thead>

      <tbody class="match" v-for="match in matchWisePoints" :key="match">
        <tr>
          <td>
            <p>{{ match.matchNo }}</p>
          </td>
          <td>
            <p>{{ match.matchVs }}</p>
          </td>
          <td>
            <p>{{ match.points }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  getMatchWisePoints,
  fetchTeamWiseTotalPoints,
  getTeamWiseTotalPoints,
} from "../final-api-wrapper";

export default {
  data() {
    return {
      teamWiseTotalPoints: [],
      greeting: "",
      matchWisePoints: [],
    };
  },
  mounted() {
    this.fetchScores();
  },
  methods: {
    async fetchScores() {
      let totalPoints = await getTeamWiseTotalPoints();
      await fetchTeamWiseTotalPoints();
      this.teamWiseTotalPoints = totalPoints;
    },
    dynamicHeading(name) {
      this.greeting = `${name.toUpperCase()} team match-wise points`;
      this.updateMatchWisePoints(name);
    },
    updateMatchWisePoints(teamName) {
      let points = getMatchWisePoints(teamName);
      this.matchWisePoints = points;
    },
  },
};
</script>

<style>
div {
  margin-bottom: 10px;
}

.well {
  background: none;
}
</style>
