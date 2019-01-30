const state = {
  registeredUsers: [
    {id: '-LWMS-pfJ937K4iwRl7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomek Drazek',
      email: 'tomek@wolluk.com',
      password: 'pass',
      roles: {
        admin: true,
        editor: true,
        translator: true,
        designer: true}},
    {id: '-LWMS-pfJ937K4i4001l7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'Janusz Cebula',
      email: 'janusz@example.com',
      password: 'pass',
      roles: {
        admin: false,
        editor: true,
        translator: false,
        designer: false}},
    {id: '-LWMS-pfJ937K4i3651l7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'pass',
      roles: {
        admin: false,
        editor: false,
        translator: true,
        designer: false}}
  ],
  searchCriterias: {
    label: 'User Roles',
    roles: {
      admin: {name: 'Administrator', value: false},
      editor: {name: 'Editor', value: false},
      translator: {name: 'Translator', value: false},
      designer: {name: 'Designer', value: false}
    }
  },
  filteredUserrs: []
}
const mutations = {
  mutateUser (state, payload) {
    let userToUpdate = state.registeredUsers.find(user => user.id === payload.id)
    let userIndex = state.registeredUsers.indexOf(userToUpdate)
    state.registeredUsers[userIndex] = payload
  }
}
const getters = {
  allUsers (state) {
    return state.registeredUsers
  },
  userByEmail (state, email) {
    return state.registeredUsers.find(user => user.email === email)
  }
}
const actions = {
  mutateUser ({commit}, payload) {
    commit('mutateUser', payload)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
