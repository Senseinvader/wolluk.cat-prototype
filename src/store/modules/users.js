// import slugify from 'slugify'
// import firebase from 'firebase'
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
  //  This action receives User object from UserPageComponent and depending on Context
  //  (whether that user is to create or update) dispatches editUser of createUser action
  mutateUser ({dispatch}, payload) {
    if (payload.id) {
      dispatch('editUser', payload)
    } else {
      console.log('this user doesnt exist in database')
    }
  },
  clearFilteredUsers ({commit}) {
    commit('clearFilteredUsers')
  },
  //  This action sets new data about existing user to the database, then dispatches
  editUser ({dispatch}, payload) {
    console.log(payload.slug)
    db.collection('wolluk-users').where('id', '==', payload.id).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id)
        db.collection('wolluk-users').doc(doc.id)
        .update({
          displayName: payload.displayName,
          email: payload.email,
          slug: payload.slug,
          roles: payload.roles
        })
      })
    })
    .catch(error => {
      console.log(error.message)
    })
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
        let newUser = {
          id: doc.data().id,
          email: doc.data().email,
          displayName: doc.data().displayName,
          slug: doc.data().slug,
          roles: doc.data().roles
        }
        updatedRegusteredUsers.push(newUser)
      })
    })
    console.log('whatdafuc?', updatedRegusteredUsers[0])
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
