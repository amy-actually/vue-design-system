<template>
  <main class="channel" role="main">
    <header class="background--white d-flex p-4">
      <div class="col-md-10 m-auto">
        <div class="col-md-8">
          <heading class="channel__title text--dark text--serif" level="h1">
            Events
          </heading>

          <p class="channel__description">
            Through partnerships in the community, we are able to bring you art and historical
            exhibits, teach workshops, invite performers and speakers, provide nationally recognized
            children's programming, and more.
          </p>
        </div>
      </div>
    </header>

    <section class="background--white library__section p-3">
      <div class="col-lg-10 m-lg-auto">
        <div class="d-md-flex">
          <div class="mr-4 flex-shrink-1">
            <content-search
              :date-filter="true"
              :selected-date="selectedDate"
              @selectdate="selectedDate = $event"
              :filter="q"
              @querycontent="q = $event"
              :library="library"
              @filterlibrary="library = $event"
              @clearcontentfilter="clearFilter()"
              contentName="event"
            />
          </div>

          <div class="flex-fill">
            <filter-results
              :total="total"
              :selectedDate="selectedDate"
              :filter="q"
              :location="locationDetails"
              contentName="event"
              :prefetchTotal="eventCount"
            />

            <content-stream
              :key="selectedDate + q + library"
              :contents="events"
              type="events"
              @totalresults="total = $event"
              :filter="q"
              :selected-date="selectedDate"
              :location="library"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState } from "vuex"

import ContentStream from "../patterns/ContentStream.vue"
import ContentSearch from "../patterns/ContentSearch.vue"
import FilterResults from "../elements/FilterResults.vue"

export default {
  name: "EventsExample",

  components: {
    ContentSearch,
    ContentStream,
    FilterResults,
  },

  computed: {
    ...mapState("content", ["events"]),
    eventCount() {
      return this.$store.state.content.counts.events
    },
    locationDetails() {
      return this.location && this.location !== "all"
        ? this.$store.state.taxonomies.locations.find(location => location.slug === this.location)
        : {}
    },
  },

  data() {
    return {
      selectedDate: null,
      library: this.location,
      total: 0,
      page: 1,
      q: this.filter,
    }
  },

  methods: {
    clearFilter() {
      this.selectedDate = null
      this.q = null
      this.library = null
      this.page = 1
    },
  },
  watch: {
    q() {
      this.$root.$emit("resetpage")
    },
    library() {
      this.$root.$emit("resetpage")
    },
    selectedDate() {
      this.$root.$emit("resetpage")
    },
    "$store.state.userLocation"() {
      this.library = this.$store.state.userLocation
      this.$root.$emit("resetpage")
    },
  },
  mounted() {
    this.$store.dispatch("content/fetchUpcomingEvents")
    this.$root.$on("inputData", data => {
      this.q = data
    })
    this.$root.$on("resetPage", data => {
      this.page = 1
    })
  },
  created() {
    this.$store.dispatch("content/fetchUpcomingEvents")
  },
  props: {
    filter: {
      type: String,
    },
    location: {
      default: "",
      type: String,
    },
  },
}
</script>
