import slugify from 'slugify'

const state = {
  allUsers: [
    {id: '-LWMS-pfJ937K4iwRlkj',
      displayName: 'Tomek Drazek',
      email: 'tomek@wolluk.com',
      password: 'pass',
      slug: 'tomekwollukcom',
      roles: {
        admin: true,
        editor: false,
        translator: false,
        designer: false}},
    {id: '-LWMS-pfJ937K4i4001llp',
      displayName: 'Janusz Cebula',
      email: 'janusz@example.com',
      password: 'pass',
      slug: 'januszexamplecom',
      roles: {
        admin: false,
        editor: true,
        translator: false,
        designer: false}},
    {id: '-LWMS-pfJ937K4i3651lcv',
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'pass',
      slug: 'johnexamplecom',
      roles: {
        admin: false,
        editor: false,
        translator: true,
        designer: false}},
    {id: '-LWMS-pfJ937R8i3651lrt',
      displayName: 'Tomas Piper',
      email: 'pete@example.com',
      password: 'pass',
      slug: 'peteexamplecom',
      roles: {
        admin: false,
        editor: false,
        translator: true,
        designer: false}},
    {id: '-LWMS-pfJ937R886951lee',
      displayName: 'Tomas Connor',
      email: 'tom1@example.com',
      password: 'pass',
      slug: 'tom1examplecom',
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
  filteredUsers: []
}
const mutations = {
  // Mutation for localStorage version with previous search of a payload user in users array
  mutateUser (state, payload) {
    let userToUpdate = state.allUsers.find(user => user.id === payload.id)
    let userIndex = state.allUsers.indexOf(userToUpdate)
    state.allUsers[userIndex] = payload
  },
  findUsers (state, payload) {
    state.filteredUsers = payload
  },
  // Mutation reinitializes filteredUsers array to be equal to allUsers
  //  being used on created() and destroyed() lifecyle hooks
  clearFilteredUsers (state) {
    state.filteredUsers = state.allUsers
  },
  deleteUser (state, payload) {
    console.log('delete user')
    state.allUsers = payload
  },
  addUser (state, payload) {
    state.allUsers.push(payload)
  }
  // digestallUsers (state, payload) {
  //   state.allUsers = payload
  // }
}
const getters = {
  filteredUsers (state) {
    return state.filteredUsers
  },
  allUsers (state) {
    return state.allUsers
  },
  userBySlug (state) {
    // return state.allUsers.find(user => user.slug === slug)
    return slug => state.allUsers.find(user => {
      return user.slug === slug
    })
  }
}
const actions = {
  mutateUser ({commit}, payload) {
    // Slug is created based on email address and used for routing (instead of ids)
    payload.slug = slugify(payload.email, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true
    })
    // If user is in array, data is updated, othewise is pushed to array
    let userToUpdate = state.allUsers.find(user => user.id === payload.id)
    if (state.allUsers.indexOf(userToUpdate) !== -1) {
      console.log('yes we can update')
      commit('mutateUser', payload)
    } else {
      commit('addUser', payload)
    }
  },
  // Action to reinitialize filteredUsers equal to registaredUsers (all users)
  clearFilteredUsers ({commit}) {
    commit('clearFilteredUsers')
  },
  deleteUser ({commit}, payload) {
    let newAllUsers = state.allUsers.filter(user => user.id !== payload.id)
    commit('deleteUser', newAllUsers)
  },
  // digestallUsers ({commit}) {
  //   commit('digestallUsers', state.initialallUsers)
  // },

  // This action filters all registered users based on given search criteras (as payload)
  // and dispatches findUsers mutation to put only filtered users into filteredUsers array
  findUsers ({commit, dispatch}, payload) {
    let nameResults = []
    let roleResults = []
    let results = []
    // Check if filterSet has searchCriteria, based on it filters allUsers
    // match displayName or email with the searchCriteria
    if (payload.searchCriteria.length) {
      nameResults = state.allUsers.filter(user => {
        return user.email.match(payload.searchCriteria) || user.displayName.toLowerCase().match(payload.searchCriteria)
      })
      console.log('nameRes', nameResults)
    }
    // Check if filterSet contains one or more roles marked, filters allUsers
    if (payload.admin) {
      let result = state.allUsers.filter(user => user.roles.admin)
      roleResults = [...roleResults, ...result]
    }
    if (payload.editor) {
      let result = state.allUsers.filter(user => user.roles.editor)
      roleResults = [...roleResults, ...result]
    }
    if (payload.translator) {
      console.log(payload.translator)
      let result = state.allUsers.filter(user => user.roles.translator)
      roleResults = [...roleResults, ...result]
      console.log('roleRes', roleResults)
    }
    if (payload.designer) {
      let result = state.allUsers.filter(user => user.roles.designer)
      roleResults = [...roleResults, ...result]
    }
    // Based on results of filtering by searchCriteria and roles, in case they both not empty
    // combines results
    if (roleResults.length && !nameResults.length) {
      results = roleResults
    } else if (roleResults.length && nameResults.length) {
      results = nameResults.filter(element => roleResults.includes(element))
    } else if (nameResults.length && !roleResults.length) {
      results = nameResults
    } else {
      results = state.allUsers
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
