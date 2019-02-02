import slugify from 'slugify'
import firebase from 'firebase'
import db from '../../main'

const state = {
  registeredUsers: [],
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
  },
  updateRegisteredUsers (state, payload) {
    state.registeredUsers = payload
    console.log(state.registeredUsers)
  }
}
const getters = {
  allUsers (state) {
    return state.registeredUsers
  },
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
    payload.slug = slugify(payload.email, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true
    })
    console.log(payload.slug)
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
  updateRegisteredUsers ({commit}) {
    let updatedRegusteredUsers = []
    db.collection('wolluk-users').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc
        console.log(doc.data())
        updatedRegusteredUsers.push(doc.data())
      })
    })
    commit('updateRegisteredUsers', updatedRegusteredUsers)
  },
  findUsers ({commit, dispatch}, payload) {
    // TODO put in mutation payload all filtered users from filterSet (action payload)
    let nameResults = []
    let roleResults = []
    let results = []
    if (payload.searchCriteria.length) {
      nameResults = state.registeredUsers.filter(user => {
        console.log(user)
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
