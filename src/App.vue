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

    <Search :search-action="$route.name" />

    <router-view class="view" />

    <app-footer :menuItems="footerMenu" :locations="currentLocation" />
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
    ...mapState(["currentLocation", "locations", "menus"]),
  },
  footerMenu() {
    return menus[0]
  },
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif|Lato");
</style>
