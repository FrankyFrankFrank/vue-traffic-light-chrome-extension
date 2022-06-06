<template>
  <div class="main_app">
    <h1>loadedTeam {{ loadedTeam }}</h1>
    <button @click="disconnectFromTeam"
      class="w-full px-2 py-1 border border-slate-800 bg-slate-800 text-white hover:bg-white hover:text-slate-800 mr-1 font-bold">
      Disconnect
    </button>
  </div>
</template>

<script setup>
import { useTeamStore } from '@/store/teamStore';
import { piniaInstance } from '@/store';
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue';

const teamStore = useTeamStore(piniaInstance);
const { disconnectFromTeam, getTeamById, watchForMemberChanges } = teamStore;
const { loadedTeam } = storeToRefs(teamStore)

onMounted(() => {
  chrome.storage.sync.get(["loadedTeam"], (data) => {
    const loadedTeam = data.loadedTeam;
    if (!loadedTeam) return
    loadTeam(loadedTeam)
  })
  teamStore.askPermission()
})

async function loadTeam(teamDocId) {
  await getTeamById(teamDocId);
  storeTeamInChrome()
  watchForMemberChanges()
}

function storeTeamInChrome() {
  chrome.storage.sync.set({ loadedTeam: loadedTeam.value })
  console.log(chrome.storage.sync.get(['loadedTeam']))

}
</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
