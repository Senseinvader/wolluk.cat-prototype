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
            <v-flex xs3 offset-2>
              <v-btn large fab class='green'>
                <v-icon large color='white'>person</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn flat color='green'>
              <span>delete</span>
            </v-btn>
            <v-btn flat color='green' :to="{name: 'editUser', params: {user_name: user.slug}}">
              <span>edit</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-btn fab bottom right color="pink" dark fixed :to="{name:'createUser'}">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'SystemUsers',
  data () {
    return {
    }
  },
  created () {
    this.$store.dispatch('users/clearFilteredUsers')
  },
  computed: {
    filteredUsers () {
      console.log(this.$store.getters['users/filteredUsers'])
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