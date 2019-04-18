<template>
  <terms
    :type="taxonomy"
    :callToAction="primaryCTA"
    :sidebar="sidebar"
    :terms="terms"
    :filter="filter"
    :showFeatured="showFeatured()"
  >
    <template v-slot:breadcrumb v-if="nav">
      <breadcrumb :current="channelTitle" :ancestors="nav" />
    </template>

    <template v-slot:header>
      <channel-header
        :title="channelTitle"
        :description="channelDescription"
        class="background--white"
      />
    </template>

    <template v-slot:sidebar>
      <content-search
        v-if="sidebar.search"
        :date-filter="false"
        :location-filter="sidebar.search.location"
        :filter="filter"
        :library="sidebar.search.location ? location : null"
        @filterlibrary="location = $event"
        @clearcontentfilter="clearFilter()"
        @querycontent="filter = $event"
      />
    </template>

    <template v-slot:content>
      <filter-results
        v-if="(filter && filter.length > 0) || (location && location !== 'all')"
        :total="total"
        :filter="filter"
        :location="location"
        :contentName="
          taxonomy.slice(-1) == 's' ? taxonomy.substring(0, taxonomy.length - 1) : taxonomy
        "
      />
      <content-stream
        :key="`${taxonomy}-${filter}-${location}`"
        :type="taxonomy"
        @totalresults="total = $event"
        :filter="filter"
        :location="location"
        :contents="terms"
        :per-page="Number(10)"
      />
    </template>
  </terms>
</template>

<script>
import Terms from "../templates/Terms.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import ChannelHeader from "../patterns/ChannelHeader.vue"
import ContentSearch from "../patterns/ContentSearch.vue"
import ContentStream from "../patterns/ContentStream.vue"
import FilterResults from "../elements/FilterResults.vue"

export default {
  name: "TermsExample",
  components: {
    Breadcrumb,
    ChannelHeader,
    ContentSearch,
    ContentStream,
    FilterResults,
    Terms,
  },
  computed: {
    primaryCTA() {
      return this.$store.getters["content/getCtaByCategory"]("any", "random")
    },
    terms() {
      return this.$store.state.taxonomies[this.taxonomy]
    },
  },
  data() {
    return {
      location: "all",
      filter: null,
      total: 0,
    }
  },
  created() {
    console.log(this.taxonomy)
    this.$store.dispatch("content/fetchContent", { type: "callsToAction" })
    this.$store.dispatch("taxonomies/fetchTerms", { type: this.taxonomy })
  },
  beforeUpdate() {
    if (!this.terms || this.terms.length < 1) {
      this.$store.dispatch("taxonomies/fetchTerms", { type: this.taxonomy })
    }
  },
  methods: {
    clearFilter() {
      this.filter = null
      this.location = null
      this.total = 0
    },
    showFeatured() {
      if (this.$route.query && this.$route.query.page && this.$route.query.page > 1) {
        return false
      }
      return !this.filter || this.filter.length == 0
    },
  },
  props: {
    channelTitle: {
      type: String,
    },
    channelDescription: {
      type: String,
    },
    taxonomy: {
      type: String,
    },
    sidebar: {
      default: null,
    },
    nav: {
      default: null,
    },
  },
}
</script>
