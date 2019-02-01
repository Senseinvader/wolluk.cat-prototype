import slugify from 'slugify'

const state = {
  registeredUsers: [
    {id: '-LWMS-pfJ937K4iwRlkj', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomek Drazek',
      email: 'tomek@wolluk.com',
      password: 'pass',
      slug: 'tomek-drazek',
      roles: {
        admin: true,
        editor: false,
        translator: false,
        designer: false}},
    {id: '-LWMS-pfJ937K4i4001llp', // this is id similar to Firebase (auto gen.)
      displayName: 'Janusz Cebula',
      email: 'janusz@example.com',
      password: 'pass',
      slug: 'janusz-cebula',
      roles: {
        admin: false,
        editor: true,
        translator: false,
        designer: false}},
    {id: '-LWMS-pfJ937K4i3651lcv', // this is id similar to Firebase (auto gen.)
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'pass',
      slug: 'john-doe',
      roles: {
        admin: false,
        editor: false,
        translator: true,
        designer: false}},
    {id: '-LWMS-pfJ937R8i3651lrt', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomas Piper',
      email: 'pete@example.com',
      password: 'pass',
      slug: 'tomas-piper',
      roles: {
        admin: false,
        editor: false,
        translator: true,
        designer: false}},
    {id: '-LWMS-pfJ937R886951lee', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomas Connor',
      email: 'tom1@example.com',
      password: 'pass',
      slug: 'tomas-connor',
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
  // registeredUsers: [],
  filteredUsers: []
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
  },
  deleteUser (state, payload) {
    console.log('delete user')
    state.registeredUsers = payload
  },
  addUser (state, payload) {
    state.registeredUsers.push(payload)
  }
  // digestRegisteredUsers (state, payload) {
  //   state.registeredUsers = payload
  // }
}
const getters = {
  allUsers (state) {
    return state.registeredUsers
  },
  // userByEmail (state, email) {
  //   return state.registeredUsers.find(user => user.email === email)
  // },
  filteredUsers (state) {
    return state.filteredUsers
  },
  registeredUsers (state) {
    return state.registeredUsers
  },
  userBySlug (state) {
    // return state.registeredUsers.find(user => user.slug === slug)
    return slug => state.registeredUsers.find(user => {
      return user.slug === slug
    })
  }
}
const actions = {
  mutateUser ({commit}, payload) {
    payload.slug = slugify(payload.displayName, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true
    })
    let userToUpdate = state.registeredUsers.find(user => user.id === payload.id)
    if (state.registeredUsers.indexOf(userToUpdate) !== -1) {
      console.log('yes we can update')
      commit('mutateUser', payload)
    } else {
      commit('addUser', payload)
    }
  },
  clearFilteredUsers ({commit}) {
    commit('clearFilteredUsers')
  },
  deleteUser ({commit}, payload) {
    console.log(state.registeredUsers)
    let newRegisteredUsers = state.registeredUsers.filter(user => user.id !== payload.id)
    console.log(state.registeredUsers.length, newRegisteredUsers.length)
    commit('deleteUser', newRegisteredUsers)
  },
  // digestRegisteredUsers ({commit}) {
  //   commit('digestRegisteredUsers', state.initialRegisteredUsers)
  // },
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
