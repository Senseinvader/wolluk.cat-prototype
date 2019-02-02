<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 Sign Up
      v-flex(xs12='', sm6='', offset-sm3='', mt-3='')
        form(@submit.prevent="userSignUp")
          v-layout(column='')
            v-flex
              v-text-field#email(name='email', v-model='email', label='Email', type='email', required='')
            v-flex
              v-text-field#password(name='password', v-model='password', label='Password', type='password', required='')
            v-flex
              v-text-field#confirmPassword(name='confirmPassword', v-model='passwordConfirm', label='Confirm Password', type='password', required='', :rules='[comparePasswords]')
            v-flex.text-xs-center(mt-5='')
              v-btn(color='primary', type='submit') Sign Up
            v-flex
              v-alert(type='error', dismissible='', v-model='alert') {{ error }}
</template>


<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      alert: false
    }
  },
  computed: {
    comparePasswords () {
      return this.password === this.passwordConfirm ? true : 'Passwords don\'t match'
    },
    error () {
      return this.$store.state.auth.error
    },
    loading () {
      return this.$store.state.auth.loading
    }
  },
  methods: {
    userSignUp () {
      if (this.comparePasswords !== true) {
        return
      }
      this.$store.dispatch('auth/userSignUp', { email: this.email, password: this.password })
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('auth/setError', null)
      }
    }
  }
}
</script>