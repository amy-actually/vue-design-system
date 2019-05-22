import actions from "./actions.js"
import mutations from "../../mutations.js"
import getters from "./getters.js"

export default {
  namespaced: true,
  state: {
    alerts: [],
    blogs: [],
    callsToAction: [],
    collection: [],
    events: [],
    pages: [],
    posts: [],
    resources: [],
    counts: {
      alerts: 0,
      blogs: 0,
      callsToAction: 0,
      collection: 0,
      events: 0,
      pages: 0,
      posts: 0,
      resources: 0,
    },
    alertsFetched: false,
    blogsFetched: false,
    collectionFetched: false,
    eventsFetched: false,
    pagesFetched: false,
    postsFetched: false,
    resourcesFetched: false,
  },
  actions,
  getters,
  mutations,
}
