<template>
  <ng-infocard title="录制中房间管理" :update="UpdateTime" style="margin-top: 3vh">
    <table class="ng-lookup">
      <colgroup>
        <col width="3%" />
        <col width="55%" />
        <col width="25%" />
        <col width="15%" />
      </colgroup>
      <thead>
        <tr>
          <th>
            <el-checkbox class="ng-checkbox" :indeterminate="isIndeterminate" v-model="CheckAll"
              @change="handleCheckAllChange" :disabled="Loading" />
          </th>
          <th>
            <el-input class="ng-roominput" size="small" v-model="SearchKeywords" @keyup="handleOnkeyup($event)"
              placeholder="搜索UID/房间号/昵称/标题" :disabled="Loading" clearable>
              <template #prefix>
                <el-icon class="el-input__icon">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </th>
          <th>
            <el-select class="ng-todo" v-model="BatchOperationSelect" :disabled="Loading" size="small"
              placeholder="执行的操作">
              <el-option v-for="item in BatchOperation" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </th>
          <th>
            <el-button :disabled="BatchOperationSelect === '' || Loading" size="small"
              @click="$emit('requestgroup', BatchOperationSelect, CheckedRoom)">确定
            </el-button>
          </th>
        </tr>
      </thead>
    </table>
    <el-skeleton :loading="Loading" :count="skLen" animated>
      <template #template>
        <div class="room-sk">
          <div class="ng-roomCover">
            <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
          </div>
          <div class="ng-roominfo">
            <div class="ng-faceGroup">
              <div class="ng-face">
                <el-skeleton-item style="--el-skeleton-circle-size: 40px" variant="circle" />
              </div>
            </div>
            <div class="ng-roomnameCard">
              <el-skeleton-item variant="text" style="font-size: 15px; width: 80%" />
              <div class="ng-hostgroup">
                <el-skeleton-item variant="text" style="font-size: 0.6rem; width: 60%" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <el-checkbox-group v-model="CheckedRoom">
          <ul class="ng-roomGroup">
            <!--这里放一个插槽，用来放置列表第一个定制的元素，比如添加房间-->
            <slot v-if="SearchResult.length === 0"></slot>
            <li class="RoomCardV2" v-for="(item, index) in room" :key="index" v-loading="item.load">
              <div class="ng-roomManager" :id="'m' + index">
                <div class="ng-configbar">
                  <el-icon class="el-icon-back ng-bticon" @click="stemo('#m' + index, '0%')">
                    <arrow-left />
                  </el-icon>
                  <div class="ng-hostname">{{ item.uname }}</div>
                </div>
                <div class="ng-btngroup">
                  <div>
                    <div class="ng-fromtitle">基础管理</div>
                    <el-button size="small">管理文件</el-button>
                    <el-button size="small" type="danger" @click="requestApi('Room_Del', item.uid, null, index)">删除房间
                    </el-button>
                  </div>
                  <div>
                    <div class="ng-fromtitle">录制弹幕</div>
                    <el-switch size="small" v-model="item.IsRecDanmu" active-color="#3bdd83" inactive-color="#a0b5a9"
                      @change="requestApi('Room_DanmuRec', item.uid, item.IsRecDanmu, index)" />
                    <el-button v-if="item.IsDownload" style="margin-left: 12px" size="small" type="danger"
                      @click="requestApi('Rec_CancelDownload', item.uid, null, index)">停止录制
                    </el-button>
                  </div>
                </div>
              </div>

              <div>
                <div class="ng-roomCover">
                  <div class="ng-isLive ng-floatbar" v-if="item.live_status === 1">正在直播</div>
                  <div class="ng-floatbar">
                    <el-checkbox class="ng-checkbox" :label="item" :key="item" @change="handleCheckedRoomChange">{{}}
                    </el-checkbox>
                  </div>
                  <div class="ng-clink" :onclick="`window.open('https://live.bilibili.com/${item.room_id}')`"></div>
                  <img class="ng-image" referrerPolicy="no-referrer" :src="item.cover_from_user" />
                  <div class="ng-roomType ng-floatbar">{{ item.st }}</div>
                </div>
                <div class="ng-roominfo">
                  <div class="ng-faceGroup" :onclick="`window.open('https://space.bilibili.com/${item.uid}')`">
                    <div class="ng-face">
                      <img class="ng-image" referrerPolicy="no-referrer" :src="item.face" />
                    </div>
                  </div>
                  <div class="ng-roomnameCard">
                    <div class="ng-roomtitle">{{ item.title }}</div>
                    <div class="ng-hostgroup">
                      <div class="ng-hostname">{{ item.uname }}</div>
                      <ng-svg icon-class="setting2" :size="{ width: '22px', height: '22px' }" class="ng-bticon"
                        @click="stemo('#m' + index, '100%')" />
                      <el-switch v-model="item.IsAutoRec" active-color="#3bdd83" inactive-color="#6b997f"
                        @change="requestApi('Room_AutoRec', item.uid, item.IsAutoRec, index)"></el-switch>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-checkbox-group>
        <el-empty v-if="room.length === 0" description="列表为空"></el-empty>
      </template>
    </el-skeleton>
  </ng-infocard>
