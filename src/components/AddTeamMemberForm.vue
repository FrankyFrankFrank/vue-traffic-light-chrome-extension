<template>
    <form v-on:submit.prevent="handleSubmit">
        <fieldset class="flex flex-wrap items-center mb-4 pb-4 border-b">
            <label class="w-full uppercase tracking-widest" for="add-team-member">Add Team Member</label>
            <input type="text" id="add-team-member" v-model="newTeamMemberName"
                class="border flex-grow px-2 py-1 mr-1" />
            <input type="submit"
                class="px-2 py-1 bg-blue-800 hover:bg-white text-white hover:text-blue-800 border border-blue-800 font-bold"
                value="Add">
        </fieldset>
    </form>
</template> 

<script setup>
import { ref } from 'vue'
import { useTeamStore } from '@/store/teamStore';

const teamStore = useTeamStore()
const { addTeamMember } = teamStore

const newTeamMemberName = ref('')

function handleSubmit() {
    addTeamMember(newTeamMemberName.value)
    newTeamMemberName.value = null
}

</script>