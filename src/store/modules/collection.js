export default {
  namespaced: true,
  state: {
    featuredCollections: [],
    genres: [],
    audience: [],
    subjects: [],
    taxonomies: [],
  },
  actions: {
    fetchAudiences({ commit }) {
      return bigKahuna.get(`/audience`, { per_page: 100 }).then(response => {
        commit("addTermsToState", ["audience", response.data])
      })
    },

    fetchFeaturedCollections({ commit }, page = 1) {
      return bigKahuna
        .get(`/featured-collections`, { per_page: 100, page: page })
        .then(response => {
          commit("addTermsToState", ["featuredCollections", response.data])
        })
    },

    fetchGenres({ commit }) {
      return bigKahuna.get(`/genres`, { per_page: 100 }).then(response => {
        commit("addTermsToState", ["genres", response.data])
      })
    },

    fetchSubjects({ commit }) {
      return bigKahuna.get(`/subjects`, { per_page: 100 }).then(response => {
        commit("addTermsToState", ["genres", response.data])
      })
    },

    fetchTaxonomies({ commit }) {
      return bigKahuna.get(`/taxonomies`, { per_page: 100 }).then(response => {
        commit("addTaxonomiesToState", response.data)
      })
    },
  },
  getters: {},
  mutations: {
    addTermsToState(state, { type, data }) {
      if (Array.isArray(data) && (!state[type] || state[type].length == 0)) {
        state[type] = data
      } else if (data.id && state[type].find(item => item.id === data.id) == undefined) {
        state[type].push(data)
      } else if (Array.isArray(data)) {
        data.forEach(content => {
          if (state[type].find(item => item.id === content.id) == undefined) {
            state[type].push(content)
          }
        })
      }
    },

    addTaxonomiesToState(state, data) {
      state.taxonomies = data
    },
  },
}
