import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingStatus: false, //loading全局开关。
  },
  mutations: {
    changeLoading(state, val) {
      state.loadingStatus = val
    },
  },
  actions: {
    commitLoading({commit},val){
      commit('changeLoading',val)
    },
  },
  modules: {
  }
})
