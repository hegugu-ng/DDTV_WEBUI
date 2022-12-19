<template>
  <div class="nav" :style="{ width: dw + 'px' }" id="navbar" v-show="$route.meta.show && screenWidth > 1024">
    <div class="logo"></div>
    <div class="router-bar">
      <div
        class="bar-item"
        v-for="(item, count) in info"
        :key="count"
        @click="$router.push({ path: item.router })"
        :style="item.router == $route.path ? 'background-color: #1863ff;' : ''"
      >
        <el-tooltip class="item" effect="dark" :content="item.title" placement="right" :disabled="!navBar">
          <button class="ddtv-ui-bt nav-bt" :style="itemcss">
            <ng-svg class="nav-icon" :icon-class="item.icon" />
            <div class="title" v-show="titleshow">{{ item.title }}</div>
          </button>
        </el-tooltip>
      </div>
    </div>
    <div :class="'/about' === $route.path ? 'bar-item navon' : 'bar-item'" @click="$router.push({ path: '/about' })">
      <button class="ddtv-ui-bt nav-bt" :style="itemcss">
        <ng-svg class="nav-icon" icon-class="more" />
        <div class="title" v-if="titleshow">更多</div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import TweenLite from "gsap";

export default {
  name: "navBar",
  computed: {
    ...mapGetters(["navBar"]),
    ...mapState(["screenWidth"]),
  },
  data() {
    return {
      dw: "",
      dt: [1, 2, 3, 4, 5],
      itemcss: null,
      titleshow: null,
      info: [
        { title: "概览", router: "/", icon: "home" },
        { title: "房间配置", router: "/room", icon: "roomsettimg" },
        { title: "系统设置", router: "/setting", icon: "setting" },
        { title: "文件管理", router: "/files", icon: "folder" },
        // {title:"任务管理",router:'/event',icon:'rank_fill'},
      ],
    };
  },
  beforeMount() {
    // 在挂载页面前 规定起始宽度，避免闪烁
    if (document.documentElement.clientWidth < 1400) this.NavOff();
    else this.NavOn();
  },
  watch: {
    navBar: function (val) {
      if (val) this.NavOff();
      else this.NavOn();
      // if (oldval != val &&  this.screenWidth> 1024) {
      // if(!this.$route.meta.show){return}
      TweenLite.to(".nav", { width: this.dw, duration: 0.3 });
      // }
    },
  },
  methods: {
    ...mapMutations(["addLog"]),
    NavOn: function () {
      this.titleshow = true;
      this.addLog({ lv: "debug", msg: "导航栏展开" });
      // console.debug("[UI] 导航栏展开")
      this.dw = 220;
      this.itemcss = { "justify-content": "flex-start", "padding-left": "10px" };
    },
    NavOff: function () {
      this.titleshow = false;
      this.addLog({ lv: "debug", msg: "导航栏收缩" });
      this.dw = 46;
      this.itemcss = { "justify-content": "center" };
    },
  },
};
</script>

<style scoped>
.nav {
  width: 208px;
  z-index: 2;
  background-color: #05072b;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  /* box-shadow: 2px 0 10px rgb(0 0 0 / 10%); */
  /* border-right: 1px solid #e6e4e4; */
  box-shadow: 2px 0 6px 0 rgb(0 21 41 / 35%);
}
.view {
  flex: auto 1 1;
  height: 100%;
  overflow: hidden;
}
.logo {
  height: 65px;
  flex-shrink: 0;
}
.router-bar {
  flex: 100% 1 1;
  display: flex;
  flex-direction: column;
}
.more {
  height: 50px;
  flex-shrink: 0;
}
.bar-item {
  height: 56px;
  transition: 0.25s ease-in-out;
  /* background-color: darkseagreen; */
}
.bar-item:hover {
  background: #001b54;
}
.nav-bt {
  width: 100%;
  height: 100%;
  background: 0 0;
  border-radius: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
}
.nav-icon {
  font-size: 25px;
}
.title {
  flex-shrink: 0;
  font-size: 16px;
  padding-left: 15px;
  color: #fff;
}
</style>
