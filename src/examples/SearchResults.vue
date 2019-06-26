<template>
  <channel :callToAction="primaryCTA" :type="network">
    <template v-slot:breadcrumb v-if="nav">
      <breadcrumb :current="channelTitle" :ancestors="nav" />
    </template>

    <template v-slot:header>
      <channel-header :title="channelTitle" :description="channelDescription" />
    </template>

    <template v-slot:sidebar>
      <content-search
        :date-filter="false"
        :location-filter="true"
        :filter="q"
        @querycontent="q = $event"
        :library="location"
        @filterlibrary="location = $event"
        @clearcontentfilter="clearFilter()"
      />
    </template>

    <template v-slot:content>
      <filter-results
        :total="Number(total)"
        :filter="q"
        :location="locationDetails"
        :prefetchTotal="apiTotal"
      />
      <content-stream
        v-if="contents"
        :key="`${q}`"
        @totalresults="total = $event"
        :contents="contents"
        :location="location"
        :perPage="10"
        :apiTotal="apiTotal"
      />
    </template>
  </channel>
</template>

<script>
import api from "../store/plugins/api.js"
import Channel from "../templates/Channel.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import ChannelHeader from "../patterns/ChannelHeader.vue"
import ContentSearch from "../patterns/ContentSearch.vue"
import ContentStream from "../patterns/ContentStream.vue"
import FilterResults from "../elements/FilterResults.vue"

export default {
  name: "SearchResults",

  components: {
    Breadcrumb,
    ChannelHeader,
    Channel,
    ContentSearch,
    ContentStream,
    FilterResults,
  },

  computed: {
    primaryCTA() {
      return this.$store.getters["content/getCtaByCategory"](
        this.$store.state.currentLocation,
        "random"
      )
    },
    locationDetails() {
      return this.location && this.location !== "all"
        ? this.$store.state.taxonomies.locations.find(location => location.slug === this.location)
        : {}
    },
  },
  created() {
    console.log("created")
    if (this.$route.query && (this.$route.query.filter || this.$route.query.search)) {
      this.q = this.$route.query.filter ? this.$route.query.filter : this.$route.query.search
    }
    /*  this.$root.$on("resetPage", data => {
      this.page = 1
    }) */
    this.location =
      this.$route.query && this.$route.query.location
        ? this.$route.query.location
        : this.$store.state.currentLocation !== "all"
        ? this.$store.state.currentLocation
        : ""

    this.$store.dispatch("content/fetchInitalContent", this.network)
    this.getResults()
  },
  data() {
    return {
      location: "",
      q: "",
      selectedDate: "",
      total: 0,
      contents: [],
      apiTotal: null,
      loading: false,
      pages: [],
    }
  },
  methods: {
    clearFilter() {
      this.pages = []
      this.contents = []
      this.q = null
      this.location = null
      //this.page = 1
    },
    getResults() {
      let query =
        this.q && this.q.length > 0
          ? this.q
          : this.$route.query && this.$route.query.filter && this.$route.query.filter.length > 0
          ? this.$route.query.filter
          : this.$route.query && this.$route.query.search && this.$route.query.search.length > 0
          ? this.$route.query.search
          : null

      console.log("Query: " + query)
      if (!query || !query.length > 0) {
        return null
      }

      console.log(this.loading)
      if (this.loading === false && query && query.length > 0) {
        const page =
          this.$route.query && this.$route.query.page ? Number(this.$route.query.page) : 1
        console.log(page)

        if (
          !this.pages.includes(page) &&
          (!this.apiTotal ||
            (page <= Math.ceil(this.apiTotal / 10) && this.contents.length < this.apiTotal))
        ) {
          console.log("fetching... page " + page)
          this.pages = [...this.pages, page]
          this.loading = true

          api.fetchContent("search", { search: query, per_page: 10, page: page }).then(results => {
            if (results.posts.content) {
              this.contents = [...this.contents, ...results.posts.content]
            }
            this.apiTotal = results.posts.total
            this.loading = false
          })
        }
        const nextPage = 1 + page
        if (
          !this.pages.includes(nextPage) &&
          (this.loading === true ||
            (nextPage <= Math.ceil(this.apiTotal / 10) && this.contents.length < this.apiTotal))
        ) {
          this.pages = [...this.pages, nextPage]
          this.loading = true
          api
            .fetchContent("search", { search: query, per_page: 10, page: nextPage })
            .then(results => {
              if (results.posts.content) {
                this.contents = [...this.contents, ...results.posts.content]
              }
              this.loading = false
            })
        }
      }
    },
  },
  props: {
    channelDescription: {
      type: String,
    },

    channelTitle: {
      required: true,
      type: String,
    },

    network: {
      type: String,
      required: true,
    },

    slug: {
      default: "any",
      required: true,
      type: String,
    },

    nav: {
      type: Array,
    },
  },
  watch: {
    selectedDate() {
      this.$root.$emit("resetpage")
    },
    q() {
      this.loading = false
      this.pages = []
      this.contents = []
      this.getResults()
    },
    location() {
      this.$root.$emit("resetpage")
    },
    "$store.state.currentLocation"() {
      this.location =
        this.$store.state.currentLocation !== "all" ? this.$store.state.currentLocation : ""
      this.$root.$emit("resetpage")
    },
    "$route.query.search"() {
      if (this.$route.query.search && this.q !== this.$route.query.search) {
        this.q = this.$route.query.search
      }
    },
    "$route.query.filter"() {
      if (this.$route.query.filter && this.q !== this.$route.query.filter) {
        this.q = this.$route.query.filter
      }
    },
    "$route.query.page"() {
      //this.page = this.$route.query.page;
      this.getResults()
    },
  },
}
</script>

<style lang="scss">
.channel {
  &__title {
    @media #{$media-query-medium} {
      font-size: $font-size-xx-large;
    }
  }

  &__description {
    color: $color-blue-alternate;
    font-family: $font-family-text;
    font-size: $font-size-base;

    @media #{$media-query-medium} {
      font-size: $font-size-large;
    }
  }
}

.heading__separator {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: 8px;
  border: none;
  box-shadow: none;
  margin: 40px 0;

  &:before {
    flex: 0 1 144px;
    background-color: $color-blue-alternate;
    content: "";
  }
}

.separator {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: 4px;
  border: none;
  box-shadow: none;
  margin: 40px 0;
}
</style>
