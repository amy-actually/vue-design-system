import api from "./plugins/api.js"
import { returnType } from "./modules/utilities.js"

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
    const contentType = returnType(type)
    let args =
      contentType === "blog"
        ? { ...params, number: perPage, page: pg }
        : { ...params, per_page: perPage, page: pg }

    return api.fetchContent(contentType, args).then(results => {
      commit(`${results.commit}`, { type: contentType, data: results.posts })
      if (state.counts && state.counts[contentType]) {
        commit("ADD_COUNT", { type: contentType, count: results.count })
      }
    })
  },

  async fetchContentBySlug({ commit }, { type, slug }) {
    const contentType = returnType(type)
    return api.fetchBySlug(contentType, slug).then(results => {
      commit("ADD_CONTENT_SLUG", { type: contentType, data: results.data })
    })
  },

  async fetchAllContent({ commit, state }, { type, params = {} }) {
    console.log("FECTHING ALL " + type)
    const contentType = returnType(type)
    console.log(contentType)
    let args = { ...params, per_page: 100 }

    let results = await api.fetchContent(contentType, args)
    if (contentType === "organizers") {
      console.log(results)
    }
    let pages = results.pages

    commit(`${results.commit}`, { type: contentType, data: results.posts })

    let page = 2
    while (pages >= page) {
      args.page = page
      dispatch("fetchContent", { type: contentType, pg: page, params: args })
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
