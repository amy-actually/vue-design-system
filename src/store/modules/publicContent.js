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
    currentLocation: "all",
  },

  mutations: {
    addContentToState(state, data) {
      if (!state[data.type] || state[data.type].length == 0) {
        state[data.type] = data.data
      } else if (state[data.type].find(item => item.id === data.data.id) !== undefined) {
        state[data.type].push(data.data)
      }
    },
  },

  getters: {},

  actions: {
    async getServices({ commit }, page = 1) {
      return bigKahuna.get(`/services?per_page=100&page=${page}`).then(response => {
        commit("addContentToState", { type: "services", data: response.data })
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
