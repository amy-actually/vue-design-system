<template>
  <vue-link class="d-block event link link--undecorated" :to="'events/' + event.slug">
    <card
      class="mb-3"
      content-type="event"
      :explainer="event.start_date | moment('dddd, MMMM Do YYYY h:mm a')"
      :heading="event.title"
      :heading-class="headingClass"
      :sub-explainer="venue"
      v-if="event"
    >
      <template slot="copy">
        {{ getExcerpt(event) }}
      </template>
    </card>
  </vue-link>
</template>

<script>
import Vue from "vue"
import VueMoment from "vue-moment"
import VueLink from "vue-link"

import Card from "./Card.vue"
import Heading from "../elements/Heading.vue"

Vue.use(VueMoment)

export default {
  name: "EventCard",

  component: {
    Card,
    Heading,
    VueLink,
  },

  computed: {
    venue() {
      return this.event.venue ? this.event.venue.venue : ""
    },
  },

  methods: {
    /**
     * If the excerpt property is set we will prefer that,
     * otherwise we can grab the content of the event itself.
     * However, that content includes markup, so we'll use a little trick
     * to render the text without any html;
     * @param event
     * @returns {string | null}
     */
    getExcerpt(event) {
      const excerpt = event.excerpt ? event.excerpt : event.content
      const excerptContainer = document.createElement("div")

      excerptContainer.innerHTML = excerpt

      return this.truncateExcerpt
        ? `${excerptContainer.textContent.substring(0, 140)} ...`
        : excerptContainer.textContent
    },
  },

  props: {
    headingClass: {
      type: String,
    },

    headingLevel: {
      type: String,
    },

    subheadingClass: {
      type: String,
    },

    subheadingLevel: {
      default: "h3",
      type: String,
    },

    event: {
      required: true,
      type: Object,
    },

    truncateExcerpt: {
      default: false,
      type: Boolean,
    },

    variant: {
      type: String,
    },
  },
}
</script>

<style lang="scss">
.event {
  &.link {
    &:focus,
    &:hover {
      box-shadow: $box-shadow-small;
    }

    transition: all 0.2s ease-out;
  }
}
</style>
