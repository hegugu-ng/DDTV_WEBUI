<template>
  <div>
    <div class="ng-lookup">
      <el-checkbox size="small" class="ng-checkboox right10" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" border>全选</el-checkbox>
      <el-input class="ng-roominput right10" size="small" v-model="lp" placeholder="搜索UID/房间号/昵称/标题" clearable>
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
      <el-select class="ng-todo right10" v-model="select" size="small" placeholder="执行的操作">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button :disabled="select == ''" size="small" @click="$emit('requestgroup',select,checkedRoom)">确定</el-button>
    </div>
    <ul class="ng-roomGroup">
      <slot v-if="lp == ''"></slot>
      <li class="RoomCardV2" v-for="(item, index) in lproom.length == 0 && lp == '' ? room:lproom" :key="index" v-loading="item.load">

        <div class="ng-roomManager" :id="'m'+index">
          <div class="ng-configbar">
            <el-icon class="el-icon-back ng-bticon"  @click="stemo('#m'+index,'0%')">
              <arrow-left />
            </el-icon>
            <div class="ng-hostname">{{ item.uname }}</div>
          </div>
          <div class="ng-bntgroup">
            <div>
              <div class="ng-fromtitle">基础管理</div>
              <el-button size="small" >管理文件</el-button>
              <el-button size="small" type="danger" @click="requestApi('Room_Del',item.uid,null,index)">删除房间</el-button>
            </div>
            <div>
            <div class="ng-fromtitle">录制弹幕</div>
              <el-switch
                size="small"
                v-model="item.IsRecDanmu"
                active-color="#3bdd83"
                inactive-color="#a0b5a9"
                @change="requestApi('Room_DanmuRec',item.uid,item.IsRecDanmu,index)"
              />
              <el-button v-if="item.IsDownload" style="margin-left: 12px;" size="small" type="danger" @click="requestApi('Rec_CancelDownload',item.uid,null,index)">停止录制</el-button>
            </div>
          </div>
        </div>

        <div>
          <div class="ng-roomCover" >
            <div class="ng-isLive ng-floatbar" v-if="item.live_status == 1">正在直播</div>
            <div class="ng-floatbar">
              <el-checkbox class="ng-checkboox" v-model="item.check" @change="handleCheckedRoomChange"></el-checkbox>
            </div>
            <div class="ng-clink" :onclick="`window.open('https://live.bilibili.com/${item.room_id}')`"></div>
            <img class="ng-image" referrerPolicy="no-referrer" :src="item.cover_from_user"/>
            <div class="ng-roomType ng-floatbar">{{ item.st }}</div>
          </div>
          <div class="ng-roominfo">
            <div class="ng-faceGroup" :onclick="`window.open('https://space.bilibili.com/${item.uid}')`">
              <div class="ng-face">
                <img class="ng-image" referrerPolicy="no-referrer" :src="item.face"/>
              </div>
            </div>
            <div class="ng-roomnameCard">
              <div class="ng-roomtitle">{{ item.title }}</div>
              <div class="ng-hostgroup">
                <div class="ng-hostname">{{ item.uname }}</div>
                <ng-svg icon-class="setting2" :size="{width: '22px',height: '22px'}" class="ng-bticon" @click="stemo('#m'+index,'100%')"/>
                <el-switch
                  v-model="item.IsAutoRec"
                  active-color="#3bdd83"
                  inactive-color="#6b997f"
                  @change="requestApi('Room_AutoRec',item.uid,item.IsAutoRec,index)"
                ></el-switch>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <el-empty 
    v-if="lproom.length == 0 && lp == '' ? room.length == 0:lproom.length == 0" 
    :description="lproom.length == 0 && lp == '' ? '房间列表为空':'没有符合的搜索结果'"></el-empty>
  </div>
