import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import router from "@/router"

Vue.use(Vuex)

export default new Vuex.Store({
  // Making sure that we're doing
  // everything correctly by enabling
  // strict mode in the dev environment.
  strict: process.env.NODE_ENV !== "production",
  modules: {
    publicContent,
  },
  state: {
    menu: [],
    locations: [],
    loggedin: false,
  },
  mutations: {
    addContentToState(state, { type, data }) {
      if (Array.isArray(data) && (!state[type] || state[type].length == 0)) {
        state[type] = data
      } else if (data.id && state[type].find(item => item.id === data.id) == undefined) {
        state[type].push(data)
      } else if (Array.isArray(data)) {
        data.forEach(content => {
          if (state[type].find(item => item.id === content.id) == undefined) {
            state[type].push(content)
          }
        })
      }
    },
    setValue(state, value) {
      state.currentService = location
    },
  },
})
