<template>
  <UserPageComponent v-bind:read-only="false" v-bind:user="userTemplate" v-bind:pass-form-visibility='true'/>
</template>


<script>
import UserPageComponent from './UserPageComponent'

export default {
  components: { UserPageComponent },
  name: 'createUser',
  data () {
    return {
      userTemplate: {
        id: null,
        displayName: null,
        email: null,
        password: ' ',
        slug: null,
        roles: {
          admin: false,
          editor: false,
          translator: false,
          designer: false}
      }
    }
  }
}
</script>


<style>

</style>