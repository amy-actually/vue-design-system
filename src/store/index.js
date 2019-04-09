import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import router from "../router"

Vue.use(Vuex)
import actions from "./actions.js"
import mutations from "./mutations.js"
import getters from "./getters.js"

const bigKahuna = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/wp/v2/`,
})
const fontana = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/fontana/v1/`,
})
//https://public-api.wordpress.com/rest/v1.1/sites/fontanalib.wordpress.com/posts
const shelfLife = axios.create({
  baseURL: "https://public-api.wordpress.com/rest/v1.1/sites/fontanalib.wordpress.com/",
})

const endpoint = {
  alerts: { type: "bigKahuna", slug: "notices" },
  callsToAction: { type: "bigKahuna", slug: "calls-to-action" },
  collection: { type: "bigKahuna", slug: "collection" },
  events: { type: "bigKahuna", slug: "events" },
  locations: { type: "bigKahuna", slug: "locations" },
  pages: { type: "bigKahuna", slug: "pages" },
  posts: { type: "bigKahuna", slug: "posts" },
  resources: { type: "bigKahuna", slug: "notices" },
  services: { type: "bigKahuna", slug: "notices" },
  blogs: { type: "shelfLife", slug: "posts" },
}

//Vue.prototype.axios = axios;

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
