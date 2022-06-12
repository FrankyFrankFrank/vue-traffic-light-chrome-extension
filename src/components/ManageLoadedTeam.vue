<template>
    <div class="flex items-stretch">
        <button @click="disconnectFromTeam"
            class="w-full px-2 py-1 border border-slate-800 bg-slate-800 text-white hover:bg-white hover:text-slate-800 mr-1 font-bold">
            Disconnect
        </button>
        <button @click="deleteTeam"
            class="w-full px-2 py-1 border border-red-800 bg-red-800 text-white hover:bg-white hover:text-red-800 font-bold">Delete
            Team
        </button>
    </div>
</template>

<script setup>
import { piniaInstance } from '@/store';
import { useTeamStore } from '@/store/teamStore';

const teamStore = useTeamStore(piniaInstance)
const { disconnectFromTeam, deleteTeam } = teamStore
</script>
