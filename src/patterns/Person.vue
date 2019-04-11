<template>
  <component
    class="person background--gray p-1"
    :is="element"
    :class="[contentContainerClass, type === 'blog' ? 'person--blogger' : '']"
  >
    <div class="align-items-center d-flex card person">
      <div class="person__avatar" v-if="avatar">
        <img :src="avatar" :class="{ 'person__avatar-rectangle': rectangle }" />
      </div>
      <div v-else class="person__avatar">
        <img src="https://source.unsplash.com/random/64x64" />
      </div>

      <div class="person__content">
        <p class="align-items-center mt-3">
          <span class="text--dark text--bold text--underlined person__name">{{ nice_name }}</span>
          <br />
          <span class="text--small text--dark" v-if="description" v-html="description"></span>
        </p>
      </div>
    </div>
  </component>
</template>
<script>
export default {
  name: "Person",
  computed: {
    avatar() {
      if (this.profileImage) {
        return this.profileImage === Object(this.profileImage)
          ? this.getImage(this.profileImage)
          : this.profileImage
      }
      let image = []
      switch (this.type) {
        case "organizer":
          if (this.personObject.image) {
            image.url = this.personObject.image.url
            image.w = this.personObject.image.width
            image.h = this.personObject.image.height
          }
          break
        case "blog":
          image = this.personObject.avatar_URL
          break
        default:
          image = this.personObject.avatar_urls[96]
          break
      }
      return this.getImage(image)
    },
    nice_name() {
      if (this.name) {
        return this.name
      }
      if (this.personObject) {
        return this.type === "organizer"
          ? this.personObject.organizer || this.personObject.post_title
          : this.type === "blog" && this.personObject.first_name && this.personObject.last_name
          ? this.personObject.first_name + " " + this.personObject.last_name
          : this.type === "blog" && this.personObject.name
          ? this.personObject.name
          : this.type === "blog"
          ? this.personObject.nice_name
          : this.personObject.name || ""
      }
      return ""
    },
    description() {
      if (this.title) {
        return this.title
      }
      if (this.personObject) {
        return this.type === "organizer"
          ? this.personObject.description || this.personObject.post_content
          : this.type === "blog"
          ? `Blogger <a href='https://fontanalib.wordpress.com/author/${
              this.personObject.login
            }/'>Read more at Wordpress.com</a>`
          : this.personObject.content
          ? this.personObject.content
          : this.personObject.description
          ? this.personObject.description
          : ""
      }
      return null
    },
  },
  data() {
    return {
      rectangle: false,
    }
  },
  methods: {
    getImage(image) {
      if (!image.url) {
        let img = new Image()
        img.src = image
        img.style.position = "absolute"
        img.style.left = -9999 // Image width must not exceed 9999 pixels
        img.style.visibility = "hidden" // Maybe you can remove this
        document.body.appendChild(img)
        this.rectangle = img.height !== image.width
        document.body.removeChild(img)
        return image
      }
      this.rectangle = image.w !== image.h
      return image.url
    },
  },
  props: {
    /**
     * CSS class for person container
     */
    contentContainerClass: {
      type: String,
    },
    /**
     * HTML Element for the container
     */
    element: {
      type: String,
      default: "div",
    },
    name: {
      type: String,
    },
    /**
     * An object containing the person's information (e.g. organizer or blogger profile)
     */
    personObject: {
      type: Object,
    },
    /**
     * The src/url for a person's image
     */
    profileImage: {
      default: null,
    },
    /**
     * The person's title/description
     */
    title: {
      type: String,
    },
    /**
     * The type of person/personObject (e.g. 'organizer' or 'blog')
     */
    type: {
      type: String,
    },
  },
}
</script>
<style lang="scss">
.person {
  position: relative;
}
.person__avatar {
  flex: 0 0 100%;
  margin-left: 1rem;
  margin-right: 1rem;
  max-width: 64px;
  max-height: 64px;
  width: 25%;
  overflow: hidden;
  border-radius: 50%;
}
.person__avatar img {
  max-width: 100%;
  vertical-align: bottom;
}
.person__avatar-rectangle {
  min-width: 64px;
  min-height: 64px;
  margin: auto;
}
.person--blogger a {
  display: block;
  margin-top: 0.5em;
  text-decoration: none;
  color: $color_teal;
}
.person--blogger a:hover {
  font-weight: bold;
}
</style>
<docs>
  ```jsx
  <div>
<person profileImage="https://fontanalib.wordpress.com/author/awestlib" name="Amy West" title="Digital Content Coordinator, Fontana Regional Library" />
  </div>
  ```
</docs>
