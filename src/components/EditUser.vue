<template>
  <UserPageComponent v-bind:read-only="false" v-bind:user="user"/>
</template>


<script>
import UserPageComponent from './UserPageComponent'

export default {
  components: { UserPageComponent },
  name: 'editUser',
  data () {
    return {
      slug: this.$route.params.user_name
    }
  },
  computed: {
    user () {
      return this.$store.getters['users/userBySlug'](this.slug)
    }
  }
}
</script>


<style>

</style>