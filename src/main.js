// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
// import firebase from '@/firebase'
import colors from 'vuetify/es5/util/colors'

// A-la'carte components goes here:
import {
  Vuetify,
  VApp,
  VCard,
  VDialog,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VForm,
  VGrid,
  VToolbar,
  VTextField,
  VCheckbox,
  VCombobox,
  VChip,
  VSelect,
  VAlert,
  VMenu,
  VDivider,
  transitions
} from 'vuetify'

import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VCard,
    VDialog,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VForm,
    VGrid,
    VToolbar,
    VTextField,
    VCheckbox,
    VCombobox,
    VChip,
    VSelect,
    VAlert,
    VMenu,
    VDivider,
    transitions
  },
  theme: {
    primary: colors.green,
    secondary: colors.grey,
    accent: colors.red,
    error: colors.red,
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

Vue.config.productionTip = false

// Vue.prototype.$firebase = firebase
// Ust this for Firebase authentication:
/* eslint-disable no-new */
// const unsubscribe = firebase.auth()
//   .onAuthStateChanged((firebaseUser) => {
//     new Vue({
//       el: '#app',
//       router,
//       store,
//       render: h => h(App),
//       created () {
//         if (firebaseUser) {
//           store.dispatch('autoSignIn', firebaseUser)
//         }
//       }
//     })
//     unsubscribe()
//   })

// Simplified version without Firebase auth:
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
