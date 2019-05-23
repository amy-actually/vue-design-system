<template>
  <page-template>
    <template v-slot:breadcrumb>
      <breadcrumb
        :current="page.type == 'alert' ? page.acf.short_title : page.title"
        :ancestors="nav"
      />
    </template>

    <template v-slot:header>
      <pageLead type="page" :title="page.type == 'alert' ? page.acf.short_title : page.title">
        <template v-slot:tagline>
          <em class="event__time text--dark">
            Updated: {{ page.modified | moment("dddd, MMMM Do YYYY") }}
          </em>
        </template>
        <template v-slot:excerpt v-if="page.type === 'alert'">
          <div class="event__excerpt pb-3" v-html="page.content.rendered" />
        </template>
      </pageLead>
    </template>

    <template v-slot:content v-if="page.type !== 'alert'">
      <pageContent :content="page.content.rendered ? page.content.rendered : page.content" />
    </template>
  </page-template>
</template>

<script>
import PageTemplate from "../patterns/PageTemplate.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import PageLead from "../patterns/PageLead.vue"
import PageContent from "../elements/PageContent.vue"

import Icon from "../elements/Icon.vue"
import CButton from "../elements/Button.vue"

export default {
  name: "Page",
  computed: {
    page() {
      return this.$store.getters["content/getItemBySlug"](this.type, this.slug)
    },
  },
  mounted() {
    let content = this.$store.getters["content/getItemBySlug"](this.type, this.slug)
    if (!content) {
      this.$store.dispatch("content/fetchContentBySlug", { type: this.type, slug: this.slug })
    }
  },
  component: {
    Breadcrumb,
    PageContent,
    PageLead,
    PageTemplate,
    Icon,
    CButton,
  },
  props: {
    slug: {
      type: String,
    },
    type: {
      type: String,
    },
    nav: {
      type: Array,
    },
  },
}
</script>
<style lang="scss">
@import "~bootstrap/scss/_badge";
</style>
