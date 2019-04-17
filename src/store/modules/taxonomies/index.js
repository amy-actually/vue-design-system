import api from "../../plugins/api.js"
import * as utils from "../utilities.js"

const content = {
  genres: { hierarchical: true, store: "genres", label: "Filter by Genre" },
  audience: { hierarchical: false, store: "audience", label: "Filter by Audience" },
}
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
    async fetchCollectionTerms({ dispatch, commit }) {
      return Promise.all([
        dispatch("fetchTerms", { type: "audience" }),
        dispatch("fetchTerms", { type: "genres" }),
        dispatch("fetchTerms", { type: "featuredCollections" }),
      ])
    },
    async fetchTerms({ commit }, { type, perPage = 100, pg = 1, params = {} }) {
      let args = { ...params, per_page: perPage, page: pg }
      return api.fetchContent(type, args).then(results => {
        commit("addTermsToState", { type: type, data: results.posts })
      })
    },
  },
  getters: {
    getTermBySlug: (state, getters, rootState, rootGetters) => (type, slug) => {
      type = utils.returnTaxonomyType(type)
      return state[type].find(item => item.slug === slug)
    },
    getTermById: (state, getters, rootState, rootGetters) => (type, tid) => {
      type = utils.returnTaxonomyType(type)
      return state[type].find(item => item.id === tid)
    },
    getTermFilters: (state, getters) => types => {
      let container = []
      types.forEach(tax => {
        container[tax] =
          content[tax]["hierarchical"] === true ? getters.getHierarchy(tax) : state[tax]
      })
      return container
    },
    getHierarchy: state => tax => {
      let parents = state[tax].filter(term => !term.parent || term.parent == 0)
      parents.forEach(
        parent =>
          (parent.children = state[tax].filter(child => child.parent && child.parent == parent.id))
      )
      return parents
    },
  },
  mutations: {
    addTermsToState(state, { type, data }) {
      if (Array.isArray(data) && (!state[type] || state[type].length == 0)) {
        state[type] = data
      } else if (Array.isArray(data)) {
        data.forEach(content => {
          if (state[type].find(item => item.id === content.id) == undefined) {
            state[type].push(content)
          }
        })
      } else if (data.id && state[type].find(item => item.id === data.id) == undefined) {
        state[type].push(data)
      }
    },
  },
}
