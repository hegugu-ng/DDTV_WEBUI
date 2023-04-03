<template>
  <div class="nav" id="navbar">
    <div class="logo"></div>
    <div class="router-bar">
      <el-menu router :collapse="isCollapse" :collapse-transition="false" class="nav">
        <el-menu-item :index="item.router" v-for="(item, count) in info" :key="count">
          <el-icon><ng-svg class="nav-icon" :icon-class="item.icon" /></el-icon>
          <template #title>
            <div class="title">{{ item.title }}</div>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div :class="'/about' === $route.path ? 'bar-item navon' : 'bar-item'" @click="$router.push({ path: '/about' })">
      <button class="ddtv-ui-bt nav-bt" :style="itemcss">
        <ng-svg class="nav-icon" icon-class="more" />
        <div class="title" v-if="titleshow">更多</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();

const isCollapse = ref(
  computed(() => {
    return width.value < 1024;
  })
);
</script>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "navBar",
  computed: {
    ...mapGetters(["navBar"]),
    ...mapState(["screenWidth"])
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
        { title: "文件管理", router: "/files", icon: "folder" }
        // {title:"任务管理",router:'/event',icon:'rank_fill'},
      ]
    };
  }
  // beforeMount() {
  //   // 在挂载页面前 规定起始宽度，避免闪烁
  //   if (document.documentElement.clientWidth < 1400) this.NavOff();
  //   else this.NavOn();
  // },
  // watch: {
  //   navBar: function (val) {
  //     if (val) this.NavOff();
  //     else this.NavOn();
  //     // if (oldval != val &&  this.screenWidth> 1024) {
  //     // if(!this.$route.meta.show){return}
  //     TweenLite.to(".nav", { width: this.dw, duration: 0.3 });
  //     // }
  //   }
  // },
  // methods: {
  //   ...mapMutations(["addLog"]),
  //   NavOn: function () {
  //     this.titleshow = true;
  //     this.addLog({ lv: "debug", msg: "导航栏展开" });
  //     // console.debug("[UI] 导航栏展开")
  //     this.dw = 220;
  //     this.itemcss = { "justify-content": "flex-start", "padding-left": "10px" };
  //   },
  //   NavOff: function () {
  //     this.titleshow = false;
  //     this.addLog({ lv: "debug", msg: "导航栏收缩" });
  //     this.dw = 46;
  //     this.itemcss = { "justify-content": "center" };
  //   }
  // }
};
</script>

<style scoped lang="css">
@media screen and (min-width: 1024px) {
  .nav {
    width: 206px;
    display: none;
    justify-content: "flex-start";
    padding-left: "10px";
  }
}
.nav {
  z-index: 2;
  background-color: #05072b;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border: 0;
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
  color: #fff;
}
</style>
