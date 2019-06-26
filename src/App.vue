<template>
  <div class="library" id="app">
    <div class="location--nav d-flex" v-if="location && location.slug != 'headquarters'">
      <location-card :location="location" :key="location.id" variant="summary" />
    </div>
    <header
      class="align-items-center d-flex flex-wrap align-content-between justify-content-center justify-content-md-between library__header p-3"
    >
      <vue-link to="/">
        <Logo fill="white" />
      </vue-link>

      <Menu
        :key="currentLocation"
        :currentLocation="currentLocation"
        :locations="locations"
        v-show="locations && locations.length > 0"
      />
    </header>

    <Search :search-action="$route.name ? $route.name : 'everything'" />

    <router-view class="view" />

    <app-footer :menuItems="footerMenu" :location="location" />
  </div>
</template>

<script>
import AppFooter from "./patterns/AppFooter.vue"
import Logo from "./elements/Logo.vue"
import Menu from "./patterns/Menu.vue"
import Search from "./patterns/Search.vue"
import { mapState } from "vuex"
import VueLink from "vue-link"
import LocationCard from "./patterns/LocationCard.vue"

export default {
  name: "app",

  components: {
    AppFooter,
    Logo,
    Menu,
    Search,
    VueLink,
    LocationCard,
  },
  computed: {
    ...mapState(["currentLocation", "menus"]),
    ...mapState("taxonomies", ["locations"]),
    location() {
      return this.currentLocation === "all" && this.locations
        ? this.locations.find(location => location.slug === "headquarters")
        : this.locations.find(location => location.slug === this.currentLocation)
    },
    footerMenu() {
      const footer = this.menus.find(menu => menu.slug === "footer-menu")
      return !footer ? [] : footer.items
    },
  },
  created() {
    this.$store.dispatch("loadApp")
  },
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif|Lato");
.location--nav {
  width: 100%;
}
.location--nav .card .card__color-code,
.location--nav .card .card__badge {
  display: none !important;
}
.location--nav .card h2 {
  font-size: 1em;
  margin: 0;
  flex: 1 1 100% !important;
  /* color: $color-gray; */
}
.location--nav .card {
  width: 100%;
  margin: 0 !important;
  /*color: $color-gray; */
  & .card__copy {
    margin-bottom: 0 !important;
    & p {
      margin: 10px 0 0 0;
    }
  }
  & > .p-4 {
    padding: 10px !important;
  }
  & > div > div > a {
    display: none;
  }
}
</style>
