export default {
  ADD_CONTENT: (state, { type, data }) => {
    console.log("ADD_CONTENT: " + type)
    console.log(data)
    let container = state[type]
    if (Array.isArray(data)) {
      data.forEach(content => {
        if (!container.find(item => item.id === content.id)) {
          container.push(content)
        }
      })
    } else if (data) {
      if (!container.find(item => item.id == data.id)) {
        container.push(data)
      }
    }
    state[type] = container
  },
  ADD_BLOG_CONTENT: (state, { type, data }) => {
    console.log("ADD_BLOG_CONTENT: " + type)
    let container = state.blogs.length > 0 ? state.blogs : []
    if (Array.isArray(data)) {
      data.forEach(content => {
        if (!container.find(item => item.ID === content.ID)) {
          container.push(content)
        }
      })
    } else if (data) {
      if (!container.find(item => item.ID == data.ID)) {
        container.push(data)
      }
    }
    state.blogs = container
  },
  ADD_CONTENT_SLUG: (state, { type, data }) => {
    let container = state[type].length > 0 ? state[type] : []
    if (Array.isArray(data)) {
      data.forEach(content => {
        if (!container.find(item => item.slug === content.slug) == undefined) {
          container.push(content)
        }
      })
    } else if (data) {
      if (!container.find(item => item.slug == data.slug)) {
        container.push(data)
      }
    }
    state[type] = container
  },

  SET_LOCATION: (state, location) => {
    state.currentLocation =
      location && state.locations.find(term => term.slug === location) ? location : "all"
  },
}
