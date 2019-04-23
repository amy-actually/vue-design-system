<template>
  <component
    class="dropdown"
    :class="[
      { dropup: alignment == 'dropup' },
      { dropleft: alignment == 'dropleft' },
      { dropright: alignment == 'dropright' },
    ]"
    :is="element"
    v-on-clickaway="closeDropdown"
  >
    <span
      :aria-expanded="isOpen"
      aria-haspopup="true"
      class="dropdown__toggle dropdown-toggle"
      :class="buttonClass"
      href="#"
      v-on:click="toggleMenu"
      role="button"
    >
      <span class="dropdown__label" :class="labelClass">
        <slot name="label">Hello</slot>
      </span>
    </span>
    <div
      class="dropdown__menu dropdown-menu "
      :class="[
        { show: isOpen },
        dropdownMenuClass,
        { 'dropdown-menu-right': alignment == 'right' },
      ]"
      @click="toggleMenu"
    >
      <slot name="items"></slot>
    </div>
  </component>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway"

export default {
  name: "Dropdown",
  status: "prototype",
  release: "1.0.0",

  data() {
    return {
      isOpen: false,
    }
  },

  methods: {
    closeDropdown() {
      this.isOpen = false
    },

    toggleMenu() {
      this.isOpen = !this.isOpen
    },
  },

  mixins: [clickaway],

  props: {
    buttonClass: {
      default: "",
      type: String,
    },
    dropdownMenuClass: {
      type: String,
    },
    labelClass: {
      default: "",
      type: String,
    },
    element: {
      default: "div",
      type: String,
    },
    /**
     * Specify menu alignment for right, dropup, dropleft, dropright (specify down/left for normal alignment)
     */
    alignment: {
      default: "right",
      type: String,
    },
  },
}
</script>

<style lang="scss">
@import "~bootstrap/scss/dropdown";
.dropdown {
  &__label {
    cursor: pointer;
  }

  &__menu {
    background-color: $color-white;
    border: 2px solid $color-white;
    border-radius: 0;
    left: inherit;
    padding: 0.5rem 1rem;
    /* &--right{
      right: 0;
    } */

    &__item.link {
    }
  }
}
</style>
<docs>
  ```jsx
  const items=[{text: 'All Blogs', to:'/blogs/'}, {text: 'This Blog', to:'/blogs/this'}];
<div>
<Dropdown
        button-class="button--blue-alternate d-none d-inline-block menu__item menu__item--location nav-link text--ellipsis text--nowrap text--white"
        class="nav-item"
        dropdown-menu-class="text--nowrap"
        label-class="menu__item__label"
        alignment="dropright"
        style="float:left"
        >
        
        <template v-slot:label>DropRight</template>

        <template v-slot:items>
          <div class="dropdown__menu__selected">All Items</div>
          <div v-for='(item, key) in items' 
          class="d-block dropdown__menu__item link link--undecorated mb-1 mt-1 text--underlined"
          :key="key">
            {{item.text}}
          </div>
        </template>

      </Dropdown>
      <Dropdown
        button-class="button--blue-alternate d-none d-inline-block menu__item menu__item--location nav-link text--ellipsis text--nowrap text--white"
        class="nav-item"
        dropdown-menu-class="text--nowrap"
        label-class="menu__item__label"
        alignment="dropleft"
        style="float:right"
        >
        
        <template v-slot:label>DropLeft</template>

        <template v-slot:items>
          <div class="dropdown__menu__selected">All Items</div>
          <div v-for='(item, key) in items' 
          class="d-block dropdown__menu__item link link--undecorated mb-1 mt-1 text--underlined"
          :key="key">
            {{item.text}}
          </div>
        </template>

      </Dropdown>
      
    <Dropdown
        button-class="button--blue-alternate d-none d-inline-block menu__item menu__item--location nav-link text--ellipsis text--nowrap text--white"
        class="nav-item"
        dropdown-menu-class="text--nowrap"
        label-class="menu__item__label"
        alignment="dropup"
        style="clear:both">
        
        <template v-slot:label>UP</template>

        <template v-slot:items>
          <div class="dropdown__menu__selected">All Items</div>
          <div v-for='(item, key) in items' 
          class="d-block dropdown__menu__item link link--undecorated mb-1 mt-1 text--underlined"
          :key="key">
            {{item.text}}
          </div>
        </template>

      </Dropdown>


      <Dropdown
        button-class="button--blue-alternate d-none d-inline-block menu__item menu__item--location nav-link text--ellipsis text--nowrap text--white"
        class="nav-item"
        dropdown-menu-class="text--nowrap"
        label-class="menu__item__label"
        alignment="left">
        
        <template v-slot:label>DOWN</template>

        <template v-slot:items>
          <div class="dropdown__menu__selected">All Items</div>
          <div v-for='(item, key) in items' 
          class="d-block dropdown__menu__item link link--undecorated mb-1 mt-1 text--underlined"
          :key="key">
            {{item.text}}
          </div>
        </template>

      </Dropdown>

      


      <Dropdown
        button-class="button--blue-alternate d-none d-inline-block menu__item menu__item--location nav-link text--ellipsis text--nowrap text--white"
        class="nav-item"
        dropdown-menu-class="text--nowrap"
        label-class="menu__item__label"
        alignment="right"
        style="text-align:right">
        
        <template v-slot:label>Right</template>

        <template v-slot:items>
          <div class="dropdown__menu__selected">All Items</div>
          <div v-for='(item, key) in items' 
          class="d-block dropdown__menu__item link link--undecorated mb-1 mt-1 text--underlined"
          :key="key">
            {{item.text}}
          </div>
        </template>

      </Dropdown>
      
      <br/><br/>
      
      

      
</div>
  ```
</docs>
