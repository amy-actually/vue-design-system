import { returnType, endpoint } from "../utilities.js"

export default {
  getAllContentBy: state => (locationName = "all", serviceName = "any") => {
    const content = [
      ...state.blogs,
      ...state.collection,
      ...state.events,
      ...state.pages,
      ...state.posts,
      ...state.resources,
      ...state.services,
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
        : state.locations.currentLocation !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === state.locations.currentLocation)
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

    relatedContent =
      serviceName !== "any" && relatedContent.length > 0
        ? relatedContent.filter(
            page =>
              page.acf &&
              page.acf.services &&
              page.acf.services.some(service => service.slug === state.services.currentService)
          )
        : relatedContent

    return relatedContent
  },

  getContentBy: state => (contentType, locationName = "all", serviceName = "any") => {
    console.log("getContentBy: " + contentType)
    const type = returnType(contentType)
    const content = state[type]

    let relatedContent

    relatedContent =
      locationName !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === locationName)
          )
        : state.locations.currentLocation !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === state.locations.currentLocation)
          )
        : content

    relatedContent =
      serviceName !== "any" && relatedContent.length > 0
        ? relatedContent.filter(
            page =>
              page.acf &&
              page.acf.services &&
              page.acf.services.some(service => service.slug === state.services.currentService)
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
    const content = state.callsToAction
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
    console.log("getCollection: " + collection)
    const type = returnType(collection)

    let content = state[type]
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
}
