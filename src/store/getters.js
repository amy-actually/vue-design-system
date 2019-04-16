export default {
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

  getItemBySlug: state => (contentType, slug) => {
    return state[contentType].find(item => item.slug === slug)
  },
}
