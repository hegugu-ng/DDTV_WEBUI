<template>
  <!--菜单栏-->
  <div class="top-bar" v-if="$route.meta.show">
    <div class="top-bar-title">
      {{ $route.meta.title }}
    </div>
    <button type="button" class="ddtv-ui-bt barnav"  v-show="screenWidth<1024">
      <div class="bt-content">
        <i class="el-icon-s-unfold"></i>
        <span class="default-slot"></span>
      </div>
    </button>
  </div>
</template>
<script>
import { mapState } from 'vuex';export default {
  name: "top-bar",
  computed:{
    ...mapState(['screenWidth']),
  },
};
</script>

<style scoped>
.top-bar {
  padding: 16px;
  display: flex;
  align-items: center;
  height: 32px;
  background: #ffffff;
  justify-content: flex-start;
  border-bottom: 1px solid #e6e4e4;
  z-index: 1;
  }
.top-bar-title {
  font-size: 28px;
  font-weight: 300;
}
.barnav{
  background-color: #ffffff00;
  font-size: 25px;
}
</style>