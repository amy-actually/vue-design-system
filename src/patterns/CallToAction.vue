<template>
  <component class="call-to-action" :is="element">
    <card
      :button-label="action"
      class="align-items-stretch card--background-blue-base"
      :copy="copy"
      :heading="heading"
      :image="image"
      type="deck"
    >
      <template slot="action" v-if="link && action">
        <a class="button button--aqua button--large" :href="link">
          {{ action }}
        </a>
      </template>
    </card>

    <div
      class="card__background d-none d-sm-block"
      :style="`background-image: url(${image});`"
    ></div>
  </component>
</template>

<script>
import Card from "../patterns/Card.vue"

export default {
  name: "CallToAction",

  components: {
    Card,
  },

  props: {
    action: {
      required: true,
      type: String,
    },
    copy: {
      required: true,
      type: String,
    },
    element: {
      default: "div",
      type: String,
    },
    image: {
      required: true,
      type: String,
    },
    heading: {
      required: true,
      type: String,
    },
    link: {
      type: String,
    },
  },
}
</script>

<style>
.call-to-action {
  position: relative;
}
</style>
