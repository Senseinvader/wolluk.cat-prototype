import router from '@/router'
import firebase from 'firebase'

const state = {
  user: null,
  error: null,
  loading: false
}

const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  }
}

const getters = {
  isAuthenticated (state) {
    return state.user !== null && state.user !== undefined
  },
  isAdmin (state) {
    return state.user !== null && state.user.roles === true && state.user.roles.admin === true
  },
  error (state) {
    return state.error
  },
  activeUser (state) {
    return state.user
  },
  activeUserRoles (state) {
    return state.user ? state.user.roles : null
  }
}
const actions = {
  userSignUp ({commit}, payload) {
    // // Add user to /users
    // commit('setUser', { email: payload.email })
    // // rootState.// verify from /users/
    // router.push('/home')
    commit('setLoading', true)
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    .then(cred => {
      commit('setUser', {
        id: cred.user.uid,
        email: cred.user.email
      })
      console.log(cred.user)
      commit('setLoading', false)
      commit('setError', false)
      router.push('/home')
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  userSignIn ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    .then(cred => {
      commit('setUser', {id: cred.user.uid,
        email: cred.user.email
      })
      commit('setLoading', false)
      commit('setError', null)
      router.push('/home')
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', { email: payload.email })
  },
  userSignOut ({commit}) {
    firebase.auth().signOut().then(() => {
      commit('setUser', null)
      commit('setError', null)
      router.push({ name: 'Landing' })
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