</template>
<script>
import { postFormAPI } from "../../api";
import { room_data } from "../../utils/data_cli";
import TweenLite from 'gsap';
export default {
  name: "RoomGroupV2",
  props: ["room"],
  data: function () {
    return {
      // 工具栏全选标志
      checkAll: false,
      // 工具栏选择列表
      checkedRoom: [],
      //工具栏部分选择标志
      isIndeterminate: false,
      select: '',
      lp: "",
      options: [
        {
          value: "stoprec",
          label: "停止录制",
        },
        {
          value: "delete",
          label: "删除房间",
        },
        {
          value: "startrec",
          label: "开启录制",
        },
      ],
      lproom: [],
      timer:null
    };
  },
  watch: {
    lp: function (newval) {
      this.lproom = [];
      if (newval != "") {
        for (let i = 0; i < this.room.length; i++) {
          let item = this.room[i];
          let kstr = [item.title, item.uid, item.uname,item.room_id];

          for (let j = 0; j < kstr.length; j++) {
            let expstr = kstr[j];
            if (this.fuzzyMatch(expstr, newval)) {
              this.lproom.push(item);
              break;
            }
          }
        }
      }
      this.handleCheckedRoomChange()
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      for (let i = 0; i < this.room.length; i++) {
          let item = this.room[i]
          if(item.live_status != 1) continue
          let now = Date.now()
          let time = this.formatSeconds((now/1000 - item.live_time))
          let room = this.room
          room[i].st = time
        }
    }, 10000)
},
  methods: {
    stemo:function(id,height){
      TweenLite.to(id,{height:height})
    },
    requestApi: async function (cmd, uid, data, index) {
      console.log(this.room[index])
      this.room[index].load = true;
      let res = { code: -1 };
      try {
        if (cmd == "Room_AutoRec") res = await this.Room_AutoRec(uid, data);
        if (cmd == "Room_DanmuRec") res = await this.Room_DanmuRec(uid, data);
        if (cmd == "Room_Del") res = await this.Room_Del(uid);
        if (cmd == "Rec_CancelDownload") res = await this.Rec_CancelDownload(uid)
        // 抛出错误
        if (res.code != 0) throw new Error("服务器返回错误");
        if (cmd == "Room_Del") this.room.splice(index, 1);
        if (cmd == "Rec_CancelDownload") this.room.splice(index, 1);
      } catch (err) {
        if (cmd == "Room_AutoRec") this.room[index].IsAutoRec = !data;
        if (cmd == "Room_DanmuRec") this.room[index].IsRecDanmu = !data;
      } finally {
        this.room[index].load = false;
      }
    },
    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var middle = 0; // 分
      var hour = 0; // 小时

      if (theTime > 60) {
        undefined;
        middle = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (middle > 60) {
          undefined;
          hour = parseInt(middle / 60);
          middle = parseInt(middle % 60);
        }
      }
      var result = ""
      // + parseInt(theTime) + "秒";
      if (middle > 0) {
        undefined;
        result = "" + parseInt(middle) + "分" + result;
      }
      if (hour > 0) {
        undefined;
        result = "" + parseInt(hour) + "小时" + result;
      }
      return result;
    },
    fuzzyMatch(str1, key) {
      let index = -1,
        flag = false;
      str1 = String(str1).toLowerCase();
      key = String(key).toLowerCase();
      for (var i = 0, arr = String(key).split(""); i < arr.length; i++) {
        //有一个关键字都没匹配到，则没有匹配到数据
        if (String(str1).indexOf(arr[i]) < 0) {
          break;
        } else {
          let match = String(str1).matchAll(arr[i]);
          let next = match.next();
          while (!next.done) {
            if (next.value.index > index) {
              index = next.value.index;
              if (i === arr.length - 1) {
                flag = true;
              }
              break;
            }
            next = match.next();
          }
        }
      }
      return flag;
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
      let room = this.room
      if(this.lp != "") room = this.lproom
      if(room.length != 0){
        for (let i = 0; i < room.length; i++) {
          if (val) {
            room[i].check = true;
            this.checkAll = true;
          } else {
            this.checkAll = false;
            room[i].check = false;
          }
        }
      }else{
        this.checkAll = false
      }
    },
    handleCheckedRoomChange() {
      let arr = this.room
      if(this.lp != '') arr = this.lproom
      let statusand = '',
          statusor = ''
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if(i==0){
          statusand = item.check
          statusor = item.check
        }else{
        // 全选才为 true
        statusand &&=item.check
        statusor ||=item.check
        }
      }
      if(arr.length != 0){
        // 全选才为 true
        let alltrue = statusand
        // 全不选才为 true
        let allfalse = !statusor
        if(alltrue){
          this.isIndeterminate = false;
          this.checkAll = true
        }
        if(allfalse){
          this.isIndeterminate = false;
          this.checkAll = false
        }
        if(allfalse == alltrue){
          this.isIndeterminate = true;
          this.checkAll = false
        }
      }else{
        this.isIndeterminate = false;
        this.checkAll = false
      }
    },

    Room_AllInfo: async function () {
      let res = await postFormAPI("Room_AllInfo");
      let data = res.data;
      if (data.code == 0) {
        await room_data(this, data.data);
      }
    },
    Room_AutoRec: async function (uid, data) {
      let param = {
        UID: uid,
        IsAutoRec: data,
      };
      let res = await postFormAPI("Room_AutoRec", param);
      return res.data;
    },
    Room_DanmuRec: async function (uid, data) {
      let param = {
        UID: uid,
        IsRecDanmu: data,
      };
      let res = await postFormAPI("Room_DanmuRec", param);
      return res.data;
    },
    Room_Del: async function (uid) {
      let param = {
        UID: uid,
      };
      let res = await postFormAPI("Room_Del", param);
      return res.data;
    },
    Room_Add: async function(uid){
      let param = {
        UID: uid,
      };
      let res = await postFormAPI("Room_Add", param);
      return res.data;
    },
    Rec_CancelDownload: async function(uid){
      let param = {
        UID: uid,
      };
      let res = await postFormAPI("Rec_CancelDownload", param);
      return res.data;
    }
  },
