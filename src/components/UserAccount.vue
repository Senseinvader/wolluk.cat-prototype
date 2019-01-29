<template>
  <v-container>
    <v-layout row wrap justify-center mt-5>
      <v-flex xs7 md1 mr-4>
        <v-btn large fab class='green'>
          <v-icon large color='white'>person</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs7 md4>
        <v-form >
          <v-text-field v-model="user.email" label="e-mail address" disabled ></v-text-field>
          <v-text-field v-model="user.displayName" label="User Name" :rules='nameRules' ></v-text-field>
          <v-checkbox v-model="user.roles.admin" label='Administrator' disabled ></v-checkbox>
          <v-checkbox v-model="user.roles.editor" label='Editor' disabled ></v-checkbox>
          <v-checkbox v-model="user.roles.translator" label='Translator' disabled ></v-checkbox>
          <v-checkbox v-model="user.roles.designer" label='Designer' disabled ></v-checkbox>
          <v-layout row wrap justify-center mb-3>
            <v-btn flat class='red--text' @click='openPassForm'>reset password</v-btn>
          </v-layout>
          <v-layout row wrap justify-center>
            <v-flex xs12 md12 v-if="passForm">
              <v-form ref='form' v-model='valid'>
                <v-text-field label="Old Password" :rules="oldPassRules" required></v-text-field>
                <v-text-field label="New Password" v-model='match' required></v-text-field>
                <v-text-field label="Repeat new Password" v-model='model' :rules='newPassRules' required></v-text-field>
                <v-layout row wrap justify-center mb-4>
                  <v-btn flat color='green' @click="closePassForm">cancel</v-btn>
                  <v-btn dark color='green' @click='handleChangePass' :disabled='!valid'>submit changes</v-btn>  
                </v-layout>            
              </v-form>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap justify-center pa-4>
            <v-btn flat class='green--text'>cancel</v-btn>
            <v-btn dark color='green' @click='handleUpdate'>submit</v-btn>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>

export default {
  name: 'UserAccount',
  data () {
    return {
      valid: true,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length < 20) || 'Name must be less than 20 characters'
      ],
      oldPassRules: [
        v => !!v || 'Field is reuquired',
        v => (v === this.user.password) || 'Wrong current password'
      ],
      newPassRules: [
        v => v === this.match || 'Passwords dont match'
      ],
      user: null,
      passForm: false,
      match: '',
      model: ''
    }
  },
  watch: {
    match: 'validateField',
    model: 'validateField'
  },
  created () {
    this.user = this.$store.getters['auth/activeUser']
    console.log(this.user.password)
  },
  methods: {
    handleUpdate () {
      this.$store.dispatch('users/mutateUser', this.user)
      console.log(this.user.displayName)
    },
    openPassForm () {
      this.passForm = true
    },
    closePassForm () {
      this.passForm = false
    },
    handleChangePass () {
      this.passForm = false
      this.user.password = this.model
    },
    validateField () {
      this.$refs.form.validate()
    }
  }
}
</script>


<style>

</style>

