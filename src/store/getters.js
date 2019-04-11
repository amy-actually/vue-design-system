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
        : rootState.locations.currentLocation !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(
                location => location.slug === rootState.locations.currentLocation
              )
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
              page.acf.services.some(service => service.slug === rootState.services.currentService)
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
        : rootState.locations.currentLocation !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(
                location => location.slug === rootState.locations.currentLocation
              )
          )
        : content

    relatedContent =
      serviceName !== "any" && relatedContent.length > 0
        ? relatedContent.filter(
            page =>
              page.acf &&
              page.acf.services &&
              page.acf.services.some(service => service.slug === rootState.services.currentService)
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

  getCtaByCategory: state => (slug, index = 1) => {
    if (!state.callsToAction || state.callsToAction.length == 0) {
      return null
    }
    const content = state.callsToAction

    let relatedContent

    relatedContent = content.filter(
      cta =>
        cta.acf && cta.acf.category && cta.acf.category.some(category => category.slug === slug)
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

    return relatedContent[index]
  },

  getItemBySlug: state => (contentType, slug) => {
    return state[contentType].find(item => item.slug === slug)
  },
}
