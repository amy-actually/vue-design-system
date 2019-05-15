<template>
  <channel :callToAction="primaryCTA" :type="taxonomy" v-if="term">
    <template v-slot:breadcrumb>
      <breadcrumb :current="term.name" :ancestors="[{ text: taxonomy, to: `/${taxonomy}` }]" />
    </template>

    <template v-slot:header>
      <channel-header :title="term.name" :description="term.description" />
    </template>

    <template v-slot:sidebar>
      <location-card
        v-if="taxonomy === 'locations'"
        :location="term"
        :key="term.id"
        variant="sidebar"
      />

      <content-search
        :contentFilter="contentTypes"
        :location-filter="taxonomy !== 'locations' ? true : false"
        :filter="filter"
        @querycontent="filter = $event"
        :library="location"
        @filterlibrary="location = $event"
        @clearcontentfilter="clearFilter()"
      />
    </template>

    <template v-slot:content>
      <filter-results :total="Number(total)" :filter="filter" :location="locationDetails" />
      <content-stream
        :key="`${taxonomy}-${slug}`"
        @totalresults="total = $event"
        :filter="filter"
        :location="location"
        :contents="contents"
      />
    </template>
  </channel>
</template>

<script>
import Channel from "../templates/Channel.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import ChannelHeader from "../patterns/ChannelHeader.vue"
import ContentSearch from "../patterns/ContentSearch.vue"
import ContentStream from "../patterns/ContentStream.vue"
import FilterResults from "../elements/FilterResults.vue"
import { getName } from "../store/modules/utilities.js"

export default {
  name: "TermExample",

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
      return this.$store.getters["content/getCtaByCategory"](this.slug, "random")
    },

    contents() {
      if (this.taxonomy === "locations") {
        return this.$store.getters["content/getAllContentBy"](this.slug)
      }
      return this.$store.getters["content/getAllContentBy"](this.location, this.slug)
    },
    term() {
      return this.$store.getters["taxonomies/getTermBySlug"](this.taxonomy, this.slug)
    },

    locationDetails() {
      return this.$store.getters["taxonomies/getTermBySlug"]("locations", this.location)
    },
    contentTypes() {
      if (!this.term || !this.term.count_by_type) {
        return []
      }
      let types = []
      for (var type in this.term.count_by_type) {
        let name = getName(type)
        console.log(name)
        if (name && name.name && this.term.count_by_type[type] > 0) {
          types.push({ ...name, count: this.term.count_by_type[type] })
        }
      }

      return types
    },
  },
  created() {
    console.log("CREATED: " + this.taxonomy)
    this.$root.$on("resetPage", data => {
      this.page = 1
    })
    //this.location = this.taxonomy=="locations" ? this.slug : this.$store.state.currentLocation;

    /* if (
      this.$store.state.taxonomies[this.taxonomy] &&
      this.$store.state.taxonomies[this.taxonomy].length === 0
    ) {
      this.$store.dispatch("taxonomies/fetchTerms", { taxonomy: this.taxonomy }).then(results => {
        let term = this.$store.getters["taxonomies/getTermBySlug"](this.taxonomy, this.slug)
        this.$store.dispat
      })
    } else {
      let term = this.$store.getters["taxonomies/getTermBySlug"](this.taxonomy, this.slug)
    } */
    this.$store.dispatch("taxonomies/fetchTermContent", {
      taxonomy: this.taxonomy,
      slug: this.slug,
    })

    this.location =
      this.taxonomy == "locations" ? this.slug : this.$store.state.currentLocation || "all"
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
      this.location = this.taxonomy == "locations" ? this.slug : null
      this.page = 1
    },
  },
  props: {
    taxonomy: {
      type: String,
      required: true,
    },

    slug: {
      default: "any",
      required: true,
      type: String,
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
