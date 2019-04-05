const bigKahuna = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/wp/v2/`,
})

export default {
  namespaced: true,
  state: {
    callsToAction: [],
    collection: [],
    events: [],
    pages: [],
    posts: [],
    articles: [],
    resources: [],
    alerts: [],
    services: [],
  },

  mutations: {
    setCurrentLocation(state, location) {
      state.currentLocation = location
    },
  },

  getters: {},

  actions: {
    async getUpcomingEvents({ commit }, page = 1) {
      return bigKahuna.get(`/events?per_page=100&page=${page}`).then(response => {
        commit("addContentToState", ["events", response.data])
      })
    },
    async getContentBySlug({ commit }, { type, slug }) {
      return bigKahuna.get(`/${type}?slug=${slug}`).then(response => {
        commit("addContentToState", ["events", response.data])
      })
    },
    /* getHomePageContent({ commit, dispatch }){
      let response
      try {
        response = await Vue.http.get()
      } catch(err){
        return
      }
      const data = response.body

    }, */
  },
}
