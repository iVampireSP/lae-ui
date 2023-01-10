import { createStore } from 'vuex'
import http from '../http.js'

export default createStore({
  state: {
    gct: [],
  },
  actions: {
    fetchGCT({ commit }) {
      http.get('/modules/gct/hosts').then((response) => {
        commit('setGct', response.data)
      })
    },
  },
  mutations: {
    addGCT(state, gct) {
      state.gct.push(gct)
    },
    removeGCT(state, gct) {
      state.gct.splice(state.gct.indexOf(gct), 1)
    },
    setGCT(state, gct) {
      state.gct = gct
    },
    updateGCT(state, gct) {
      let index = state.gct.findIndex((item) => item.id === gct.id)
      state.gct.splice(index, 1, gct)
    },
  },
})
