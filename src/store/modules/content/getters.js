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
    const content = state[contentType]

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
  getCollection: state => (field, value) => {
    console.log(field + " : " + value)

    const content = state.collection

    let relatedContent

    let subField =
      field === "audience"
        ? "target_readership"
        : field === "genres"
        ? "genre"
        : field === "featuredCollections"
        ? "featured_collection"
        : field

    relatedContent =
      subField !== "new"
        ? content.filter(
            page =>
              page.acf && page.acf[subField] && page.acf[subField].some(item => item.slug === value)
          )
        : content
    return relatedContent
  },

  getItemBySlug: state => (contentType, slug) => {
    return state[contentType].find(item => item.slug === slug)
  },
}
