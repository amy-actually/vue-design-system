<template>
  <main :class="`channel ${type}`" role="main">
    <slot name="breadcrumb"> </slot>
    <slot name="header"> </slot>

    <featured-terms
      :featuredObjects="featuredTerms"
      :callToAction="callToAction"
      v-if="!filter && showFeatured && showFeatured > 0"
    />

    <section class="background--white d-flex p-4">
      <div class="col-lg-10 m-lg-auto">
        <div class="d-md-flex">
          <div class="col col-md-6 col-lg-4" v-if="sidebar">
            <slot name="sidebar"></slot>
          </div>

          <div :class="sidebar ? 'col col-lg-8' : ''">
            <slot name="content"> </slot>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import FeaturedTerms from "../patterns/FeaturedTerms.vue"
import { mapMutations } from "vuex"

export default {
  name: "Terms",
  components: {
    FeaturedTerms,
  },

  computed: {
    featuredTerms() {
      if (!this.terms) {
        return []
      }
      let matches = this.callToAction ? [this.callToAction.acf.heading] : []
      if (
        this.callToAction &&
        this.callToAction.acf.services &&
        this.callToAction.acf.services.length > 0
      ) {
        matches = [
          ...matches,
          ...this.callToAction.acf.services.map(serv => serv.slug),
          ...this.callToAction.acf.services.map(serv => serv.name),
        ]
      }
      if (
        this.callToAction &&
        this.callToAction.acf.location &&
        this.callToAction.acf.location.length > 0
      ) {
        matches = [...matches, ...this.callToAction.acf.location.map(loc => loc.slug)]
      }
      if (
        this.callToAction &&
        this.callToAction.acf.event_categories &&
        this.callToAction.acf.event_categories.length > 0
      ) {
        matches = [
          ...matches,
          ...this.callToAction.acf.event_categories.map(cat => cat.name),
          ...this.callToAction.acf.event_categories.map(cat => cat.slug),
        ]
      }

      let featured = []

      matches.forEach(match => {
        let m = match.toLowerCase()
        this.terms.forEach(item => {
          if (
            Object.keys(item).some(
              key =>
                (item[key] != null &&
                  item[key]
                    .toString()
                    .toLowerCase()
                    .includes(m)) ||
                Object.keys(item[key]).some(
                  k =>
                    item[key][k] !== null &&
                    item[key][k]
                      .toString()
                      .toLowerCase()
                      .includes(m)
                )
            ) &&
            !featured.find(i => i.id == item.id)
          ) {
            featured.push(item)
          }
        })
      })

      if (featured.length < this.showFeatured) {
        let more = this.terms.filter(term => {
          return featured.find(t => t.id == term.id) ? false : true
        })

        featured = more ? [...featured, ...more] : featured
      }
      featured = featured.splice(0, Number(this.showFeatured))

      return featured
    },
  },

  props: {
    type: {
      type: String,
    },
    /**
     * return this.$store.getters['content/getCtaByCategory'](this.slug, "random")
     */
    terms: {
      type: Array,
    },
    callToAction: {
      type: Object,
    },
    sidebar: {
      default: null,
    },
    filter: {
      default: null,
    },
    showFeatured: {
      default: 6,
    },
  },
}
</script>
