<template>
  <svg :class="svgClass" :style="style" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "svgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    size: {
      type: Object,
      default: {width: '1em',height: '1em'},
    },
    color:{
      type:String,
      default:"#2c3e50"
    }
  },
  data: function () {
    return {
      style:{
        width: this.size.width,
        height: this.size.height,
        color: this.color
      }
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
  },
};
</script>

<style scoped>
.svg-icon {
  fill: currentColor;
  overflow: hidden;
}
</style>