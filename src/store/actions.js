import api from "./plugins/api.js"
export default {
  async loadHome({ commit, dispatch }) {
    dispatch("taxonomies/fetchTerms", { type: "locations" })
    dispatch("fetchContent", { type: "menus" })
    dispatch("content/fetchContent", { type: "callsToAction", perPage: 10 })
    dispatch("content/fetchContent", { type: "events", perPage: 10 })
    dispatch("taxonomies/fetchTerms", { type: "services", perPage: 100 })
    dispatch("content/fetchContent", { type: "collection", perPage: 10 })
    dispatch("content/fetchContent", { type: "blogs", perPage: 5 })
  },

  async fetchContent({ commit }, { type, perPage = 100, pg = 1, params = {} }) {
    console.log("FETCHCONTENT")
    let args =
      type === "blog"
        ? { ...params, number: perPage, page: pg }
        : { ...params, per_page: perPage, page: pg }

    return api.fetchContent(type, args).then(results => {
      commit(`${results.commit}`, { type: type, data: results.posts })
    })
  },

  async fetchContentBySlug({ commit }, { type, slug }) {
    return api.fetchBySlug(type, slug).then(results => {
      commit("ADD_CONTENT_SLUG", { type: type, data: results.data })
    })
  },

  /**
   * NEEDS WORK!!--------------
   */
  async fetchAllContent({ commit }, { type, params = {} }) {
    let page = 1
    let pages

    let args =
      type === "blog"
        ? { ...params, number: 100, page: page }
        : { ...params, per_page: 100, page: page }

    do {
      args.page = page

      api.fetchContent(type, args).then(results => {
        pages = results.pages
        commit(`${results.commit}`, { type: type, data: results.posts })
        page++
      })
    } while (page < pages)
    //commit("addAllItems", { type: "organizers", data: organizers })
  },
}
