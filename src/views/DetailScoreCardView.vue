<template>
  <div class="about">
    <!-- Display LOADING INDICATOR until API returns the TEAM LIST -->
    <div v-if="teams.length == 0">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div
        class="spinner-border"
        style="width: 3rem; height: 3rem"
        role="status">
      </div>
    </div>
    <div class="row">
      <!-- Display the Teams Dropdown -->
      <div class="dropdown col-auto" id='teamNameDropdown' align="left" v-if="teams.length != 0">
        <button class="btn btn-secondary dropdown-toggle bg-primary" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">{{ teamInDisplay }}</button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" >
          <li class='teamName' v-for="teamName in teams" :key="teamName">
            <p class="dropdown-item" @click="handleTeamSelection(teamName)">{{ teamName }}</p>
          </li>
        </ul>
      </div>
      <!-- Display the Matches Dropdown -->
      <div class="dropdown col-auto" align="left" id='matchesDropdown' v-if="matches.length != 0">
        <button class="btn btn-secondary dropdown-toggle bg-primary" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">{{ matchInDisplay }}</button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" >
          <li class='mch' v-for="mch in matches" :key="mch">
            <p class="dropdown-item" @click="handleMatchSelection(mch)">{{ mch.teams }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getOwnerNames, getMatches } from "../final-api-wrapper";

export default {
  data() {
    return {
      teams: [],
      matches: [],
      teamInDisplay: 'Select Team',
      matchInDisplay: 'Select Match',
    }
  },
  created() {
    this.fetchTeamNames();
  },
  mounted() {
    this.fetchMatches();
  },
  methods: {
    async fetchTeamNames() {
      let teamNames = await getOwnerNames();
      this.teams = teamNames;
    },
    async fetchMatches() {
      let matches = await getMatches();
      this.matches = matches;
    },
    handleTeamSelection(teamName) {
      console.log(`TEAM SELECTED = ${teamName}`)
      this.teamInDisplay = teamName;
    },
    handleMatchSelection(match) {
      console.log(`MATCH SELECTED = ${match.teams}`)
      this.matchInDisplay = match;
    }
  }
}
</script>

<style>

#teamNameDropdown {
  margin-left: 5rem;

}

</style>
