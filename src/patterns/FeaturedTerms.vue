<template>
  <section class="d-md-flex p-4">
    <div class="col-md-8">
      <div class="d-md-flex flex-md-wrap">
        <template v-for="item in featuredObjects">
          <div class="mb-4 col-md-6 d-flex align-items-stretch" :key="item.id + 'featured'">
            <card
              v-if="!collection"
              badge-label=" "
              class="card--background-white flex-grow-1"
              :content-type="getType(item.taxonomy)"
              :copy="item.description"
              :explainer="`Featured ` + getType(item.taxonomy)"
              :heading="item.name"
              style="min-height: 197px;"
              ><!--:type="featuredObjects && featuredObjects.length > 2 ? 'default' : 'deck'"-->
              <template slot="action">
                <vue-link class="button button--orange" :to="getPath(item.taxonomy, item.slug)"
                  >More</vue-link
                >
              </template>
            </card>
            <collection-item
              class="card background--white flex-fill"
              v-if="collection"
              :item="item"
              headingLevel="h4"
              :image="getImage(item)"
              :title="item.name"
              variant="feature"
            >
            </collection-item>
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
import CollectionItem from "../patterns/CollectionItem.vue"

export default {
  name: "FeaturedTerms",
  components: {
    CallToAction,
    Card,
    VueLink,
    CollectionItem,
  },
  created() {
    if (this.$route.path.includes("collection")) {
      this.collection = true
    }
  },
  updated() {
    if (this.$route.path.includes("collection")) {
      this.collection = true
    }
  },
  data() {
    return {
      collection: false,
    }
  },
  methods: {
    getPath(taxonomy, slug) {
      const collections = ["genres", "audience", "featured-collections"]
      return collections.includes(taxonomy)
        ? `/collection/${taxonomy}/${slug}`
        : taxonomy.slice(-1) == "s"
        ? `/${taxonomy}/${slug}`
        : `/${taxonomy}s/${slug}`
    },
    getType(type) {
      return type.slice(-1) == "s" ? type.substring(0, type.length - 1) : type
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
<style lang="scss">
.card__link {
  &.link {
    &:focus,
    &:hover {
      box-shadow: $box-shadow-small;
    }

    transition: all 0.2s ease-out;
  }
}
</style>
