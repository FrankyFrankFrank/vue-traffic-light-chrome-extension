<template>
    <div>
        <h1 class="text-lg text-center uppercase font-bold tracking-widest">Find a team</h1>

        <label for="team-name" class="w-full uppercase tracking-widest">Enter Existing Team Code</label>
        <input type="text" id="team-name" v-model="teamDocId" class="border w-full mb-2 px-2 py-1 mr-1" />
        <button @click="handleLoadTeamSubmit"
            class="w-full px-2 py-1 uppercase tracking-widest bg-blue-800 hover:bg-white text-white hover:text-blue-800 border border-blue-800 font-bold"
            >
            {{ teamDocId ? `Join Team ${teamDocId}` : 'Enter Team Name' }}
        </button>
        <p class="text-center">or</p>
        <button @click="handleCreateTeamSubmit"
            class="w-full px-2 py-1 uppercase tracking-widest bg-green-800 hover:bg-white text-white hover:text-green-800 border border-green-800 font-bold">
            Create New Team
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    loadTeam: Function,
    createTeam: Function,
})

const teamDocId = ref(null)

const handleLoadTeamSubmit = () => {
    props.loadTeam(teamDocId.value)
}

const handleCreateTeamSubmit = () => {
    props.createTeam()
}
</script>