import {createRouter,createWebHashHistory} from 'vue-router'

import Home from '../views/Home.vue'
import Room from '../views/Room.vue'
import Setting from '../views/Setting.vue'
import Login from '../views/Login.vue'
import Flv from '../views/flv.vue'
import About from '../views/About.vue'

import {isAuthenticated} from '../utils/authenticated'

// Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      login: true,
      show: true,
      title: '概览'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      login: true,
      show: true,
      title: '关于'
    }
  },
  {
    path: '/room',
    name: 'Room',
    component: Room,
    meta: {
      login: true,
      show: true,
      title: '房间配置'
    }
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: {
      login: true,
      show: true,
      title: '系统设置'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      login: false,
      show: false,
      title: '登录'
    }
  },
  {
    path: '/flv',
    name: 'flv',
    component: Flv,
    meta: {
      login: true,
      show: true,
      title: 'FLV'
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


router.beforeEach(async (to, from, next) => {
  // 动态添加 title 后面拼接一个名称
  document.title = `DDTV - ${to.meta.title}`
  let Authenticated = isAuthenticated()
  // 如果用户登录了还想要回到登录页 取消跳转
  if (to.path == '/login' && Authenticated) {
    next({ path: from.path })
  }
  // 判断鉴权  逻辑:如果在除了 Login 的其他页面 且没有登录状态的 定向到登录页
  if (to.name !== 'Login' && !Authenticated) next({path: '/login' })
  else next()
})


export default router