<template>
  <div>
    <card class="collection-item mb-3" content-type="collection" v-if="isFeatured">
      <template slot="copy">
        <div class="d-flex">
          <div class="collection-item__cover col-3 pl-0">
            <img :src="item.featured_image" alt="" />
          </div>

          <div class="col-9 mt-0 pl-0 pr-0">
            <heading class="h2 mt-0 text--serif" :level="headingLevel" v-html="item.title.rendered">
            </heading>

            <heading class="h4 mt-0" :level="headingLevel" v-html="showcaseCreators(item)">
            </heading>

            <p class="text--large" v-html="item.acf.abstract"></p>
            <a
              class="button button--large button--pink"
              :href="`https://www.nccardinal.org/eg/opac/record/${item.acf.record_identifier}`"
            >
              Click
            </a>
          </div>
        </div>
      </template>
    </card>

    <card
      class="collection-item mb-3"
      content-type="collection"
      :heading="item.title.rendered"
      :heading-level="headingLevel"
      :subheading="showcaseCreators(item)"
      :subheading-class="subheadingClass"
      :subheading-level="subheadingLevel"
      v-else
    >
      <template slot="copy">
        <div class="d-flex">
          <div class="collection-item__cover col-4 pl-0">
            <img :src="item.featured_image" alt="" />
          </div>

          <div class="col-8 mt-0 pl-0 pr-0">
            <p class="mt-0" v-html="item.acf.abstract"></p>
            <a
              class="button button--pink"
              :href="`https://www.nccardinal.org/eg/opac/record/${item.acf.record_identifier}`"
            >
              Click
            </a>
          </div>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import Card from "./Card.vue"
import Heading from "../elements/Heading.vue"

export default {
  name: "CollectionItem",

  component: {
    Card,
    Heading,
  },

  computed: {
    isFeatured() {
      return this.variant === "feature"
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
      required: true,
      type: Object,
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
