import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      //页面组件状态 - 警告栏
      connectStatus: [],
      // { message: "消息", level: "info", priority: 99, action:"Until Network Restored",type:"Network Disconnection"},
      beforeStatus: null,
      // 日志
      log: [],
      screenWidth: document.documentElement.clientWidth,
      // 正在直播的房间
      Is_live: [],
      // 房间列表
      System_Resources: undefined,
      Rec_RecordingInfo_Lite: undefined,
      Room_AllInfo: undefined
    };
  },
  getters: {
    log: (state) => state.log,
    connectStatus: (state) => state.connectStatus,
    // 最新的一条日志
    newLog: (state) => (state.log.length !== 0 ? state.log[state.log.length - 1] : null),
    navBar: (state) => state.screenWidth < 1300,
    sys_core_data: (state) => state.sys_core_data
  },
  mutations: {
    addLog(state, payload) {
      const date = new Date();
      const nowStr = date.toLocaleString("zh", { hour12: true });
      payload = { level: payload.lv, msg: payload.msg, time: nowStr };
      state.log.push(payload);
    },
    clearLog: (state) => (state.log = []),
    // 向顶部状态栏推送一条消息
    AddConnectStatus: (state, payload) => state.connectStatus.push(payload),
    // 从状态栏中吊销一条消息
    RemoveConnectStatus: (state, payload) => {
      let index = state.connectStatus.indexOf(payload);
      state.connectStatus.splice(index, 1);
    },
    setStatus: (state, payload) => (state.connectStatus = payload),
    screenWidth: (state, payload) => (state.screenWidth = payload),
    beforeStatus: (state, payload) => (state.beforeStatus = payload),
    System_Resources: (state, payload) => (state.System_Resources = payload),
    Rec_RecordingInfo_Lite: (state, payload) => (state.Rec_RecordingInfo_Lite = payload),
    Room_AllInfo: (state, payload) => (state.Room_AllInfo = payload)
  },
  actions: {
    AsyncRemoveConnectStatus: async function (context, payload) {
      setTimeout(() => {
        context.commit("RemoveConnectStatus", payload);
      }, 1100);
    },
    System_Resources: async function (context, payload) {
      context.commit("System_Resources", payload);
    },
    Rec_RecordingInfo_Lite: async function (context, payload) {
      context.commit("Rec_RecordingInfo_Lite", payload);
    }
  },
  modules: {}
});
