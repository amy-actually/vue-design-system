<template>
  <component class="dropdown" :is="element" v-on-clickaway="closeDropdown">
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
      class="dropdown__menu dropdown-menu"
      :class="[{ show: isOpen }, dropdownMenuClass]"
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
    right: 0;

    &__item.link {
    }
  }
}
</style>
