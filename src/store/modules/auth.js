import router from '@/router'

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
    return state.user.roles.admin === true
  },
  error (state) {
    return state.error
  }
}
const actions = {
  userSignUp ({commit}, payload) {
    // Add user to /users
    commit('setUser', { email: payload.email })
    // rootState.// verify from /users/
    router.push('/home')
    // commit('setLoading', true)
    // rootState.// verify from /users/
    // firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    // .then(firebaseUser => {
    //   commit('setUser', {email: firebaseUser.user.email})
    //   commit('setLoading', false)
    //   router.push('/home')
    // })
    // .catch(error => {
    //   commit('setError', error.message)
    //   commit('setLoading', false)
    // })
  },
  userSignIn ({commit, rootState}, payload) {
    // commit('setLoading', true)
    let users = rootState.users.registeredUsers
    users.forEach(user => {
      if (user.email === payload.email && user.password === payload.password) {
        commit('setUser', { email: payload.email, password: payload.password, roles: user.roles })
        commit('setError', null)
        router.push('/home')
      } else {
        commit('setError', 'You entered wrong credentials')
      }
    })
    // firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    // .then(firebaseUser => {
    //   commit('setUser', {email: firebaseUser.user.email})
    //   commit('setLoading', false)
    //   commit('setError', null)
    //   router.push('/home')
    // })
    // .catch(error => {
    //   commit('setError', error.message)
    //   commit('setLoading', false)
    // })
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', { email: payload.email })
  },
  userSignOut ({commit}) {
    // firebase.auth().signOut()
    commit('setUser', null)
    commit('setError', null)
    router.push('/')
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
