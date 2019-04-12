import Vue from "vue"
import Vuex from "vuex"

import router from "../router"

Vue.use(Vuex)

import actions from "./actions.js"
import mutations from "./mutations.js"
import getters from "./getters.js"

import content from "./modules/content.js"
import taxonomies from "./modules/taxonomies.js"
import tribe from "./modules/tribe.js"

export default new Vuex.Store({
  // Making sure that we're doing
  // everything correctly by enabling
  // strict mode in the dev environment.
  strict: process.env.NODE_ENV !== "production",
  modules: {
    content: content,
    taxonomies: taxonomies,
    tribe: tribe,
  },
  state: {
    currentLocation: "all",
    loggedin: false,
    menus: [],
  },
  actions,
  getters,
  mutations,
})
