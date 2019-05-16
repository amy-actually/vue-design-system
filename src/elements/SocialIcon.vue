<template>
  <vue-link :to="url" itemprop="sameAs" class="social__icon--link">
    <c-button v-bind:style="[colorCode ? { backgroundColor: iconColor } : '']">
      <Icon :name="name" class="social__icon" :fill="colorCode ? '#fff' : null" /> &nbsp;&nbsp;
    </c-button>
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
const brandColors = {
  facebook: "#3b5998",
  messenger: "#0084FF",
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  tumblr: "#36465D",
  youtube: "#FF0000",
  wordpress: "#21759B",
  goodreads: "#663300",
  tiktok: "#000",
  discord: "#7289DA",
  pinterest: "#BD081C",
  whatsapp: "#25D366",
  snapchat: "#FFFC00",
  wechat: "#7BB32E",
  linkedin: "#0077B5",
  reddit: "#FF4500",
  twitch: "#6441A4",
  medium: "#12100E",
  skype: "#00AFF0",
  blogger: "#FF5722",
  viber: "#665CAC",
  github: "#181717",
  codepen: "#000",
}
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
  computed: {
    iconColor() {
      return !this.colorCode || !brandColors[this.name] ? null : brandColors[this.name]
    },
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
.social__icon--link {
  margin: 1px;
  display: inline-block;
  button {
    border: none;
    position: relative;
    height: 2.5em;
    width: 2.5em;
  }
  svg {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
