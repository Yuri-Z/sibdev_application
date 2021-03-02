import Vue from 'vue'
import Vuex from 'vuex'

import storeFavorites from '@/src/assets/js/functions/storeFavorites'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      login: '',
      password: ''
    },
    favorites: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    deleteFromFavorites(state, index) {
      state.favorites.splice(index, 1)
      // setFavorites(state.favorites)
    },
    addToFavorites(state, { request, index }) {
      if (typeof index === 'number') {
        state.favorites.splice(index, 1, request)
      } else {
        state.favorites.push(request)
      }
      // setFavorites(state.favorites)
    },
    modifyFavorites(state, [payload, index]) {
      if (Array.isArray(payload))
        return state.favorites = payload
      if (typeof index === 'number') {
        if (payload) state.favorites.splice(index, 1, payload)
        else state.favorites.splice(index, 1)
      } else {
        return state.favorites.push(payload)
      }
    }
  },
  actions: {
    authorize({commit}, user) {
      commit('setUser', user)
      commit('modifyFavorites', [Array.from(JSON.parse(localStorage.getItem('favorites'))[user.login])])
    },
    setFavorites({state: {user: {login}, favorites}, commit}, [payload, index]) {
      commit('modifyFavorites', [payload, index])

      storeFavorites(login, favorites)
    },
  },
  modules: {}
})
