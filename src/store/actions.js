const endpoint = {
  alerts: { type: "bigKahuna", slug: "notices" },
  callsToAction: { type: "bigKahuna", slug: "calls-to-action" },
  collection: { type: "bigKahuna", slug: "collection" },
  events: { type: "bigKahuna", slug: "events" },
  locations: { type: "bigKahuna", slug: "locations" },
  pages: { type: "bigKahuna", slug: "pages" },
  posts: { type: "bigKahuna", slug: "posts" },
  resources: { type: "bigKahuna", slug: "notices" },
  services: { type: "bigKahuna", slug: "notices" },
  blogs: { type: "shelfLife", slug: "posts" },
}

const bigKahuna = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/wp/v2/`,
})
const fontana = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/fontana/v1/`,
})
//https://public-api.wordpress.com/rest/v1.1/sites/fontanalib.wordpress.com/posts
const shelfLife = axios.create({
  baseURL: "https://public-api.wordpress.com/rest/v1.1/sites/fontanalib.wordpress.com/",
})

export default {
  async loadHome({ commit, dispatch }) {
    console.log("LOADHOME")
    dispatch("fetchContent", { type: "locations" })
    dispatch("fetchMenus")
    dispatch("fetchContent", { type: "events", perPage: 10 })
    dispatch("fetchContent", { type: "services" })
    dispatch("fetchContent", { type: "collection", perPage: 10 })
    dispatch("fetchContent", { type: "blogs", perPage: 5 })
  },

  async fetchContent({ commit }, { type, perPage = 100, pg = 1, params = [] }) {
    const name = endpoint[type]["slug"]
    const api = endpoint[type]["type"]
    console.log("fetching " + type)
    let args = params
    if (api === "bigKahuna") {
      args = { ...args, per_page: perPage, page: pg }
      return bigKahuna.get(`/${name}`, args).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
        resolve()
      })
    }
    if (api === "fontana") {
      args = { ...args, per_page: perPage, page: pg }
      return fontana.get(`/${name}`, args).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
      })
    }
    if (api === "shelfLife") {
      args = { ...args, number: perPage, page: pg }
      return shelfLife.get(`/${name}`, { number: perPage, page: pg }).then(response => {
        commit("ADD_BLOG_CONTENT", { type: type, data: response.data.posts })
      })
    }
  },

  async fetchContentBySlug({ commit }, { type, slug }) {
    const name = endpoint[type]["slug"]
    const api = endpoint[type]["type"]

    if (api === "bigKahuna") {
      return bigKahuna.get(`/${name}`, { slug: slug }).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
      })
    }
    if (api === "fontana") {
      return fontana.get(`/${name}`, { slug: slug }).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
      })
    }
    if (api === "shelfLife") {
      return shelfLife.get(`/${name}/${slug}`).then(response => {
        commit("ADD_CONTENT", { type: type, data: response.data })
      })
    }
  },

  async fetchMenus({ commit }) {
    return fontana.get(`/menus`).then(response => {
      //commit("ADD_CONTENT", [type, response.data])
      response.data.forEach(menu => {
        const items = fontana.get(`/menus/${menu.slug}`).then(results => {
          console.log(results)
          commit("ADD_CONTENT_SLUG", { type: "menus", data: results.data })
        })
        resolve()
      })
    })
  },
}
