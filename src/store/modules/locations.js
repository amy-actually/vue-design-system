export default {
  namespaced: true,
  state: {
    collection: 0,
    events: 0,
    pages: 0,
    posts: 0,
    articles: 0,
    resources: 0,
    services: 0,
    currentLocation: "all",
  },

  mutations: {
    setCount(state, { type, count }) {
      state[type] = count
    },
    setValue({ state, rootState }, location) {
      state.currentLocation = rootState.publicContent.locations.find(loc => loc.slug === location)
        ? location
        : "all"
    },
  },

  getters: {
    getRelatedContent(state, getters, rootState) {
      // let content = rootState.publicContent
      /**
       * Access Public Content State and find all content
       * that matches state.currentLocation
       */
    },
  },
}
