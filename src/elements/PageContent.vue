<template>
  <section class="background--gray page__content">
    <div class="col-11 col-md-10 col-lg-6 m-auto pt-4 pb-4 p-lg-4">
      <div v-html="content"></div>
      <slot></slot>
    </div>
  </section>
</template>
<script>
export default {
  name: "PageContent",
  props: {
    content: {
      type: String,
    },
  },
}
</script>
<style lang="scss">
.page__content {
  font-size: 1rem;
  color: $color_blue_dark;

  p {
    margin: 2em 0;
  }
  .tiled-gallery {
    margin: auto;
    padding: 2em 0;
    text-align: center;
    display: flex;
    flex-flow: column;
    align-items: center;
    .gallery-row {
      display: flex;
      flex-flow: row wrap;
      .gallery-group {
        display: flex;
        flex-flow: column;
        a {
          display: flex;
          flex-flow: column;
        }
      }
    }
    .tiled-gallery-item {
      margin-bottom: 1em;
    }
  }
  .alignnone {
    max-width: 100%;
    img {
      max-width: 100%;
      height: auto;
    }
  }
  .wp-caption-text,
  .tiled-gallery-caption {
    text-align: center;
    margin-top: 0;
    font-style: italic;
    color: $color_blue_alternate;
  }
}
</style>
