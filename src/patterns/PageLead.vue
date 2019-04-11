<template>
  <header class="col-11 col-md-10 col-lg-6 m-auto p-lg-4">
    <slot name="externalCta"></slot>

    <heading class="event__title text--dark text--serif" v-html="title"></heading>

    <slot name="tagline"></slot>

    <div class="heading__separator"></div>

    <slot name="excerpt"></slot>
  </header>
</template>
<script>
import Heading from "../elements/Heading.vue"

export default {
  name: "PageLead",

  components: {
    Heading,
  },
  props: {
    title: {
      type: String,
    },
  },
}
</script>
<style lang="scss">
.heading__separator {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: 8px;
  border: none;
  box-shadow: none;
  margin: 40px 0;

  &:before {
    flex: 0 1 144px;
    background-color: $color-blue-alternate;
    content: "";
  }
}
</style>
