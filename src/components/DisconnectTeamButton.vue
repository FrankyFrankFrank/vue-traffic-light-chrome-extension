<template>
    <button @click="disconnectFromTeam"
        class="w-full px-2 py-1 border border-slate-800 bg-slate-800 text-white hover:bg-white hover:text-slate-800 mr-1 font-bold">
        Disconnect
    </button>
</template>


<script setup>
import { piniaInstance } from '@/store';
import { useTeamStore } from '@/store/teamStore';

const teamStore = useTeamStore(piniaInstance)
const { disconnectFromTeam } = teamStore
</script>
