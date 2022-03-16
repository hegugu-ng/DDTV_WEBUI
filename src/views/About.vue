<template>
  <div class="about">
    <div class="chatGroup">
      <div class="phone-bar">
        <div class="phone-info">
          <div class="phone-time">12:54</div>
          <div>NGWORKS</div>
          <ng-svg class="phone-icon" :size="{width: '15px',height: '15px'}" color="#fff" icon-class="wifi" />
          <ng-svg class="phone-icon" :size="{width: '13px',height: '13px'}" color="#fff" icon-class="dingwei" />
        </div>
        <div class="group-titlebar">
          <ng-svg class="phone-icon" :size="{width: '20px',height: '20px'}" color="#fff" icon-class="返回" />
          <div class="group-title">
            <div>
              <div>蒂蒂媞薇深夜食堂</div>
              <div class="group-title online">319人在线</div>
            </div>
          </div>
          <ng-svg class="phone-icon" :size="{width: '20px',height: '20px'}" color="#fff" icon-class="编辑" />
          <ng-svg class="phone-icon" :size="{width: '20px',height: '20px'}" color="#fff" icon-class="日历" />
        </div>
      </div>
      <div class="chat-d">
        <div  v-for="(item, index) in msg" :key="index">
          <div :class="`chat  chat-${item.type}`" v-if="item.event == 'message'">
            <img class="chat-face" referrerPolicy="no-referrer" :src="item.face" />
            <div :class="`chat-${item.type}_triangle`"></div>
            <div :class="`chat-msg chat-msg-${item.type}`">
              <div class="chat-nick">{{ item.nick }}</div>
              <div :class="`chat-msgbox chat-msgbox-${item.type}`">
                <span v-html="item.message"></span>
              </div>
            </div>
          </div>
          <div class="chat-notice" v-else>
            <span>{{item.message}}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2>感谢这些瑰宝般的项目！</h2>
      <ng-svg  v-for="(item,index) in pr" :size="{width: '50px',height: '50px'}" :key="index" :icon-class="item"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pr:['node_js','npm','vue'],
      user:[
        {
          face:"https://i1.hdslb.com/bfs/face/217a3e473ac7b18af679facf226fc8a3876c0558.jpg@240w_240h_1c_1s.webp",
          nick:"寒曦朦"
        },
        {
          face:"https://i2.hdslb.com/bfs/face/c21f7053c896130d10ca31cd362b4d83708ca657.jpg@240w_240h_1c_1s.webp",
          nick:"蓝的温柔像羽毛"
        },
        {
          face:"https://i2.hdslb.com/bfs/face/3c7a5154645318cc7e3adb9605fe572fe0647d41.jpg@240w_240h_1c_1s.webp",
          nick:"枫の雨"
        },
        {
          face:"https://i2.hdslb.com/bfs/face/27f20d1cdbd66d8f01d496e7605a9ce396e03c5e.jpg@240w_240h_1c_1s.webp",
          nick:"蒂蒂媞薇_Official",
        },
        {
          face: "https://i1.hdslb.com/bfs/face/2f30ce11b11d2412c94d417d1e13899f575ab827.jpg@240w_240h_1c_1s.webp",
          nick: "禾咕咕Official",
        },
        {
          face:"https://i1.hdslb.com/bfs/face/b796fc234e84db55d37f48562004a070705c2258.jpg@240w_240h_1c_1s.webp",
          nick:"DMC",
        }
        ],
      message: [
        {
          event:"message",
          face:"https://i1.hdslb.com/bfs/face/b796fc234e84db55d37f48562004a070705c2258.jpg@240w_240h_1c_1s.webp",
          nick:"DMC",
          message:"#查询web进度",
          type: 'left'
        },
        {
          event:"message",
          face: "https://i1.hdslb.com/bfs/face/2f30ce11b11d2412c94d417d1e13899f575ab827.jpg@240w_240h_1c_1s.webp",
          nick: "禾咕咕Official",
          message: "在写了在写了",
          type: 'right'
        },
        {
          event:"notice",
          message:"蓝的温柔像羽毛被禁言1分钟"
        },
        {
          event:"message",
          face:"https://i2.hdslb.com/bfs/face/c21f7053c896130d10ca31cd362b4d83708ca657.jpg@240w_240h_1c_1s.webp",
          nick:"蓝的温柔像羽毛",
          message:"cnm",
          type: 'left'
        },
        {
          event:"message",
          face:"https://i1.hdslb.com/bfs/face/217a3e473ac7b18af679facf226fc8a3876c0558.jpg@240w_240h_1c_1s.webp",
          nick:"寒曦朦",
          message:"笑死",
          type: 'left'
        },
        {
          event:"message",
          face: "https://i1.hdslb.com/bfs/face/2f30ce11b11d2412c94d417d1e13899f575ab827.jpg@240w_240h_1c_1s.webp",
          nick: "禾咕咕Official",
          message: "欢迎加入ddtv官方群聊进行催更（？）",
          type: 'right'
        },
      ],
      msg:[]
    };
  },
  mounted() {
    let luckUser = this.get3user(this.user)
    let dynamicMsg = this.msgOftime()

    let n = []
    for(var i=0;i< luckUser.length;i++){
      let item = luckUser[i]
      item.message = dynamicMsg[i]
      item.event = "message"
      if(item.nick == '禾咕咕Official') item.type = 'right'
      else item.type = 'left'
      n.push(item)
    }
    var c = n.concat(this.message)
    this.msg = c

    let groupcover = require('../assets/groupcover.jpg'),
        css = 'border-bottom: 1px solid #f4f0f0;color: #d7d3d3;font-size: 10px;padding-bottom: 5px;width: 200px;',
        imgcss = "width: 45px;height: 45px;border-radius: 50%;flex-shrink: 0;"


    let group = {
          face:"https://i2.hdslb.com/bfs/face/27f20d1cdbd66d8f01d496e7605a9ce396e03c5e.jpg@240w_240h_1c_1s.webp",
          nick:"蒂蒂媞薇_Official",
          message:`
          <a style='cursor:pointer;text-decoration: none;color: #000;' href="https://jq.qq.com/?_wv=1027&k=AgRHFySh">
          <div style='${css}'>推荐群</div>
          <div style='display: flex;margin-top: 6px;'>
            <img style='${imgcss}' src='${groupcover}'/>
            <div style='margin-left: 6px;padding-top: 3px;'>
              <div style='font-size: 14px;font-weight: bold;letter-spacing: 2px;'>蒂蒂媞薇深夜食堂</div>
              <div style='font-size: 10px;color:#888'>欢迎加入群聊</div>
            </div>
          </div></a>`,
          type: 'left',
          event:'message'
        }
    this.msg.push(group)
  },
  methods: {
    msgOftime(){
      let now = new Date(),
          hour = now.getHours() 
      console.log(hour)
      if (hour < 2){
        return ['为什么路径要单独拆出来','比较好取吧，当然不单独拆出来也行','你怎么寄吧这么多问题']
      }
      if(hour < 4){
        return ['我看看能不能分析出来什么','我还以为你也要闭眼开车（','我颅内DEBUG没发现问题']
      }
      if(hour < 5){
        return ['记得bot对接ddtv(','那任意一个接口都不推荐轮询(','你那破bot还没修好？']
      }
      if(hour < 6){
        return ['我超你们为啥都这么早','早哦','要上班的啊']
      }
      if (hour < 9){
        return ['我过几天来写，明天要给大老板汇报','这就是现充吗','你好忙']
      }
      if (hour < 12){
        return ['寄','快下班了赶紧摸','阿哲']
      }
      if (hour < 14){
        return ['上工了上工了','饭还没干完捏','这是什么啊']
      }
      if (hour < 17){
        return ['快下班了','饮茶饮茶','你们怎么都要上班啊']
      }
      if (hour < 19){
        return ['晚上好哦','#查询web进度','#查询web进度']
      }
      if (hour < 23){
        return ['辛苦了','晚安','我马上更新一波官网文档']
      }
      return ['晚上好，还没休息啊','总感觉有人在偷看','阿哲']
    },
    get3user(Arr){
      var arrNew=[];
      for(var i=0;i<3;i++)
      {
        var _num = Math.floor(Math.random()*Arr.length)
        var mm = Arr[_num];
        Arr.splice(_num,1)
        arrNew.push(mm)
      }
      return arrNew
    }
  }
  
}
</script>

