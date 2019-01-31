<template lang="pug">
  v-list(:expand="false") 

    v-flex(mb-3="")
      v-list-tile
        v-list-tile-content
          v-text-field(label="Search" v-model="searchCriteria" clearable @keyup="addStringToFilterSet" mt-5="")

    v-list-group(:value="true")
      v-list-tile(slot="activator")
        v-list-tile-content {{ roleFilters.label }}
      
      v-list-tile(v-for="(role, roleName) in roleFilters.roles" :key="roleName" )
        v-list-tile-action
          v-checkbox(hide-details v-model="filterSet[roleName]" @change="sendSearchQuery")
        v-list-tile-content
          v-list-tile-title {{ role.name }}

</template>
<script>
export default {
  data () {
    return {
      searchCriteria: '',
      filterSet: {searchCriteria: '', admin: false, editor: false, translator: false, designer: false}
    }
  },
  computed: {
    roleFilters () {
      return this.$store.state.users.roleSearchFilters
    }
  },
  methods: {
    addStringToFilterSet () {
      this.filterSet.searchCriteria = this.searchCriteria
      this.sendSearchQuery()
    },
    sendSearchQuery () {
      this.$store.dispatch('users/findUsers', this.filterSet)
    }
  }
}
</script>
