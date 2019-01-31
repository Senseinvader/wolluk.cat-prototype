const state = {
  registeredUsers: [
    {id: '-LWMS-pfJ937K4iwRl7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomek Drazek',
      email: 'tomek@wolluk.com',
      password: 'pass',
      roles: {
        admin: true,
        editor: false,
        translator: false,
        designer: false}},
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
        designer: false}},
    {id: '-LWMS-pfJ937R8i3651l7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomas Piper',
      email: 'pete@example.com',
      password: 'pass',
      roles: {
        admin: false,
        editor: false,
        translator: true,
        designer: false}},
    {id: '-LWMS-pfJ937R8i6951l7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomas Connor',
      email: 'pete@example.com',
      password: 'pass',
      roles: {
        admin: false,
        editor: false,
        translator: false,
        designer: true}}
  ],
  roleSearchFilters: {
    label: 'User Roles',
    roles: {
      admin: {name: 'Administrator', value: false},
      editor: {name: 'Editor', value: false},
      translator: {name: 'Translator', value: false},
      designer: {name: 'Designer', value: false}
    }
  },
  filteredUsers: null
}
const mutations = {
  mutateUser (state, payload) {
    let userToUpdate = state.registeredUsers.find(user => user.id === payload.id)
    let userIndex = state.registeredUsers.indexOf(userToUpdate)
    state.registeredUsers[userIndex] = payload
  },
  findUsers (state, payload) {
    state.filteredUsers = payload
  },
  clearFilteredUsers (state) {
    state.filteredUsers = state.registeredUsers
  }
}
const getters = {
  allUsers (state) {
    return state.registeredUsers
  },
  userByEmail (state, email) {
    return state.registeredUsers.find(user => user.email === email)
  },
  filteredUsers (state) {
    return state.filteredUsers
  }
}
const actions = {
  mutateUser ({commit}, payload) {
    commit('mutateUser', payload)
  },
  clearFilteredUsers ({commit}) {
    commit('clearFilteredUsers')
  },
  findUsers ({commit, dispatch}, payload) {
    // TODO put in mutation payload all filtered users from filterSet (action payload)
    let nameResults = []
    let roleResults = []
    let results = []
    if (payload.searchCriteria.length) {
      nameResults = state.registeredUsers.filter(user => {
        return user.email.match(payload.searchCriteria) || user.displayName.toLowerCase().match(payload.searchCriteria)
      })
      console.log('nameRes', nameResults)
    }
    if (payload.admin) {
      let result = state.registeredUsers.filter(user => user.roles.admin)
      roleResults = [...roleResults, ...result]
    }
    if (payload.editor) {
      let result = state.registeredUsers.filter(user => user.roles.editor)
      roleResults = [...roleResults, ...result]
    }
    if (payload.translator) {
      console.log(payload.translator)
      let result = state.registeredUsers.filter(user => user.roles.translator)
      roleResults = [...roleResults, ...result]
      console.log('roleRes', roleResults)
    }
    if (payload.designer) {
      let result = state.registeredUsers.filter(user => user.roles.designer)
      roleResults = [...roleResults, ...result]
    }
    if (roleResults.length && !nameResults.length) {
      results = roleResults
    } else if (roleResults.length && nameResults.length) {
      results = nameResults.filter(element => roleResults.includes(element))
    } else if (nameResults.length && !roleResults.length) {
      results = nameResults
    } else {
      results = state.registeredUsers
    }
    commit('findUsers', results)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
