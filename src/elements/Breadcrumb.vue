<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><vue-link to="/">Home</vue-link></li>
      <li v-for="item in ancestors" :key="item.text" class="breadcrumb-item">
        <vue-link
          v-if="item.to"
          :to="item.to"
          v-html="item.text.charAt(0).toUpperCase() + item.text.slice(1)"
        ></vue-link>
        <span v-else v-html="item.text"></span>
      </li>
      <li
        class="breadcrumb-item active"
        aria-current="page"
        v-html="current.charAt(0).toUpperCase() + current.slice(1)"
      ></li>
    </ol>
  </nav>
</template>
<script>
import VueLink from "vue-link"

export default {
  name: "Breadcrumb",
  status: "prototype",
  release: "1.0.0",
  components: {
    VueLink,
  },
  props: {
    /**
     * The title of the current page.
     */
    current: {
      type: String,
      required: true,
    },
    ancestors: {
      type: Array,
      default: [{ text: "All Blogs", to: "/blogs" }, { text: "This Blog", href: "/blogs/this" }],
    },
  },
}
</script>
<style lang="scss">
@import "~bootstrap/scss/_breadcrumb";
.breadcrumb {
  margin-top: 0;
}
</style>
<docs>
  ```jsx
  <div>
<breadcrumb current="Page Title" :ancestors="[{text: 'All Blogs', to:'/blogs/'}, {text: 'This Blog', to:'/blogs/this'}]"/>
  </div>
  ```
</docs>
