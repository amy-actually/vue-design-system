<template>
  <card
    contentType="location"
    class="card--background-gray my-2"
    :class="{ 'text--dark': isSidebar }"
    :explainer="isSidebar ? null : location.acf.city"
    :heading="isSidebar ? 'Hours' : null"
    :badge-label="isSidebar ? 'Location Information' : null"
    v-bind:style="{ 'min-height': '197px' }"
    itemscope
    itemtype="http://schema.org/Library"
  >
    <template v-slot:copy>
      <template v-if="isSidebar">
        <div class="location__hours__wrap d-flex flex-column">
          <div
            v-for="(day, index) in location.acf.operating_hours"
            :key="index"
            class="location__hours"
            :class="getOrder(index, day)"
            v-html="getOperatingHours(index, day)"
            itemprop="openingHoursSpecification"
            itemtype="http://schema.org/OpeningHoursSpecification"
          />
        </div>

        <div class="d-flex flex-column">
          <c-button
            :aria-label="'phone ' + location.name"
            type="button"
            :href="`tel:1-${location.acf.phone}`"
          >
            <Icon name="phone" fill="#fff" size="small" class="location__phone-button__icon" />
            <span> {{ location.acf.phone }}</span>
          </c-button>

          <img :src="location.acf.building_image.url" class="flex-grow-0" />

          <template v-for="contact in location.acf.contact">
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
        <address-block
          :location="location"
          :variant="variant"
          :address="location.acf.address"
          :mailing-address="
            location.acf.mailing_address && location.acf.mailing_address.length > 0
              ? location.acf.mailing_address
              : null
          "
          :city="location.acf.city"
          :zip="location.acf.zip"
          :fax="location.acf.fax"
        />

        <social-icon
          v-for="(social, index) in location.acf.social"
          :key="index"
          :url="social.address"
          :name="social.name"
        />
      </template>

      <div v-if="!isSidebar" class="row d-flex">
        <div class="col-4 order-2 align-self-end d-flex flex-column">
          <c-button
            :aria-label="'phone ' + location.name"
            type="button"
            class="location__phone flex-grow-1"
          >
            <Icon name="phone" fill="#fff" size="small" class="location__phone--icon" />
            {{ location.acf.phone }}</c-button
          >
          <img :src="location.acf.building_image.url" />
        </div>

        <div class="col col-8 order-0 d-flex flex-column justify-content-around">
          <heading level="h3"> {{ location.name }} </heading>
          <address-block
            :location="location"
            :variant="variant"
            :address="location.acf.address"
            :mailing-address="
              location.acf.mailing_address && location.acf.mailing_address.length > 0
                ? location.acf.mailing_address
                : null
            "
            :city="location.acf.city"
            :zip="location.acf.zip"
            :fax="location.acf.fax"
          />
          <!-- MOVE OUT OF CARD TO LOCATION PAGE -->
          <div v-if="location.acf.newsletter">
            <div
              v-for="newsletter in location.acf.newsletter"
              :key="newsletter.name"
              v-html="newsletter.signup_widget"
            />
          </div>
          <!-- ABOVE -->
          <div class="location__social mt-3">
            <!-- DIV 4 -->
            <social-icon
              v-for="(social, index) in location.acf.social"
              :key="index"
              :url="social.address"
              :name="social.name"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-slot:action v-if="!isSidebar">
      <vue-link class="button button--blue-alternate" :to="`/locations/${location.slug}`"
        >More</vue-link
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
import AddressBlock from "../elements/AddressBlock.vue"
import SocialIcon from "../elements/SocialIcon.vue"
import Icon from "../elements/Icon.vue"
import Person from "./Person.vue"

export default {
  name: "LocationCard",

  components: {
    Card,
    Heading,
    CButton,
    AddressBlock,
    SocialIcon,
    Person,
    VueLink,
    Icon,
  },

  computed: {
    isSidebar() {
      return this.variant === "sidebar"
    },
    status() {
      let today = moment()
        .format("dddd")
        .toLowerCase()

      if (this.location.acf.operating_hours[today].closed) {
        return "closed"
      }
      let time = moment()

      const open = moment(this.location.acf.operating_hours[today].open, this.format)
      const close = moment(this.location.acf.operating_hours[today].close, this.format)
      const current = time.isBetween(open, close) ? "open" : "closed"

      if (current === "open" && close.diff(time, "minutes") < 46) {
        return "closing-soon"
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
      const today = moment().day()
      const weekday = moment()
        .day(`${day}`)
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
        ? `<span class='location__hours__day__name'>${day}</span> <span class='location__hours__day__hours--closed'>Closed</span>`
        : `<span class='location__hours__day__name' itemprop="dayOfWeek" href="http://schema.org/${day}">${day}</span> <span class='location__hours__day__hours'><span itemprop="opens" content="${moment(
            hours.open,
            this.format
          ).format("HH:mm:ss")}">${hours.open}</span>- <span itemprop="closes" content="${moment(
            hours.close,
            this.format
          ).format("HH:mm:ss")}">${hours.close}</span></span>`
    },
    /**
     * Returns Organizer Profile
     */
    getLibrarian(id) {
      console.log(id)
      if (this.$store.state.tribe.organizers.length == 0) {
        let results = this.$store
          .dispatch("tribe/fetchAllContent", { type: "organizers" })
          .then(() => {
            return this.$store.getters["tribe/getTribeByField"]("organizers", "id", Number(id))
          })
      } else {
        return this.$store.getters["tribe/getTribeByField"]("organizers", "id", Number(id))
      }
    },

    buildFormFromWidget(widget) {
      /**
       * REMOVE THIS FUNCTION & USE embedded instead
       */
      console.log(widget)
      let fragment = document.createElement("div")
      fragment.innerHTML = widget
      let action = fragment.getElementsByTagName("form")[0].getAttribute("action")
      //action = action[0].getAttribute('action');

      let u = action.match(/(?:u=)(.*)(?:\&)/i, action)[1]
      let id = action.match(/(?:id=)(.*)(?:\&|$)/i, action)[1]
      action = action.match(/[^\?]*/i, action)[0]

      let inputs = fragment.getElementsByTagName("input")

      let form = `<form action="${action}" method="POST">
                  <input type="hidden" name="u" value="${u}">
                  <input type="hidden" name="id" value="${id}">
                  `

      const excludeInputs = ["radio", "button", "checkbox", "submit"]
      var count = 0
      for (let i = 0; i < inputs.length; i++) {
        const name = inputs[i].name

        if (
          inputs[i].type.toLowerCase() !== "hidden" &&
          !excludeInputs.includes(inputs[i].type.toLowerCase()) &&
          inputs[i].previousElementSibling
        ) {
          let newName = "MERGE" + count
          form += `<div class="form--field"><label for="${newName}">${
            inputs[i].previousElementSibling.innerText
          }</label><input type="${inputs[i].type}" name="${newName}" id="${newName}" value="${
            inputs[i].value
          }"></div>`
          count++
        }
      }

      return (
        form +
        `<input type="submit" class="formEmailButton" name="submit" value="Subscribe"></form>`
      )
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
.location__phone {
  font-size: 1em;
  position: relative;
  &--icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 0.2em;
    vertical-align: text-top;
  }
}
</style>
