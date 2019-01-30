<template lang="pug">
  v-container(fluid='')
      v-layout(row='', wrap='')
        v-flex.text-xs-center(xs12='', mt-5='')
          h1 The users dashboard
          h1 {{ filteredUsers }}
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
    }
  }
}
</script>


<style>

</style>

