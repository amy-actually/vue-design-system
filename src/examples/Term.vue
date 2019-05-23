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
        :contentFilter="contentTypes.filter(item => item.type !== 'collection')"
        :location-filter="taxonomy !== 'locations' ? true : false"
        :filter="filter"
        @querycontent="filter = $event"
        :library="location"
        @filterlibrary="location = $event"
        @clearcontentfilter="clearFilter()"
        @setactive="active = $event"
      />
    </template>

    <template v-slot:content>
      <filter-results
        :total="Number(total)"
        :filter="filter"
        :location="locationDetails"
        :contentName="active === 'all' ? 'result' : getTypeName()"
        :prefetchTotal="contentTypes.reduce((a, b) => a + Number(b.count), 0)"
      />
      <Showcase
        v-if="active === 'all' && term && collection"
        :collection-link="`/collection/${taxonomy}/${term.slug}`"
        :collection-items="collection"
        heading="Related Collections"
        :collectionLinkLabel="
          `See more of the ${new Intl.NumberFormat().format(
            term.count_by_type['collection-item']
          )} related collection items`
        "
      />
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
        return this.active === "all"
          ? this.$store.getters["content/getAllContentBy"](this.slug)
          : this.$store.getters["content/getContentBy"](this.active, this.slug)
      }
      return this.active === "all"
        ? this.$store.getters["content/getAllContentBy"](this.location, this.slug)
        : this.$store.getters["content/getContentBy"](this.active, this.location, this.slug)
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
      console.log("Content Types")
      for (var type in this.term.count_by_type) {
        let name = getName(type)
        console.log(name)
        if (name && name.name && this.term.count_by_type[type] > 0) {
          types.push({ ...name, count: this.term.count_by_type[type] })
        }
      }

      return types
    },
    collection() {
      let collection =
        this.taxonomy === "locations"
          ? this.$store.getters["content/getContentBy"]("collection", this.slug)
          : this.$store.getters["content/getContentBy"]("collection", this.location, this.slug)
      return collection.slice(0, 10)
    },
  },
  created() {
    console.log("CREATED: " + this.taxonomy)
    this.$root.$on("resetPage", data => {
      this.page = 1
    })

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
      active: "all",
      apiPage: 1,
    }
  },
  methods: {
    clearFilter() {
      this.selectedDate = null
      this.filter = null
      this.location = this.taxonomy == "locations" ? this.slug : null
      this.page = 1
    },
    getTypeName() {
      if (this.active === "all") {
        return "result"
      }
      let content = this.contentTypes.find(item => item.type === this.active)
      let params = {}
      params[this.taxonomy] = this.term.id

      if (content.count > this.contents.length && content.type !== "collection") {
        this.$store.dispatch(`${content.module}/fetchAllContent`, {
          type: content.type,
          params: params,
        })
      }
      return content.name
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
