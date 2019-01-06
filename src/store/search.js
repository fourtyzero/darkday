import { pick } from 'lodash'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    page: 1,
    last: 1,
    categories: [],
    filter: '',
    sort: '',
    q: '',
    results: [],
    searching: false,
  },
  mutations: {
    setQuery(state, q) {
      state.q = q
    },
    setSorter(state, s) {
      state.sort = s
    },
    setPage(state, p) {
      state.page = p
    },
    setFilter(state, s) {
      state.filter = s
    },
    setCategory(state, cs) {
      state.categories = cs
    },
    setParams(state, p) {
      Object.keys(p).forEach((k) => (state[k] = p[k]))
    },
    updateResults(state, payloads) {
      state.results = payloads
    },
  },
  actions: {
    search({ state, commit }) {
      state.searching = true
      axios
        .get('/api/search', {
          params: {
            q: state.q,
            filter: state.filter,
            categories: state.categories,
            sort: state.sort,
            page: state.page,
          },
        })
        .then(({ data }) => {
          state.searching = false
          state.results = data.data
          state.last = data.last_page
        })
        .catch((err) => {
          state.searching = false
        })
    },
  },
}
