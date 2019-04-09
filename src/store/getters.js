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

    relatedContent.sort(function(a, b) {
      let date1 = !a.type
        ? 0
        : a.type === "event"
        ? new Date(a.start_date)
        : a.type === "collection-item"
        ? new Date(a.acf.record_creation_date)
        : new Date(a.date)
      let date2 = !b.type
        ? 0
        : b.type === "event"
        ? new Date(b.start_date)
        : b.type === "collection-item"
        ? new Date(b.acf.record_creation_date)
        : new Date(b.date)
      return date1.getTime() - date2.getTime()
    })

    return relatedContent
  },

  getContentBy: state => (contentType, locationName = null) => {
    console.log(contentType)
    if (!state[contentType] || state[contentType].length == 0) {
      return null
    }
    const content = state[contentType]

    let relatedContent

    relatedContent =
      locationName && locationName !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === locationName)
          )
        : !locationName && state.currentLocation !== "all"
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
      rootState.services.currentService !== "any" && relatedContent.length > 0
        ? relatedContent.filter(
            page =>
              page.acf &&
              page.acf.services &&
              page.acf.services.some(service => service.slug === rootState.services.currentService)
          )
        : rootState.services.currentService && rootState.services.currentService !== "any"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.services &&
              page.acf.services.some(service => service.slug === rootState.services.currentService)
          )
        : relatedContent

    relatedContent.sort(function(a, b) {
      let date1 = !a.type
        ? 0
        : a.type === "event"
        ? new Date(a.start_date)
        : a.type === "collection-item"
        ? new Date(a.acf.record_creation_date)
        : new Date(a.date)
      let date2 = !b.type
        ? 0
        : b.type === "event"
        ? new Date(b.start_date)
        : b.type === "collection-item"
        ? new Date(b.acf.record_creation_date)
        : new Date(b.date)
      return date1.getTime() - date2.getTime()
    })

    return relatedContent
  },
}
