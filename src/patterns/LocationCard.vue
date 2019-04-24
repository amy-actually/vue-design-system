<template>
  <card
    v-if="variant === 'sidebar'"
    badge-label="Location Information"
    class="card--background-gray text--dark my-2"
    heading="Hours"
    itemscope
    itemtype="http://schema.org/Library"
  >
    <template v-slot:copy>
      <div class="location__hours__wrap d-flex flex-column">
        <div
          class="location__hours"
          v-for="(day, index) in library.acf.operating_hours"
          :key="index"
          :class="getOrder(index, day)"
          v-html="getOperatingHours(index, day)"
          itemprop="openingHoursSpecification"
          itemtype="http://schema.org/OpeningHoursSpecification"
        ></div>
      </div>

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
    </template>
    <template v-slot:action>
      <router-link
        v-if="location.slug !== 'headquarters'"
        itemprop="branchOf"
        class="link mt-4"
        to="/locations/headquarters"
        >Member of Fontana Regional Library</router-link
      >
    </template>
  </card>
  <!--        :copy="location.description" -->
  <card
    v-else
    :badge-label="location.name"
    class="card--background-gray"
    :explainer="location.acf.city"
    v-bind:style="{ 'min-height': '197px' }"
    itemscope
    itemtype="http://schema.org/Library"
  >
    <template v-slot:copy class="row d-flex">
      <div class="col-4 order-2 align-self-end">
        <img :src="location.acf.building_image.url" />
      </div>

      <div class="col col-8 order-0">
        <c-button :aria-label="'phone ' + location.name" type="button">
          {{ location.acf.phone }}</c-button
        >
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
    </template>

    <template v-slot:action>
      <router-link class="button button--blue-alternate" :to="`/locations/${location.slug}`"
        >More</router-link
      >
    </template>
  </card>
</template>
<script>
import VueLink from "vue-link"
import moment from "moment"
import Card from "./Card.vue"
import Heading from "../elements/Heading.vue"
import CButton from "../elements/Button.vue"
import Address from "../elements/Address.vue"
import Icon from "../elements/Icon.vue"
import Person from "./Person.vue"

export default {
  name: "LocationCard",

  component: {
    Card,
    Heading,
    CButton,
    Address,
    Icon,
    Person,
    VueLink,
  },

  computed: {
    time() {
      return moment()
    },
    today() {
      return this.time.day()
    },
    status() {
      if (!this.location) {
        console.log("beep beep")
        return ""
      }
      console.log("beep beep")
      const open = moment(this.location.acf.operating_hours[this.today].open, this.format)
      console.log(open)
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
