import { defineStore } from 'pinia'

export const useTeamStore = defineStore('teamStore', {
  state: () => ({
    loadedTeam: null,
    teamMembers: [],
    snapshotListenerUnsubscribe: null,
  }),
  actions: {
      setLoadedTeam(id) {
        this.loadedTeam = id
      },
      setTeamMembers(memberSnapshot) {
        this.teamMembers = []
        
        memberSnapshot.forEach((doc) => {
          const { name, color } = doc.data()
          const id = doc.id
          this.teamMembers.push({
            id,
            name,
            color
          })
        })
      },
      disconnectFromTeam() {
        this.snapshotListenerUnsubscribe()
        this.loadedTeam = null
        this.teamMembers = []
        chrome.storage.sync.set({ loadedTeam: this.loadedTeam })
      }
  }
})