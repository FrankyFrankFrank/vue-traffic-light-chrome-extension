import { defineStore } from 'pinia'
import { doc, collection, onSnapshot, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

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
      async removeTeamMember(memberId) {
        await deleteDoc(this.getMemberRef(memberId))
      },
      watchForMemberChanges() {
        const membersRef = this.getTeamMembersRef()
        this.snapshotListenerUnsubscribe = onSnapshot(membersRef, this.setTeamMembers)
      },
      setTeamMemberColor(memberId, color) {
        const memberRef = this.getMemberRef(memberId)

        updateDoc(memberRef, {
          color
        })
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