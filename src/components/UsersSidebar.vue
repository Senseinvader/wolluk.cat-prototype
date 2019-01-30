<template lang="pug">
  v-list(:expand="false") 

    v-flex(mb-3="")
      v-list-tile
        v-list-tile-content(mb-4="")
          v-text-field(label="Search" clearable)

    v-list-group(:value="true")
      v-list-tile(slot="activator")
        v-list-tile-content {{ filters.label }}
      
      v-list-tile(v-for="(role, roleName) in filters.roles" :key="roleName" )
        v-list-tile-action
          v-checkbox(hide-details v-model="filterSet[roleName]")
        v-list-tile-content
          v-list-tile-title {{ role.name }}

</template>
<script>
// import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      filterSet: {}
    }
  },
  computed: {
    // ...mapGetters({
    //   filters: 'objects/searchcriterias'
    // })
    filters () {
      return this.$store.state.users.searchCriterias
    }
  }
}
</script>
