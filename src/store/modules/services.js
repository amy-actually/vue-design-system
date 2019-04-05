export default {
  namespaced: true,
  state: {
    collection: 0,
    events: 0,
    pages: 0,
    posts: 0,
    articles: 0,
    resources: 0,
    currentService: "any",
  },

  mutations: {
    setCount(state, { type, count }) {
      state[type] = count
    },
    setValue({ state, rootState }, service) {
      state.currentService = rootState.publicContent.services.find(serv => serv.slug === service)
        ? service
        : "any"
    },
  },
}
