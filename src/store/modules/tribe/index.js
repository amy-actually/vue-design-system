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
      console.log("tribe getter")
      const contentType = returnType(type)
      console.log(contentType)
      return state[contentType].find(item => item[field] === value)
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
      if (state[type].length == 0) {
        state[type] = data
      } else {
        let items = []
        data.forEach(content => {
          if (!state[type].find(item => item.slug === content.slug)) {
            items.push(content)
          }
        })
        state[type] = state[type].concat(items)
      }
    },
  },
}
