<template>
  <UserPageComponent v-bind:read-only="false" v-bind:user="user"/>
</template>


<script>
import UserPageComponent from './UserPageComponent'

export default {
  components: { UserPageComponent },
  name: 'createUser',
  data () {
    return {
      user: {
        id: '',
        displayName: '',
        email: '',
        password: ' ',
        slug: '',
        roles: {
          admin: false,
          editor: false,
          translator: false,
          designer: false}}
    }
  }
}
</script>


<style>

</style>