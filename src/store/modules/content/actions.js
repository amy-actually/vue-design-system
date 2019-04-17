import api from "../../plugins/api.js"
export default {
  async loadHome({ dispatch, commit }) {
    dispatch("fetchContent", { type: "callsToAction", perPage: 10 })
    dispatch("fetchContent", { type: "events", perPage: 10 })
    dispatch("fetchContent", { type: "collection", perPage: 10 })
    dispatch("fetchContent", { type: "blogs", perPage: 5 })
  },

  async fetchContent({ dispatch, commit, state }, { type, perPage = 100, pg = 1, params = {} }) {
    let args =
      type === "blog"
        ? { ...params, number: perPage, page: pg }
        : { ...params, per_page: perPage, page: pg }

    return api.fetchContent(type, args).then(results => {
      commit(`${results.commit}`, { type: type, data: results.posts })
      if (!params || params.length == 0) {
        commit("ADD_COUNT", { type: type, count: results.count })
      }
      return results.count
    })
  },

  async fetchContentBySlug({ commit }, { type, slug }) {
    return api.fetchBySlug(type, slug).then(results => {
      commit("ADD_CONTENT_SLUG", { type: type, data: results.data })
    })
  },

  async fetchAllContent({ dispatch, commit }, { type, params = {}, number = 0 }) {
    let count = 0

    let args = type === "blog" ? { ...params, number: 100 } : { ...params, per_page: 100 }

    let results = await api.fetchContent(type, args)
    let pages = number > 0 ? number : results.pages
    count = results.count

    commit(`${results.commit}`, { type: type, data: results.posts })

    let page = 2
    while (pages >= page) {
      args.page = page
      dispatch("fetchContent", { type: type, pg: page, params: args })
      page++
    }
    if (!params || params.length == 0) {
      commit("ADD_COUNT", { type: type, count: count })
    }
  },
}
