import axios from "axios"
//import Qs from 'Qs'
import { endpoint } from "../modules/utilities.js"

const bigKahuna = axios.create({
  baseURL: `https://fontana.librarians.design/wp-json/wp/v2/`,
  /* paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'}).replace(/%2B/g, '+').replace(/%5B/g, '[').replace(/%5D/g, ']')
  },  */
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
  async fetchContent(type, params) {
    const name = endpoint[type]["slug"]
    const apiType = endpoint[type]["type"]
    const mod = endpoint[type]["module"]

    if (apiType === "fontana") {
      return fontana.get(`/${name}`, { params: params }).then(res => {
        return { commit: "ADD_CONTENT", posts: res.data }
      })
    }

    if (apiType === "bigKahuna") {
      return bigKahuna.get(`/${name}`, { params: params }).then(res => {
        return mod !== "taxonomies"
          ? {
              commit: `ADD_CONTENT`,
              pages: Number(res.headers["x-wp-totalpages"]),
              count: Number(res.headers["x-wp-total"]),
              posts: res.data,
            }
          : { commit: "ADD_CONTENT", posts: res.data }
      })
    }

    if (apiType === "shelfLife") {
      return shelfLife.get(`/${name}`, { params: params }).then(res => {
        let perPage = params && params.number ? params.number : 20
        return {
          commit: `ADD_BLOG_CONTENT`,
          pages: Math.ceil(res.data.found / perPage),
          count: Number(res.data.found),
          posts: res.data.posts,
        }
      })
    }
  },
  async fetchBySlug(type, slug) {
    const name = endpoint[type]["slug"]
    const apiType = endpoint[type]["type"]

    if (apiType === "tribe") {
      return tribe.get(`/${name}/by-slug/${slug}`).then(res => {
        return { commit: `ADD_CONTENT_SLUG`, data: res.data }
      })
    }
    if (apiType === "shelfLife" && type === "blogs") {
      return shelfLife.get(`/posts/slug:${slug}`).then(res => {
        return { commit: `ADD_CONTENT_SLUG`, data: res.data }
      })
    }
    if (apiType === "bigKahuna") {
      return bigKahuna.get(`/${name}?slug=${slug}`).then(res => {
        return { commit: `ADD_CONTENT_SLUG`, data: res.data }
      })
    }
    if (apiType === "fontana") {
      return fontana.get(`/${name}/${slug}`).then(res => {
        return { commit: `ADD_CONTENT_SLUG`, data: res.data }
      })
    }
  },
}
