<template>
  <page-template>
    <template v-slot:breadcrumb>
      <breadcrumb :current="page.title" :ancestors="nav" />
    </template>

    <template v-slot:header>
      <pageLead type="page" :title="page.title">
        <template v-slot:externalCta>
          <a
            class="wordpress-follow-button"
            href="https://fontanalib.wordpress.com"
            data-blog="https://fontanalib.wordpress.com"
            data-lang="en"
            data-show-follower-count="true"
            >Follow Shelf Life in the Mountains on WordPress.com</a
          >
        </template>

        <template v-slot:tagline>
          <em class="event__time text--dark">
            Posted: {{ page.date | moment("dddd, MMMM Do YYYY") }}
          </em>
        </template>
        <template v-slot:excerpt>
          <p class="event__excerpt" v-html="page.excerpt"></p>

          <div class="mb-3 clearfix">
            <a :href="page.URL" class="float-left">
              <c-button
                aria-label="read on wordpress.com"
                class="text--uppercase text--white button--blue-alternate"
                type="button"
              >
                <icon name="wordpress" />
                Read it on WordPress
              </c-button>
            </a>
            <div class="page__stats mt-1 float-right">
              <a class="btn button--pink btn-sm" v-on:click="count = 1">
                <icon name="like" />
                Likes <span class="badge badge-light">{{ page.like_count + count }}</span></a
              >

              <a :href="page.URL + '#comments'" class="btn btn-sm button--aqua">
                <icon name="comment" />
                Comments
                <span class="badge badge-light">{{ page.discussion.comment_count }}</span></a
              >
            </div>
          </div>

          <div class="col-6 mr-1">
            <person
              contentContainerClass="d-flex row mb-3 person"
              type="blog"
              :personObject="page.author"
            >
            </person>
          </div>
        </template>
      </pageLead>
    </template>

    <template v-slot:content>
      <pageContent :content="page.content" />
    </template>
  </page-template>
</template>

<script>
import PageTemplate from "../patterns/PageTemplate.vue"
import Breadcrumb from "../elements/Breadcrumb.vue"
import PageLead from "../patterns/PageLead.vue"
import PageContent from "../elements/PageContent.vue"
import Person from "../patterns/Person.vue"
import Icon from "../elements/Icon.vue"
import CButton from "../elements/Button.vue"

export default {
  name: "Blog",

  component: {
    Breadcrumb,
    PageContent,
    PageLead,
    PageTemplate,
    Person,
    Icon,
    CButton,
  },

  computed: {
    nav() {
      return [{ text: "Blog", to: "/blog/" }]
    },
  },
  data() {
    return {
      count: 0,
    }
  },
  props: {
    page: {
      type: Object,
    },
  },
}
</script>
<style lang="scss">
@import "~bootstrap/scss/_badge";
</style>
