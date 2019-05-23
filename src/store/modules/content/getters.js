import { returnType, endpoint, sortByDate } from "../utilities.js"

export default {
  getAllContentBy: (state, getters, rootState) => (locationName = "all", serviceName = "any") => {
    const content = [
      ...state.events,
      ...state.pages,
      ...state.resources,
      ...state.posts,
      ...state.blogs,
    ]
    let relatedContent

    relatedContent =
      locationName !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === locationName)
          )
        : rootState.currentLocation !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === rootState.currentLocation)
          )
        : content

    relatedContent =
      !relatedContent || relatedContent.length < 1
        ? content.filter(
            page =>
              !page.acf ||
              !page.acf.location ||
              page.acf.location.some(location => location.slug === "headquarters")
          )
        : relatedContent

    let term
    if (serviceName && serviceName !== "any") {
      console.log("find the term...")
      term = rootState.taxonomies.services.find(item => item.slug === serviceName)
    }

    relatedContent =
      serviceName !== "any" && relatedContent.length > 0
        ? relatedContent.filter(
            page =>
              (page.acf &&
                page.acf.services &&
                page.acf.services.some(service => service.slug === serviceName)) ||
              (page.services && term && page.services.includes(term.id))
          )
        : relatedContent
    console.log(relatedContent)
    return sortByDate(relatedContent)
  },

  getContentBy: (state, getters, rootState) => (
    contentType,
    locationName = "all",
    serviceName = "any"
  ) => {
    const type = returnType(contentType)
    const content = [...state[type]]

    let relatedContent

    relatedContent =
      locationName !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === locationName)
          )
        : rootState.currentLocation !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === rootState.currentLocation)
          )
        : content

    relatedContent =
      serviceName !== "any" && relatedContent.length > 0
        ? relatedContent.filter(
            page =>
              page.acf &&
              page.acf.services &&
              page.acf.services.some(service => service.slug === serviceName)
          )
        : relatedContent

    relatedContent =
      !relatedContent || relatedContent.length < 1
        ? content.filter(
            page =>
              !page.acf ||
              !page.acf.location ||
              page.acf.location.some(location => location.slug === "headquarters")
          )
        : relatedContent

    return relatedContent
  },

  getCtaByCategory: state => (slug = null, index = 0, exclude = []) => {
    const content = [...state.callsToAction]
    let relatedContent

    if (exclude.length > 0) {
      relatedContent = content.filter(cta => (exclude.includes(cta.id) ? false : true))
    }

    if (relatedContent && (!slug || slug === "all" || slug === "any")) {
      return index === "random"
        ? relatedContent[Math.floor(Math.random() * relatedContent.length)]
        : relatedContent[index]
    }

    relatedContent =
      !relatedContent || relatedContent.length < 1
        ? content.filter(
            cta =>
              cta.acf &&
              cta.acf.category &&
              cta.acf.category.some(category => category.slug === slug)
          )
        : relatedContent.filter(
            cta =>
              cta.acf &&
              cta.acf.category &&
              cta.acf.category.some(category => category.slug === slug)
          )

    relatedContent =
      !relatedContent || relatedContent.length < 1
        ? content.filter(
            cta =>
              cta.acf &&
              cta.acf["featured-collections"] &&
              cta.acf["featured-collections"].some(category => category.slug === slug)
          )
        : relatedContent.filter(
            cta =>
              cta.acf &&
              cta.acf["featured-collections"] &&
              cta.acf["featured-collections"].some(category => category.slug === slug)
          )

    relatedContent =
      !relatedContent || relatedContent.length < 1
        ? content.filter(
            cta =>
              cta.acf &&
              cta.acf.location &&
              cta.acf.location.some(location => location.slug === slug)
          )
        : relatedContent
    relatedContent =
      !relatedContent || relatedContent.length < 1
        ? content.filter(
            cta =>
              cta.acf && cta.acf.services && cta.acf.services.some(service => service.slug === slug)
          )
        : relatedContent
    relatedContent =
      !relatedContent || relatedContent.length < 1
        ? content.filter(
            page =>
              !page.acf ||
              !page.acf.location ||
              page.acf.location.some(location => location.slug === "headquarters")
          )
        : relatedContent

    return index === "random"
      ? relatedContent[Math.floor(Math.random() * relatedContent.length)]
      : relatedContent[index]
  },
  getCollection: state => (field, value, collection = "collection") => {
    const type = returnType(collection)

    let content = [...state[type]]
    let relatedContent

    if (field === "new") {
      relatedContent = content.slice(0, 200)
    } else {
      let subField = returnType(field)

      subField =
        endpoint[subField] && endpoint[type].filter[subField]
          ? endpoint[type].filter[subField]
          : field

      relatedContent =
        subField !== "new" && subField !== "error"
          ? content.filter(
              page =>
                page.acf &&
                page.acf[subField] &&
                page.acf[subField].some(item => item.slug === value)
            )
          : content
    }

    return relatedContent
  },

  getItemBySlug: state => (contentType, slug) => {
    const type = returnType(contentType)
    return state[type].find(item => item.slug === slug)
  },

  getItemByField: state => (contentType, field, value) => {
    const type = returnType(contentType)
    let subField = returnType(field)

    subField =
      endpoint[subField] && endpoint[type].filter[subField]
        ? endpoint[type].filter[subField]
        : field

    return state[type].find(
      item =>
        item.acf[subField] === value ||
        item.acf[subField].some(obj => Object.values(obj).includes(value))
    )
    /* {
        console.log(obj)
       return obj == value || 
      })) */
    //|| (typeof obj === 'object' && obj.any(prop=>prop==value)) )
  },
}
