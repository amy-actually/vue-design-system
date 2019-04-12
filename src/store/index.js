import Vue from "vue"
import Vuex from "vuex"

import router from "../router"

Vue.use(Vuex)

import actions from "./actions.js"
import mutations from "./mutations.js"
import getters from "./getters.js"

import taxonomies from "./modules/taxonomies.js"
import tribe from "./modules/tribe.js"

export default new Vuex.Store({
  // Making sure that we're doing
  // everything correctly by enabling
  // strict mode in the dev environment.
  strict: process.env.NODE_ENV !== "production",
  modules: {
    taxonomies: taxonomies,
    tribe: tribe,
  },
  state: {
    alerts: [],
    blogs: [],
    callsToAction: [],
    collection: [],
    currentLocation: "all",
    events: [],
    loggedin: false,
    menus: [],
    pages: [],
    posts: [],
    resources: [],
  },
  actions,
  getters,
  mutations,
})