</template>

<script>
// roomCard 需要所有的房间数据，并且将其展示 如果需要在开播的房间，则需要处理筛选
import TweenLite from "gsap";
import { getRoomAllInfo } from "@/newapi";
import store from "@/store";
import { room_data } from "@/utils/data_cli";
import InfoCard from "./InfoCard";

export default {
  name: "RoomGroup",
  components: {
    "ng-infocard": InfoCard
  },
  data: function () {
    return {
      skLen: 3,
      // 加载状态
      Loading: true,
      // 显示的更新信息
      UpdateTime: "正在更新数据",
      IsNull: false,
      // 传递来的房间数据
      room: [],
      forkRoom: undefined,
      // 工具栏 全选标志
      CheckAll: false,
      // 工具栏 被选择的房间
      CheckedRoom: [],
      //工具栏 全选 部分选择标志
      isIndeterminate: false,
      // 搜索 关键词
      SearchKeywords: "",
      // 搜索 结果
      SearchResult: [],
      // 搜索间隙的等待
      SearchLoading: false,
      // 选择的批量操作
      BatchOperationSelect: "",
      // 可以供选择的批量操作
      BatchOperation: [
        {
          value: "stoprec",
          label: "停止录制"
        },
        {
          value: "delete",
          label: "删除房间"
        },
        {
          value: "startrec",
          label: "开启录制"
        }
      ],
      timer: null,
      lastTimeStamp: 0
    };
  },
  mounted() {
    this.LoadData();
    // this.forkRoom = this.room;
    // this.timer = setInterval(() => {
    //   for (let i = 0; i < this.room.length; i++) {
    //     let item = this.room[i];
    //     if (item.live_status !== 1) continue;
    //     let now = Date.now();
    //     let time = this.formatSeconds(now / 1000 - item.live_time);
    //     let room = this.room;
    //     room[i].st = time;
    //   }
    // }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    LoadData: function () {
      if (store.state.Room_AllInfo) {
        console.log("RoomCard发现store中已经存在数据");
        this.UpdateDataView(true);
      } else {
        Promise.all([getRoomAllInfo()]).then((res) => {
          console.log("RoomCard组件请求数据成功", res);
          store.commit("Room_AllInfo", res[0].data.data);
          this.UpdateDataView(true);
        });
      }
    },
    UpdateDataView: function (IsDownload) {
      let allRoom = this.$store.state.Room_AllInfo;
      if (IsDownload) {
        let liveRoomData = [];
        // 开始生成本地渲染列表的索引
        allRoom.forEach((item) => {
          if (item.live_status === 1 && item.IsDownload) {
            liveRoomData.push(item);
          }
        });
        room_data(this.room, liveRoomData);
      } else {
        room_data(this.room, allRoom);
      };
      this.forkRoom = this.room;
      if (this.room.length !== 0) {
        this.skLen = this.room.length;
      }
      setTimeout(() => {
        this.Loading = false;
      }, 1000);

      this.UpdateTime = Date().toString();
    },
    handleOnkeyup(event) {
      this.SearchLoading = true;
      if (event.keyCode === 13) {
        this.handleInputChange();
      } else {
        this.lastTimeStamp = event.timeStamp;
        setTimeout(() => {
          //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
          if (this.lastTimeStamp === event.timeStamp) {
            this.handleInputChange();
          }
        }, 500);
      }
      this.SearchLoading = false;
    },
    handleInputChange() {
      if (this.SearchKeywords !== "") {
        //关键词直接写死
        let Keywords = ["title", "uid", "uname", "room_id"];
        //调用正则表达式实现模糊查询
        const regex = new RegExp(this.SearchKeywords, "i");
        //直接实现模糊查询，并给room二次赋值
        this.room = this.room.filter((item) => {
          for (let key of Keywords) {
            //添加toString()方法，防止数字类型报错
            if (item[key].toString().match(regex)) {
              return true;
            }
          }
          return false;
        });
      } else {
        //字符串清空后回归原始数据
        this.room = this.forkRoom;
      }
      //更新列表中显示的结果
      // ng: 加入这个函数可能导致 搜索后列表为空时 全选打勾
      // this.handleCheckedRoomChange();
    },
    stemo: function (id, height) {
      TweenLite.to(id, { height: height });
    },
    requestApi: async function (cmd, uid, data, index) {
      console.log(this.room[index]);
      this.room[index].load = true;
      let res = { code: -1 };
      try {
        if (cmd === "Room_AutoRec") res = await this.Room_AutoRec(uid, data);
        if (cmd === "Room_DanmuRec") res = await this.Room_DanmuRec(uid, data);
        if (cmd === "Room_Del") res = await this.Room_Del(uid);
        if (cmd === "Rec_CancelDownload") res = await this.Rec_CancelDownload(uid);
        // 抛出错误
        if (res.code !== 0) return new Promise.Error("服务器返回错误");
        if (cmd === "Room_Del") this.room.splice(index, 1);
        if (cmd === "Rec_CancelDownload") this.room.splice(index, 1);
      } catch (err) {
        if (cmd === "Room_AutoRec") this.room[index].IsAutoRec = !data;
        if (cmd === "Room_DanmuRec") this.room[index].IsRecDanmu = !data;
      } finally {
        this.room[index].load = false;
      }
    },
    formatSeconds: function (value) {
      let theTime = parseInt(value); // 秒
      let middle = 0; // 分
      let hour = 0; // 小时

      if (theTime > 60) {
        middle = Math.round(theTime / 60);
        if (middle > 60) {
          hour = Math.round(middle / 60);
          middle = Math.round(middle % 60);
        }
      }
      let result = "";
      // + parseInt(theTime) + "秒";
      if (middle > 0) {
        result = "" + Math.round(middle) + "分" + result;
      }
      if (hour > 0) {
        result = "" + Math.round(hour) + "小时" + result;
      }
      return result;
    },
    handleCheckAllChange(val) {
      this.CheckedRoom = val ? this.room : [];
      this.isIndeterminate = false;
    },
    handleCheckedRoomChange() {
      const checkedCount = this.CheckedRoom.length;
      this.CheckAll = checkedCount === this.room.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.room.length;
      console.log(this.CheckedRoom);
    },

    Room_AutoRec: async function (uid, data) {
      let param = {
        UID: uid,
        IsAutoRec: data
      };
      let res = await postFormAPI("Room_AutoRec", param);
      return res.data;
    },
    Room_DanmuRec: async function (uid, data) {
      let param = {
        UID: uid,
        IsRecDanmu: data
      };
      let res = await postFormAPI("Room_DanmuRec", param);
      return res.data;
    },
    Room_Del: async function (uid) {
      let param = {
        UID: uid
      };
      let res = await postFormAPI("Room_Del", param);
      return res.data;
    },
    Room_Add: async function (uid) {
      let param = {
        UID: uid
      };
      let res = await postFormAPI("Room_Add", param);
      return res.data;
    },
    Rec_CancelDownload: async function (uid) {
      let param = {
        UID: uid
      };
      let res = await postFormAPI("Rec_CancelDownload", param);
      return res.data;
    }
  }
};
</script>

<style>
.room-sk {
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

.ng-btngroup {
  padding: 0 10px 0 10px;
}

.icon-img {
  vertical-align: middle;
  background-repeat: no-repeat;
  background-image: url("../../assets/icons.png");
}

.ng-roomGroup {
  /* position: absolute; */
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
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
  margin: 0.8rem 0 0.8rem 0;
}

.ng-roominput {
  max-width: 18rem;
}

.ng-todo {
  width: 8rem;
}

.ng-fromtitle {
  font-size: 0.8rem;
  padding: 0.5rem 0 0.5rem 0;
  color: #161313;
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
  height: 0;
  width: 100%;
  position: absolute;
  z-index: 101;
  /* top: 0; */
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 90%);
  backdrop-filter: blur(5px);
  overflow: hidden;
}

.ng-configbar {
  padding: 10px 10px 0 10px;
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

.ng-image {
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

.ng-checkbox {
  float: right;
  padding-right: 2px;
  pointer-events: auto;
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
  pointer-events: none;
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
  font-size: 0.6rem;
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
