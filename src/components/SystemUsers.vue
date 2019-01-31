<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm4 class='ma-2 mx-4 pa-4' v-for='user in filteredUsers' :key='user.id'>
        <v-card dark color="purple">
          <v-layout row wrap>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="subheading">{{user.displayName}}</div>
                  <div>{{user.email}}</div>
                  <div>
                    <div class='roles text-uppercase' v-for='(role, roleName) in user.roles' :key='roleName' v-if='role'>{{roleName}}_</div>
                  </div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs5>
              <v-btn large fab class='green'>
                <v-icon large color='white'>person</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-card-action>
            <v-btn flat color='green'>delete</v-btn>
            <v-btn flat color='green'>edit</v-btn>
          </v-card-action>
        </v-card>
      </v-flex>
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