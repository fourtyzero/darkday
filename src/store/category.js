import axios from 'axios'
// import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    categories: [],
  },
  mutations: {
    addCategories(state, payload) {
      state.categories = payload
    },
  },
  actions: {
    fetchRemote({ commit }) {
      axios.get('/api/category').then((res) => {
        commit('addCategories', res.data)
      })
    },
  },
}
