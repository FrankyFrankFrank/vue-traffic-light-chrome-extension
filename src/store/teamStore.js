import { defineStore } from 'pinia'
import { doc, collection, onSnapshot, getDoc } from 'firebase/firestore'

export const useTeamStore = defineStore('teamStore', {
  state: () => ({
    loadedTeam: null,
    teamMembers: [],
    snapshotListenerUnsubscribe: null,
  }),
  actions: {
      async getTeamById(teamDocId) {
        const teamRef = this.getTeamRef(teamDocId);
        const teamSnapshot = await getDoc(teamRef);
        this.loadedTeam = teamSnapshot.id
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
      watchForMemberChanges() {
        const membersRef = this.getTeamMembersRef()
        this.snapshotListenerUnsubscribe = onSnapshot(membersRef, this.setTeamMembers)
      },
      disconnectFromTeam() {
        this.snapshotListenerUnsubscribe()
        this.loadedTeam = null
        this.teamMembers = []
        chrome.storage.sync.set({ loadedTeam: this.loadedTeam })
      },
      getTeamRef(teamDocId) {
        return doc(this.firebaseDB, "teams", teamDocId)
      },
      getMemberRef(memberId) {
        return doc(this.firebaseDB, "teams", this.loadedTeam, "members", memberId)
      },
      getTeamMembersRef() {
        return collection(this.firebaseDB, "teams", this.loadedTeam, "members")
      },
  }
})