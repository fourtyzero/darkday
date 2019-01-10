import { http } from '@/utils'
import Vue from 'vue'
// import uuid from 'uuid/v1'
let id = 1
export default {
  //命名空间
  namespaced: true,
  state: {
    items: {},
    // items: {
    //   1: {id: 1, product: {}},
    //   2: {id: 2, product: 3},
    // }
  },
  mutations: {
    addItem(state, { item }) {
      state.items[item.id] = item
    },
    addItems(state, items) {
      items.forEach((item) => {
        // state.items[item.id] = item
        Vue.set(state.items, item.id, item)
      })
    },
    alterItem(state, { id, change }) {
      state.items[id].quantity += change
      if (state.items[id].quantity <= 0) {
        state.items[id].quantity = 0
        state.items[id].checked = false
      }
    },
    setChecked(state, payload) {
      if (payload.id) {
        const { id, checked } = payload
        state.items[id].checked = checked
      } else {
        const { items, checked } = payload
        items.forEach((id) => (state.items[id].checked = checked))
      }
    },
    checkAll(state) {
      Object.keys(state.items).forEach((k) => (state.items[k].checked = true))
    },
    removeItem(state, { id }) {
      Vue.delete(state.items, id)
    },
    removeItems(state, ids) {
      for (let i = 0; i < ids.length; i++) {
        Vue.delete(state.items, ids[i])
      }
    },
    removeChecked(state) {
      Object.keys(state.items).forEach((i) => {
        if (i.checked) Vue.delete(state.items, i.id)
      })
    },
    clear(state) {
      state.items = {}
    },
  },
  actions: {
    clear({ commit }) {
      commit('clear')
    },
    fetchRemote({ commit, rootState }) {
      http
        .withToken(rootState.user.me.token)
        .get('/api/me/cart/all')
        .then((res) => {
          // add checked to true
          const d = res.data.map((i) => {
            i.checked = true
            const spec = i.product.specs.find((s) => s.quantity === i.spec)
            i.spec = spec ? spec : i.product.specs[0]
            i.seller = i.product.seller
            return i
          })
          commit('addItems', d)
        })
    },
    payOrder({ rootState }, { orderId }) {
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/order/pay', { order_id: orderId })
    },
    confirmOrder(
      { commit, state, rootState },
      { cb, items, address_id, extra }
    ) {
      const checked = Object.values(state.items)
        .filter((i) => i.checked)
        .map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price: i.spec.current_price,
          spec: i.spec.quantity,
        }))
      // remove all checked items in store
      commit('removeChecked')
      // will send all checked items as an order
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/order/create', { address_id, items: checked })
        .then((res) => {
          cb(res.data.id)
        })
      // .then()
    },
    addItem({ state, commit, rootState }, payload) {
      const { item } = payload
      // make a guard, can not add same product twice
      const p = Object.values(state.items).some(
        (i) => i.product.id === item.product.id
      )
      if (p) return
      // const item = payload.item
      let itemId
      if (!item.id) {
        item.id = id++
        itemId = item.id
      }
      commit('addItem', { item })
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/cart/add', {
          item: {
            product_id: item.product.id,
            spec: item.spec.quantity,
            quantity: item.quantity,
          },
        })
        .then((res) => {
          const { id } = res.data
          // const { id } = res.data.id
          state.items[itemId].id = id
          Vue.set(state.items, id, state.items[itemId])
          Vue.delete(state.items, itemId)
        })
    },
    alterItem({ commit, rootState, state }, payload) {
      // const { id, change } = payload
      commit('alterItem', payload)
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/cart/alter', { id, quantity: state.items[id].quantity })
    },
    removeItems({ commit, rootState }, items) {
      commit('removeItems', items)
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/cart/delete', { items })
    },
    removeChecked({ state, commit, rootState }) {
      const items = Object.keys(state.items)
      commit('removeItems', items)
      http
        .withToken(rootState.user.me.token)
        .post('/api/me/cart/delete', { items })
    },
  },
}
