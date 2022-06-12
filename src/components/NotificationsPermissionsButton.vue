<script setup>
import { useTeamStore } from '@/store/teamStore';

const teamStore = useTeamStore()

</script>

<template>
<div class="text-center mt-2">
    <button v-if="teamStore.permissionStatus === 'default'" @click="teamStore.askPermission()">
        Allow Notifications
    </button>
    <p v-if="teamStore.permissionStatus === 'granted'">Notifications Enabled</p>
</div>
</template>