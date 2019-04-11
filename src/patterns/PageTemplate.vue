<template>
  <main class="background--white event" role="main">
    <slot name="breadcrumb"> </slot>
    <article>
      <slot name="header"> </slot>
      <slot name="content"> </slot>
    </article>
  </main>
</template>

<script>
export default {
  name: "PageTemplate",
}
</script>
