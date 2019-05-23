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
    audienceCount: 0,
    featuredCount: 0,
    genresCount: 0,
    locationsCount: 0,
    servicesCount: 0,
    subjectsCount: 0,
  },
  actions: {
    async fetchCollectionTerms({ state, rootState, commit, dispatch }) {
      dispatch("fetchTerms", { taxonomy: "audience" })
      dispatch("fetchTerms", { taxonomy: "genres" })
      dispatch("fetchTerms", { taxonomy: "featuredCollections" })
    },
    async fetchTerms({ commit }, { taxonomy, perPage = 100, pg = 1, params = {} }) {
      let tax = returnType(taxonomy)
      let args = { ...params, per_page: perPage, page: pg }
      return api.fetchContent(tax, args).then(results => {
        commit("addTermsToState", { taxonomy: tax, data: results.posts })
        if (!params || params.length == 0) {
          commit("ADD_COUNT", { type: tax, count: results.count })
        }
      })
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
      let fetch = []
      for (var content in term.count_by_type) {
        if (term.count_by_type[content] > 0) {
          let params = {}
          params[tax] = term.id
          let type = returnType(content)
          if (type && type !== "error") {
            if (type !== "collection") {
              fetch.push(
                dispatch(
                  `${endpoint[type].module}/fetchAllContent`,
                  { type: type, params: params },
                  { root: true }
                )
              )
            } else {
              fetch.push(
                dispatch(
                  `${endpoint[type].module}/fetchContent`,
                  { type: type, params: params },
                  { root: true }
                )
              )
            }
          }
        }
      }
      return Promise.all(fetch)
    },
    async fetchAllContent({ state, rootState, commit, dispatch }, { type }) {
      const contentType = returnType(type)
      if (contentType === "error") {
        return
      }
      let results
      if (state[`${contentType}Count`] === 0) {
        results = await dispatch("fetchTerms", { taxonomy: contentType })
      }

      if (state[contentType].length < state[`${contentType}Count`]) {
        let pages = Math.ceil(state[`${contentType}Count`] / 100)
        let page = Math.floor(state[contentType].length / 100) + 1
        while (pages >= page) {
          dispatch("fetchContent", { type: contentType, pg: page, params: args })
          page++
        }
      }
      return
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
    ADD_COUNT(state, { type, count }) {
      if (state[`${type}Count`]) {
        state[`${type}Count`] = count
      }
    },
  },
}
