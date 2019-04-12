<template> </template>
<script>
export default {
  name: "ContentTypeFilter",

  computed: {
    pageCount() {
      return this.$store.getters.getCtaByCategory(this.slug, "random")
    },
  },
  created() {},
  data() {
    return {
      count: {
        callsToAction: 0,
        events: 0,
        pages: 0,
        posts: 0,
        articles: 0,
        collection: 0,
        resources: 0,
      },
    }
  },
  methods: {
    getCounts() {
      if (this.channelType === "term") {
        //const term
      }
    },
  },
  props: {
    channel: {
      type: String,
    },

    activeStream: {
      type: String,
    },

    channelType: {
      type: String,
    },
  },
}
</script>
