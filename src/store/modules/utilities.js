export const endpoint = {
  alerts: {
    type: "bigKahuna",
    slug: "notices",
    module: "content",
    alts: ["notice", "alert", "alerts"],
    filter: {
      location: "affected_location",
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
      service: "category",
      location: "location",
      featuredCollection: "featured_collection",
      subject: "subjects",
      category: "event_categories",
    },
  },

  collection: {
    type: "bigKahuna",
    slug: "collection",
    module: "content",
    alts: ["collections"],
    filter: {
      service: "services",
      location: "location",
      featuredCollection: "featured_collection",
      audience: "target_readership",
      genre: "genre",
    },
  },

  events: {
    type: "bigKahuna",
    slug: "events",
    module: "content",
    alts: ["event", "tribe_event", "tribe_events"],
    filter: {
      service: "services",
      location: "location",
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
      service: "services",
      location: "location",
    },
  },

  posts: {
    type: "bigKahuna",
    slug: "posts",
    module: "content",
    alts: ["post"],
    filter: {
      service: "services",
      location: "location",
    },
  },

  resources: {
    type: "bigKahuna",
    slug: "resources",
    module: "content",
    alts: ["resource"],
    filter: {
      subject: "subjects",
      vendor: "vendors",
      resourceType: "resource-types",
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
      service: "categories",
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

export function returnPostType(type) {
  //NEEDS COMPLETION
  return
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
