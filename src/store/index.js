import { createStore } from 'vuex'


export default createStore({
  state() {
    return {
      //页面组件状态 - 警告栏
      connectStatus: {
        "level": 'warn',
        "msg": '有新版本',
        "type": 'updater',
        "show": false
      },
      beforeStatus: null,
      // 日志
      log: [],
      screenWidth: document.documentElement.clientWidth,
      // 正在直播的房间
      Is_live: [],
      // 房间列表
      room_list: [],
      System_Resources: undefined,
      Rec_RecordingInfo_Lite: undefined,
      Room_AllInfo: undefined
    }
  },
  getters: {
    log: state => state.log,
    connectStatus: state => state.connectStatus,
    // 最新的一条日志
    newLog: state => state.log.length !== 0 ? state.log[state.log.length - 1] : null,
    navBar: state => state.screenWidth < 1300,
    sys_core_data: state => state.sys_core_data,
  },
  mutations: {
    addLog(state, payload) {
      const date = new Date();
      const nowStr = date.toLocaleString('zh', {hour12: true});
      payload = { "level": payload.lv, "msg": payload.msg, "time": nowStr };
      state.log.push(payload);
    },
    clearLog: state => state.log = [],
    setStatus: (state, payload) => state.connectStatus = payload,
    screenWidth: (state, payload) => state.screenWidth = payload,

    beforeStatus: (state, payload) => state.beforeStatus = payload,
    System_Resources: (state, payload) => state.System_Resources = payload,
    Rec_RecordingInfo_Lite: (state, payload) => state.Rec_RecordingInfo_Lite = payload,
    Room_AllInfo: (state, payload) => state.Room_AllInfo = payload

  },
  actions: {
    setStatusAsync(context, payload) {
      // 异步的修改状态栏，延迟2秒
      setTimeout(() => {
        context.commit('setStatus', payload);
      }, 2000)
    },
    System_Resources: async function (context, payload) {
      let res = await postFormAPI("System_Resources");
      context.commit('System_Resources', payload);
    },
    Rec_RecordingInfo_Lite: async function (context, payload) {
      let res = await postFormAPI("Rec_RecordingInfo_Lite");

      context.commit('Rec_RecordingInfo_Lite', payload);
    },
  },
  modules: {
  }
})

