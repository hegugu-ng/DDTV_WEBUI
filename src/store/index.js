import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //页面组件状态 - 警告栏
    connectStatus: {
      "level": 'warn', 
      "msg": '有新版本', 
      "type": 'updater', 
      "show": false
    },
    beforestatus:null,
    // 日志
    log: [{
      "level": 'info', 
      "msg": '欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV欢迎使用DDTV', 
      "time": '2022/1/4 下午6:36:49'
    }],
    screenWidth: document.documentElement.clientWidth,
    // 正在直播的房间
    Is_live:[{
      id:1,
      show:false,
      type:"虚拟主播",
      name:"冰糖IO",
      title:"6000舰感谢纪念回！！！！！！",
      face:require("../assets/testroom/face1.jpg"),
      cover:require("../assets/testroom/cover1.jpg"),
      pendant:require("../assets/testroom/pendant1.png"),
      home:'https://space.bilibili.com/198297',
      liveroom:"https://live.bilibili.com/876396",
      at:1645701436301,
      st:'',
      check:false,
      rec:true
    },
    {
      id:2,
      show:false,
      type:"虚拟主播",
      name:"七海Nana7mccci",
      title:"Hi!",
      face:require("../assets/testroom/face2.jpg"),
      cover:require("../assets/testroom/cover2.jpg"),
      pendant:require("../assets/testroom/pendant2.png"),
      home:"https://space.bilibili.com/434334701",
      liveroom:"https://live.bilibili.com/21452505",
      at:1645701496301,
      st:'',
      check:false,
      rec:true
    },
    {
      id:3,
      show:false,
      type:"虚拟主播",
      name:"咩栗",
      title:"生日新衣会！！",
      face:require("../assets/testroom/face3.jpg"),
      cover:require("../assets/testroom/cover3.jpg"),
      pendant:require("../assets/testroom/pendant3.png"),
      home:"https://space.bilibili.com/745493",
      liveroom:"https://live.bilibili.com/8792912",
      at:1645701286301,
      st:'',
      check:false,
      rec:true

    },
    {
      id:4,
      show:false,
      type:"虚拟主播",
      name:"子花酱Hanako",
      title:"⭐ 过生日 .exe",
      face:require("../assets/testroom/face4.jpg"),
      cover:require("../assets/testroom/cover4.jpg"),
      pendant:require("../assets/testroom/pendant4.png"),
      home:"https://space.bilibili.com/75937648",
      liveroom:"https://live.bilibili.com/21725187",
      at:1645701306301,
      st:'',
      check:false,
      rec:true
    },
    {
      id:5,
      show:false,
      type:"虚拟主播",
      name:"东爱璃Lovely",
      title:"可爱小狍子（？也要唱歌歌",
      face:require("../assets/testroom/face5.jpg"),
      cover:require("../assets/testroom/cover5.jpg"),
      pendant:require("../assets/testroom/pendant5.png"),
      home:"https://space.bilibili.com/3821157/",
      liveroom:"https://live.bilibili.com/21692711",
      at:1645701536301,
      st:'',
      check:false,
      rec:true
    },
    {
      id:6,
      show:false,
      type:"虚拟主播",
      name:"钉宫妮妮Ninico",
      title:"捏~QwQ",
      face:require("../assets/testroom/face6.jpg"),
      cover:require("../assets/testroom/cover6.jpg"),
      pendant:require("../assets/testroom/pendant6.png"),
      home:"https://space.bilibili.com/8881297/",
      liveroom:"https://live.bilibili.com/192",
      at:1645701236301,
      st:'',
      check:false,
      rec:true

    }],
    // 房间列表
    room_list: [{
      loading:false,
      show:true,
      islive:true,
      name:'禾咕咕',
      orname:'禾咕咕Official',
      rec:true,
      like:true,
      roomid:114514
  }]
  },
  getters: {
    log: state => state.log,
    connectStatus: state => state.connectStatus,
    // 最新的一条日志
    newLog: state => state.log.length != 0 ? state.log[state.log.length-1] : null,
    navBar: state => state.screenWidth < 1300 ? true:false,
  },
  mutations: {
    addLog: (state, playload) => state.log.push(playload),
    clearLog: state =>state.log = [],
    setStatus: (state, playload) => state.connectStatus = playload,
    screenWidth: (state, playload) => state.screenWidth = playload,
    beforestatus: (state,playload) => state.beforestatus = playload
  },
  actions: {
    setStatusAsync(context,playload){
      // 异步的修改状态栏，延迟2秒
      setTimeout(() => {
        context.commit('setStatus',playload);
      },2000)
    }
  },
  modules: {
  }
})
