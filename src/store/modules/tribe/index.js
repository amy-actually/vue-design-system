import actions from "../../actions.js"
import { returnType } from "../utilities.js"

export default {
  namespaced: true,
  state: {
    organizers: [],
    venues: [],
    categories: [],
  },

  actions,
  getters: {
    getTribeByField: state => (type, field, value) => {
      const contentType = returnType(type)
      state[contentType].find(item => item[field] === value)
    },
  },

  mutations: {
    addItem(state, { type, data }) {
      //Check is exists, if not then push
      if (state[type].find(item => item.id === data.id) == undefined) {
        state[type] = [...state[type], data]
      }
    },
    addAllItems(state, { type, data }) {
      state[type] = data
    },
  },
}
