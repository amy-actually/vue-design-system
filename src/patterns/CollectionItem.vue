<template>
  <div>
    <card class="collection-item mb-3" content-type="collection" v-if="isFeatured">
      <template slot="copy">
        <div class="d-flex">
          <div class="collection-item__cover col-3 pl-0">
            <img :src="featuredImage" alt="" />
          </div>

          <div class="col-9 mt-0 pl-0 pr-0">
            <heading class="h2 mt-0 text--serif" :level="headingLevel" v-html="name"> </heading>

            <heading class="h4 mt-0" :level="headingLevel" v-html="author"> </heading>

            <p class="text--large" v-html="excerpt"></p>
            <vue-link class="button button--large button--pink" :to="path">
              {{ action }}
            </vue-link>
          </div>
        </div>
      </template>
    </card>

    <card
      class="collection-item mb-3"
      content-type="collection"
      :heading="name"
      :heading-level="headingLevel"
      :subheading="author"
      :subheading-class="subheadingClass"
      :subheading-level="subheadingLevel"
      :explainer="explainer"
      v-else
    >
      <template slot="copy">
        <div class="d-flex">
          <div class="collection-item__cover col-4 pl-0">
            <img :src="featuredImage" alt="" />
          </div>

          <div class="col-8 mt-0 pl-0 pr-0">
            <p class="mt-0" v-html="excerpt"></p>
            <vue-link class="button button--pink" :to="path">
              {{ action }}
            </vue-link>
          </div>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import Card from "./Card.vue"
import Heading from "../elements/Heading.vue"
import VueLink from "vue-link"

export default {
  name: "CollectionItem",

  component: {
    Card,
    Heading,
    VueLink,
  },

  computed: {
    action() {
      return this.item && this.item.type === "collection-item" ? "More Info" : "More"
    },

    isFeatured() {
      return this.variant === "feature"
    },

    author() {
      return !this.creators && this.item
        ? this.showcaseCreators(this.item)
        : Array.isArray(this.creators) &&
          this.creators.length > 1 &&
          typeof this.creators[0] != "object"
        ? `${this.creators[0]} and others`
        : Array.isArray(this.creators) && this.creators.length > 1 && this.creators[0].name
        ? `${this.creators[0].name} and others`
        : Array.isArray(this.creators) && typeof this.creators[0] != "object"
        ? `${this.creators[0]}`
        : Array.isArray(this.creators) && this.creators[0].name
        ? `${this.creators[0].name}`
        : !Array.isArray(this.creators)
        ? this.creators
        : null
    },

    featuredImage() {
      if (this.item && this.item.featured_image) {
        return this.item.featured_image
      }
      if (this.item && this.item.taxonomy) {
        let item = this.$store.getters["content/getItemByField"](
          "collection",
          this.item.taxonomy,
          this.item.slug
        )

        return item && item.featured_image
          ? item.featured_image
          : this.item.acf && this.item.acf.sample_cover
          ? this.item.acf.sample_cover.sizes.large
          : null
      }
      return null
    },

    name() {
      return this.item && this.item.title && this.item.title.rendered
        ? this.item.title.rendered
        : this.item && this.item.title
        ? this.item.title
        : this.item && this.item.name
        ? this.item.name
        : this.title
        ? this.title
        : ""
    },

    explainer() {
      if (!this.item || (this.item && !this.item.taxonomy)) {
        return null
      }
      let type =
        this.item.taxonomy.slice(-1) == "s"
          ? this.item.taxonomy.substring(0, this.item.taxonomy.length - 1)
          : this.item.taxonomy
      return this.variant === "feature" ? `Featured ${type}` : type
    },

    path() {
      if (this.item && this.item.acf && this.item.acf.url) {
        return this.item.acf.url
      }
      const collections = ["genres", "audience", "featured-collections"]
      return this.item && this.item.taxonomy && collections.includes(taxonomy)
        ? `/collection/${taxonomy}/${slug}`
        : `/${taxonomy}/${slug}`
    },
    excerpt() {
      return this.item && this.item.type === "collection-item"
        ? this.item.acf.abstract
        : this.item && this.item.taxonomy
        ? this.item.description
        : ""
    },
  },

  methods: {
    showcaseCreators(item) {
      const { creators } = item.acf
      if (creators == false) {
        return ""
      }
      const { name: creatorName } = creators.find(creator => creator.name)
      const hasMoreThanOneCreator = creators.length > 1

      return `by ${creatorName} ${hasMoreThanOneCreator ? "and others" : ""}`
    },
  },

  props: {
    headingLevel: {
      required: true,
      type: String,
    },

    subheadingClass: {
      type: String,
    },

    subheadingLevel: {
      default: "h3",
      type: String,
    },

    item: {
      type: Object,
    },
    creators: {
      default: null,
    },

    image: {
      default: null,
    },
    title: {
      default: null,
    },

    variant: {
      type: String,
    },
  },
}
</script>
<docs>
  ```jsx
  const mockData = require('../examples/mockData.js'); 
  <div class="row">
    
    <collection-item class="col col-8 card--background-gray"
      headingLevel="h2"
      subheadingClass="mt-1"
      :item="mockData.books[1]"
      variant="feature"
      />         

    <collection-item class="col col-4 card--background-blue-dark"
      headingLevel="h2"
      subheadingClass="mt-1 text--white"
      :item="mockData.books[0]"
      />   
      </div> 
  ```
</docs>
