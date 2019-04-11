<template>
  <component class="card" :class="{ 'card--deck': isDeck }" :is="element">
    <div :class="contentContainerClass">
      <div :class="{ 'card__content col-sm-10 col-md-5 mb-4 pb-4 pl-md-0 pr-md-0': isDeck }">
        <template v-if="contentType">
          <div
            aria-hidden="true"
            class="card__color-code mb-1"
            :class="`card__color-code--${contentType}`"
            v-if="contentType"
          ></div>

          <div class="align-items-center card__badge d-flex justify-content-between">
            <div
              class="align-self-start card__badge__label text--bold text--extra-small text--uppercase"
              v-html="badgeLabel ? badgeLabel : contentType"
            ></div>

            <div class="card__badge__explainer text--extra-small text--right" v-if="explainer">
              {{ decodeHtml(explainer) }}
              <br />

              <div class="card__badge__sub-explainer" v-if="subExplainer">
                {{ decodeHtml(subExplainer) }}
              </div>
            </div>
          </div>
        </template>

        <heading
          :class="[{ 'text--serif': isDeck }, headingClass ? headingClass : 'card__heading']"
          :level="headingLevel"
          v-if="heading"
          v-html="heading"
        >
        </heading>

        <heading
          :class="[subheadingClass ? subheadingClass : 'card__subheading mt-2']"
          :level="subheadingLevel"
          v-if="subheading"
        >
          {{ decodeHtml(subheading) }}
        </heading>

        <div class="card__heading__separator" v-if="isDeck"></div>

        <p class="card__copy">
          <slot name="copy">{{ decodeHtml(copy) }}</slot>
        </p>

        <slot name="action"></slot>
      </div>
    </div>

    <div class="card__image img-fluid" v-if="image && !isDeck">
      <img :src="image" alt="" />
    </div>
  </component>
</template>

<script>
import Heading from "../elements/Heading.vue"

export default {
  name: "Card",

  components: {
    Heading,
  },

  computed: {
    isDeck() {
      return this.type === "deck"
    },
  },
  methods: {
    decodeHtml: function(html) {
      if (html) {
        var txt = document.createElement("textarea")
        txt.innerHTML = html
        return txt.value
      }
    },
  },

  props: {
    badgeLabel: {
      type: String,
    },

    copy: {
      type: String,
    },

    contentContainerClass: {
      default: "p-4",
      type: String,
    },

    contentType: {
      type: String,
      //validator: value => value.match(/(event|blog|collection|service)/)
    },

    element: {
      default: "div",
      type: String,
    },

    explainer: {
      type: String,
    },

    heading: {
      type: String,
    },

    headingLevel: {
      default: "h2",
      type: String,
    },

    headingClass: {
      type: String,
    },

    image: {
      type: String,
    },

    subExplainer: {
      type: String,
    },

    subheading: {
      type: String,
    },

    subheadingClass: {
      type: String,
    },

    subheadingLevel: {
      default: "h3",
      type: String,
    },

    type: {
      default: "default",
      type: String,
      validator: value => value.match(/(default|deck)/),
    },
  },
}
</script>

<style lang="scss">
@mixin card($background-color) {
  background-color: $background-color;

  .card__badge {
    &__explainer,
    &__label {
      color: color-yiq($background-color);
    }
    &__sub-explainer {
      border-top: 2px solid color_yiq($background-color);
      margin-top: 3px;
      opacity: 0.5;
    }
  }

  .card__copy,
  .card__heading {
    color: color-yiq($background-color);
  }

  &__copy {
    font-family: $font-family-text;
  }
}
.card {
  position: relative;

  @each $color, $value in $theme-colors {
    &--background-#{$color} {
      @include card($value);
    }
  }

  &__badge {
    &__explainer,
    &__label {
      font-family: $font-family-text;
    }

    &__explainer {
      position: absolute;
      right: 3em;
    }
  }

  &__color-code {
    &::before {
      flex: 0 1 64px;
      content: "";
    }

    &--collection::before {
      background-color: $color-pink;
    }

    &--event::before {
      background-color: $color-aqua;
    }

    &--everything::before {
      background: linear-gradient(90deg, $color-pink, $color-orange);
    }

    &--service::before {
      background-color: $color-orange;
    }

    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    height: 4px;
    border: none;
    box-shadow: none;
  }

  &--deck {
    .card {
      &__content {
        @media #{$media-query-medium} {
          max-width: 66%;
        }

        z-index: 1;
      }

      &__heading {
        font-size: $font-size-x-large;
        font-weight: $font-weight-regular;

        @media #{$media-query-medium} {
          font-size: $font-size-xxx-large;
        }

        line-height: $line-height-heading;

        &__separator {
          display: flex;
          justify-content: flex-start;
          align-items: stretch;
          height: 8px;
          border: none;
          box-shadow: none;
          margin: 40px 0;

          &::before {
            flex: 0 1 144px;
            background-color: white;
            content: "";
          }
        }
      }

      &__copy {
        font-size: $font-size-base;
        @media #{$media-query-medium} {
          font-size: $font-size-large;
          max-width: 75%;
        }
      }
    }
  }

  &__heading {
    font-size: $font-size-large;
    font-weight: $font-weight-bold;
  }

  &__image img {
    max-width: 100%;
    vertical-align: bottom;
  }
}
</style>
