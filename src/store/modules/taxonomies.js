import api from "../plugins/api.js"
export default {
  namespaced: true,
  state: {
    audience: [],
    featuredCollections: [],
    genres: [],
    locations: [],
    services: [],
    subjects: [],
    taxonomies: [],
  },
  actions: {
    async fetchTerms({ commit }, { type, perPage = 100, pg = 1, params = [] }) {
      let args = { ...params, per_page: perPage, page: pg }
      return api.fetchContent(type, args).then(results => {
        commit("addTermsToState", { type: type, data: results.posts })
      })
    },
  },
  getters: {
    getTermBySlug: (state, getters, rootState) => (type, slug) => {
      return state[type].find(item => item.slug === slug)
    },
  },
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
  },
}
