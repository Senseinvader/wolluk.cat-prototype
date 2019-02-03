// import slugify from 'slugify'
import firebase from 'firebase'
import db from '../../main'
import router from '@/router'

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
  filteredUsers: [],
  error: null
}
const mutations = {
  // Mutation for localStorage version with previous search of a payload user in users array
  mutateUser (state, payload) {
    let userToUpdate = state.registeredUsers.find(user => user.id === payload.id)
    let userIndex = state.registeredUsers.indexOf(userToUpdate)
    state.registeredUsers[userIndex] = payload
  },
  //  Mutatuon of filteredUsers array based on given payload - array of filtered users
  findUsers (state, payload) {
    state.filteredUsers = payload
  },
  // Mutation reinitializes filteredUsers array to be equal to registeredUsers
  //  being used on created() and destroyed() lifecyle hooks
  clearFilteredUsers (state) {
    state.filteredUsers = state.registeredUsers
  },
  deleteUser (state, payload) {
    state.registeredUsers = payload
  },
  addUser (state, payload) {
    state.registeredUsers.push(payload)
  },
  //  Mutation used to dinamically update registeredUsers array based on changes to it in database
  // mutation used in firebase version
  updateRegisteredUsers (state, payload) {
    state.registeredUsers = payload
  },
  setError (state, payload) {
    state.error = payload
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
  //  This action changes password of an active user, does not commit mutations nor dispatches other actions
  changePassword ({commit}, payload) {
    let user = firebase.auth().currentUser
    console.log(payload.email)
    let credential = firebase.auth.EmailAuthProvider.credential(
      payload.email,
      payload.oldPassword
    )
    // Stage one - reauthenticate current user using given old password
    user.reauthenticateAndRetrieveDataWithCredential(credential)
    .then(() => {
      console.log('reauthenticated successfully')
      // Stage two - change password to given new password
      user.updatePassword(payload.password)
    })
    .then(() => {
      console.log('password changed successfully')
      commit('setError', null)
      router.push({name: 'Home'})
    })
    .catch(error => {
      commit('setError', error.message)
    })
  },
  //  This action receives User object from UserPageComponent and depending on Context
  //  (whether that user is to create or update) dispatches editUser of createUser action
  mutateUser ({dispatch}, payload) {
    if (payload.id) {
      dispatch('editUser', payload)
    } else {
      //  TODO creating a user from the admin account
      console.log('this user doesnt exist in database')
    }
  },
  // reinitiates filteredUsers equal to registaredUsers (all users)
  clearFilteredUsers ({commit}) {
    commit('clearFilteredUsers')
  },
  //  This action sets new data about existing user to the database (at this stage only displayName)
  //  It soesn't dispatch commit amy mutation or dispatch other action, cause all updated data is being
  // listened by updateRegisteredUsers action/listener
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
  // TODO implement delete user from admin account
  deleteUser ({commit}, payload) {
    console.log(state.registeredUsers)
  },
  //  This action is an event listener, which updates array of registered users each time
  //  data was edited, added of deleted
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
    // NOT UNDERSTOOD STATE OF THE ARRAY - ITEMS CANNOT BE GOT BY INDEX
    // PRESUMABLY IT IS THE REASON WHY SEARCH ACTION DOESNT WORK WITH DYNAMIC ARRAYS
    console.log('whatdafuc?', updatedRegusteredUsers[0])
    commit('updateRegisteredUsers', updatedRegusteredUsers)
  },
  // This action filters all registered users based on given search criteras (as payload)
  // and dispatches findUsers mutation to put only filtered users into filteredUsers array
  findUsers ({commit, dispatch}, payload) {
    let nameResults = []
    let roleResults = []
    let results = []
    // Check if filterSet has searchCriteria, based on it filters registeredUsers
    // match displayName or email with the searchCriteria
    if (payload.searchCriteria.length) {
      nameResults = state.registeredUsers.filter(user => {
        console.log(user)
        return user.email.match(payload.searchCriteria) || user.displayName.toLowerCase().match(payload.searchCriteria)
      })
      console.log('nameRes', nameResults)
    }
    // Check if filterSet contains one or more roles marked, filters registeredUsers
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
    // Based on results of filtering by searchCriteria and roles, in case they both not empty
    // combines results
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
