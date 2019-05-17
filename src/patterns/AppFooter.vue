<template>
  <footer class="align-items-start d-md-flex justify-content-center justify-content-md-between p-3">
    <div class="col-md-6 col-xl-4 pl-0 pr-0 pt-md-3 mb-3">
      <card
        v-if="location"
        class="card--background-blue-dark mb-3"
        :heading="location.name"
        subheading="Fontana Regional Library"
        subheading-class="h4 mt-0 text--white"
      >
        <template slot="copy">
          {{ location.acf.phone }} <br /><br />
          {{ location.acf.librarian }} <br />
          {{ location.acf.address }} <br />
          {{ location.acf.city }}, {{ location.acf.state }} {{ location.acf.zip }} <br /><br />
          Fax: {{ location.acf.fax }}
        </template>
      </card>

      <Search class="col" container-class="" :search-action="$route.name" />
    </div>

    <nav class="col-md menu menu--footer p-0 p-md-3 mb-5" role="navigation">
      <template v-for="(item, index) in menuItems">
        <div class="" v-if="item.menu_item_parent == 0" :key="index">
          <vue-link
            class="background--blue-alternate d-block link link--undecorated mb-3 menu__item"
            :to="item.url"
          >
            <h4 class="p-2 px-md-4 m-0 text--white text--uppercase">
              {{ item.title }}
            </h4>
          </vue-link>
          <ul v-if="children[item.ID]" class="menu__item__children p-2 px-md-4">
            <li v-for="(child, key) in children[item.ID]" :key="key" class="py-1">
              <vue-link class="text--white text--sans" :to="child.url">{{ child.title }}</vue-link>
            </li>
          </ul>
        </div>
      </template>
    </nav>
  </footer>
</template>

<script>
import Card from "./Card.vue"
import Search from "./Search.vue"
import VueLink from "vue-link"

export default {
  name: "AppFooter",

  components: {
    Card,
    Search,
    VueLink,
  },
  computed: {
    children() {
      let menu = []
      this.menuItems.forEach(item => {
        if (item.menu_item_parent > 0 && !menu[item.menu_item_parent]) {
          menu[item.menu_item_parent] = []
        }
        if (item.menu_item_parent > 0) {
          menu[item.menu_item_parent].push(item)
        }
      })
      return menu
    },
  },
  data() {
    return {
      parents: this.menuItems.filter(item => item.menu_item_parent == 0),
    }
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
  },
}
</script>
<style lang="scss">
nav.menu--footer {
  display: flex;
  flex-flow: column;
  @media #{$media-query-medium} {
    flex-flow: column wrap;
  }
  @media #{$media-query-large} {
    flex-flow: row wrap;
  }
  > div {
    flex: 1 1 auto;
    @media #{$media-query-medium} {
      border-right: $border_width_default $border_style_default $color_blue_alternate;
      &:last-child {
        border: none;
      }
    }
  }
  .menu__item__children {
    list-style-type: none;
    padding-left: 0;
  }
  h4 {
    font-size: 110%;
  }
}
</style>
