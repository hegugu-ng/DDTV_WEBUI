// import Vue from 'vue'
import { createStore } from 'vuex'

// Vue.use(Vuex)

const store = createStore({
  state() {
    return {
      //页面组件状态 - 警告栏
      connectStatus: {
        "level": 'warn',
        "msg": '有新版本',
        "type": 'updater',
        "show": false
      },
      beforestatus: null,
      // 日志
      log: [{
        "level": 'info',
        "msg": '欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV',
        "time": '2022/1/4 下午6:36:49'
      }],
      screenWidth: document.documentElement.clientWidth,
      // 正在直播的房间
      Is_live: [],
      // 房间列表
      room_list: []
    }
  },
  getters: {
    log: state => state.log,
    connectStatus: state => state.connectStatus,
    // 最新的一条日志
    newLog: state => state.log.length != 0 ? state.log[state.log.length - 1] : null,
    navBar: state => state.screenWidth < 1300 ? true : false,
  },
  mutations: {
    addLog: (state, playload) => state.log.push(playload),
    clearLog: state => state.log = [],
    setStatus: (state, playload) => state.connectStatus = playload,
    screenWidth: (state, playload) => state.screenWidth = playload,
    beforestatus: (state, playload) => state.beforestatus = playload
  },
  actions: {
    setStatusAsync(context, playload) {
      // 异步的修改状态栏，延迟2秒
      setTimeout(() => {
        context.commit('setStatus', playload);
      }, 2000)
    }
  },
  modules: {
  }
})

export default store