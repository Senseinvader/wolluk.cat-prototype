import router from '@/router'
import firebase from 'firebase'
import db from '../../main'
import slugify from 'slugify'

const state = {
  user: null,
  error: null,
  loading: false,
  slug: null
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
    commit('setLoading', true)
    state.slug = slugify(payload.email, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true
    })
    let ref = db.collection('wolluk-users').doc(state.slug)
    ref.get().then(doc => {
      if (doc.exists) {
        commit('setError', 'User with this email already exists')
      } else {
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(cred => {
          let newUser = {
            id: cred.user.uid, // this is id similar to Firebase (auto gen.)
            displayName: null,
            email: cred.user.email,
            slug: state.slug,
            roles: {
              admin: true}
          }
          commit('setUser', newUser)
          ref.set(newUser)
        })
        .then(() => {
          commit('setLoading', false)
          commit('setError', false)
          router.push({name: 'Home'})
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
      }
    })
  },
  userSignIn ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    .then(cred => {
      state.slug = slugify(cred.user.email, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true
      })
      db.collection('wolluk-users').doc(state.slug).get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data()
          commit('setUser', data)
          router.push({name: 'Home'})
          commit('setLoading', false)
          commit('setError', null)
          console.log(data)
        } else {
          commit('setError', 'User not found')
        }
      })
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
