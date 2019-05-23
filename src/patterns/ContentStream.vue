<template>
  <section class="content" v-if="content">
    <template v-for="item in content">
      <template v-if="!item.type && item.taxonomy">
        <card
          v-if="item.taxonomy == 'services'"
          class="card--background-gray mb-4"
          content-type="service"
          :copy="item.description"
          :heading="item.name"
          :key="item.id"
          style="min-height: 197px;"
        >
          <template slot="action">
            <vue-link class="button button--orange" :to="`services/${item.slug}`">
              {{ item.acf.button_text ? item.acf.button_text : "Read more" }}
            </vue-link>
          </template>
        </card>
        <location-card v-else-if="item.taxonomy == 'location'" :location="item" :key="item.id" />
        <card
          v-else
          :badge-label="getContentType(item.taxonomy)"
          class="card--background-white"
          :content-type="getContentType(item.taxonomy)"
          :copy="item.description"
          :heading="item.name"
          :key="item.id"
          style="min-height: 197px;"
          :image="getImage(item)"
          :type="getType(item.taxonomy)"
        >
          <template slot="action">
            <vue-link class="button button--orange" :to="getPath(item.taxonomy, item.slug)"
              >More</vue-link
            >
          </template>
        </card>
      </template>

      <template v-else-if="item.type == 'event'">
        <event-card class="card--background-gray my-2" :event="item" :key="item.id" />
      </template>

      <template v-else-if="item.type == 'post' && item.site_ID">
        <card
          :key="item.id"
          class="card--background-white text--dark border my-2"
          content-type="blog"
          :explainer="item.author.nice_name"
          :sub-explainer="item.date | moment('dddd, MMMM Do')"
          :heading="item.title"
        >
          <div slot="copy">
            <div v-html="item.excerpt"></div>
          </div>

          <template slot="action">
            <vue-link class="button button--aqua" :to="`blogs/${item.slug}`">
              Info
            </vue-link>
          </template>
        </card>
      </template>

      <template v-else-if="item.type == 'page' || (item.type == 'post' && !item.site_ID)">
        <card
          :badge-label="type == 'pages' || item.type == 'page' ? 'Information' : 'Article'"
          :heading="item.title && item.title.rendered ? item.title.rendered : item.title"
          :class="
            type == 'pages' || item.type == 'page'
              ? 'card--background-white text--dark border'
              : 'card--background-gray'
          "
          content-type="blog"
          :key="item.id"
          class="my-2"
        >
          <div slot="copy">
            {{
              item.content && item.content.rendered
                ? getExcerpt(item.content.rendered)
                : getExcerpt(item.content)
            }}
          </div>

          <template slot="action">
            <vue-link
              class="button"
              :class="type == 'pages' || item.type == 'page' ? 'button--aqua' : 'button--orange'"
              :to="`${item.type}s/${item.slug}`"
              >More</vue-link
            >
          </template>
        </card>
      </template>
      <template v-else-if="item.type == 'collection-item'">
        <collection-item
          :item="item"
          heading-level="h3"
          :key="item.id"
          subheading-class="mt-1"
          subheading-level="h4"
        />
      </template>

      <!-- pages card -->
      <template v-else>
        <card
          :badge-label="
            item.type && item.type == 'resources'
              ? 'Resource'
              : item.type && item.type === 'alert' && item.acf.notice_type === 'announcement'
              ? item.acf.notice_type
              : item.type && item.type === 'alert' && item.acf.notice_type !== 'announcement'
              ? item.acf.notice_type + ' closing'
              : ''
          "
          :sub-explainer="
            item.type ? item.type.toUpperCase() : item.taxonomy ? item.taxonomy.toUpperCase() : ''
          "
          :heading="
            item.title && item.title.rendered
              ? item.title.rendered
              : item.title
              ? item.title
              : item.acf.name
          "
          :class="[
            { 'card--background-blue-dark text--white my-2': item.type === 'resources' },
            { 'border my-2': item.type === 'alert' },
          ]"
          :content-type="item.type && item.type === 'alert' ? 'notice' : 'resource'"
          :key="item.id"
        >
          <div slot="copy" class="mt-2">
            {{
              item.content && item.content.rendered
                ? getExcerpt(item.content.rendered)
                : item.content
                ? getExcerpt(item.content)
                : item.description
                ? getExcerpt(item.description)
                : getExcerpt(item.acf.description)
            }}
          </div>

          <template slot="action">
            <router-link
              class="button button--teal"
              :to="`../resources/${item.slug}`"
              v-if="item.type === 'resources'"
              >More</router-link
            >
            <router-link
              class="button button--pink-dark"
              :to="`../notices/${item.slug}`"
              v-if="item.type === 'alert'"
              >More</router-link
            >
          </template>
        </card>
      </template>
    </template>

    <pagination
      v-if="total > 0"
      :key="total + 'pp'"
      :total="Math.ceil(total / perPage)"
      v-model="page"
      v-on:resetpage="page = 1"
    >
    </pagination>
  </section>
