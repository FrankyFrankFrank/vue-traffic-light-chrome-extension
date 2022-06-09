import { defineStore } from 'pinia'
import { doc, collection, onSnapshot, getDoc, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { v4 as uuid } from "uuid";


export const useTeamStore = defineStore('teamStore', {
  state: () => ({
    loadedTeam: null,
    teamMembers: [],
    snapshotListenerUnsubscribe: null,
  }),
  actions: {
      async loadTeam(teamDocId) {
        await this.getTeamById(teamDocId)
        this.storeTeamInChrome()
        this.watchForMemberChanges()
      },
      async getTeamById(teamDocId) {
        const teamRef = this.getTeamRef(teamDocId)
        const teamSnapshot = await getDoc(teamRef)
        this.loadedTeam = teamSnapshot.id
      },
      async deleteTeam() {
        const membersRef = this.getTeamMembersRef()
        const memberSnapshot = await getDocs(membersRef)
        memberSnapshot.forEach(async (member) => {
          await deleteDoc(this.getMemberRef(member.id))
        })

        await deleteDoc(this.getTeamRef(this.loadedTeam))

        this.loadedTeam = null
        this.teamMembers = null
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
      async createTeam() {
        const teamDocId = btoa(uuid()).substring(0, 8);
        await this.getTeamById(teamDocId)
        this.storeTeamInChrome()
        this.watchForMemberChanges()
      },
      async addTeamMember(name) {
        this.makeNotification({
          title: "New Team Member",
          body: `${name} was added to the team!`,
        });
        await addDoc(this.getTeamMembersRef(), { name })
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
      storeTeamInChrome() {
        chrome.storage.sync.set({ loadedTeam: this.loadedTeam })
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