import { returnType } from "./modules/utilities.js"

export default {
  getContentBy: state => (contentType, locationName = "all", serviceName = "any") => {
    const type = returnType(contentType)
    const content = [...state.content[type]]

    let relatedContent

    relatedContent =
      locationName !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === locationName)
          )
        : state.currentLocation !== "all"
        ? content.filter(
            page =>
              page.acf &&
              page.acf.location &&
              page.acf.location.some(location => location.slug === state.currentLocation)
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

  getItemBySlug: state => (contentType, slug) => {
    const type = returnType(contentType)
    return state[type].find(item => item.slug === slug)
  },

  verifyType: state => type => {
    return returnType(type)
  },
}
