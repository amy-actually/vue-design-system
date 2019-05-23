<template>
  <main :class="`background--white ${type}`" role="main">
    <call-to-action
      v-if="callToAction"
      class="call-to-action--large"
      :key="callToAction.id"
      :action="callToAction.acf.action"
      :copy="callToAction.acf.copy"
      :image="callToAction.acf.image"
      :heading="callToAction.acf.heading"
      :link="callToAction.acf.link"
    ></call-to-action>

    <slot name="breadcrumb"> </slot>
    <slot name="header"> </slot>

    <section class="background--white library__section p-3 col-lg-10 m-lg-auto d-flex flex-wrap">
      <div class="channel__sidebar mr-3" v-if="sidebar">
        <slot name="sidebar"></slot>
      </div>

      <div class="channel__content">
        <!--:class="sidebar ? '' : ''"-->
        <slot name="content"> </slot>
      </div>
    </section>
  </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue"

export default {
  name: "Channel",
  components: {
    CallToAction,
  },

  props: {
    type: {
      type: String,
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
<style lang="scss">
.channel__sidebar {
  flex: 1 0 250px;
  max-width: 350px;
}
.channel__content {
  flex: 1 1 50%;
}
</style>
