// import $ from 'axios'
import { http } from '@/utils'
import remove from 'lodash'
import Vue from 'vue'
import axios from 'axios'
const init = {
  id: 0,
  token: '',
  footprints: [],
  orders: [],
  name: '',
  mobile: '',
  avatar: '',
  sex: 0,
  default_address: '',
  addresses: [],
}
export default {
  namespaced: true,
  state: {
    loggedIn: false,
    logging: false,
    loginMessage: '',
    loginStatus: 'ready',
    me: init,
  },
  mutations: {
    login(state, payload) {
      state.loggedIn = true
      Object.keys(payload).forEach((k) => {
        Vue.set(state.me, k, payload[k])
      })
    },
    logout(state) {
      state.loggedIn = false
      state.loginStatus = 'ready'
      state.logging = false
      state.me = init
      window.localStorage.removeItem('user.mobile')
      window.localStorage.removeItem('user.password')
    },
    updateProfile(state, payload) {
      Object.keys(payload).forEach((k) => {
        Vue.set(state.me, k, payload[k])
      })
    },
    addAddresses(state, addrs) {
      addrs.forEach((a) => state.me.addresses.push(a))
    },
    deleteAddress(state, { id }) {
      remove(state.me.addresses, (a) => a.id === id)
    },
  },
  actions: {
    // TODO: should support pagination, both server side and client side
    fetchAddresses({ state }) {
      http
        .withToken(state.me.token)
        .get(`/api/user/${state.me.id}/addresses`)
        .then((res) => {
          state.me.addresses = res.data
        })
    },
    logout({ commit, dispatch }) {
      // http
      //   .withToken(state.me.token)
      //   .post('/api/user/logout')
      //   .then(() => {
      //     commit('logout')
      //   })
      commit('logout')
      dispatch('cart/clear', {}, { root: true })
    },
    login({ state, commit, dispatch }, payload) {
      state.logging = true
      state.loginMessage = ''
      setTimeout(() => {
        if (payload.method === 'normal') {
          const { mobile, password, autoLogin, redirect } = payload
          if (autoLogin) {
            window.localStorage.setItem('user.mobile', mobile)
            window.localStorage.setItem('user.password', password)
          } else {
            window.localStorage.removeItem('user.mobile')
            window.localStorage.removeItem('user.password')
          }
          axios
            .post('/api/user/login', { mobile, password })
            .then((res) => {
              state.logging = false
              const { data } = res
              if (data.error || res.status === 401) {
                state.loginMessage = data.message || '登录失败'
                state.loginStatus = 'fail'
                return
              }
              state.loginMessage = ''
              state.loginStatus = 'ok'
              commit('login', data)
              // and fetch user favortes
              dispatch('favorite/fetchFavorites', {}, { root: true })
              dispatch('cart/fetchRemote', {}, { root: true })
            })
            .catch((err) => {
              state.logging = false
              state.loginMessage = err.message || '登录失败'
              state.loginStatus = 'fail'
            })
        }
      }, 2500)
    },
    addAddress({ commit, rootState }, payload) {
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/address/create', payload)
        .then((res) => {
          commit('addAddresses', [res.data])
        })
    },
    deleteAddress({ commit, rootState }, payload) {
      commit('deleteAddress', payload)
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/address/delete', { address_id: payload.id })
    },
    setDefaultAddress({ state, rootState }, id) {
      state.me.default_address = id
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/address/default', { address_id: id })
    },
  },
}
