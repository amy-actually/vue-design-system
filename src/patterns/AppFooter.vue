<template>
  <footer class="align-items-start d-md-flex justify-content-center justify-content-md-between p-3">
    <div class="col-md-6 col-xl-4 pl-0 pr-0 pt-md-3 mb-3">
      <card
        class="card--background-blue-dark mb-3"
        heading="Jackson County Public Library"
        subheading="Fontana Regional Library"
        subheading-class="h4 mt-0 text--white"
        v-if="location"
      >
        <template slot="copy">
          828-586-2016 County Librarian: Tracy Fitzmaurice location_on310 Keener Street Sylva, NC
          28779 Fax: 828-631-2943 Hours and address will be here if location / phone number
        </template>
      </card>

      <Search class="col" container-class="" :search-action="$route.name" />
    </div>

    <nav class="col-md d-xl-flex flex-wrap menu menu--footer p-0 p-md-3" role="navigation">
      <div class="col-xl-4 p-0 pl-xl-2 pr-xl-2" v-for="item in menuItems">
        <router-link
          class="background--blue-alternate d-block link link--undecorated mb-3 p-4 menu__item"
          :to="item.url"
        >
          <span class="menu__item__label text--white">
            {{ item.title }}
          </span>
        </router-link>
      </div>
    </nav>
  </footer>
</template>

<script>
import Card from "./Card.vue"
import Search from "./Search.vue"

export default {
  name: "AppFooter",

  components: {
    Card,
    Search,
  },

  props: {
    /**
     * An array of menu items that include `title` and `url` properties.
     */
    menuItems: {
      type: Array,
    },

    /**
     * A `location` object from which to derive hours and contact information.
     */
    location: {
      type: Object,
    },
    beforeMount() {
      this.$store.dispatch("fetchMenus")
    },
  },
}
</script>
