<template>
  <section class="d-md-flex p-4">
    <div class="col-md-8">
      <div class="d-md-flex flex-md-wrap">
        <template v-for="item in featuredObjects">
          <div class="mb-4 col-md-6" :key="item.id + 'featured'">
            <card
              :badge-label="getType(item.taxonomy)"
              class="card--background-white"
              :content-type="getType(item.taxonomy)"
              :copy="item.description"
              explainer="Featured"
              :heading="item.name"
              heading-class="sr-only"
              style="min-height: 197px;"
              :type="featuredObjects && featuredObjects.length > 2 ? 'default' : 'deck'"
              :image="getImage(item)"
            >
              <template slot="action">
                <vue-link class="button button--orange" :to="getPath(item.taxonomy, item.slug)"
                  >More</vue-link
                >
              </template>
            </card>
          </div>
        </template>
      </div>
    </div>

    <div class="card background--gray d-flex">
      <call-to-action
        v-if="callToAction"
        :action="callToAction.acf.action"
        class="background--blue-alternate"
        :copy="callToAction.acf.copy"
        :image="callToAction.acf.image"
        :heading="callToAction.acf.heading"
        :link="callToAction.acf.link"
      />
    </div>
  </section>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue"
import VueLink from "vue-link"
import Card from "../patterns/Card.vue"

export default {
  name: "FeaturedTerms",
  components: {
    CallToAction,
    Card,
    VueLink,
  },
  methods: {
    getPath(taxonomy, slug) {
      const collections = ["genres", "audience", "featured-collections"]
      return collections.includes(taxonomy)
        ? `/collection/${taxonomy}/${slug}`
        : `/${taxonomy}/${slug}`
    },
    getType(type) {
      return type.slice(-1) == "s" ? type.substring(0, type.length - 1) : type
    },
    getImage(term) {
      if (this.featuredObjects && this.featuredObjects.length > 2) {
        return null
      }
      if (this.$route.path.includes("collection") && term.taxonomy) {
        let item = this.$store.getters["content/getItemByField"](
          "collection",
          term.taxonomy,
          term.slug
        )
        console.log("Looking for image...")
        console.log(item)
        return item && item.featured_image
          ? item.featured_image
          : term.acf && term.acf.sample_cover
          ? term.acf.sample_cover.sizes.large
          : null
      }
    },
  },
  props: {
    featuredObjects: {
      type: Array,
    },
    /**
     * return this.$store.getters['content/getCtaByCategory'](this.slug, "random")
     */
    callToAction: {
      type: Object,
    },
  },
}
</script>
