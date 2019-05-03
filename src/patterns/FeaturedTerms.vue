<template>
  <section class="d-md-flex p-4">
    <div class="col-md-8">
      <div class="d-md-flex flex-md-wrap">
        <template v-for="item in featuredObjects">
          <div class="mb-4 col-md-6" :key="item.id + 'featured'">
            <card
              v-if="!collection"
              :badge-label="item.name"
              class="card--background-white"
              :content-type="getType(item.taxonomy)"
              :copy="item.description"
              :explainer="`Featured ` + getType(item.taxonomy)"
              :heading="item.name"
              heading-class="sr-only"
              style="min-height: 197px;"
              ><!--:type="featuredObjects && featuredObjects.length > 2 ? 'default' : 'deck'"-->
              <template slot="action">
                <vue-link class="button button--orange" :to="getPath(item.taxonomy, item.slug)"
                  >More</vue-link
                >
              </template>
            </card>
            <vue-link
              class="card__link link link--undecorated"
              v-if="collection"
              :to="`${$route.path}/${item.slug}`"
            >
              <!-- <term-card
                :image="getImage(item)"
                :title="item.name"
                :content="item.description"
                :explainer="`Featured ` + getType(item.taxonomy)"
              /> -->
              <card
                class="card--background-white"
                content-container-class="p4"
                :heading="item.name"
                heading-class="h3 text--bold"
                heading-level="h3"
                :explainer="`Featured ` + getType(item.taxonomy)"
                subheading-class="h5 mt-1"
                subheading-level="h4"
                :image="getImage(item)"
                type="collection"
                :contentType="getType(item.taxonomy)"
              >
              </card>
            </vue-link>
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
import TermCard from "../patterns/TermCard.vue"

export default {
  name: "FeaturedTerms",
  components: {
    CallToAction,
    Card,
    VueLink,
    TermCard,
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
        : `/${taxonomy}/${slug}`
    },
    getType(type) {
      return type.slice(-1) == "s" ? type.substring(0, type.length - 1) : type
    },
    getImage(term) {
      if (this.featuredObjects && this.featuredObjects.length > 2) {
        return null
      }
      if (this.collection && term.taxonomy) {
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
