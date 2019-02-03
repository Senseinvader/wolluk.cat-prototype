<template>
  <v-container>
    <v-layout row wrap>
      <v-flex sm12 md5 class='pa-4' v-for='user in filteredUsers' :key='user.id'>
        <v-card color="grey lighten-4">
          <v-layout row wrap>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="subheading">{{user.displayName}}</div>
                  <div>{{user.email}}</div>
                  <div>
                    <div class='roles text-uppercase caption' v-for='(role, roleName) in user.roles' :key='roleName' v-if='role'>{{roleName}}_</div>
                  </div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs3 offset-xs1>
              <v-btn large fab class='green'>
                <v-icon large color='white'>person</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-card-actions>

            <v-dialog v-model='dialog' persistent max-width='300'>
              <v-btn flat color='green' slot='activator' @click='prepareDeleteCandidate(user)'><span>delete</span></v-btn>
              <v-card>
                <v-card-title class='subheading'>Delete this user?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn dark color='green' @click='dialog=false'>cancel</v-btn>
                  <v-btn dark color='error' @click='handleDeleteUser'>delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            

            <v-btn flat color='green' :to="{name: 'editUser', params: {user_name: user.slug}}">
              <span>edit</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-tooltip top>
        <v-btn fab bottom right color="pink" dark fixed :to="{name:'createUser'}" slot='activator'>
          <v-icon>add</v-icon>
      </v-btn>
      <span>Add new user</span>
      </v-tooltip>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'SystemUsers',
  data () {
    return {
      dialog: false,
      deleteCandidate: null
    }
  },
  created () {
    this.$store.dispatch('users/clearFilteredUsers')
  },
  computed: {
    filteredUsers () {
      return this.$store.getters['users/filteredUsers']
    },
    role (roles) {
      Object.keys(roles).forEach(key => {
        if (roles[key] === true) {
          return key
        }
      })
    }
  },
  methods: {
    handleDeleteUser () {
      this.$store.dispatch('users/deleteUser', this.deleteCandidate)
      this.$store.dispatch('users/clearFilteredUsers')
      this.dialog = false
    },
    prepareDeleteCandidate (user) {
      this.deleteCandidate = user
    }
  }
}
</script>


<style>
.roles {
  display: inline-block;
}
</style>


  // v-container(fluid='')
  //   h1 The users dashboard
  //   v-layout(row='', wrap='')
  //     v-flex(xs12='' sm6='' md6='' v-for='user in filteredUsers' :key='user.id')          
  //       v-card.text-xs-center.ma-3 {{ user.displayName }}