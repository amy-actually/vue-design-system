import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import router from "@/router"

Vue.use(Vuex)
const bigKahuna = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/wp/v2/`,
})

export default new Vuex.Store({
  // Making sure that we're doing
  // everything correctly by enabling
  // strict mode in the dev environment.
  strict: process.env.NODE_ENV !== "production",
  modules: {
    publicContent,
  },
  state: {
    locations: [],
    loggedin: false,
    menu: [],
  },
})
