<template>
  <div class="library" id="app">
    <header
      class="align-items-center d-flex justify-content-center justify-content-md-between library__header p-3"
    >
      <router-link to="/">
        <Logo fill="white" />
      </router-link>

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

export default {
  name: "app",

  components: {
    AppFooter,
    Logo,
    Menu,
    Search,
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
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif|Lato");
</style>
