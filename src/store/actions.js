import api from "./plugins/api.js"
export default {
  async loadHome({ commit, dispatch }) {
    dispatch("taxonomies/fetchTerms", { type: "locations" })
    dispatch("fetchContent", { type: "menus" })
    dispatch("fetchContent", { type: "callsToAction", perPage: 10 })
    dispatch("fetchContent", { type: "events", perPage: 10 })
    dispatch("taxonomies/fetchTerms", { type: "services", perPage: 100 })
    dispatch("fetchContent", { type: "collection", perPage: 10 })
    dispatch("fetchContent", { type: "blogs", perPage: 5 })
  },

  async fetchContent({ commit }, { type, perPage = 100, pg = 1, params = [] }) {
    let args =
      type === "blog"
        ? { ...params, number: perPage, page: pg }
        : { ...params, per_page: perPage, page: pg }

    return api.fetchContent(type, args).then(results => {
      if (results.commit === "ADD_CONTENT_COUNTED") {
        commit("ADD_CONTENT", { type: type, data: results.posts })
      } else {
        commit(`${results.commit}`, { type: type, data: results.posts })
      }
    })
  },

  async fetchContentBySlug({ commit }, { type, slug }) {
    const name = this.api.endpoint[type]["slug"]
    const apiType = this.api.endpoint[type]["type"]

    if (apiType === "bigKahuna") {
      return this.api.bigKahuna.get(`/${name}`, { slug: slug }).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
      })
    }
    if (apiType === "fontana") {
      return this.api.fontana.get(`/${name}`, { slug: slug }).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
      })
    }
    if (apiType === "shelfLife") {
      return this.api.shelfLife.get(`/${name}/${slug}`).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
      })
    }
  },
}
