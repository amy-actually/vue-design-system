import axios from "axios"
const endpoint = {
  alerts: { type: "bigKahuna", slug: "notices", variant: "content" },
  audience: { type: "bigKahuna", slug: "audience", variant: "taxonomy" },
  callsToAction: { type: "bigKahuna", slug: "calls-to-action", variant: "content" },
  collection: { type: "bigKahuna", slug: "collection", variant: "content" },
  events: { type: "bigKahuna", slug: "events", variant: "content" },
  featuredCollections: { type: "bigKahuna", slug: "featured-collections", variant: "taxonomy" },
  genres: { type: "bigKahuna", slug: "genres", variant: "taxonomy" },
  locations: { type: "bigKahuna", slug: "locations", variant: "taxonomy" },
  pages: { type: "bigKahuna", slug: "pages", variant: "content" },
  posts: { type: "bigKahuna", slug: "posts", variant: "content" },
  resources: { type: "bigKahuna", slug: "notices", variant: "content" },
  services: { type: "bigKahuna", slug: "services", variant: "taxonomy" },
  subjects: { type: "bigKahuna", slug: "subjects", variant: "taxonomy" },
  blogs: { type: "shelfLife", slug: "posts", variant: "blog" },
  taxonomies: { type: "bigKahuna", slug: "taxonomies", variant: "content" },
  search: { type: "fontana", slug: "search", variant: "search" },
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
  fetchContent(type, params) {
    const name = endpoint[type]["slug"]
    const apiType = endpoint[type]["type"]

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
        return endpoint[type].variant === "content"
          ? {
              commit: "ADD_CONTENT_COUNTED",
              count: Number(res.headers["x-wp-total"]),
              posts: res.data,
            }
          : { commit: "ADD_CONTENT", posts: res.data }
      })
    }

    if (apiType === "bigKahuna") {
      return bigKahuna.get(`/${name}`, params).then(res => {
        return endpoint[type].variant === "content"
          ? {
              commit: "ADD_CONTENT_COUNTED",
              count: Number(res.headers["x-wp-total"]),
              posts: res.data,
            }
          : { commit: "ADD_CONTENT", posts: res.data }
      })
    }

    if (apiType === "shelfLife") {
      return shelfLife.get(`/${name}`, params).then(res => {
        return {
          commit: "ADD_BLOG_CONTENT",
          count: Number(res.data.found),
          posts: res.data.posts,
        }
      })
    }
  },
}
