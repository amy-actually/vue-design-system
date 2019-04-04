const publicTaxonomies = {
  state: {
    featuredCollections: [],
    genres: [],
    audiences: [],
    services: [],
  },

  mutations: {
    addContentToState(state, data) {
      if (!state[data.name] || state[data.name].length == 0) {
        state[data.name] = data.results
      } else {
        for (let i = 0; i < data.results.length; i++) {
          const index = state[data.name].findIndex(item => item.id === data.results[i].id)
          if (index === -1) {
            state[data.name].push(data.results[i])
          }
        }
      }
    },
  },

  getters: {},

  actions: {
    async getServices({ commit }) {
      return new Promise(resolve => {
        const services = api.fetchData("services", { per_page: 100 }).then(data => {
          commit("addServicesToState", data.data)
          resolve()
        })
      })
    },
  },
}
