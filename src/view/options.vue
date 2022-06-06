<template>
  <div class="main_app">
    <h1>loadedTeam {{ teamId }}</h1>
    <button @click="getTeam">Foo</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

let teamId = ref('')

function getTeam() {
  chrome.storage.sync.get(["loadedTeam"], (data) => {
    console.log('foooooo', data)
    const loadedTeam = data.loadedTeam;
    if (!loadedTeam) return
    teamId.value = loadedTeam
  })
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
