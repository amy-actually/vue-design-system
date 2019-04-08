const tribe = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/tribe/events/v1/`,
})

export default {
  namespaced: true,
  state: {
    organizers: [],
    venues: [],
    categories: [],
  },

  actions: {
    async fetchAllOrganizers({ commit, dispatch }) {
      let page = 1
      let pages
      let organizers = []

      do {
        let results = await dispatch("getOrganizers", page)
        organizers.push(results.data.organizers)
        pages = results.data.total_pages
        page++
      } while (page < pages)
      commit("addAllItems", { type: "organizers", data: organizers })
    },
    async fetchOrganizers({ commit }, page = 1) {
      return tribe.get(`/organizers?per_page=100&page=${page}`)
    },
    async fetchOrganizerBySlug({ commit }, slug) {
      return tribe.get(`/organizers/by-slug/${slug}`).then(response => {
        commit("addItem", { type: "organizers", data: response.data })
      })
    },
    async fetchOrganizerById({ commit }, id) {
      return tribe.get(`/organizers/${id}`).then(response => {
        commit("addItem", { type: "organizers", data: response.data })
      })
    },
    async fetchVenues({ commit }, page = 1) {
      return tribe.get(`/venues?per_page=100&page=${page}`).then(response => {
        commit("addAllItems", { type: "venues", data: response.data.venues })
      })
    },
    async fetchVenueBySlug({ commit }, slug) {
      return tribe.get(`/venues/by-slug/${slug}`).then(response => {
        commit("addItem", { type: "venues", data: response.data })
      })
    },
    async fetchVenueBySlug({ commit }, slug) {
      return tribe.get(`/venues/by-slug/${slug}`).then(response => {
        commit("addItem", { type: "venues", data: response.data })
      })
    },
    async fetchEventCategories({ commit }) {
      return tribe.get(`/categories?per_page=100`).then(response => {
        commit("addAllItems", { type: "categories", data: response.data.categories })
      })
    },
    /* async fetchOrganizers({ commit }){
      //https://fontana.librarians.design/wp-json/tribe/events/v1/organizers
      return new Promise(resolve => {
        const authors = api.fetchData('/organizers/${')
      .then( data=>{
        commit('addAuthorsToState', data.data);
        resolve();
      });
    });
    } */
  },
  getters: {
    getTribeByField: state => (type, field, value) =>
      state[type].find(item => item[field] === value),
  },

  mutations: {
    addItem(state, { type, data }) {
      //Check is exists, if not then push
      if (state[type].find(item => item.id === data.id) == undefined) {
        state[type].push(data)
      }
    },
    addAllItems(state, { type, data }) {
      state[type] = data
    },
  },
}
