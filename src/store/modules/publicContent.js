const bigKahuna = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/wp/v2/`,
})

export default {
  namespaced: true,
  state: {
    alerts: [],
    articles: [],
    callsToAction: [],
    collection: [],
    events: [],
    pages: [],
    posts: [],
    resources: [],
    services: [],
  },

  mutations: {
    addContentToState(state, { type, data }) {
      if (Array.isArray(data) && (!state[type] || state[type].length == 0)) {
        state[type] = data
      } else if (data.id && state[type].find(item => item.id === data.id) == undefined) {
        state[type].push(data)
      } else if (Array.isArray(data)) {
        data.forEach(content => {
          if (state[type].find(item => item.id === content.id) == undefined) {
            state[type].push(content)
          }
        })
      }
    },
  },

  getters: {
    getAllContentBy({ state, rootState }, locationName = null) {
      const content = [
        ...state.articles,
        ...state.collection,
        ...state.events,
        ...state.pages,
        ...state.posts,
        ...state.resources,
        ...state.services,
      ]
      let relatedContent

      relatedContent =
        locationName && locationName !== "all"
          ? content.filter(
              page =>
                page.acf &&
                page.acf.location &&
                page.acf.location.some(location => location.slug === locationName)
            )
          : !locationName && rootState.locations.currentLocation !== "all"
          ? content.filter(
              page =>
                page.acf &&
                page.acf.location &&
                page.acf.location.some(
                  location => location.slug === rootState.locations.currentLocation
                )
            )
          : content

      relatedContent =
        !relatedContent || relatedContent.length < 1
          ? content.filter(
              page =>
                !page.acf ||
                !page.acf.location ||
                page.acf.location.some(location => location.slug === "headquarters")
            )
          : relatedContent

      relatedContent =
        rootState.services.currentService !== "any" && relatedContent.length > 0
          ? relatedContent.filter(
              page =>
                page.acf &&
                page.acf.services &&
                page.acf.services.some(
                  service => service.slug === rootState.services.currentService
                )
            )
          : rootState.services.currentService && rootState.services.currentService !== "any"
          ? content.filter(
              page =>
                page.acf &&
                page.acf.services &&
                page.acf.services.some(
                  service => service.slug === rootState.services.currentService
                )
            )
          : relatedContent

      relatedContent.sort(function(a, b) {
        let date1 = !a.type
          ? 0
          : a.type === "event"
          ? new Date(a.start_date)
          : a.type === "collection-item"
          ? new Date(a.acf.record_creation_date)
          : new Date(a.date)
        let date2 = !b.type
          ? 0
          : b.type === "event"
          ? new Date(b.start_date)
          : b.type === "collection-item"
          ? new Date(b.acf.record_creation_date)
          : new Date(b.date)
        return date1.getTime() - date2.getTime()
      })

      return relatedContent
    },
    getContentBy({ state, rootState }, contentType, locationName = null) {
      const content = state[contentType]

      let relatedContent

      relatedContent =
        locationName && locationName !== "all"
          ? content.filter(
              page =>
                page.acf &&
                page.acf.location &&
                page.acf.location.some(location => location.slug === locationName)
            )
          : !locationName && rootState.locations.currentLocation !== "all"
          ? content.filter(
              page =>
                page.acf &&
                page.acf.location &&
                page.acf.location.some(
                  location => location.slug === rootState.locations.currentLocation
                )
            )
          : content

      relatedContent =
        !relatedContent || relatedContent.length < 1
          ? content.filter(
              page =>
                !page.acf ||
                !page.acf.location ||
                page.acf.location.some(location => location.slug === "headquarters")
            )
          : relatedContent

      relatedContent =
        rootState.services.currentService !== "any" && relatedContent.length > 0
          ? relatedContent.filter(
              page =>
                page.acf &&
                page.acf.services &&
                page.acf.services.some(
                  service => service.slug === rootState.services.currentService
                )
            )
          : rootState.services.currentService && rootState.services.currentService !== "any"
          ? content.filter(
              page =>
                page.acf &&
                page.acf.services &&
                page.acf.services.some(
                  service => service.slug === rootState.services.currentService
                )
            )
          : relatedContent

      relatedContent.sort(function(a, b) {
        let date1 = !a.type
          ? 0
          : a.type === "event"
          ? new Date(a.start_date)
          : a.type === "collection-item"
          ? new Date(a.acf.record_creation_date)
          : new Date(a.date)
        let date2 = !b.type
          ? 0
          : b.type === "event"
          ? new Date(b.start_date)
          : b.type === "collection-item"
          ? new Date(b.acf.record_creation_date)
          : new Date(b.date)
        return date1.getTime() - date2.getTime()
      })

      return relatedContent
    },
  },

  actions: {
    async getUpcomingEvents({ commit }, page = 1) {
      return bigKahuna.get(`/events?per_page=100&page=${page}`).then(response => {
        commit("addContentToState", ["events", response.data])
      })
    },
    async getContentBySlug({ commit }, { type, slug }) {
      return bigKahuna.get(`/${type}?slug=${slug}`).then(response => {
        commit("addContentToState", ["events", response.data])
      })
    },
    /* getHomePageContent({ commit, dispatch }){
      let response
      try {
        response = await Vue.http.get()
      } catch(err){
        return
      }
      const data = response.body

    }, */
  },
}
