import actions from "../actions.js"
import mutations from "../mutations.js"
import getters from "../getters.js"

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
  },
  actions,
  getters,
  mutations,
}
