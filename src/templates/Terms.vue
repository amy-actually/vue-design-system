<template>
  <main :class="`channel ${type}`" role="main">
    <breadcrumb v-if="nav" :current="channelTitle" :ancestors="nav" />
    <channel-header :title="channelTitle" :description="channelDescription" />

    <featured-terms :featuredObjects="featuredTerms" />

    <section class="background--white d-flex p-4">
      <div class="col-lg-10 m-lg-auto">
        <div class="d-md-flex">
          <template v-if="sidebar">
            <div class="col col-md-6 col-lg-4">
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
            </div>
          </template>

          <div :class="sidebar ? 'col col-lg-8' : ''">
            <content-stream
              :key="`${type}-${filter}-${location}`"
              :type="type"
              @totalresults="total = $event"
              :filter="filter"
              :location="location"
              :contents="contents"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import FeaturedTerms from "../patterns/FeaturedTerms.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import ChannelHeader from "../patterns/ChannelHeader.vue"
import ContentSearch from "../patterns/ContentSearch.vue"
import ContentStream from "../patterns/ContentStream.vue"
import FilterResults from "../elements/FilterResults.vue"

export default {
  name: "Terms",
  components: {
    FeaturedTerms,
    Breadcrumb,
    ChannelHeader,
    ContentSearch,
    ContentStream,
    FilterResults,
  },
  computed: {
    primaryCTA() {
      return this.$store.getters["content/getCtaByCategory"]("any", "random")
    },
    terms() {
      return this.state.taxonomies[type]
    },
    featuredTerms() {
      //let search = this.callToAction.acf[type] ? String(this.callToAction.acf[type]) : null

      let featured = this.callToAction.acf[type]
        ? this.terms.filter(item =>
            Object.keys(item).some(
              key =>
                (item[key] != null &&
                  this.callToAction.acf[type].some(value => {
                    item[key]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
                  })) ||
                Object.keys(item[key]).some(
                  k =>
                    item[key][k] !== null &&
                    this.callToAction.acf[type].some(value => {
                      item[key][k]
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                    })
                )
            )
          )
        : this.terms.splice(0, 6)

      if (featured.length < 6 && featured.length > 0) {
        let more = this.terms.filter(term => {
          return featured.find(t => t.id == term.id) ? false : true
        })

        featured = more ? [...featured, ...more] : featured
        featured = featured.splice(0, 6)
      }

      return featured
    },
  },

  props: {
    taxonomy: {
      type: String,
    },
    sidebar: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
