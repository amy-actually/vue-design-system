import api from "../../plugins/api.js"
import { returnType } from "../utilities.js"

export default {
  async loadHome({ dispatch, commit }) {
    return Promise.all([
      dispatch("fetchContent", { type: "callsToAction", perPage: 10 }),
      dispatch("fetchContent", { type: "events", perPage: 10 }),
      dispatch("fetchContent", { type: "collection", perPage: 10 }),
      dispatch("fetchContent", { type: "blogs", perPage: 5 }),
    ])
  },

  async fetchContent({ dispatch, commit, state }, { type, perPage = 100, pg = 1, params = {} }) {
    const contentType = returnType(type)
    let args =
      contentType === "blog"
        ? { ...params, number: perPage, page: pg }
        : { ...params, per_page: perPage, page: pg }

    return api
      .fetchContent(contentType, args)
      .then(results => {
        commit(`${results.commit}`, { type: contentType, data: results.posts })
        if (!params || params.length == 0) {
          commit("ADD_COUNT", { type: contentType, count: results.count })
        }
        return results.count
      })
      .catch(e => console.error(`.catch(${e})`))
  },

  async fetchContentBySlug({ commit }, { type, slug }) {
    const contentType = returnType(type)
    return api.fetchBySlug(contentType, slug).then(results => {
      commit("ADD_CONTENT_SLUG", { type: contentType, data: results.data })
    })
  },

  async fetchAllContent({ dispatch, commit }, { type, params = {}, number = 0 }) {
    return new Promise((resolve, reject) => {
      const contentType = returnType(type)

      if (contentType === "error") {
        reject("error")
      }

      let count = 0

      let args = contentType === "blog" ? { ...params, number: 100 } : { ...params, per_page: 100 }

      let results = api.fetchContent(contentType, args).then(results => {
        console.log(results)
        let pages = number > 0 ? number : results.pages
        count = results.count

        commit(`${results.commit}`, { type: contentType, data: results.posts })

        let page = 2
        while (pages >= page) {
          args.page = page
          dispatch("fetchContent", { type: contentType, pg: page, params: args })
          page++
        }
        if (!params || params.length == 0) {
          commit("ADD_COUNT", { type: contentType, count: count })
        }
        resolve("fetched")
      })
    })
  },

  fetchUpcomingEvents({ dispatch, commit, state }) {
    if (!state.eventsFetched) {
      dispatch("fetchAllContent", { type: "events" })
      commit("SET_STATE", { type: "eventsFetched", value: true })
    }
  },
  fetchInitalContent({ dispatch, commit, state }, type) {
    if (!state[`${type}Fetched`]) {
      dispatch("fetchAllContent", { type: type })
      commit("SET_STATE", { type: `${type}Fetched`, value: true })
    }
  },
}
