<template>
  <main :class="`background--white ${type}`" role="main">
    <call-to-action
      v-if="call"
      class="call-to-action--large"
      :key="call.id"
      :action="call.acf.action"
      :copy="call.acf.copy"
      :image="call.acf.image"
      :heading="call.acf.heading"
      :link="call.acf.link"
    ></call-to-action>

    <slot name="breadcrumb"> </slot>
    <slot name="header"> </slot>
    <slot name="content"> </slot>
  </main>
</template>

<script>
export default {
  name: "ChannelTemplate",

  computed: {
    call() {
      return this.$store.getters.getCtaByCategory(this.slug, "random")
    },
  },

  props: {
    slug: {
      type: String,
    },
  },
}
</script>
