import Vue from "vue"
import Router from "vue-router"
import ChannelExample from "../examples/Channel.vue"
import CollectionExample from "../examples/Collection.vue"
import CollectionsExample from "../examples/Collections.vue"
import EventExample from "../examples/Event.vue"
import EventsExample from "../examples/Events.vue"
import Index from "../examples/Index.vue"
import NotFound from "../templates/NotFound.vue"
import SearchResults from "../examples/SearchResults.vue"
import Service from "../examples/Service.vue"
import Terms from "../examples/Terms.vue"
import TermExample from "../examples/Term.vue"
import Blog from "../examples/Blog.vue"
//--------------
//import routes from "./routes"

Vue.use(Router)

const router = new Router({
  mode: "history",

  routes: [
    {
      component: ChannelExample,
      meta: {
        title: "Blog",
      },
      name: "Blog",
      path: "/blog",
      props: route => ({
        channelTitle: "Shelf Life in the Mountains",
        channelDescription: `
          This is the blog for the Fontana Regional Library system, 
          serving Jackson, Macon, and Swain counties in western North Carolina.
          Our blog contributors come from all over our three county region and cover a 
          vast array of topics including historical and current events, technology, 
          cats and much more, as well as related books suggestions!
        `,
        network: "blogs",
        slug: "any",
      }),
    },
    {
      component: Blog,
      path: "/blog/:slug",
      props: route => ({
        page: router.app.$store.getters["content/getItemBySlug"]("blogs", route.params.slug),
      }),
    },

    {
      component: CollectionsExample,
      meta: {
        title: "Collection",
      },
      name: "Collection",
      path: "/collection",
      props: route => ({
        channelTitle: "Collection",
        slug: "any",
      }),
    },

    {
      component: CollectionExample,
      meta: {
        title: "Collection",
      },
      name: "Collection-new",
      path: "/collection/new",
      props: route => ({
        channelTitle: "Collection",
        network: "new",
        slug: "any",
        nav: [{ text: "Collection", to: "/collection" }],
      }),
    },

    {
      component: Terms,
      meta: {
        title: "Collection Genres",
      },
      name: "Collection-genres",
      path: "/collection/genres",
      props: route => ({
        channelTitle: "Collection Genres",
        channelDescription: `
        Find library materials by Genre`,
        taxonomy: "genres",
        slug: "any",
        sidebar: { search: { location: false } },
        nav: [{ text: "Collection", to: "/collection" }],
      }),
    },

    {
      component: CollectionExample,
      meta: {
        title: "Collection",
      },
      name: "Collection-network-slug",
      path: "/collection/:network/:slug",
      props: route => ({
        channelTitle: "Collection",
        network: route.params.network,
        slug: route.params.slug,
        nav: [{ text: "Collection", to: "/collection" }],
      }),
    },

    {
      component: Index,
      meta: {
        title: "Home",
      },
      name: "Index",
      path: "/",
      props: route => ({
        location: route.query.location,
      }),
    },

    {
      component: ChannelExample,
      meta: {
        title: "Events",
      },
      path: "/events",
      name: "Events",
      props: route => ({
        channelTitle: "Events",
        channelDescription: `
        Through partnerships in the community, we are able to bring you art and historical exhibits, teach workshops, invite performers and speakers, provide nationally recognized children's programming, and more.
        `,
        network: "events",
        slug: "events/",
      }),
    },

    {
      component: EventExample,
      path: "/events/:slug",
      props: route => ({
        eventObject: router.app.$store.getters["content/getItemBySlug"](
          "events",
          route.params.slug
        ),
      }),
    },

    {
      component: SearchResults,
      name: "Search",
      path: "/search",
      props: route => ({
        filter: route.query.filter,
        location: route.query.location,
      }),
    },

    {
      component: Terms,
      name: "Services",
      path: "/services",
      props: route => ({
        channelTitle: "Services",
        channelDescription: `
          We are able to offer loads of services across multiple counties, which can help connect
          you to free events, tax experts, your ancestry, or get you free books, movies, and much,
          much more.`,
        taxonomy: "services",
        sidebar: { search: { location: false } },
      }),
    },

    {
      component: Terms,
      name: "Locations",
      path: "/locations",
      props: route => ({
        channelTitle: "Locations",
        channelDescription: `
        The Heart of the Community, Enriching Lives and Inspiring the Future.<br/><br/>
        With 6 locations in Western North Carolina, Fontana Regional Library provides the public of Jackson, Macon, and Swain counties with excellent service and convenient access to resources for your educational, informational, and recreational needs.`,
        taxonomy: "locations",
        sidebar: { search: { location: false } },
      }),
    },

    {
      component: TermExample,
      path: "/services/:slug",
      props: route => ({
        slug: route.params.slug,
        taxonomy: "services",
        nav: [{ text: "Services", to: "/services" }],
      }),
    },

    {
      component: ChannelExample,
      meta: {
        title: "Information",
      },
      path: "/pages",
      name: "Pages",
      props: route => ({
        channelTitle: "Library Information",
        channelDescription: `
          Find Information about general library services, how-to's and more.
        `,
        network: "pages",
        slug: "pages/",
      }),
    },

    {
      path: "*",
      name: "NotFound",
      component: NotFound,
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (
    !hasLocationQueryParameter(to) &&
    hasLocationQueryParameter(from) &&
    from.query.location !== "all"
  ) {
    next({ name: to.name, query: from.query })
  } else {
    next()
  }
})

function hasLocationQueryParameter(route) {
  return !!route.query.location
}

export default router