</template>
<script>
import VueLink from "vue-link"
import Card from "../patterns/Card.vue"
import EventCard from "../patterns/EventCard.vue"
import LocationCard from "../patterns/LocationCard.vue"
import CollectionItem from "../patterns/CollectionItem.vue"
import Pagination from "../elements/Pagination.vue"
import { chunk } from "lodash"
import moment from "moment"

export default {
  name: "Stream",
  components: {
    Card,
    EventCard,
    CollectionItem,
    Pagination,
    VueLink,
    LocationCard,
  },
  computed: {
    content() {
      let content = this.filterContent(this.filter, this.selectedDate, this.location)
      this.resultTotal = content && content.length > 0 ? content.length : "0"
      const paged = chunk(content, this.perPage)
      return paged[this.page - 1]
    },
    total() {
      return this.apiTotal ? this.apiTotal : this.resultTotal
    },
    taxonomies() {
      let taxo = this.$state.taxonomies.taxonomies.map(tax => tax.slug)
      console.log(taxo)
      return this.$state.taxonomies.taxonomies.map(tax => tax.slug)
    },
  },
  created() {
    if (this.$route.query && this.$route.query.page) {
      this.page = Number(this.$route.query.page)
    }
    this.$root.$on("resetpage", () => {
      this.$router.push({
        query: {
          page: 1,
        },
      })
      this.page = 1
    })
  },
  data() {
    return {
      page: 1,
      resultTotal: 0,
    }
  },
  methods: {
    getPath(taxonomy, slug) {
      const collections = ["genres", "audience", "featured-collections"]
      return collections.includes(taxonomy)
        ? `/collection/${taxonomy}/${slug}`
        : `/${taxonomy}/${slug}`
    },
    getType(type) {
      const collections = ["genres", "audience", "featured-collections"]
      return collections.includes(type) ? "collection" : "default"
    },
    getContentType(type) {
      return type.slice(-1) == "s" ? type.substring(0, type.length - 1) : type
    },
    getImage(term) {
      const collections = ["genres", "audience", "featured-collections"]
      if (term.taxonomy && collections.includes(term.taxonomy)) {
        let item = this.$store.getters["content/getItemByField"](
          "collection",
          term.taxonomy,
          term.slug
        )

        return item && item.featured_image
          ? item.featured_image
          : term.acf && term.acf.sample_cover
          ? term.acf.sample_cover.sizes.large
          : null
      }
      return null
    },
    filterContent(filter, datestring, library) {
      let content = !datestring
        ? this.contents
        : this.contents.filter(
            item =>
              (item.type &&
                item.type == "event" &&
                `${item.start_date_details.year}-${item.start_date_details.month}-${
                  item.start_date_details.day
                }` >= datestring) ||
              (item.type &&
                item.type != "event" &&
                (item.modified.substring(0, 7) == this.selectedDate ||
                  item.date.substring(0, 7) == this.selectedDate.substring(0, 7)))
          )

      //Filter Events by library
      content =
        !library || library == "all"
          ? content
          : content.filter(
              item =>
                item.acf &&
                ((item.acf.location &&
                  item.acf.location.some(location => location.slug === library)) ||
                  (item.acf.affected_location &&
                    item.acf.affected_location.some(
                      location => location === library || location === "all-locations"
                    )))
            )

      //Filter by terms
      if (this.termFilter) {
        for (const [taxonomy, value] of Object.entries(this.termFilter)) {
          if (taxonomy && value && value.length > 0) {
            content = content.filter(
              item => item[taxonomy] && item[taxonomy].some(val => value.includes(val))
            )
          }
        }
      }

      // Filter events by Query String
      let value = filter ? filter.toLowerCase() : null
      content = !value
        ? content
        : content.filter(item =>
            Object.keys(item).some(
              key =>
                (item[key] != null &&
                  item[key]
                    .toString()
                    .toLowerCase()
                    .includes(value)) ||
                Object.keys(item[key]).some(
                  k =>
                    item[key][k] !== null &&
                    item[key][k]
                      .toString()
                      .toLowerCase()
                      .includes(value)
                )
            )
          )

      //this.resultTotal = content.length
      return content
    },
    getExcerpt(excerpt) {
      if (!excerpt || excerpt.length === 0) {
        return ""
      }
      const excerptContainer = document.createElement("div")
      excerptContainer.innerHTML = excerpt
      let content = excerptContainer.value

      return excerptContainer.textContent.length > 200
        ? `${excerptContainer.textContent.substring(0, 200)} ...`
        : excerptContainer.textContent
    },
  },
  watch: {
    /**
     * Add the page to the route query params
     */
    page() {
      this.$router.push({
        query: {
          page: this.page,
        },
      })

      if (this.apiTotal && this.page >= this.resultTotal / this.perPage - 5) {
        this.$root.$emit("loadmore")
      }
    },
    resultTotal() {
      this.$emit("totalresults", this.resultTotal)
    },
  },
  props: {
    contents: {
      type: Array,
    },
    type: {
      type: String,
      default: "mixed",
    },
    perPage: {
      type: Number,
      default: 5,
    },
    filter: {
      type: String,
    },
    selectedDate: {
      type: String,
    },
    location: {
      type: String,
    },
    termFilter: {
      type: Object,
    },
    apiTotal: {
      type: Number,
    },
  },
}
</script>

<style lang="scss"></style>
