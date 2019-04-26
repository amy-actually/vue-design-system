import api from "../../plugins/api.js"
import { returnType } from "../utilities.js"

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
        dispatch("fetchTerms", { taxonomy: "audience" }),
        dispatch("fetchTerms", { taxonomy: "genres" }),
        dispatch("fetchTerms", { taxonomy: "featuredCollections" }),
      ])
    },
    async fetchTerms({ commit }, { taxonomy, perPage = 100, pg = 1, params = {} }) {
      let tax = returnType(taxonomy)
      taxonomy = !tax ? taxonomy : tax
      let args = { ...params, per_page: perPage, page: pg }
      return api.fetchContent(taxonomy, args).then(results => {
        commit("addTermsToState", { taxonomy: taxonomy, data: results.posts })
      })
    },
    async fetchTermContent(
      { state, rootState, commit, dispatch, getters, rootGetters },
      { taxonomy, slug }
    ) {
      let tax = returnType(taxonomy)
      taxonomy = !tax ? taxonomy : tax
      let term = state[taxonomy].find(item => item.slug == slug)

      if (!term) {
        term = await dispatch("fetchTerms", { taxonomy: taxonomy })
        term = state[taxonomy].find(item => item.slug == slug)
      }
      //NEEDS COMPLETION - DISPATCH GET LINKS (or count by page)
      dispatch()
    },
  },
  getters: {
    getTermBySlug: (state, getters, rootState, rootGetters) => (taxonomy, slug) => {
      let tax = returnType(taxonomy)
      taxonomy = !tax ? taxonomy : tax
      return state[taxonomy].find(item => item.slug === slug)
    },
    getTermById: (state, getters, rootState, rootGetters) => (taxonomy, tid) => {
      let tax = returnType(taxonomy)
      taxonomy = !tax ? taxonomy : tax
      return state[taxonomy].find(item => item.id === tid)
    },
    getTermFilters: (state, getters) => taxonomies => {
      let container = []
      taxonomies.forEach(taxonomy => {
        let tax = returnType(taxonomy)
        tax = !tax ? taxonomy : tax
        container[tax] =
          content[tax]["hierarchical"] === true ? getters.getHierarchy(tax) : state[tax]
      })
      return container
    },
    getHierarchy: state => taxonomy => {
      let parents = state[taxonomy].filter(term => !term.parent || term.parent == 0)
      parents.forEach(
        parent =>
          (parent.children = state[taxonomy].filter(
            child => child.parent && child.parent == parent.id
          ))
      )
      return parents
    },
  },
  mutations: {
    addTermsToState(state, { taxonomy, data }) {
      if (Array.isArray(data) && (!state[taxonomy] || state[taxonomy].length == 0)) {
        state[taxonomy] = data
      } else if (Array.isArray(data)) {
        data.forEach(content => {
          if (state[taxonomy].find(item => item.id === content.id) == undefined) {
            state[taxonomy].push(content)
          }
        })
      } else if (data.id && state[taxonomy].find(item => item.id === data.id) == undefined) {
        state[taxonomy].push(data)
      }
    },
  },
}
