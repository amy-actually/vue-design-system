<template>
  <header class="d-flex p-4">
    <div class="col-md-10 m-auto">
      <div class="col-md-8">
        <heading class="channel__title text--dark text--serif" level="h1" v-html="title"> </heading>

        <p class="channel__description" v-html="description"></p>
      </div>
    </div>
  </header>
</template>
<script>
import Heading from "../elements/Heading.vue"
export default {
  name: "ChannelHeader",

  components: {
    Heading,
  },

  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
}
</script>
