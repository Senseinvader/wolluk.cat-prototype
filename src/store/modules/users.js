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
    state.registeredUsers = payload
  },
  addUser (state, payload) {
    state.registeredUsers.push(payload)
  },
  updateRegisteredUsers (state, payload) {
    state.registeredUsers = payload
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
  changePassword ({commit}, payload) {
    let user = firebase.auth().currentUser
    console.log(payload.email)
    let credential = firebase.auth.EmailAuthProvider.credential(
      payload.email,
      payload.oldPassword
    )
    // firebase.auth().signInWithEmailAndPassword(payload.email, payload.oldPassword)
    // .then(() => {
    //   console.log('reauthenticated successfully')
    // })
    // .then(() => {
    // })
    user.reauthenticateAndRetrieveDataWithCredential(credential)
    .then(() => {
      console.log('reauthenticated successfully')
      user.updatePassword(payload.password)
    })
    .then(() => {
      console.log('password changed successfully')
      router.push({name: 'Home'})
    })
    .catch(error => {
      console.log(error.message)
    })
  },
  //  This action receives User object from UserPageComponent and depending on Context
  //  (whether that user is to create or update) dispatches editUser of createUser action
  mutateUser ({dispatch}, payload) {
    if (payload.id) {
      dispatch('editUser', payload)
    } else {
      //  TODO creating a user by admin
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
  deleteUser ({commit}, payload) {
    console.log(state.registeredUsers)
    let newRegisteredUsers = state.registeredUsers.filter(user => user.id !== payload.id)
    console.log(state.registeredUsers.length, newRegisteredUsers.length)
    commit('deleteUser', newRegisteredUsers)
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
    console.log('whatdafuc?', updatedRegusteredUsers[0])
    commit('updateRegisteredUsers', updatedRegusteredUsers)
  },
  // This action filters all registered users based on given search criteras (as payload)
  // and dispatches findUsers mutation to put only filtered users into filteredUsers array
  findUsers ({commit, dispatch}, payload) {
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
// var user = firebase.auth().currentUser;
// var credential = firebase.auth.EmailAuthProvider.credential(
//   email,
//   password
// );
// firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
//     .then()
// // Prompt the user to re-provide their sign-in credentials

// user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
//   // User re-authenticated.
// }).catch(function(error) {
//   // An error happened.
