<template>
  <vue-link
    :to="url"
    itemprop="sameAs"
    class="button social__icon--button mr-1"
    :class="`social__icon--button--${name}`"
  >
    <Icon :name="name" class="social__icon" :fill="colorCode ? '#fff' : null" /> &nbsp;&nbsp;
  </vue-link>

  <!-- <component :is="type"
  :aria-label="ariaLabel"
  :class="[iconClass, iconSize]" v-html="svg" /> -->
</template>

<script>
//v-bind:style="[colorCode ? {backgroundColor: iconColor, borderColor: 'none'} : {borderColor: 'none'}]"
//class="d-flex p-2 align-items-center justify-content-between"
import VueLink from "vue-link"
import Icon from "./Icon.vue"
import CButton from "./Button.vue"
/**
 * Icons are used to visually communicate core parts of the product and
 * available actions. They can act as wayfinding tools to help users more
 * easily understand where they are in the product.
 */
export default {
  name: "SocialIcon",
  status: "review",
  release: "1.0.0",
  components: {
    Icon,
    VueLink,
    CButton,
  },

  props: {
    /**
     * The url to the social media profile
     */
    url: {
      type: String,
      required: true,
    },
    /**
     * The name of the platform
     */
    name: {
      type: String,
      required: true,
    },
    /**
     * The @ username
     */
    username: {
      type: String,
    },
    /**
     * Whether to color code based on the platform brand color
     */
    colorCode: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss">
.social__icon--button {
  border: none;
  position: relative;
  width: 35px;
  height: 35px;

  svg {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
$social-colors: ();
$social-colors: map-merge(
  (
    "goodreads": $goodreads,
    "snapchat": $snapchat,
    "youtube": $youtube,
    "github": $github,
    "facebook": $facebook,
    "wechat": $wechat,
    "codepen": $codepen,
    "discord": $discord,
    "blogger": $blogger,
    "whatsapp": $whatsapp,
    "instagram": $instagram,
    "twitter": $twitter,
    "messenger": $messenger,
    "twitch": $twitch,
    "medium": $medium,
    "skype": $skype,
    "wordpress": $wordpress,
    "tiktok": $tiktok,
    "pinterest": $pinterest,
    "viber": $viber,
    "tumblr": $tumblr,
    "linkedin": $linkedin,
    "reddit": $reddit,
  ),
  $social-colors
);
@mixin social($background-color) {
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
.social__icon--button {
  @each $color, $value in $social-colors {
    &--#{$color} {
      @include social($value);
    }
  }
}
</style>

<docs>
  ```jsx
  <div>
    <SocialIcon name="facebook"  />

  </div>
  ```
</docs>
