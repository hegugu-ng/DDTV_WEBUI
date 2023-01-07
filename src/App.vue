<template>
  <!--容器div-->
  <div id="app">
    <!--重要信息通知栏-->
    <ConnectedBar />
    <!--主体div-->
    <div class="content">
      <nav-bar></nav-bar>
      <div class="view">
        <!--标题栏-->
        <TitleBar />
        <!--路由视图-->
        <div class="router scrollbar">
          <template>
            <el-backtop :right="100" :bottom="100" />
          </template>
          <router-view />
        </div>
      </div>
    </div>
    <!--状态栏-->
    <StatusBar />
    <!-- <FootBar /> -->
  </div>
</template>

<script>
import ConnectedBar from "./components/ConnectedBar.vue";
import StatusBar from "./components/StatusBar.vue";
import TitleBar from "./components/TitleBar.vue";
import navBar from "./components/NavBar.vue";
// import FootBar from "./components/FootBar.vue";
// import { isAuthenticated } from './utils/authenticated'
import { mapMutations } from "vuex";
export default {
  name: "App",
  components: {
    ConnectedBar,
    StatusBar,
    TitleBar,
    navBar
    // FootBar
  },
  data() {
    return {};
  },
  created() {
    // 注册一个监听器
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.addLog({ lv: "info", msg: "欢迎使用DDTV" });
    this.addLog({
      lv: "warn",
      msg: "此为DDTV WEB UI 预览版本，可能存在问题，不建议使用于生产环境"
    });
  },
  methods: {
    ...mapMutations(["screenWidth", "addLog"]),
    handleResize() {
      // 同步新的屏幕宽度到 store
      this.screenWidth(document.documentElement.clientWidth);
    }
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
}

#app,
.page,
body,
html {
  height: 100%;
}

html {
  touch-action: none;
}

* {
  margin: 0;
  padding: 0;
}

div {
  --font-mono: "Roboto Mono", Menlo, monospace;
  --font-normal: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, "PingFang SC", "Microsoft YaHei", "\5fae\8f6f\96c5\9ed1", Arial, sans-serif;
}

body {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
}

.content {
  display: flex;
  flex: auto 1 1;
  height: 100%;
  overflow: hidden;
}

.view {
  flex: auto 1 1;
  width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.router {
  flex: 1;
  overflow: auto;
  /* padding: 0 20px 20px 20px */
}

*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

*::-webkit-scrollbar-thumb {
  background-color: #b4c7d0;
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 5px;
}

*::-webkit-scrollbar-track-piece {
  background: 0 0;
}

.ddtv-ui-bt {
  display: inline-block;
  vertical-align: middle;
  border: none;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 0 14px;
  font-size: 14px;
  line-height: 16px;
  height: 32px;
  color: #2c3e50;
  background: #e4f5ef;
  outline: 0;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.ddtv-ui-bt.flat {
  color: #2c3e50;
  background: 0 0;
}

.ddtv-ui-bt.flat {
  -webkit-transition: background 0.1s, color 0.1s;
  transition: background 0.1s, color 0.1s;
}

.ddtv-ui-bt.flat:hover {
  background: #cae4da;
}
</style>
