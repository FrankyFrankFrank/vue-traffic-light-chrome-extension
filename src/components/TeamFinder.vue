<template>
    <div>
        <h1 class="text-lg text-center uppercase font-bold tracking-widest">Find a team</h1>

        <label for="team-name" class="w-full uppercase tracking-widest">Enter Existing Code, or leave blank to create a
            new room</label>
        <input type="text" id="team-name" v-model="teamNameSearch" class="border w-full mb-2 px-2 py-1 mr-1" />
        <button @click="handleSubmit"
            class="w-full px-2 py-1 uppercase tracking-widest bg-blue-800 hover:bg-white text-white hover:text-blue-800 border border-blue-800 font-bold"
            :class="{ 'opacity-20': !teamNameSearch, 'cursor-not-allowed': !teamNameSearch }">
            {{ teamNameSearch ? `Join Team ${teamNameSearch}` : 'Enter Team Name' }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    loadTeam: Function,
})

const teamNameSearch = ref('')

const handleSubmit = () => {
    props.loadTeam(teamNameSearch.value)
}
</script>