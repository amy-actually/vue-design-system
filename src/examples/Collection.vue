<template>
  <channel :callToAction="primaryCTA" :type="network">
    <template v-slot:breadcrumb v-if="nav">
      <breadcrumb :current="!term ? channelTitle : term.name" :ancestors="nav" />
    </template>

    <template v-slot:header>
      <channel-header
        :title="!term ? channelTitle : term.name"
        :description="!term ? channelDescription : term.description"
      />
    </template>

    <template v-slot:sidebar>
      <content-search
        contentName="collection item"
        :date-filter="false"
        :location-filter="true"
        :filter="filter"
        :library="location"
        :selected="selected"
        @clearcontentfilter="clearFilter()"
        @filterlibrary="location = $event"
        @selectedterms="addSelected($event)"
        @querycontent="filter = $event"
      />
    </template>

    <template v-slot:content class="align-self-stretch" style="width:100%">
      <filter-results
        v-if="loaded"
        :total="total"
        :filter="filter"
        :location="locationDetails"
        :tags="tags"
        contentName="collection item"
        :prefetchTotal="Number(apiTotal)"
      />
      <!--v-if="!loaded && total==0"-->
      <spinner :dotSize="Number(20)" v-if="!loaded && total == 0" />

      <content-stream
        :key="`${network}-${slug}`"
        type="collection"
        :contents="contents"
        :filter="filter"
        :location="location"
        :term-filter="selected"
        :apiTotal="Number(apiTotal)"
        @totalresults="calcTotal($event)"
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
import Spinner from "../elements/Spinner.vue"

export default {
  name: "CollectionExample",

  components: {
    Breadcrumb,
    ChannelHeader,
    Channel,
    ContentSearch,
    ContentStream,
    FilterResults,
    Spinner,
  },

  computed: {
    primaryCTA() {
      //return this.$store.state.callsToAction;
      //return this.$store.getters["content/getCtaByCategory"](this.slug, "random")
      /**
       * NEED to get by featured collection
       */
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
    locationDetails() {
      return this.location && this.location !== "all"
        ? this.$store.state.taxonomies.locations.find(location => location.slug === this.location)
        : {}
    },
    term() {
      if (!this.network || this.network === "new") {
        return null
      }
      const term = this.$store.getters["taxonomies/getTermBySlug"](this.network, this.slug)
      //this.apiTotal = term && term.count_by_type ? term.count_by_type["collection-item"] : 0
      return term
    },
    contents() {
      return this.$store.getters["content/getCollection"](this.network, this.slug)
    },
    tags() {
      if (!this.selected || this.selected == 0) {
        return null
      }
      let terms = []
      for (const [taxonomy, value] of Object.entries(this.selected)) {
        value.forEach(val => {
          const t = this.getTerm(val, taxonomy)
          if (!value.includes(t.parent)) {
            terms.push(t)
          }
        })
      }
      return terms
    },
  },
  created() {
    if (this.network && this.selected[this.network]) {
      delete this.selected[this.network]
    }
    this.fetchContent()

    console.log("CREATED: " + this.network)
    this.$root.$on("resetPage", data => {
      this.page = 1
    })
    this.$root.$on("inputData", data => {
      this.q = data
    })
    this.$root.$on("input", data => {
      this.page = data
    })
    this.$root.$on("resetPage", data => {
      this.page = 1
    })
    this.$root.$on("loadmore", data => {
      if (this.network !== "new") {
        this.apiPage++
        this.fetchContent()
      }
    })

    if (this.$route.query.search) {
      this.filter = this.$route.query.search
    }
    if (this.$route.query.level) {
      let level = this.$store.getters["taxonomies/getTermBySlug"](
        "audience",
        this.$route.query.level
      )
      this.selected.audience.push(level.id)
    }
    if (this.$route.query.location) {
      this.location = this.$route.query.location
    }
    if (this.$route.query.genre) {
      let genre = this.$store.getters["taxonomies/getTermBySlug"]("genres", this.$route.query.genre)
      this.selected.genres.push(genre.id)
    }
  },
  data() {
    return {
      filter: null,
      location: this.library ? this.library : "",
      total: 0,
      apiTotal: 0,
      apiPage: 1,
      page: 1,
      selected: {
        genres: [],
        audience: [],
      },
      loaded: false,
    }
  },
  methods: {
    addSelected(selected) {
      this.selected[selected.taxonomy] = selected.terms
    },

    calcTotal(total) {
      this.total = total
      if (
        this.network !== "new" &&
        (this.filter ||
          (this.location && this.location !== "all") ||
          (this.selected.genres && this.selected.genres.length > 0) ||
          (this.selected.audience && this.selected.audience.length > 0)) &&
        total < 100
      ) {
        this.apiPage = 1
        this.fetchContent()
      }
    },

    async fetchContent() {
      this.$store.dispatch("taxonomies/fetchCollectionTerms").then(results => {
        this.loaded = false
        const term = this.term
          ? this.term
          : this.network !== "new"
          ? this.$store.getters["taxonomies/getTermBySlug"](this.network, this.slug)
          : null

        if (!this.network || this.network == "new") {
          this.$store.dispatch("content/fetchContent", { type: "collection", perPage: 100, pg: 1 })
          this.$store
            .dispatch("content/fetchContent", { type: "collection", perPage: 100, pg: 2 })
            .then(results => {
              this.loaded = true
            })
        }
        if (this.network && this.network !== "new" && this.slug !== "any" && this.term) {
          let params = {}
          params[this.network] = term.id
          if (this.filter) {
            params.search = this.filter
          }
          if (this.location && this.location !== "all") {
            const loc = this.$store.state.taxonomies.locations.find(
              location => location.slug === this.location
            )
            params.locations = loc.id
          }
          if (this.selected.genres && this.selected.genres.length > 0) {
            params.genres = this.selected.genres.join()
          }
          if (this.selected.audience && this.selected.audience.length > 0) {
            params.audience = this.selected.audience.join()
          }
          this.$store
            .dispatch("content/fetchContent", {
              type: "collection",
              perPage: 100,
              pg: this.apiPage,
              params: params,
            })
            .then(results => {
              this.apiTotal = results
              this.loaded = true
            })
        }
      })
    },

    clearFilter() {
      if (this.selected.genres) {
        this.selected.genres = []
      }
      if (this.selected.audience) {
        this.selected.audience = []
      }
      this.apiTotal =
        this.term && this.term.count_by_type ? this.term.count_by_type["collection-item"] : 0
      this.filter = null
      this.location = ""
    },
    getTerm(tid, tax) {
      // RECONFIG THIS GETTER
      return this.$store.getters["taxonomies/getTermById"](tax, tid)
    },
  },
  props: {
    channelDescription: {
      type: String,
    },

    channelTitle: {
      type: String,
    },

    network: {
      type: String,
      default: "new",
    },

    slug: {
      required: true,
      type: String,
    },

    nav: {
      type: Array,
    },
  },
  watch: {
    filter() {
      this.$root.$emit("resetpage")
    },
    location() {
      this.$root.$emit("resetpage")
    },
    /*     $route(){
      
      let page = this.$route.query && this.$route.query.page ? this.$route.query.page : 1
      console.log("pg: " + page + " apiPage: " + this.apiPage);
      if(page * 5 >= ((this.apiPage * 100) - 15)){
        console.log("GETTIN MORE")
        this.apiPage++;
        this.fetchContent();
      }
    } */
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
.collection__sample__cover {
  max-width: 125px;
  max-height: 150px;
}
</style>
