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
    return state.user !== null && state.user.roles.admin === true
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
    commit('setUser', { email: payload.email })
    router.push('/home')
  },
  userSignIn ({commit, rootState}, payload) {
    let users = rootState.users.registeredUsers
    console.log(users)
    let foundUser = null
    users.forEach(user => {
      if (user.email === payload.email && user.password === payload.password) {
        foundUser = user
      }
    })
    if (foundUser) {
      commit('setUser', foundUser)
      commit('setError', null)
      router.push('/home')
    } else {
      commit('setError', 'You entered wrong credentials')
    }
  },
  autoSignIn ({commit}, payload) {
    commit('setUser', { email: payload.email })
  },
  userSignOut ({commit}) {
    commit('setUser', null)
    commit('setError', null)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
