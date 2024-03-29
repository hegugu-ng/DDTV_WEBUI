import { createRouter, createWebHashHistory } from "vue-router";

const Home = () => import("../views/Home.vue");
const Room = () => import("../views/Room.vue");
const Setting = () => import("../views/Setting.vue");
const Login = () => import("../views/Login.vue");
const Flv = () => import("../views/flv.vue");
const About = () => import("../views/About.vue");
const Files = () => import("../views/Files.vue");
const blogin = () => import("../views/blogin.vue");
const test = () => import("../views/test.vue");

// import { isAuthenticated } from "@/utils/authenticated";

// Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      login: true,
      show: true,
      title: "概览"
    }
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      login: false,
      show: false,
      title: "关于"
    }
  },
  {
    path: "/room",
    name: "Room",
    component: Room,
    meta: {
      login: true,
      show: true,
      title: "房间配置"
    }
  },
  {
    path: "/files",
    name: "Files",
    component: Files,
    meta: {
      login: true,
      show: true,
      title: "文件管理"
    }
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    meta: {
      login: true,
      show: true,
      title: "系统设置"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      login: false,
      show: false,
      title: "登录"
    }
  },
  {
    path: "/flv",
    name: "flv",
    component: Flv,
    meta: {
      login: true,
      show: true,
      title: "FLV"
    }
  },
  {
    path: "/test",
    name: "test",
    component: test,
    meta: {
      login: true,
      show: true,
      title: "测试"
    }
  },
  {
    path: "/blogin",
    name: "blogin",
    component: blogin,
    meta: {
      login: true,
      show: true,
      title: "登录B站"
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
router.beforeEach(async (to, from, next) => {
  // 动态添加 title 后面拼接一个名称
  document.title = `DDTV WEB UI - ${to.meta.title}`;
  next();
});

export default router;