<style scoped>
.group-titlebar{
  display: flex;
  color: #fff;
  justify-content: space-evenly;
  align-items: center;
  font-size: 16px;
  padding: 0 10px 0 10px;
}
.online{
  font-size: 0.01em;
}
.group-title{
  display:flex;
  justify-content: center;
}
.phone-time,.group-title{
  flex:1;
}
.phone-icon{
  margin-top: -1px;
  padding: 0 2px 0 2px;
  font-weight: 500;
}
.phone-info{
  color: #fff;
  padding: 10px;
  font-size: 10px;
  font-weight: normal;
  display: flex;
}
.phone-bar{
  height:80px;
  background-color: #00a8ff;
  background-image: linear-gradient(90deg, #00dafe 0%, #00a8ff 75%);
}
.about {
  margin: 10px;
  display: flex
}
.chatGroup{
  width: 370px;
  background-color: #eaedf4;
}
.chat-d{
  padding: 10px;
  padding: 10px;
  height: 600px;
  overflow-y: scroll;
}
.chat{
  display: flex;
  min-height: 65px;
}
.chat-right{
  flex-direction: row-reverse;
}
.chat-face{
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 8px;
  flex-shrink: 0;
  border: 1px solid #e3dddd;
}
.chat-msg{
  margin-bottom: 13px;
  text-align:left
}
.chat-msg-right{
  text-align:right;
}
.chat-nick{
  /* position: absolute; */
  color: #848484;
  font-size: 70%;
  margin-bottom: 2px;
}
.chat-msgbox{
  /* position: absolute; */
  text-align:left;
  padding: 10px 10px 10px 10px;
  border-radius: 17px;
  display: inline-block;
  background-color: #fff;

}
.chat-msgbox-right{
  background-color: #00a8ff;
  color: #fff;
}

.chat-left_triangle {
  position: relative;
  height: 0px;
  width: 0px;
  border-width: 9px;
  border-style: solid;
  border-color: transparent white transparent transparent;
  top: 27px;
  left: 2px;
  margin-left: -7px;
}

.chat-right_triangle {
  position: relative;
  height: 0px;
  width: 0px;
  border-width: 9px;
  border-style: solid;
  border-color: transparent transparent transparent #00a8ff;
  top: 27px;
  left: -2px;
  margin-right: -7px;
}

body {
  background-color: #ebebeb;
  font-family: -apple-system;
  font-family: "-apple-system", "Helvetica Neue", "Roboto", "Segoe UI","sans-serif";
}
.chat-sender {
  clear: both;
  font-size: 80%;
}


.chat-receiver div:first-child img,
.chat-sender div:first-child img {
  width: 100%;
  height: 100%
  /*border-radius: 10%;*/
}


.chat-notice {
  clear: both;
  font-size: 70%;
  color: white;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.chat-notice span {
  background-color: #cecece;
  line-height: 25px;
  border-radius: 5px;
  padding: 5px 10px;
}
</style>
