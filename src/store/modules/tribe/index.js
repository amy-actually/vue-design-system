import actions from "../../actions.js"

export default {
  namespaced: true,
  state: {
    organizers: [],
    venues: [],
    categories: [],
  },

  actions,
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