beforeDestroy() {
    if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
        clearInterval(this.timer); //关闭
    }
}
};
</script>


<style>
.ng-bntgroup{
  padding: 0px 10px 0px 10px;
}
.icon-img{
  vertical-align: middle;
  background-repeat: no-repeat;
  background-image: url('../../assets/icons.png');
}
.ng-roomGroup {
  /* position: absolute; */
  padding-inline-start: 0px;
  margin-block-start: 0px;
  margin-block-end: 0px;
}
.right10 {
  margin-right: 10px;
}
.ng-hlbt {
  border: 1px solid #e5dbdb;
  display: inline;
  padding: 5px;
  font-size: 10px;
  font-weight: bold;
  margin-right: 3px;
  cursor: pointer;
}
.ng-lookup {
  margin: 0.8rem 0rem 0.8rem 0rem;
  display: flex;
  align-items: center;
}
.ng-roominput {
  max-width: 18rem;
}
.ng-todo {
  width: 8rem;
}
.ng-fromtitle{
  font-size: .8rem;
  padding: .5rem 0rem .5rem 0rem;
  color: #161313;;
}
.RoomCardV2 {
  display: inline-block;
  width: 228px;
  border: 1px solid #e9eaec;
  padding: 10px 2px;
  margin: 0 0.8rem 0.8rem 0;
  border-radius: 8px;
  background: #fff;
  position: relative;
  overflow: hidden;
}
.RoomCardV2:hover {
  box-shadow: 0 13px 20px 0 rgb(59 64 72 / 22%);
  transition: transform 0.3s cubic-bezier(0.63, -0.01, 0.59, 1);
}
.ng-roomManager {
  height: 0%;
  width: 100%;
  position: absolute;
  z-index: 101;
  /* top: 0; */
  bottom: 0;
  left: 0;
  right: 0;
  /* background: rgb(255, 255, 255); */
  backdrop-filter: blur(10px);
  overflow: hidden;
}
.ng-configbar {
  padding: 10px 10px 0px 10px;
  font-size: 25px;
  display: flex;
  align-items: center;
}
.ng-bticon {
  cursor: pointer;
}
.ng-bticon:hover {
  color: #999;
}
.ng-roomCover {
  width: 208px;
  margin: 0 9px 0 9px;
  height: 117px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.ng-image{
  width: 100%;
  /* height: 100%; */
}
.ng-isLive {
  top: -1px;
  left: -1px;
  background-image: url("../../assets/testlive.png");
  background-position: 0 100%;
  text-indent: 30px;
  font-size: 12px;
  color: #fff;
  line-height: 24px;
}
.ng-checkboox {
  float: right;
  padding-right: 2px;
}
.ng-clink {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 102;
  cursor: pointer;
}
.ng-roomType {
  padding-left: 8px;
  box-sizing: border-box;
  bottom: 6px;
  font-size: 14px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 3;
}
.ng-floatbar {
  position: absolute;
  width: 100%;
  height: 24px;
  background-repeat: no-repeat;
  background-size: auto 100%;
  z-index: 120;
}
.ng-roominfo {
  display: flex;
  align-items: center;
  margin-top: 5px;
  padding: 0 10px;
  box-sizing: border-box;
}
.ng-faceGroup {
  cursor: pointer;
  width: 55px;
  height: 55px;
  position: relative;
}
.ng-face {
  width: 40px;
  height: 40px;
  /* background-image: url('../assets/testuserface.jpg'); */
  border-radius: 50%;
  margin-top: 8px;
  margin-left: 8px;
  position: absolute;
  overflow: hidden;
}
.ng-pendant {
  /* background-image: url('../assets/testzb.png'); */
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: absolute;
}
.ng-userOfficial {
  z-index: 11;
  font-size: 0.36em;
  width: 17px;
  height: 17px;
  position: absolute;
  right: 10%;
  bottom: 10%;
}
.ng-ao-p {
  background-image: url("../../assets/superuser.svg");
}
.ng-roomnameCard {
  width: calc(100% - 55px);
}
.ng-roomtitle {
  font-size: 16px;
  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  /* margin-bottom: 8px; */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  padding-left: 6px;
}
.ng-hostgroup {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ng-hostname {
  font-size: 0.6em;
  color: #3b2929;
  margin-top: 1px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-left: 6px;
  flex: 1;
  padding-right: 3px;
  box-sizing: border-box;
}
.ng-stoprec {
  width: 54px;
  height: 26px;
  background-color: #409eff;
  font-size: 12px;
  color: #fff;
  text-align: center;
  line-height: 26px;
  border-radius: 4px;
  cursor: pointer;
}
</style>