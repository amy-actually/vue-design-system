<template>
  <component
    :is="element"
    class="location__address"
    :class="{ 'mt-4 pt-4 border-top': type === 'sidebar' }"
    :itemprop="type"
    itemscope
    itemtype="http://schema.org/PostalAddress"
  >
    <div class="location__street h4" itemprop="streetAddress">{{ address }}</div>
    <div v-if="mailing_address" class="location__mailing h4">
      {{ mailing_address }}
    </div>
    <div class="location__city h4">
      <span itemprop="addressLocality">{{ city }}, {{ state }}</span>
      <span itemprop="postalCode">{{ zip }}</span>
    </div>
    <div class="location__fax my-3" v-if="phone">
      Tel: <a :href="`tel:1-${phone}`" itemprop="telephone">{{ phone }}</a>
    </div>
    <div class="location__fax my-3" v-if="fax">
      Fax: <span itemprop="faxNumber">{{ fax }}</span>
    </div>
  </component>
</template>
<script>
/**
 * A wrapper for a location address that provides schema.org markup
 */
export default {
  name: "Address",
  status: "prototype",
  release: "1.0.0",
  props: {
    /**
     * The element the component renders as.
     */
    element: {
      default: "address",
      type: String,
    },
    /**
     * The street address / physical location
     */
    address: {
      type: String,
    },
    /**
     * The mailing address (if different from street address)
     */
    mailingAddress: {
      type: String,
    },
    /**
     * City name
     */
    city: {
      type: String,
    },
    /**
     * 2-letter abbreviation for state
     */
    state: {
      type: String,
      default: "NC",
    },
    /**
     * Postal code
     */
    zip: {
      type: String,
    },
    /**
     * Telephone/Contact Number
     */
    phone: {
      type: String,
      default: null,
    },
    /**
     * Location's Fax number
     */
    fax: {
      type: String,
      default: null,
    },
    /**
     * The address type (schema.org specified), if needed.
     */
    type: {
      type: String,
      default: "address",
      validator: value => value.match(/(address|billingAddress|deliveryAddress|location)/),
    },
    /**
     * Layout variant
     */
    variant: {
      type: String,
      default: "card",
      validator: value => value.match(/(card|sidebar|featured)/),
    },
  },
}
</script>
<style lang="scss">
.location__address {
  font-style: normal;
}
</style>
<docs>
  ```jsx

    <Address
      address="249 Frank Allen Rd."
      mailingAddress="PO BOX 2127"
      city="Cashiers"
      phone="828-743-0215"
      fax="828-743-1638"
      zip="28717"
      />

  ```
</docs>
