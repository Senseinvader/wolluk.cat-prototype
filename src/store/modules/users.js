const state = {
  registeredUsers: [
    {id: '-LWMS-pfJ937K4iwRl7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'Tomek Drazek',
      email: 'tomek@wolluk.com',
      password: 'pass',
      roles: {
        admin: true,
        editor: true,
        translator: true,
        designer: true}},
    {id: '-LWMS-pfJ937K4i4001l7Q', // this is id similar to Firebase (auto gen.)
      displayName: 'Janusz Cebula',
      email: 'janusz@example.com',
      password: 'pass',
      roles: {
        admin: false,
        editor: true,
        translator: false,
        designer: false}}
  ]
}
const getters = {

}
const actions = {

}
const mutations = {

}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
