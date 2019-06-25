const endpoint = {
  alerts: {
    type: "bigKahuna",
    slug: "notices",
    module: "content",
    alts: ["notice", "alert", "alerts"],
    filter: {
      locations: "affected_location",
    },
    resultName: "Notice",
    colorCode: null,
  },

  audience: {
    type: "bigKahuna",
    slug: "audience",
    module: "taxonomies",
    alts: [
      "target_readership",
      "target-readership",
      "targetreadership",
      "audiences",
      "target_audience",
      "target-audience",
    ],
    filter: {},
    resultName: "Audience",
    colorCode: null,
  },

  callsToAction: {
    type: "bigKahuna",
    slug: "calls-to-action",
    module: "content",
    alts: [
      "calls-to-action",
      "calls_to_action",
      "callstoaction",
      "call-to-action",
      "call_to_action",
      "calltoaction",
      "action",
      "actions",
    ],
    filter: {
      services: "category",
      locations: "location",
      featuredCollections: "featured_collection",
      subjects: "subjects",
      categories: "event_categories",
    },
    resultName: null,
    colorCode: null,
  },

  collection: {
    type: "bigKahuna",
    slug: "collection",
    module: "content",
    alts: [
      "collections",
      "collection-item",
      "collection-items",
      "collectionitem",
      "collectionitems",
    ],
    filter: {
      services: "services",
      locations: "location",
      featuredCollections: "featured_collection",
      audience: "target_readership",
      genres: "genre",
    },
    resultName: "Collection Item",
    colorCode: "pink",
  },

  events: {
    type: "bigKahuna",
    slug: "events",
    module: "content",
    alts: ["event", "tribe_event", "tribe_events"],
    filter: {
      services: "services",
      locations: "location",
    },
    resultName: "Event",
    colorCode: "aqua",
  },

  featuredCollections: {
    type: "bigKahuna",
    slug: "featured-collections",
    module: "taxonomies",
    alts: [
      "featured-collections",
      "featured_collections",
      "featuredcollections",
      "featured",
      "featured-collection",
      "featured_collection",
      "featuredcollection",
    ],
    resultName: "Featured Collection",
    colorCode: "pink",
  },

  genres: {
    type: "bigKahuna",
    slug: "genres",
    module: "taxonomies",
    alts: ["genre"],
    resultName: "Genre",
    colorCode: "pink",
  },

  locations: {
    type: "bigKahuna",
    slug: "locations",
    module: "taxonomies",
    alts: ["location"],
    resultName: "Location",
    colorCode: null,
  },

  menus: {
    type: "fontana",
    slug: "menus",
    module: "root",
    alts: ["menu"],
    resultName: null,
    colorCode: null,
  },

  pages: {
    type: "bigKahuna",
    slug: "pages",
    module: "content",
    alts: ["page"],
    filter: {
      services: "services",
      locations: "location",
    },
    resultName: "Information Page",
    colorCode: "blue-base",
  },

  posts: {
    type: "bigKahuna",
    slug: "posts",
    module: "content",
    alts: ["post", "articles", "article"],
    filter: {
      services: "services",
      locations: "location",
    },
    resultName: "Article",
    colorCode: null,
  },

  resources: {
    type: "bigKahuna",
    slug: "resources",
    module: "content",
    alts: ["resource"],
    filter: {
      subjects: "subjects",
      vendors: "vendors",
      resourceTypes: "resource-types",
    },
    resultName: "Resource",
    colorCode: "teal",
  },

  services: {
    type: "bigKahuna",
    slug: "services",
    module: "taxonomies",
    alts: ["service"],
    resultName: "Service",
    colorCode: "orange",
  },

  subjects: {
    type: "bigKahuna",
    slug: "subjects",
    module: "taxonomies",
    alts: ["subject"],
    resultName: "Subject",
    colorCode: null,
  },

  blogs: {
    type: "shelfLife",
    slug: "posts",
    module: "blog",
    alts: ["blog"],
    filter: {
      services: "categories",
    },
    resultName: "Blog Post",
    colorCode: null,
  },

  taxonomies: {
    type: "bigKahuna",
    slug: "taxonomies",
    module: "content",
    alts: ["taxonomy", "terms"],
    resultName: null,
    colorCode: null,
  },

  search: {
    type: "fontana",
    slug: "search",
    module: null,
    alts: [],
    resultName: null,
    colorCode: null,
  },

  organizers: {
    type: "tribe",
    slug: "organizers",
    module: "tribe",
    alts: ["tribe_organizer", "organizer", "tribe_organizers"],
    filter: {},
    resultName: "Organizer",
    colorCode: null,
  },

  venues: {
    type: "tribe",
    slug: "venues",
    module: "tribe",
    alts: ["tribe_venue", "venue", "tribe_venues"],
    filter: {},
    resultName: "Venue",
    colorCode: null,
  },
}

const returnType = type => {
  if (endpoint[type.toLowerCase()]) {
    //console.log("RETURNTYPE1 " + type)
    return type
  }
  //for (const name of Object.keys(endpoint)) {
  for (const name in endpoint) {
    if (endpoint[name].alts && endpoint[name].alts.includes(type.toLowerCase())) {
      return name
    }
  }
  console.log("UTILITIES: RETURN TYPE ERROR " + type)
  //return type
  return "error"
}

const sortByDate = (data, type = null) => {
  if (type === "collection") {
    return [...data].sort(function(a, b) {
      let date1 = new Date(a.acf.record_creation_date)
      let date2 = new Date(b.acf.record_creation_date)
      return date2.getTime() - date1.getTime()
    })
  }

  if (type === "events" || type === "event") {
    return [...data].sort(function(a, b) {
      let date1 = new Date(a.start_date)
      let date2 = new Date(b.start_date)
      return date1.getTime() - date2.getTime()
    })
  }
  let $eventFilter = new Date()
  $eventFilter.setDate($eventFilter.getDate() + 7)

  return [...data].sort(function(a, b) {
    let date1 =
      !a.type || (a.type === "event" && new Date(a.start_date) > $eventFilter)
        ? 0
        : a.type === "event"
        ? new Date(a.start_date)
        : a.type === "collection-item"
        ? new Date(a.acf.record_creation_date)
        : new Date(a.date)
    let date2 =
      !b.type || (b.type === "event" && new Date(b.start_date) > $eventFilter)
        ? 0
        : b.type === "event"
        ? new Date(b.start_date)
        : b.type === "collection-item"
        ? new Date(b.acf.record_creation_date)
        : new Date(b.date)
    return date2 - date1
    //return date1.getTime() - date2.getTime()
  })
}
const getName = type => {
  const checkType = type.toLowerCase()
  if (endpoint[checkType]) {
    //console.log("RETURNTYPE1 " + type)
    return {
      name: endpoint[checkType].resultName,
      class: endpoint[checkType].colorCode,
      type: checkType,
    }
  }
  for (const name in endpoint) {
    if (endpoint[name].alts && endpoint[name].alts.includes(checkType)) {
      return { name: endpoint[name].resultName, class: endpoint[name].colorCode, type: name }
    }
  }
  return null
}

export { endpoint, returnType, sortByDate, getName }
