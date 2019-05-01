const endpoint = {
  alerts: {
    type: "bigKahuna",
    slug: "notices",
    module: "content",
    alts: ["notice", "alert", "alerts"],
    filter: {
      locations: "affected_location",
    },
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
  },

  collection: {
    type: "bigKahuna",
    slug: "collection",
    module: "content",
    alts: ["collections"],
    filter: {
      services: "services",
      locations: "location",
      featuredCollections: "featured_collection",
      audience: "target_readership",
      genres: "genre",
    },
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
  },

  genres: {
    type: "bigKahuna",
    slug: "genres",
    module: "taxonomies",
    alts: ["genre"],
  },

  locations: {
    type: "bigKahuna",
    slug: "locations",
    module: "taxonomies",
    alts: ["location"],
  },

  menus: {
    type: "fontana",
    slug: "menus",
    module: "root",
    alts: ["menu"],
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
  },

  posts: {
    type: "bigKahuna",
    slug: "posts",
    module: "content",
    alts: ["post"],
    filter: {
      services: "services",
      locations: "location",
    },
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
  },

  services: {
    type: "bigKahuna",
    slug: "services",
    module: "taxonomies",
    alts: ["service"],
  },

  subjects: {
    type: "bigKahuna",
    slug: "subjects",
    module: "taxonomies",
    alts: ["subject"],
  },

  blogs: {
    type: "shelfLife",
    slug: "posts",
    module: "blog",
    alts: ["blog"],
    filter: {
      services: "categories",
    },
  },

  taxonomies: {
    type: "bigKahuna",
    slug: "taxonomies",
    module: "content",
    alts: ["taxonomy", "terms"],
  },

  search: {
    type: "fontana",
    slug: "search",
    module: null,
    alts: [],
  },

  organizers: {
    type: "tribe",
    slug: "organizers",
    module: "tribe",
    alts: ["tribe_organizer", "organizer", "tribe_organizers"],
    filter: {},
  },

  venues: {
    type: "tribe",
    slug: "venues",
    module: "tribe",
    alts: ["tribe_venue", "venue", "tribe_venues"],
    filter: {},
  },
}

const returnType = type => {
  console.log("TESTING FOR TYPE.............. " + type)
  if (endpoint[type]) {
    console.log("RETURNTYPE1 " + type)
    return type
  }
  for (const name of Object.keys(endpoint)) {
    if (endpoint[name].alts && endpoint[name].alts.includes(type)) {
      console.log("RETURNTYPE2 " + name)
      return name
    }
  }

  /* Object.keys(endpoint).forEach(name => {
    if (endpoint[name].alts && endpoint[name].alts.includes(type)) {
      console.log("RETURNTYPE2 " + name)
      return name
    }
  }) */
  console.log("RETURN TYPE ERROR")
  //return type
  return "error"
}

const sortByDate = (data, type = null) => {
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

export { endpoint, returnType, sortByDate }
