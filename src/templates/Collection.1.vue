<template>
  <main class="channel" role="main" :key="$route.params.slug">
    <template v-for="(call, index) in callsToAction">
      <call-to-action
        v-if="index === 0"
        :key="call.id"
        :action="call.acf.action"
        class="p-3 call-to-action--large"
        :copy="call.acf.copy"
        :image="call.acf.image"
        :heading="call.acf.heading"
      ></call-to-action>
    </template>

    <header class="background--white d-flex p-4">
      <div class="col-md-10 m-auto">
        <div class="col-md-8">
          <heading
            class="channel__title text--dark text--serif"
            level="h1"
            v-html="!term && !collectionTitle ? 'Newly Added' : !term ? collectionTitle : term.name"
          >
          </heading>

          <p
            class="channel__description"
            v-html="
              !term && !collectionDescription
                ? 'The Freshest Items'
                : !term
                ? collectionDescription
                : term.description
            "
          ></p>
        </div>
      </div>
    </header>

    <section class="background--white library__section p-3">
      <div class="col-lg-10 m-lg-auto">
        <div class="d-md-flex">
          <div class="col-md-4">
            <content-search
              :filter="filter"
              @querycontent="
                filter = $event
                page = 1
              "
              :library="location"
              @filterlibrary="location = $event"
              @clearcontentfilter="clearFilter()"
              contentName="collection item"
              :selected="selected"
              @selectedterms="addSelected($event)"
            />
          </div>

          <div class="col col-lg-8">
            <filter-results
              :total="total"
              :filter="filter"
              :location="location"
              :terms="selected"
              contentName="collection item"
              :prefetchTotal="Number(apiTotal)"
            />
            <template>
              <content-stream
                v-if="collection"
                :key="streamkey"
                :contents="collection"
                type="collection"
                @totalresults="total = $event"
                :filter="filter"
                :location="location"
                :term-filter="selected"
                :apiTotal="Number(apiTotal)"
              />
            </template>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue"
import ContentSearch from "../patterns/ContentSearch.vue"
import ContentStream from "../patterns/ContentStream.vue"
import Heading from "../elements/Heading.vue"
import FilterResults from "../elements/FilterResults.vue"

export default {
  name: "Collection",

  components: {
    CallToAction,
    ContentSearch,
    ContentStream,
    Heading,
    FilterResults,
  },

  computed: {
    callsToAction() {
      //return this.$store.state.callsToAction;
      return this.$store.getters["content/getCtaByCategory"](this.slug, "random")
      /**
       * NEED to get by featured collection
       */
    },
    term() {
      if (this.network === "new") {
        return null
      }
      const term = this.$store.getters["taxonomies/getTermBySlug"](this.network, this.slug)
      this.apiTotal = term && term.count_by_type ? term.count_by_type["collection-item"] : 0
      return term
    },
    collection() {
      return this.$store.getters["content/getCollection"](this.network, this.slug)
    },
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
      counts: {
        collection: 0,
      },
      chosen: "",
      streamkey: "",
    }
  },
  created() {
    this.fetchContent()
    /* this.$store.dispatch('taxonomies/fetchCollectionTerms').then(results => {
        const term = this.$store.getters["taxonomies/getTermBySlug"](this.network, this.slug);
        
        if(!this.network || this.network == 'new'){
          this.$store.dispatch('content/fetchContent', {type: 'collection', perPage: 100, pg: 1})
          this.$store.dispatch('content/fetchContent', {type: 'collection', perPage: 100, pg: 2})
        }
        if(this.network && this.network !== 'new' && this.slug !== 'any' && this.term){
          let params= {};
          params[this.network] = term.id
          if(this.selected.genres.length > 0){
      
            //params.genres = 
          }
          //this.$store.dispatch('content/fetchAllContent', {type: 'collection', params:params})
          this.$store.dispatch('content/fetchContent', {type: 'collection', perPage: 100, pg: this.apiPage, params: params})
        }
      }
      ) */
  },
  mounted() {
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
      this.apiPage++
      this.fetchContent()
    })
  },
  methods: {
    addSelected(selected) {
      this.streamkey = selected.terms.join("")
      this.selected[selected.taxonomy] = selected.terms
    },

    async fetchContent() {
      this.$store.dispatch("taxonomies/fetchCollectionTerms").then(results => {
        const term = this.term
          ? this.term
          : this.network !== "new"
          ? this.$store.getters["taxonomies/getTermBySlug"](this.network, this.slug)
          : null

        if (!this.network || this.network == "new") {
          this.$store.dispatch("content/fetchContent", { type: "collection", perPage: 100, pg: 1 })
          this.$store.dispatch("content/fetchContent", { type: "collection", perPage: 100, pg: 2 })
        }
        if (this.network && this.network !== "new" && this.slug !== "any" && this.term) {
          let params = {}
          params[this.network] = term.id
          //this.$store.dispatch('content/fetchAllContent', {type: 'collection', params:params})
          this.$store
            .dispatch("content/fetchContent", {
              type: "collection",
              perPage: 100,
              pg: this.apiPage,
              params: params,
            })
            .then(results => {
              console.log(results)
            })
        }
      })
    },

    clearFilter() {
      this.selected.genres = []
      this.filter = null
      this.location = ""
      this.selected.audience = []
      this.streamkey = "all"
    },
  },
  props: {
    collectionDescription: {
      type: String,
    },

    collectionTitle: {
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
    library: {
      type: String,
    },
  },
  beforeMount() {
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
  watch: {
    filter() {
      this.streamkey = this.filter
      this.$root.$emit("resetpage")
    },
    location() {
      this.streamkey = this.library
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
