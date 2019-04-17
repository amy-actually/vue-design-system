export function returnTaxonomyType(type) {
  return type === "featured-collections" ||
    type === "featured_collections" ||
    type === "featuredcollections"
    ? "featuredCollections"
    : type === "genre"
    ? "genres"
    : type === "audiences"
    ? "audience"
    : type
}

export function sortByDate(data, type = null) {
  if (type === "collection") {
    return data.sort(function(a, b) {
      let date1 = new Date(a.acf.record_creation_date)
      let date2 = new Date(b.acf.record_creation_date)
      return date1.getTime() - date2.getTime()
    })
  }

  if (type === "events" || type === "event") {
    return data.sort(function(a, b) {
      let date1 = new Date(a.start_date)
      let date2 = new Date(b.start_date)
      return date1.getTime() - date2.getTime()
    })
  }

  return data.sort(function(a, b) {
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
}
