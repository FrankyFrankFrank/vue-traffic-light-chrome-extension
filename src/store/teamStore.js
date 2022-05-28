import { defineStore } from 'pinia'

export const useTeamStore = defineStore('teamStore', {
  state: () => ({
    team: 0
  })
})