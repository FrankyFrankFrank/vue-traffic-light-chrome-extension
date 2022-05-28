import { defineStore } from 'pinia'

export const useTeamStore = defineStore('teamStore', {
  state: () => ({
    loadedTeam: null,
    teamMembers: [],
  }),
  actions: {
      setLoadedTeam(id) {
        this.loadedTeam = id
      },
      setTeamMembers(memberSnapshot) {
        this.teamMembers.value = []
        memberSnapshot.forEach((doc) => {
          const { name, color } = doc.data()
          const id = doc.id
          this.teamMembers.push({
            id,
            name,
            color
          })
        })
      }
  }
})