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

    <section class="background--white library__section p-3">
      <div class="col-lg-10 m-lg-auto">
        <div class="d-md-flex">
          <div class="mr-4" v-if="sidebar">
            <slot name="sidebar"></slot>
          </div>

          <div class="flex-grow-1">
            <!--:class="sidebar ? '' : ''"-->
            <slot name="content"> </slot>
          </div>
        </div>
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
