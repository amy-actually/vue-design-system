<template>
  <card
    :badge-label="variant === 'sidebar' ? 'Location Information' : location.name"
    :class="
      variant === 'sidebar' ? 'card--background-gray text--dark my-2' : 'card--background-gray'
    "
    :copy="variant !== 'sidebar' ? location.description : ''"
    :explainer="variant !== 'sidebar' ? location.acf.city : ''"
    :heading="variant === 'sidebar' ? 'Hours' : ''"
    :key="location.id"
    v-bind:style="variant !== 'sidebar' ? { 'min-height': '197px' } : {}"
    itemscope
    itemtype="http://schema.org/Library"
  >
    <template v-slot:copy :class="variant !== 'sidebar' ? 'row d-flex' : ''"
      ><!-- DIV 1 -->
      <!-- SIDEBAR Operating Hours -->
      <template v-if="variant === 'sidebar'">
        <div class="location__hours__wrap d-flex flex-column">
          <!-- DIV 2 -->
          <!-- DIV 3 -->
          <div
            class="location__hours"
            v-for="(day, index) in library.acf.operating_hours"
            :key="index"
            :class="getOrder(index, day)"
            v-html="getOperatingHours(index, day)"
            itemprop="openingHoursSpecification"
            itemtype="http://schema.org/OpeningHoursSpecification"
          ></div>
          <!-- CLOSE DIV 3-->
        </div>
        <!-- CLOSE DIV 2 -->

        <address
          :location="location"
          :variant="variant"
          :address="location.acf.address"
          :mailing-address="location.acf.mailing_address"
          :city="location.acf.city"
          :zip="location.acf.zip"
          :fax="location.acf.fax"
        />
        <div class="location__social mt-3">
          <!-- DIV 4 -->
          <vue-link
            v-if="library.acf.facebook_username"
            :href="`https://facebook.com/${library.acf.facebook_username}`"
            itemprop="sameAs"
          >
            <Icon name="facebook" />
          </vue-link>
        </div>
        <!-- CLOSE DIV 4-->
        <div class="d-flex flex-column">
          <!-- DIV 5-->
          <c-button
            :aria-label="'phone ' + location.name"
            type="button"
            :href="`tel:1-${library.acf.phone}`"
          >
            <Icon name="phone" fill="#fff" size="medium" class="location__phone-button__icon" />
            <span> {{ library.acf.phone }}</span>
          </c-button>

          <img :src="library.acf.building_image.url" class="flex-grow-0" />
          <template v-for="contact in library.acf.contact">
            <person
              :key="contact.person.ID"
              :name="contact.person.post_title"
              :title="contact.title"
              type="organizer"
              :personObject="getLibrarian(contact.person.ID)"
            >
            </person>
          </template>
        </div>
        <!-- CLOSE DIV 5--></template
      ><!-- END sidebar operating hours-->

      <!-- Non-sidebar address/phone -->
      <div v-if="variant !== 'sidebar'">
        <!--DIV 6-->
        <div class="col-4 order-2 align-self-end">
          <!--DIV 7-->
          <img :src="location.acf.building_image.url" />
        </div>
        <!-- CLOSE DIV 7-->

        <div class="col col-8 order-0">
          <!--DIV 8-->
          <c-button :aria-label="'phone ' + location.name" type="button">{{
            location.acf.phone
          }}</c-button>
          <address
            :location="location"
            :variant="variant"
            :address="location.acf.address"
            :mailing-address="location.acf.mailing_address"
            :city="location.acf.city"
            :zip="location.acf.zip"
            :fax="location.acf.fax"
          />
        </div>
        <!-- CLOSE DIV 8-->
        <!-- END Non-sidebar address/phone -->
      </div>
      <!-- CLOSE DIV 6--> </template
    ><!-- CLOSE DIV 1 -->
    <template v-slot:action>
      <vue-link
        v-if="variant !== 'sidebar'"
        class="button button--blue-alternate"
        :to="`/locations/${location.slug}`"
        >More</vue-link
      >
      <vue-link
        v-else-if="variant === 'sidebar' && location.slug !== 'headquarters'"
        itemprop="branchOf"
        class="link mt-4"
        to="/locations/headquarters"
        >Member of Fontana Regional Library</vue-link
      >
    </template>
  </card>
</template>

<script>
import VueLink from "vue-link"
import VueMoment from "vue-moment"

import Card from "./Card.vue"
import Heading from "../elements/Heading.vue"
import CButton from "../elements/Button.vue"
import Address from "../elements/Address.vue"
import Icon from "../elements/Icon.vue"
import Person from "./Person.vue"

Vue.use(VueMoment)

export default {
  name: "LocationCard",

  component: {
    Card,
    Heading,
    VueLink,
    CButton,
    Address,
    Icon,
    Person,
  },

  computed: {
    time() {
      return moment()
    },
    today() {
      return this.time.day()
    },
    status() {
      const open = moment(this.location.acf.operating_hours[this.today].open, this.format)
      const close = moment(this.location.acf.operating_hours[this.today].close, this.format)
      const current = this.time.isBetween(open, close) ? "open" : "closed"
      if (current === "open" && close.diff(time, "minutes") < 46) {
        current = "closing-soon"
      }
      return current
    },
  },
  data() {
    return {
      format: "hh:mm a",
    }
  },
  methods: {
    /**
     * Determines the order so that Today is always listed first.
     */
    getOrder(day, hours) {
      const weekday = moment()
        .day(day)
        .weekday()
      return today == weekday
        ? `order-0 ${this.status}`
        : weekday - today > 0
        ? "order-" + (weekday - today)
        : "order-" + (7 - today + weekday)
    },

    /**
     * Generates the HTML to display the operating hours for a given day.
     */
    getOperatingHours(day, hours) {
      day = day[0].toUpperCase() + day.substring(1).toLowerCase()
      return hours.closed
        ? `<span class='location__hours__day__name'>${day}</span> <span class='location__hours__day__hours--closed'>Closed</span></div>`
        : `<span class='location__hours__day__name' itemprop="dayOfWeek" href="http://schema.org/${day}">${day}</span> <span class='location__hours__day__hours'><span itemprop="opens" content="${moment(
            hours.open,
            this.format
          ).format("HH:mm:ss")}">${hours.open}</span>- <span itemprop="closes" content="${moment(
            hours.close,
            this.format
          ).format("HH:mm:ss")}">${hours.close}</span></span></div>`
    },
    /**
     * Returns Organizer Profile
     */
    getLibrarian(id) {
      return this.$store.state.tribe.organizers.find(organizer => organizer.id == id)
    },
  },

  props: {
    location: {
      required: true,
      type: Object,
    },

    variant: {
      type: String,
      default: "card",
      validator: value => value.match(/(card|sidebar|featured)/),
    },
  },
}
</script>

<style lang="scss">
.event {
  &.link {
    &:focus,
    &:hover {
      box-shadow: $box-shadow-small;
    }

    transition: all 0.2s ease-out;
  }
}
</style>
