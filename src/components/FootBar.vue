<template>
  <div class="footbar">
    <a
      class="bartext"
      target="_blank"
      :href="info.info.link"
      v-if="info.info.show"
      >{{ info.info.text }}</a
    >
    <a class="icp bartext" target="_blank" :href="info.ICP.link" v-if="info.ICP.show">{{
      info.ICP.text
    }}</a>
    <div class="gabeian" target="_blank" :href="info.GA.link" v-if="info.GA.show">
      <img
        class="gaicon"
        :src="require('../assets/img/gaba.png')"
        alt="公安备案"
      />
      <a class="text bartext" target="_blank" :href="info.GA.link" >{{ info.GA.text }}</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: window.BarInfo,
    };
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
} /*正常的未被访问过的链接*/
a:link {
  text-decoration: none;
} /*已经访问过的链接*/
a:visited {
  text-decoration: none;
} /*鼠标划过(停留)的链接*/
a:hover {
  text-decoration: none;
} /* 正在点击的链接*/
a:active {
  text-decoration: none;
}
.footbar {
  height: 40px;
  overflow: hidden;
  color: rgb(141, 141, 141);
  font-size: 12px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  position: absolute;
  bottom: 0;
}
.bartext {
  text-decoration: none;
  line-height: 20px;
  color: rgb(129, 129, 129);
  mix-blend-mode: difference;
}
.bartext:hover {
  color: rgba(236, 84, 84, 0.87);
}
.icp {
  text-decoration: none;
  height: 20px;
  line-height: 20px;
  color: rgb(129, 129, 129);
  flex-shrink: 0;
  margin-left: 10px;
}
.gabeian {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 10px;
}
.gabeian .text {
  float: left;
  height: 20px;
  line-height: 20px;
  margin: 0px 0px 0px 5px;
}
.gaicon {
  float: left;
  width: 15px;
  height: 15px
}
</style>

