<template>
  <div class="TypeTag" :class="level" v-if="levelshow">{{ level }}</div>
</template>
<script>
export default {
  name: "TypeTag",
  props: {
    level: String,
    levelshow:Boolean
  },
};
</script>

<style scoped>
.TypeTag {
  color: #fff;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  flex: auto 0 0;
  width: 30px;
  text-align:center
}
.info {
  background: #03c2e6;
}
.error {
  background: #F56C6C;
}
.warn {
  background: #E6A23C;
}
.debug {
  background: #909399;
}
</style>