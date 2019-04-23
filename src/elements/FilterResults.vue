<template>
  <component :is="wrapper">
    <div
      class="alert alert--primary mb-3 pl-4 pr-4"
      v-if="filter || location || total || (tags && tags.length > 0)"
    >
      <heading
        v-if="filter || location || (tags && tags.length > 0)"
        class="h3 text--dark text--serif"
        level="h2"
        >Search</heading
      >
      <p
        class="channel__subtitle mt-1 text--dark text--sans"
        v-if="filter || location || (tags && tags.length > 0)"
      >
        Here is everything we can find that matches your search
        {{ filter ? "for" : "" }} <mark class="mark">{{ filter }}</mark>
        <template v-if="location && location.name">
          <span v-if="contentName === 'event'">happening</span> at
          <vue-link class="link" :to="`/locations/${location.slug}`">{{ location.name }}</vue-link>
        </template>
        {{ tags && tags.length > 0 ? "tagged:" : "." }}
        <template v-for="tag in tags">
          <span
            :key="tag.id"
            class="badge filter-results__tag"
            :class="
              tag.taxonomy == 'audience'
                ? 'badge-primary filter-results__tag--audience'
                : tag.taxonomy == 'genres'
                ? 'badge-info filter-results__tag--genre'
                : 'badge-secondary'
            "
            v-html="tag.name"
          ></span>
        </template>
      </p>

      <p class="channel__subtitle text--dark text--large" v-if="selectedDate">
        Here are all the events that match your search for "{{ selectedDate }}".
      </p>
      <div v-if="total > 0" class="results_total text--dark text--sans m-2">
        <p v-if="!prefetchTotal">
          {{
            contentName == "result"
              ? total
              : total == 1
              ? `1 ${contentName}`
              : total + ` ${contentName}s`
          }}
          found.
        </p>
        <p v-else>
          currently showing
          {{
            contentName == "result"
              ? total
              : total == 1
              ? `1 ${contentName}`
              : total + ` ${contentName}s`
          }}
          of {{ prefetchTotal }} total results.
        </p>
      </div>
    </div>
    <p v-if="total == 0">Sorry, we couldn't find any {{ contentName }}s.</p>
  </component>
</template>
<script>
import VueLink from "vue-link"

export default {
  name: "FilterResults",
  status: "prototype",
  release: "1.0.0",
  components: {
    VueLink,
  },

  props: {
    /**
     * Value for DateFilter
     */
    selectedDate: {
      type: String,
    },
    /**
     * Value for total of results
     */
    total: {
      type: Number,
    },
    /**
     * Value for the location filter
     */
    location: {
      type: Object,
    },
    /**
     * Value for the search/query filter
     */
    filter: {
      type: String,
    },
    /**
     * The wrapping element
     */
    wrapper: {
      type: String,
      default: "div",
    },
    /**
     * The name of the content/"results" to display if specific
     */
    contentName: {
      type: String,
      default: "result",
    },
    /**
     * The value of the term filter
     */
    tags: {
      type: Array,
    },
    /**
     * The value of all results available (from the api) if not all are yet loaded in store
     */
    prefetchTotal: {
      type: Number,
    },
  },
}
</script>
<style lang="scss">
@import "~bootstrap/scss/_badge";
.results_total {
  text-align: right;
}
.filter-results__tag {
  margin: 0 2px;
  &--genre {
    background-color: $color-pink !important;
  }
  &--audience {
    background-color: $color-orange !important;
  }
}
</style>
<docs>
  ```jsx
    const mockData = require('../examples/mockData.js'); 
  <div>
<FilterResults content-name="collection item"
                filter="Suess"
                :location="mockData.location"
                :total="Number(24)"
                :tags="mockData.collectionSelected"
    />
  </div>
           
  
  ```
</docs>
