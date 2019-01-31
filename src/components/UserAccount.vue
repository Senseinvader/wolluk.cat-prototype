<template>
  <UserPageComponent v-bind:read-only="true" v-bind:user="user"/>
</template>


<script>
import UserPageComponent from './UserPageComponent'

export default {
  components: { UserPageComponent },
  name: 'UserAccount',
  data () {
    return {
      user: null
    }
  },
  created () {
    this.user = this.$store.getters['auth/activeUser']
  }
}
</script>


<style>

</style>

