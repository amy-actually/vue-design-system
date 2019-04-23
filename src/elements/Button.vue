<template>
  <component class="button btn" :class="[`button--${variation}`]" :is="element" :type="type">
    <slot />
  </component>
</template>

<script>
export default {
  name: "CButton",
  status: "prototype",
  release: "1.0.0",

  props: {
    /**
     * The element the component renders as.
     */
    element: {
      default: "button",
      type: String,
    },
    /**
     * Can be deafult, disabled, focus, hover, press or progess
     */
    state: {
      default: "default",
      type: String,
      validator: value => value.match(/(default|disabled|focus|hover|press|progress)/),
    },

    /**
     * Can be button, reset, or submit
     */
    type: {
      default: "button",
      type: String,
      validator: value => value.match(/(button|reset|submit)/),
    },
    /**
     * Can be Link, Primary, or Secondary
     */
    variation: {
      type: String,
      default: "primary",
      validator: value => value.match(/(link|primary|secondary)/),
    },
  },
}
</script>

<style lang="scss">
@import "~bootstrap/scss/buttons";

/**
* We use this `button` mixin below so that we can loop through
* all of the various theme colors in style.scss and generate the
* same classes for each. `button` takes a background color, and then
* just uses the Sass `darken()` function to determine what hover states
* look like.
*/
@mixin button($background-color) {
  background-color: $background-color;
  border-color: $background-color;
  color: color-yiq($background-color);

  &:hover {
    $hover-background: darken($background-color, 7.5%);
    background-color: $hover-background;
    border-color: darken($background-color, 10%);
    color: color-yiq($background-color);
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba($background-color, 0.5);
    outline: 0;
  }

  &:disabled {
    color: color-yiq($background-color);
    background-color: $background-color;
    border-color: $background-color;
  }
}

.button {
  &:not(:disabled):not(.disabled) {
    cursor: pointer;
  }

  &,
  &::before,
  &::after {
    box-sizing: border-box;
  }

  border-radius: $border-radius-default;
  border-style: $border-style-default;
  border-width: $border-width-default;
  display: inline-block;
  font-family: $font-family-text;
  font-size: $font-size-small;
  font-weight: $font-weight-bold;
  letter-spacing: 1px;
  line-height: $line-height-base;
  padding: $padding-vertical-default $padding-horizontal-small;
  text-align: center;
  text-decoration: none;
  transition: all $duration-quickly ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;

  &:disabled {
    box-shadow: none;
    opacity: $opacity-disabled;
  }

  &--link {
    background-color: transparent;
    border-color: transparent;
    font-weight: $font-weight-regular;

    &:disabled {
      pointer-events: none;
    }

    &:focus {
      box-shadow: none;
      border-color: transparent;
      text-decoration: $link-hover-decoration;
    }

    &:hover {
      background-color: transparent;
      border-color: transparent;
      text-decoration: $link-hover-decoration;
    }
  }

  &--large {
    font-size: $font-size-base;
    padding: $padding-vertical-large $padding-horizontal-large;
  }
}

/**
 * For each color in a theme (see styles.scss and themes.yml),
 * we'll generate button styles. This ultimately generates css like
 * `theme--new-tropic .button {}`, assuming that the "theme" class is
 * set on a parent container.
 */
.button {
  @each $color, $value in $theme-colors {
    &--#{$color} {
      @include button($value);
    }
  }

  &--link {
    color: map_get($theme-colors, "primary");

    &:hover {
      color: darken(map_get($theme-colors, "primary"), 15%);
    }
  }
}
</style>
<docs>
  ```jsx
  <div>
    <CButton variation="link">
      Click Here
    </Cbutton>
    <CButton variation="primary">
      Click Here
    </Cbutton>
    <CButton variation="secondary">
      Click Here
    </Cbutton>
    <CButton class="button--large">
      Click Here
    </Cbutton>
  </div>

  ```
</docs>
