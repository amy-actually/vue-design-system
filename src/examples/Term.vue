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
        @setactive="active = $event"
      />
      <aside v-if="taxonomy === 'locations' && term.acf.newsletter">
        <div
          class="border p-1 mt-4"
          v-for="newsletter in term.acf.newsletter"
          :key="newsletter.name"
        >
          <h4 v-html="newsletter.name" />
          <div v-html="newsletter.signup_widget"></div>
        </div>
      </aside>
    </template>

    <template v-slot:content>
      <Showcase
        v-if="(!$route.query || $route.query.page < 2) && active == 'all'"
        :collection-items="collection"
        heading=""
      />
      <div
        class="featured--events"
        v-if="(!$route.query || $route.query.page < 2) && events && active == 'all'"
      >
        <event-card
          class="card--background-gray my-2"
          :event="event"
          :key="event.id"
          v-for="event in events"
        />
      </div>
      <filter-results
        :total="Number(total)"
        :filter="filter"
        :location="locationDetails"
        :contentName="active === 'all' ? 'result' : getTypeName()"
        :prefetchTotal="contentTypes.reduce((a, b) => a + Number(b.count), 0)"
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
import Showcase from "../patterns/Showcase.vue"
import EventCard from "../patterns/EventCard.vue"

export default {
  name: "TermExample",

  components: {
    Breadcrumb,
    ChannelHeader,
    Channel,
    ContentSearch,
    ContentStream,
    FilterResults,
    Showcase,
    EventCard,
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
      return this.$store.getters["content/getCollection"](this.taxonomy, this.slug).slice(0, 10)
    },
    events() {
      return this.$store.getters["content/getCollection"](this.taxonomy, this.slug, "events").slice(
        0,
        4
      )
    },
  },
  created() {
    console.log("CREATED: " + this.taxonomy)
    this.$root.$on("resetPage", data => {
      this.page = 1
    })
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
      active: "all",
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
.featured--events {
  @media #{$media-query-large} {
    display: flex;
    flex-flow: row wrap;
    & > a {
      flex: 1 1 48%;
      margin: 1%;
    }
  }
}
</style>
