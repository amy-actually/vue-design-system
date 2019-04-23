<template>
  <div class="spinner">
    <div class="spinner__hollow-dots" :style="spinnerStyle">
      <div class="dot" v-for="(ds, index) in dotsStyles" :style="ds" :key="index"></div>
    </div>
    <div class="spinner__loading text--sans mt-3" :style="loadStyle">Loading</div>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    animationDuration: {
      type: Number,
      default: 1000,
    },
    dotSize: {
      type: Number,
      default: 15,
    },
    dotsNum: {
      type: Number,
      default: 3,
    },
    color: {
      type: String,
      default: "rgba(0, 0, 0, .4)",
    },
  },
  computed: {
    horizontalMargin() {
      return this.dotSize / 2
    },
    spinnerStyle() {
      return {
        height: `${this.dotSize}px`,
        width: `${(this.dotSize + this.horizontalMargin * 2) * this.dotsNum}px`,
      }
    },
    dotStyle() {
      return {
        animationDuration: `${this.animationDuration}ms`,
        width: `${this.dotSize}px`,
        height: `${this.dotSize}px`,
        margin: `0 ${this.horizontalMargin}px`,
        borderWidth: `${this.dotSize / 5}px`,
        borderColor: this.color,
      }
    },
    loadStyle() {
      return {
        fontSize: `15px`, //${this.dotSize/2}
        color: this.color,
        textTransform: "uppercase",
      }
    },
    dotsStyles() {
      const dotsStyles = []
      const delayModifier = 0.3
      const basicDelay = 1000
      for (let i = 1; i <= this.dotsNum; i++) {
        const style = Object.assign(
          {
            animationDelay: `${basicDelay * i * delayModifier}ms`,
          },
          this.dotStyle
        )
        dotsStyles.push(style)
      }
      return dotsStyles
    },
  },
}
</script>

<style scoped>
.spinner {
  text-align: center;
}
.spinner__loading {
  animation: pulsate 3s ease infinite;
}
.spinner__hollow-dots,
.spinner__hollow-dots * {
  box-sizing: border-box;
}
.spinner__hollow-dots {
  height: 15px;
  width: calc(30px * 3);
  margin: auto;
}
.spinner__hollow-dots .dot {
  width: 15px;
  height: 15px;
  margin: 0 calc(15px / 2);
  border: calc(15px / 5) solid #ff1d5e;
  border-radius: 50%;
  float: left;
  transform: scale(0);
  animation: spinner__hollow-dots-animation 1000ms ease infinite 0ms;
}
.spinner__hollow-dots .dot:nth-child(1) {
  animation-delay: calc(300ms * 1);
}
.spinner__hollow-dots .dot:nth-child(2) {
  animation-delay: calc(300ms * 2);
}
.spinner__hollow-dots .dot:nth-child(3) {
  animation-delay: calc(300ms * 3);
}
@keyframes spinner__hollow-dots-animation {
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes pulsate {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
