<template>
  <card class="card--background-gray mb-3" content-type="collection" :heading="heading">
    <template slot="copy">
      <div class="showcase">
        <div class="showcase__wrap">
          <transition-group
            name="showcase-slide"
            tag="ul"
            class="showcase__carousel d-flex mb-3 justify-content-between align-items-stretch"
          >
            <li
              v-for="(item, index) in collectionItems"
              class="d-flex flex-shrink-0"
              :class="`order-` + computeOrder(index, currentItem)"
              :key="item.id"
            >
              <a class="d-flex" :href="item.acf.url">
                <img
                  class="showcase__image"
                  :src="item.featured_image"
                  :alt="item.title.rendered"
                />
                <div class="showcase__title">
                  <a href="item.acf.url">
                    <h3
                      class="h4 text--bold text--nowrap pb-1 text--ellipsis"
                      v-html="item.title.rendered"
                    ></h3>
                    <p
                      class="h5 mt-1 text--nowrap pb-1 text--ellipsis"
                      v-html="showcaseCreators(item)"
                    ></p>
                  </a>
                </div>
              </a>
            </li>
          </transition-group>

          <div class="showcase__controls">
            <a
              @click="previousItems"
              href="javascript:void(0)"
              class="showcase__controls--prev background--blue-alternate"
            >
              &laquo;
            </a>

            <a
              @click="nextItems"
              href="javascript:void(0)"
              class="showcase__controls--next background--blue-alternate"
            >
              &raquo;
            </a>
          </div>
          <!-- end .showcase__controls -->
        </div>
        <!-- end .showcase__wrap-->

        <vue-link
          class="link"
          :to="{
            name: 'collection-type-slug',
            params: { channel: heading, type: collectionType, userLocation: location },
          }"
          v-if="collectionLink && collectionType"
        >
          {{ collectionLinkLabel }}
        </vue-link>
        <vue-link
          class="link"
          :to="{
            name: 'collection-type',
            params: {
              slug: collectionLink,
              channel: heading,
              type: collectionType,
              userLocation: location,
            },
          }"
          v-else-if="!collectionLink && collectionType"
        >
          {{ collectionLinkLabel }}
        </vue-link>
      </div>
      <!-- end .showcase -->
    </template>
  </card>
</template>

<script>
import VueLink from "vue-link"
import Card from "./Card.vue"

export default {
  name: "Showcase",

  component: {
    Card,
    VueLink,
  },
  data() {
    return {
      currentItem: 0,
    }
  },
  methods: {
    showcaseCreators(item) {
      const { creators } = item.acf
      if (creators == false) {
        return ""
      }
      const { name: creatorName } = creators.find(creator => creator.name)
      const hasMoreThanOneCreator = creators.length > 1

      return `by ${creatorName} ${hasMoreThanOneCreator ? "and others" : ""}`
    },
    nextItems() {
      this.currentItem =
        this.currentItem + this.jumpDistance < this.collectionItems.length
          ? this.currentItem + this.jumpDistance
          : this.currentItem + this.jumpDistance - this.collectionItems.length
    },
    previousItems() {
      this.currentItem =
        this.currentItem - this.jumpDistance >= 0
          ? this.currentItem - this.jumpDistance
          : this.collectionItems.length + (this.currentItem - this.jumpDistance)
    },
    computeOrder(index, currentItem) {
      return index - currentItem > this.jumpDistance
        ? index - (currentItem + this.jumpDistance)
        : index - currentItem < this.jumpDistance
        ? this.collectionItems.length - currentItem - this.jumpDistance + index
        : "0"
    },
  },

  props: {
    collectionLink: {
      type: String,
    },

    collectionLinkLabel: {
      default: "See more",
      type: String,
    },

    collectionItems: {
      required: true,
      type: Array,
    },

    heading: {
      required: true,
      type: String,
    },
    jumpDistance: {
      type: Number,
      default: 2,
    },
    collectionType: {
      type: String,
    },
    location: {
      type: String,
    },
  },
}
</script>
<style lang="scss">
.showcase-slide-move {
  transition: transform 1s ease-in-out;
}

.showcase__wrap {
  position: relative;
}

.showcase__carousel {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.showcase__carousel::-webkit-scrollbar {
  display: none;
}

.showcase__carousel li {
  list-style: none;
  position: relative;
  margin: 0 1px;
  padding-top: 70px;
}

/*================================================ 
/* ## content
================================================== */
.showcase__title {
  position: absolute;
  display: block;
  left: 0;
  right: 0;
  padding-right: 0.75vw;
  text-align: left;
  width: 100%;
  opacity: 1;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  * {
    color: #143352;
  }
  h3 {
    margin-bottom: 0;
  }
}

.showcase__title a {
  text-decoration: none;
}

.showcase__image {
  object-fit: cover;
  height: 30vw;

  @media #{$media-query-medium} {
    height: 20vw;
  }
  @media #{$media-query-large} {
    height: 15vw;
  }
  @media (min-width: 1350px) {
    height: 10vw;
  }
}

/*================================================ 
/* ## controls
================================================== */
.showcase__controls {
  text-align: center;
  position: absolute;
  top: 60%;
  width: 100%;
}
.showcase__controls--prev,
.showcase__controls--next {
  cursor: pointer;
  position: absolute;
  display: inline-block;
  width: 30px;
  height: 30px;
  text-decoration: none;
  font-size: 30px;
  line-height: 0.75;
  color: #fff;
  text-align: center;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  opacity: 0.4;
}
.showcase__controls--prev {
  left: 0;
  margin-left: -0.5em;
}
.showcase__controls--next {
  right: 0;
  margin-right: -0.5em;
}

.showcase__controls--prev:hover,
.showcase__controls--next:hover {
  opacity: 0.9;
}
</style>
