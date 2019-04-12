import axios from "axios"
const endpoint = {
  alerts: {
    type: "bigKahuna",
    slug: "notices",
    module: "content",
  },

  audience: {
    type: "bigKahuna",
    slug: "audience",
    module: "taxonomies",
  },

  callsToAction: {
    type: "bigKahuna",
    slug: "calls-to-action",
    module: "content",
  },

  collection: {
    type: "bigKahuna",
    slug: "collection",
    module: "content",
  },

  events: {
    type: "bigKahuna",
    slug: "events",
    module: "content",
  },

  featuredCollections: {
    type: "bigKahuna",
    slug: "featured-collections",
    module: "taxonomies",
  },

  genres: {
    type: "bigKahuna",
    slug: "genres",
    module: "taxonomies",
  },

  locations: {
    type: "bigKahuna",
    slug: "locations",
    module: "taxonomies",
  },

  pages: {
    type: "bigKahuna",
    slug: "pages",
    module: "content",
  },

  posts: {
    type: "bigKahuna",
    slug: "posts",
    module: "content",
  },

  resources: {
    type: "bigKahuna",
    slug: "notices",
    module: "content",
  },

  services: {
    type: "bigKahuna",
    slug: "services",
    module: "taxonomies",
  },

  subjects: {
    type: "bigKahuna",
    slug: "subjects",
    module: "taxonomies",
  },

  blogs: {
    type: "shelfLife",
    slug: "posts",
    module: "blog",
  },

  taxonomies: {
    type: "bigKahuna",
    slug: "taxonomies",
    module: "content",
  },

  search: {
    type: "fontana",
    slug: "search",
    module: null,
  },

  organizers: {
    type: "tribe",
    slug: "organizers",
    module: "tribe",
  },
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
const tribe = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/tribe/events/v1/`,
})

export default {
  fetchContent(type, params) {
    const name = endpoint[type]["slug"]
    const apiType = endpoint[type]["type"]
    const variant = endpoint[type]["module"]

    if (type === "menus") {
      return fontana.get(`/menus`).then(response => {
        response.data.forEach(menu => {
          const items = this.api.fontana.get(`/menus/${menu.slug}`).then(results => {
            return { commit: "ADD_CONTENT_SLUG", posts: results.data }
          })
        })
      })
    }

    if (apiType === "fontana") {
      return fontana.get(`/${name}`, params).then(res => {
        return variant !== "root"
          ? {
              commit: `${variant}/ADD_CONTENT`,
              pages: Number(res.headers["x-wp-totalpages"]),
              count: Number(res.headers["x-wp-total"]),
              posts: res.data,
            }
          : { commit: "ADD_CONTENT", posts: res.data }
      })
    }

    if (apiType === "bigKahuna") {
      return bigKahuna.get(`/${name}`, params).then(res => {
        return variant !== "root"
          ? {
              commit: `${variant}/ADD_CONTENT`,
              pages: Number(res.headers["x-wp-totalpages"]),
              count: Number(res.headers["x-wp-total"]),
              posts: res.data,
            }
          : { commit: "ADD_CONTENT", posts: res.data }
      })
    }

    if (apiType === "shelfLife") {
      return shelfLife.get(`/${name}`, params).then(res => {
        let perPage = params && params.number ? params.number : 20
        return {
          commit: `${variant}/ADD_BLOG_CONTENT`,
          pages: Math.ceil(res.data.found / perPage),
          count: Number(res.data.found),
          posts: res.data.posts,
        }
      })
    }
  },
  fetchBySlug(type, slug) {
    const name = endpoint[type]["slug"]
    const apiType = endpoint[type]["type"]
    const variant = endpoint[type]["module"]

    if (apiType === "tribe") {
      return tribe.get(`/${name}/by-slug/${slug}`).then(res => {
        return { commit: `${variant}/ADD_CONTENT_SLUG`, data: res.data }
      })
    }
    if (apiType === "shelfLife" && type === "blogs") {
      return shelfLife.get(`/posts/slug:${slug}`).then(res => {
        return { commit: `content/ADD_CONTENT_SLUG`, data: res.data }
      })
    }
    if (apiType === "bigKahuna") {
      return bigKahuna.get(`/${name}?slug=${slug}`).then(res => {
        return { commit: `${variant}/ADD_CONTENT_SLUG`, data: res.data }
      })
    }
  },
}
