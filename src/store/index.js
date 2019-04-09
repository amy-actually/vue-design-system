import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import router from "../router"

Vue.use(Vuex)
import actions from "./actions.js"
import mutations from "./mutations.js"
import getters from "./getters.js"

export default new Vuex.Store({
  // Making sure that we're doing
  // everything correctly by enabling
  // strict mode in the dev environment.
  strict: process.env.NODE_ENV !== "production",

  state: {
    alerts: [],
    blogs: [],
    callsToAction: [],
    collection: [],
    currentLocation: "all",
    events: [],
    locations: [],
    loggedin: false,
    menus: [],
    pages: [],
    posts: [],
    resources: [],
    services: [],
  },
  actions,
  getters,
  mutations,
})
