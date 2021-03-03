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
    },
    modifyFavorites(state, [payload, index]) {
      let action
      if (Array.isArray(payload)) action = 'set'
      else if (typeof index === 'number') {
        if (payload) action = 'edit'
        else action = 'delete'
      } else if (payload) action = 'add'

      switch (action) {
        case 'set': return state.favorites = payload
        case 'add': return state.favorites.push(payload)
        case 'edit': return state.favorites.splice(index, 1, payload)
        case 'delete': return state.favorites.splice(index, 1)
        default: console.log('modifyFavorites error')
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
