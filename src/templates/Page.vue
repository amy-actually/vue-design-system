<template>
  <page-template>
    <template v-slot:breadcrumb>
      <breadcrumb :current="page.title.rendered" :ancestors="nav" />
    </template>

    <template v-slot:header>
      <pageLead type="page" :title="page.title.rendered" />
    </template>

    <template v-slot:content>
      <pageContent :content="page.content.rendered" />
    </template>
  </page-template>
</template>

<script>
import PageTemplate from "../patterns/PageTemplate.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import PageLead from "../patterns/PageLead.vue"
import PageContent from "../elements/PageContent.vue"

export default {
  name: "Page",

  component: {
    Breadcrumb,
    PageContent,
    PageLead,
    PageTemplate,
  },

  computed: {
    nav() {
      return [{ text: "Pages", to: "/pages/" }]
    },
  },
  props: {
    page: {
      type: Object,
    },
  },
}
</script>
