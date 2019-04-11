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
export default {
  name: "Address",

  props: {
    /**
     * The element the component renders as.
     */
    element: {
      default: "address",
      type: String,
    },
    /**
     * The library for which to render an address
     */
    address: {
      type: String,
    },
    mailingAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
      default: "NC",
    },
    zip: {
      type: String,
    },
    phone: {
      type: String,
      default: null,
    },
    fax: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "address",
      validator: value => value.match(/(address|billingAddress|deliveryAddress|location)/),
    },
    /**
     *
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
