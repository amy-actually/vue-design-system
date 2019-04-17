<template>
  <section class="d-md-flex p-4" v-if="!filter">
    <div class="col-md-8">
      <div class="d-md-flex flex-md-wrap">
        <template v-for="item in featuredObjects">
          <div class="mb-4 col-md-6" :key="item.id">
            <card
              :badge-label="service.name"
              class="card--background-white"
              :content-type="
                item.taxonomy.slice(-1) == 's'
                  ? item.taxonomy.substring(0, item.taxonomy.length - 1)
                  : item.taxonomy
              "
              :copy="item.description"
              explainer="Featured"
              :heading="item.name"
              heading-class="sr-only"
              :key="item.id"
              style="min-height: 197px;"
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

export default {
  name: "FeaturedTerms",
  components: {
    CallToAction,
    VueLink,
  },
  methods: {
    getPath(taxonomy, slug) {
      const collections = ["genres", "audience", "featured-collections"]
      return collections.includes(taxonomy)
        ? `/collections/${taxonomy}/${slug}`
        : `/${taxonomy}/${slug}`
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
    sidebar: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
