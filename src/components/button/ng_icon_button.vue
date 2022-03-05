<template>
  <div class="section action current-project">
    <i class="icon-bar" :class="icon"></i>
  </div>
</template>
<script>
export default {
  name: "ddtv_ui_bt",
  props: {
    icon: String,
  },
};
</script>
<style scoped>
.status-bar .section.action {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
}
.status-bar .section {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
    height: 100%;
    cursor: default;
}
.status-bar .section:hover {
    background: #2c3e51;
}
.icon-bar{
  font-size: 15px;
}

</style>
