<template>
  <nav class="d-flex justify-content-md-end menu menu--header" role="navigation">
    <vue-link
      class="align-items-center align-self-center d-flex flex-column flex-fill flex-md-grow-0 menu__item nav-link nav-item text--white"
      to="https://fontana.nccardinal.org/eg/opac/login?redirect_to=%2Feg%2Fopac%2Fmyopac%2Fmain"
    >
      <Icon
        name="account"
        aria-label="Make a Donation"
        fill="#fff"
        height="24"
        icon-class="menu__item__icon"
      />

      <span class="menu__item__label">Account</span>
    </vue-link>

    <vue-link
      to="/events"
      class="align-items-center align-self-center d-flex flex-column flex-fill flex-md-grow-0 menu__item  nav-link nav-item text--white"
    >
      <Icon
        name="events"
        aria-label="Upcoming Events"
        fill="#fff"
        height="20"
        icon-class="menu__item__icon"
      />

      <span class="menu__item__label">Events</span>
    </vue-link>

    <vue-link
      class="align-items-center align-self-center d-none d-lg-flex flex-column flex-fill flex-md-grow-0 menu__item  nav-link nav-item text--white"
      to="/services"
    >
      <Icon
        name="bell"
        aria-label="Library Services"
        fill="#fff"
        height="22"
        icon-class="menu__item__icon"
      />

      <span class="menu__item__label">Services</span>
    </vue-link>

    <div class="menu__divider"></div>

    <vue-link
      to="#"
      class="align-items-center align-self-center d-none d-md-flex flex-column flex-fill flex-md-grow-0 menu__item nav-link nav-item text--white"
    >
      <Icon
        name="donate"
        aria-label="Make a Donation"
        fill="#fff"
        height="24"
        icon-class="menu__item__icon"
      />

      <span class="menu__item__label">Donate</span>
    </vue-link>

    <Dropdown
      button-class="button--blue-alternate d-none d-md-block menu__item menu__item--location nav-link text--ellipsis text--nowrap text--white"
      class="align-self-center nav-item"
      dropdown-menu-class="text--nowrap text--right"
      label-class="menu__item__label"
    >
      <template slot="label">{{ selectedLocation }}</template>
      <template slot="items">
        <div class="dropdown__menu__selected">All Libraries</div>
        <div
          v-for="location in locations"
          class="d-block dropdown__menu__item link link--undecorated mb-1 mt-1 text--underlined"
          :key="location.id"
          href="#"
          @click="setLocationInQueryParameter(`${location.slug}`)"
        >
          {{ location.name }}
        </div>
      </template>
    </Dropdown>
  </nav>
</template>

<script>
import Dropdown from "../elements/Dropdown.vue"
import VueLink from "vue-link"
import Icon from "../elements/Icon.vue"

export default {
  name: "Menu",

  components: {
    Dropdown,
    VueLink,
  },
  data() {
    return {
      selectedLocation: "",
    }
  },
  methods: {
    setLocationInQueryParameter(locationSlug) {
      this.$store.commit("SET_LOCATION", locationSlug)
      this.$router.push({ query: { location: `${locationSlug}` } })
    },
    getName() {
      let val
      return this.currentLocation === "all"
        ? "All Libraries"
        : undefined !=
          (val = this.locations.find(location => location.slug === this.currentLocation))
        ? val.name
        : "All"
    },
  },
  props: {
    currentLocation: {
      type: String,
    },
    locations: {
      type: Array,
    },
  },
  created() {
    this.selectedLocation = this.getName()
  },
}
</script>
