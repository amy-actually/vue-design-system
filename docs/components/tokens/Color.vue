<template>
  <div class="colors__categories">
    <section
      v-for="section in sections"
      :key="section"
      :id="`color_${section.replace(/-|_/g, '')}`"
      :ref="`color_${section.replace(/-|_/g, '')}`"
    >
      <h3>
        {{ section.replace(/_|-/g, " ") }}
        <ul class="colors__categories--menu">
          <li v-for="item in sections" :key="`list-${section}-${item}`" v-if="item !== section">
            <a
              href="javascript:void(0)"
              @click.prevent="scrollIt(`color_${item.replace(/-|_/g, '')}`)"
              >{{ item.replace(/_|-/g, " ") }}</a
            >
          </li>
        </ul>
      </h3>
      <div class="colors">
        <div
          v-for="(prop, index) in tokens"
          :key="index"
          class="color"
          :class="prop.category"
          v-if="prop.type === 'color' && prop.category === section"
        >
          <div class="swatch" :style="{ backgroundColor: prop.value }" />
          <h4>{{ prop.name.replace(/_/g, " ").replace(/color/g, "") }}</h4>
          <span>
            <em>RGB:</em>
            {{ prop.value }}
          </span>
          <span>
            <em>SCSS:</em>
            ${{ prop.name.replace(/_/g, "-") }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import designTokens from "@/assets/tokens/tokens.raw.json"
import orderBy from "lodash/orderBy"
function scrollFix(id) {
  let element = document.getElementById(id)
  let top = element.offsetTop
  window.scrollTo(0, top)
}

/**
 * The color palette comes with 5 different weights for each hue. These hues
 * should be used purposefully to communicate how things function in the
 * interface. Keep in mind that `vermilion` is only used in special cases
 * like destructive actions and error messages. To edit the colors, see
 * [/src/tokens/color.yml](https://github.com/viljamis/vue-design-system/blob/master/src/tokens/color.yml).
 */
export default {
  name: "Color",
  methods: {
    orderData: function(data) {
      // let byValue = orderBy(data, "value", "asc")
      let byName = orderBy(data, "name", "asc")
      let byCategoryAndName = orderBy(byName, "category")

      return byCategoryAndName
    },
    getSections: function(data) {
      let byCategoryAndName = orderBy(data, "category", "desc")
      let colors = [...byCategoryAndName].filter(token => token.type === "color")
      const sections = [...new Set(colors.map(item => item.category))]
      return sections
    },
    scrollIt(id) {
      scrollFix(id)
    },
  },
  data() {
    return {
      tokens: this.orderData(designTokens.props),
      sections: this.getSections(designTokens.props),
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../docs.tokens.scss";

/* STYLES
--------------------------------------------- */

.colors {
  margin-top: $space-s;
  display: block;
  width: 100%;
  @supports (display: grid) {
    display: grid;
    max-width: 1200px;
    align-content: stretch;
    justify-content: left;
    grid-template-columns:
      calc(20% - #{$space-m})
      calc(20% - #{$space-m})
      calc(20% - #{$space-m})
      calc(20% - #{$space-m})
      calc(20% - #{$space-m});
    grid-column-gap: $space-m;
    @media (max-width: 1300px) {
      grid-template-columns:
        calc(25% - #{$space-m})
        calc(25% - #{$space-m})
        calc(25% - #{$space-m})
        calc(25% - #{$space-m});
    }
    @media (max-width: 1100px) {
      grid-template-columns:
        calc(33.333% - #{$space-m})
        calc(33.333% - #{$space-m})
        calc(33.333% - #{$space-m});
    }
    @media (max-width: 900px) {
      grid-template-columns:
        calc(50% - #{$space-m})
        calc(50% - #{$space-m});
    }
    @media (max-width: 400px) {
      grid-template-columns: 100%;
    }
  }
}
.swatch {
  @include stack-space($space-s);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  height: $space-xxl;
  margin-left: -#{$space-s};
  margin-top: -#{$space-s};
  width: calc(100% + #{$space-l});
  float: left;
}
h4 {
  @include reset;
  @include stack-space($space-xs);
  text-transform: capitalize;
  line-height: 1.2;
  width: 100%;
  float: left;
}
.color {
  @include reset;
  @include inset-space($space-s);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-bottom: $space-m;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15);
  font-size: $size-s;
  font-family: $font-text;
  color: $color-rich-black;
  border-radius: $radius-default;
  overflow: hidden;
  text-align: left;
  @supports (display: grid) {
    width: 100%;
    float: left;
  }
  @media (max-width: 400px) {
    margin-bottom: $space-m;
  }
  &:hover {
    span {
      color: $color-rich-black;
      em {
        color: $color-silver;
      }
    }
  }
  span {
    margin-bottom: $space-xs;
    line-height: 1.3;
    color: $color-silver;
    font-size: $size-s;
    width: 100%;
    float: left;
    em {
      user-select: none;
      font-style: normal;
    }
  }
}
.colors__categories {
  h3 {
    text-transform: capitalize;
    border-bottom: 1px solid #c4cdd5;
    margin-bottom: $space-s;
  }
  > section:not(:first-child) {
    h3 {
      margin-top: $space-xxl;
    }
  }
  .colors__categories--menu {
    list-style-type: none;
    padding-left: 0;
    font-size: 10px;
    float: right;
    display: flex;
    li {
      display: inline-block;
      padding: 0 5px;
      border-left: 1px solid #c4cdd5;
      &:first-child {
        border: none;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
}
</style>

<docs>
  ```jsx
  <color/>
  ```
</docs>
