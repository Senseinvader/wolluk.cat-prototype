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
          <v-text-field v-model="user.email" label="e-mail address" :rules='emailRules' :readonly='readOnly' solo></v-text-field>
          <v-text-field v-model="user.displayName" label="User Name" :rules='nameRules' counter="20" solo clearable></v-text-field>
          <v-checkbox v-model="user.roles.admin" label='Administrator' :readonly='readOnly' color='green'></v-checkbox>
          <v-checkbox v-model="user.roles.editor" label='Editor' :readonly='readOnly' color='green'></v-checkbox>
          <v-checkbox v-model="user.roles.translator" label='Translator' :readonly='readOnly' color='green'></v-checkbox>
          <v-checkbox v-model="user.roles.designer" label='Designer' :readonly='readOnly' color='green'></v-checkbox>
          <v-layout row wrap justify-center mb-3>
            <v-btn flat class='red--text' @click='openPassForm'>reset password</v-btn>
          </v-layout>
          <v-layout row wrap justify-center>
            <v-flex xs12 md12 v-if="passForm">
              <v-form ref='form'>
                <!-- <v-text-field v-for="(item, itemName) in itemsPass" :key="itemName"
                  label="item.label"
                  :rules="item.rules"
                  required
                  :append-icon="item.visibility ? 'visibility_off' : 'visibility'"
                  :type="item.visibility ? 'text' : 'password'"
                  @click:append="item.visibility = !item.visibility"
                  ></v-text-field> -->
                <v-text-field 
                  label="Old Password"
                  v-model='oldPassword'
                  :rules="oldPassRules" 
                  required 
                  :append-icon="show1 ? 'visibility_off' : 'visibility'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  ></v-text-field>
                <v-text-field 
                  label="New Password" 
                  v-model='match' 
                  required 
                  :append-icon="show2 ? 'visibility_off' : 'visibility'"
                  :type="show2 ? 'text' : 'password'"
                  @click:append="show2 = !show2"
                  ></v-text-field>
                <v-text-field 
                  label="Repeat new Password" 
                  v-model='model' 
                  :rules='newPassRules' 
                  required 
                  :append-icon="show3 ? 'visibility_off' : 'visibility'"
                  :type="show3 ? 'text' : 'password'"
                  @click:append="show3 = !show3"
                  ></v-text-field>
                <v-layout row wrap justify-center mb-4>
                  <v-btn flat color='green' @click="closePassForm">cancel</v-btn>
                  <v-btn dark color='green' @click='handleChangePass'>submit changes</v-btn>  
                </v-layout>            
              </v-form>
            </v-flex>
            <v-flex>
              <v-alert type='error' dismissible v-model='alert'>{{ error }}</v-alert>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap justify-center pa-4>
            <v-btn flat class='green--text'>cancel</v-btn>
            <v-btn dark color='green' @click='handleUpdate' :disabled='role' :to="{name:'Home'}">submit</v-btn>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>

export default {
  name: 'UserAccount',
  props: {
    readOnly: {
      type: Boolean
    },
    user: {
      type: Object
    },
    passFormVisibility: {
      type: Boolean
    }
  },
  data () {
    return {
      role: false,
      alert: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length < 20) || 'Name must be less than 20 characters'
      ],
      oldPassRules: [
        v => !!v || 'Field is reuquired'
        // v => (v === this.user.password) || 'Wrong current password'
      ],
      newPassRules: [
        v => v === this.match || 'Passwords does not match'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passForm: this.passFormVisibility,
      match: null,
      model: null,
      show1: false,
      show2: false,
      show3: false,
      oldPassword: null
      // itemsPass: [
      //   { label: 'Old Password',
      //     rules: [
      //       v => !!v || 'Field is reuquired',
      //       v => (v === this.user.password) || 'Wrong current password'
      //     ],
      //     visibility: this.show1,
      //     model: undefined
      //   },
      //   { label: 'New Password',
      //     rules: undefined,
      //     visibility: false,
      //     model: this.match
      //   },
      //   { label: 'Repeat New Password',
      //     rules: [
      //       v => v === this.match || 'Passwords does not match'
      //     ],
      //     visibility: false,
      //     model: this.model
      //   }
      // ]
    }
  },
  computed: {
    isAdmin () {
      return this.user.roles.admin
    },
    isEditor () {
      return this.user.roles.editor
    },
    isTranslator () {
      return this.user.roles.translator
    },
    isDesigner () {
      return this.user.roles.designer
    },
    error () {
      return this.$store.state.users.error
    }
  },
  watch: {
    match: 'validateField',
    model: 'validateField',
    isAdmin (value) {
      if (value) {
        this.role = true
      }
    },
    isEditor (value) {
      if (value) {
        this.role = true
      }
    },
    isTranslator (value) {
      if (value) {
        this.role = true
      }
    },
    isDesigner (value) {
      if (value) {
        this.role = true
      }
    },
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('users/setError', null)
      }
    }
  },
  methods: {
    handleUpdate () {
      this.$store.dispatch('users/mutateUser', this.user)
    },
    openPassForm () {
      this.passForm = true
    },
    closePassForm () {
      this.passForm = false
    },
    handleChangePass () {
      if (this.$refs.form.validate()) {
        this.passForm = false
        this.user.oldPassword = this.oldPassword
        this.user.password = this.model
        console.log('user email', this.user.email)
        console.log('user oldpass', this.user.oldPassword)
        console.log('user newpass', this.user.password)
        this.$store.dispatch('users/changePassword', this.user)
      }
    },
    validateField () {
      this.$refs.form.validate()
    }
  }
}
</script>


<style>

</style>

