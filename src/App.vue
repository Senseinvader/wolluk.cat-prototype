<template lang="pug">
  v-app
    v-navigation-drawer(v-if="hasSidebar" :clipped="true" fixed v-model="sidebar" app)
      router-view(name="sidebar")
    v-toolbar(app="" clipped-left fixed color="green" dark)
      span
        v-toolbar-side-icon(@click="sidebar = !sidebar")
      v-toolbar-title 
        router-link(to="/" tag="span" style="cursor:pointer") {{ appTitle }}
      v-spacer
      v-toolbar-items.hidden-xs-only
        v-btn(flat v-for='item in menuItems' :key='item.title' :to='item.path')
          v-icon(left dark) {{ item.icon }}
          | {{ item.title }}
        v-menu(v-if="isAuthenticated" offset-y offset-x)
          v-btn(flat slot='activator')
            v-icon settings
            
          v-list(light)
            v-list-tile(v-for='item in accountItems' :key='item.title' :to='item.path') 
              v-list-tile-action
                v-icon(left) {{ item.icon }}
              v-list-tile-title {{ item.title }}

            v-divider
            v-list-tile(@click='userSignOut') 
              v-list-tile-action
                v-icon(left) exit_to_app
              v-list-tile-title Sign off
    v-content
      router-view
</template>

<script>
  import router from '@/router'

  export default {
    data () {
      return {
        appTitle: 'Wolluk.cat',
        sidebar: true
      }
    },
    computed: {
      // appTitle () {
      //   return this.$store.state.appTitle
      // },
      isAuthenticated () {
        return this.$store.getters['auth/isAuthenticated']
      },
      isAdmin () {
        return this.$store.getters['auth/isAdmin']
      },
      menuItems () {
        if (this.isAuthenticated) {
          return [
            { title: 'Home', path: '/home', icon: 'home' },
            { title: 'Objects', path: '/objects', icon: 'place' },
            { title: 'Catalogues', path: '/projects', icon: 'local_library' },
            { title: 'Translations', path: '/translation', icon: 'translate' }
          ]
        } else {
          return [
            { title: 'Sign Up', path: '/signup', icon: 'face' },
            { title: 'Sign In', path: '/signin', icon: 'lock_open' }
          ]
        }
      },
      accountItems () {
        if (this.isAdmin) {
          return [
            { title: 'My Account', action: '', icon: 'person', path: '/user-account' },
            { title: 'Change password', action: 'changePassword', icon: 'fingerprint', path: '' },
            { title: 'System users', action: '', icon: 'group', path: '/system-users' }
          ]
        } else {
          return [
            { title: 'My account', action: '', icon: 'person', path: '/user-account' },
            { title: 'Change password', action: 'changePassword', icon: 'fingerprint', path: '' }
          ]
        }
      },
      hasSidebar () {
        let matched = this.$route.matched[0]
        return matched && matched.components && matched.components.sidebar
      }
    },
    methods: {
      userSignOut () {
        router.push('/')
        this.$store.dispatch('auth/userSignOut')
      }
    }
  }
</script>