import api from "./plugins/api.js"
export default {
  async loadHome({ dispatch, commit }) {
    dispatch("content/loadHome")
    dispatch("taxonomies/fetchTerms", { taxonomy: "services", perPage: 100 })
  },
  async loadApp({ dispatch, commit }) {
    dispatch("taxonomies/fetchTerms", { taxonomy: "locations" })
    dispatch("fetchMenus", { root: true })
  },

  async fetchContent({ dispatch, commit, state }, { type, perPage = 100, pg = 1, params = {} }) {
    let args =
      type === "blog"
        ? { ...params, number: perPage, page: pg }
        : { ...params, per_page: perPage, page: pg }

    return api.fetchContent(type, args).then(results => {
      commit(`${results.commit}`, { type: type, data: results.posts })
      if (state.counts && state.counts[type]) {
        commit("ADD_COUNT", { type: type, count: results.count })
      }
    })
  },

  async fetchContentBySlug({ commit }, { type, slug }) {
    return api.fetchBySlug(type, slug).then(results => {
      commit("ADD_CONTENT_SLUG", { type: type, data: results.data })
    })
  },

  async fetchAllContent({ commit, state }, { type, params = {} }) {
    let args = { ...params, per_page: 100 }

    let results = await api.fetchContent(type, args)
    let pages = results.pages

    commit(`${results.commit}`, { type: type, data: results.posts })

    let page = 2
    while (pages >= page) {
      args.page = page
      dispatch("fetchContent", { type: type, pg: page, params: args })
      page++
    }
  },
  async fetchMenus({ commit }) {
    let menus = await api.fetchContent("menus")
    menus.posts.forEach(menu => {
      api.fetchBySlug("menus", menu.slug).then(results => {
        commit("ADD_CONTENT_SLUG", { type: "menus", data: results.data })
      })
    })
  },
}
