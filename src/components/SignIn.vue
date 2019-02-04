<template lang="pug">
  v-container(fluid='')
    v-layout(row='', wrap='')
      v-flex.text-xs-center(xs12='', mt-5='')
        h1 Sign In
      v-flex(xs12='', sm6='', offset-sm3='', mt-3='')
        form( @submit.prevent="userSignIn")
          v-layout(column='')
            v-flex
              v-text-field#email(name='email', label='Email', type='email', required='', v-model="email")
            v-flex
              v-text-field#password(name='password', label='Password', type='password', required='', v-model="password")
            v-flex.text-xs-center(mt-5='')
              v-btn(color='primary', type='submit') Sign In
            v-flex
              v-alert(type='error', dismissible='', v-model='alert') {{ error }}
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      alert: false
    }
  },
  methods: {
    userSignIn () {
      this.$store.dispatch('auth/userSignIn', { email: this.email, password: this.password })
    }
  },
  computed: {
    error () {
      return this.$store.state.auth.error
    },
    loading () {
      return this.$store.state.loading
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
