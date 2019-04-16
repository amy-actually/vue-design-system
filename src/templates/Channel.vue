<template>
  <channel-template :callToAction="primaryCTA" :type="network">
    <template v-slot:breadcrumb v-if="nav">
      <breadcrumb :current="channelTitle" :ancestors="nav" />
    </template>

    <template v-slot:header>
      <channel-header :title="channelTitle" :description="channelDescription" />
    </template>

    <template v-slot:sidebar>
      <content-search
        :date-filter="network !== 'resources' ? true : false"
        :location-filter="network !== 'resources' ? true : false"
        :selected-date="network !== 'resources' ? selectedDate : null"
        @selectdate="selectedDate = $event"
        :filter="filter"
        @querycontent="filter = $event"
        :library="network !== 'resources' ? location : null"
        @filterlibrary="location = $event"
        @clearcontentfilter="clearFilter()"
      />
    </template>

    <template v-slot:content>
      <filter-results
        :total="total"
        :selectedDate="selectedDate"
        :filter="filter"
        :location="location"
        :contentName="network.slice(-1) == 's' ? network.substring(0, network.length - 1) : network"
      />
      <content-stream
        :key="`${network}-${filter}-${location}-${selectedDate}`"
        :type="network"
        @totalresults="total = $event"
        :filter="filter"
        :selected-date="selectedDate"
        :location="location"
        :contents="contents"
      />
    </template>
  </channel-template>
</template>

<script>
import ChannelTemplate from "../patterns/ChannelTemplate.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import ChannelHeader from "../patterns/ChannelHeader.vue"
import ContentSearch from "../patterns/ContentSearch.vue"
import ContentStream from "../patterns/ContentStream.vue"
import FilterResults from "../elements/FilterResults.vue"

export default {
  name: "Channel",

  components: {
    Breadcrumb,
    ChannelHeader,
    ChannelTemplate,
    ContentSearch,
    ContentStream,
    FilterResults,
  },

  computed: {
    primaryCTA() {
      if (this.network === "services" || this.network === "locations") {
        return this.$store.getters["content/getCtaByCategory"](this.slug, "random")
      }
      if (this.$store.state.content[this.network]) {
        return this.$store.getters["content/getCtaByCategory"](
          this.$store.state.currentLocation,
          "random"
        )
      }
      if (
        this.network === "genres" ||
        this.network === "audience" ||
        this.network === "featuredCollections"
      ) {
        return this.$store.getters["content/getCtaByCategory"]("collection-services", "random")
      }
    },

    contents() {
      if (this.network === "services" || this.network === "locations") {
        return this.$store.getters["content/getAllContentBy"]("collection", this.slug)
      }
      if (this.$store.state.content[this.network]) {
        this.total = this.$store.state.content[this.network].length
          ? this.$store.state.content[this.network].length
          : 0
        return this.$store.state.content[this.network]
      }
    },
  },
  created() {
    console.log("CREATED: " + this.network)
    this.$root.$on("resetPage", data => {
      this.page = 1
    })
    if (
      this.$store.state.content[this.network] &&
      this.$store.state.content[this.network].length === 0
    ) {
      this.$store.dispatch("content/fetchAllContent", { type: this.network })
    }
  },
  data() {
    return {
      location: "",
      filter: "",
      selectedDate: "",
      page: 1,
      total: 0,
    }
  },
  methods: {
    clearFilter() {
      this.selectedDate = null
      this.filter = null
      this.location = null
      this.page = 1
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
    filter() {
      this.$root.$emit("resetpage")
    },
    location() {
      this.$root.$emit("resetpage")
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
