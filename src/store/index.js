// import Vue from 'vue'
import { createStore } from 'vuex'
import { postFormAPI, getListAPIv2 } from "../api";

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
      log: [],
      screenWidth: document.documentElement.clientWidth,
      // 正在直播的房间
      Is_live: [],
      // 房间列表
      room_list: [],
      System_Resources: null,
      Rec_RecordingInfo_Lite: null
    }
  },
  getters: {
    log: state => state.log,
    connectStatus: state => state.connectStatus,
    // 最新的一条日志
    newLog: state => state.log.length != 0 ? state.log[state.log.length - 1] : null,
    navBar: state => state.screenWidth < 1300 ? true : false,
    sys_core_data: state => state.sys_core_data,
  },
  mutations: {
    addLog(state, playload) {
      var date = new Date();
      var nowStr = date.toLocaleString('zh', { hour12: true });
      var playload = { "level": playload.lv, "msg": playload.msg, "time": nowStr };
      state.log.push(playload);
    },
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
    },
    System_Resources: async function (context, playload) {
      let res = await postFormAPI("System_Resources");
      context.commit('System_Resources', playload);
    },
    Rec_RecordingInfo_Lite: async function (context, playload) {
      let res = await postFormAPI("Rec_RecordingInfo_Lite");
      context.commit('Rec_RecordingInfo_Lite', playload);
    },
  },
  modules: {
  }
})

export default store