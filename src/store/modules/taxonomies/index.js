import api from "../../plugins/api.js"

import { returnType, endpoint } from "../utilities.js"

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
    audienceLoading: false,
    featuredCollectionsLoading: false,
    genresLoading: false,
    locationsLoading: false,
    servicesLoading: false,
    subjectsLoading: false,
  },
  actions: {
    async fetchCollectionTerms({ state, rootState, commit, dispatch }) {
      if (state.audience.length == 0 && !state.audienceLoading) {
        dispatch("fetchTerms", { taxonomy: "audience" })
      }
      if (state.genres.length == 0 && !state.genresLoading) {
        dispatch("fetchTerms", { taxonomy: "genres" })
      }
      if (state.featuredCollections.length == 0 && !state.featuredCollectionsLoading) {
        dispatch("fetchTerms", { taxonomy: "featuredCollections" })
      }
    },
    async fetchTerms(
      { state, rootState, commit },
      { taxonomy, perPage = 100, pg = 1, params = {} }
    ) {
      console.log("fetchTerms : " + taxonomy)
      let tax = returnType(taxonomy)
      let args = { ...params, per_page: perPage, page: pg }
      if (!state[`${tax}Loading`]) {
        commit("SET_LOADING", { taxonomy: tax, value: true })
        return api.fetchContent(tax, args).then(results => {
          commit("addTermsToState", { taxonomy: tax, data: results.posts })
          commit("SET_LOADING", { taxonomy: tax, value: false })
        })
      }
      return
    },
    async fetchTermContent(
      { state, rootState, commit, dispatch, getters, rootGetters },
      { taxonomy, slug }
    ) {
      console.log(`fetchTermContent: looking for ${slug} in ${taxonomy} `)

      let tax = returnType(taxonomy)
      let term
      if (state[tax].length == 0 || !state[tax].find(item => item.slug == slug)) {
        term = await dispatch("fetchTerms", { taxonomy: tax })
        //term = state[tax].find(item => item.slug == slug)
      }
      term = state[tax].find(item => item.slug == slug)
      //NEEDS COMPLETION - DISPATCH GET LINKS (or count by page)

      for (var content in term.count_by_type) {
        if (term.count_by_type[content] > 0) {
          let params = {}
          params[tax] = term.id
          dispatch("content/fetchContent", { type: content, params: params }, { root: true })
        }
      }
    },
  },
  getters: {
    getTermBySlug: (state, getters, rootState, rootGetters) => (taxonomy, slug) => {
      let tax = returnType(taxonomy)
      //taxonomy = utils.returnTaxonomyType(tax)
      return state[tax].find(item => item.slug === slug)
    },
    getTermById: (state, getters, rootState, rootGetters) => (taxonomy, tid) => {
      let tax = returnType(taxonomy)
      //taxonomy = utils.returnTaxonomyType(taxonomy)
      return state[tax].find(item => item.id === tid)
    },
    getTermFilters: (state, getters) => taxonomies => {
      let container = []
      taxonomies.forEach(taxonomy => {
        container[taxonomy] =
          content[taxonomy]["hierarchical"] === true
            ? getters.getHierarchy(taxonomy)
            : state[taxonomy]
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
            //state[taxonomy].push(content)
            state[taxonomy] = [...state[taxonomy], content]
          }
        })
      } else if (data.id && state[taxonomy].find(item => item.id === data.id) == undefined) {
        //state[taxonomy].push(data)
        state[taxonomy] = [...state[taxonomy], data]
      }
    },
    SET_LOADING(state, { taxonomy, value }) {
      state[`${taxonomy}Loading`] = value
    },
  },
}
