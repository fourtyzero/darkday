import Vue from 'vue'
import { http } from '@/utils'

export default {
  namespaced: true,
  state: {
    footprints: {
      // id: product
    },
  },
  mutations: {
    addFootprints(state, fts) {
      fts.forEach((f) => {
        Vue.set(state.footprints, f.id, f)
      })
    },
  },
  actions: {
    fetchFootprints({ commit, rootState }) {
      http
        .withToken(rootState.user.me.token)
        .get('/api/me/footprints')
        .then((res) => {
          commit('addFootprints', res.data)
        })
    },
    addFootprint({ commit, rootState }, payload) {
      // payload = {}
      commit()
      http
        .withToken(rootState.user.me.token)
        .get('/api/me/footprint/create')
        .then((res) => {
          commit('addFootprints', res.data)
        })
    },
    removeFootprints({ commit, rootState }) {
      http
        .withToken(rootState.user.me.token)
        .get('/api/me/footprint/delete')
        .then((res) => {
          commit('addFootprints', res.data)
        })
    },
  },
}
