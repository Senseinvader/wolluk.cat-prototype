<template>
  <v-container>
    <v-layout row wrap justify-center mt-5>
      <v-flex xs1 mr-4>
        <v-btn large fab class='green'>
          <v-icon large color='white'>person</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs4>
        <form @click.prevent='handleUpdate'>
          <v-text-field v-model="signedInUser.email" label="e-mail address" required ></v-text-field>
          <v-text-field v-model="signedInUser.displayName" label="User Name" required ></v-text-field>
          <v-checkbox v-model="signedInUserRoles.admin" label='Administrator' disabled ></v-checkbox>
          <v-checkbox v-model="signedInUserRoles.editor" label='Editor' disabled ></v-checkbox>
          <v-checkbox v-model="signedInUserRoles.translator" label='Translator' disabled ></v-checkbox>
          <v-checkbox v-model="signedInUserRoles.designer" label='Designer' disabled ></v-checkbox>
          <v-layout row wrap justify-center mb-3>
            <v-btn flat class='red--text'>reset password</v-btn>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap justify-center pa-4>
            <v-btn flat class='green--text'>cancel</v-btn>
            <v-btn dark color='green'>submit</v-btn>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  name: 'UserAccount',
  created () {
    console.log(this.signedInUserRoles.admin)
  },
  updated () {
    console.log(this.signedInUserRoles.admin)
  },
  computed: {
    signedInUser () {
      return this.$store.getters['auth/activeUser']
    },
    signedInUserRoles () {
      return this.$store.getters['auth/activeUserRoles']
      // return this.signedInUser ? this.signedInUser.roles : null
    }
  },
  methods: {
    handleUpdate () {
    }
  }
}
</script>


<style>

</style>

