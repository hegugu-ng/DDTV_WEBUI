<template>
  <div class="home">
    <!--核心数据-->
    <ng-ts-coredata></ng-ts-coredata>
    <div class="ng-table-group" v-if="monitor">
      <div class="ng-table" v-for="(item, index) in labe" :key="index">
        <div class="ng-table-title">{{ item.title }}</div>
        <div class="ng-table-app">
          <div class="ng-table-app-title">{{ item.desc }}</div>
          <div :id="item.id" style="width: 245px; height: 110px"></div>
        </div>
      </div>
    </div>

    <ng-infocard title="录制中房间管理" :update="liveUpdateTime_time" style="margin-top: 3vh">
      <Suspense>
        <template #default><RoomCardV2 :roomFilterMap="roomFilterMap" @requestApi="requestApi"></RoomCardV2></template>
        <template #fallback><div v-loading="true" style="height: 300px"></div></template>
      </Suspense>
    </ng-infocard>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
const RoomCardV2 = defineAsyncComponent(() => import("@/components/ng/RoomCardV2"));
</script>

<script>
import testCoredata from "../components/ng/Coredata";
import InfoCard from "../components/ng/InfoCard";
import { room_data } from "@/utils/data_cli";
import { mapState } from "vuex";
import { getRoomAllInfo, getSystemResources, getRecordingInfoLite } from "@/newapi";
import { NetworkConnection, NetworkDisconnection, TestInfo } from "@/utils/error";
// import store from "@/store";
export default {
  computed: {
    ...mapState(["screenWidth", "connectStatus"])
  },
  components: {
    "ng-infocard": InfoCard,
    "ng-ts-coredata": testCoredata
  },
  data() {
    return {
      roomFilterMap: new Map([["IsDownload", true]]),
      monitor: window.apiObj.monitor,
      mount: window.apiObj.mount,
      coreUpdateTime: null,
      coreUpdateTime_time: "",
      liveUpdateTime: null,
      liveUpdateTime_time: "",
      lp: "",
      timer: null,
      updateTimeManger: null
    };
  },
  mounted() {
    // this.UpdateDataView();
    // this.UpdateRoomView();
    // console.log("mount");
    // this.updateTimeManger = setInterval(this.Updatetime, 2000);
    // this.timer = setInterval(this.initView, 20000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    console.log("beforeUnmount");
  },
  // beforeRouteEnter(to, from, next) {
  //   if (store.state.System_Resources && store.state.Rec_RecordingInfo_Lite && store.state.Room_AllInfo) {
  //     next();
  //   } else {
  //     Promise.all([
  //       postFormAPI("System_Resources"),
  //       postFormAPI("Rec_RecordingInfo_Lite"),
  //       postFormAPI("Room_AllInfo")
  //     ]).then((res) => {
  //       store.commit("System_Resources", res[0].data.data);
  //       store.commit("Rec_RecordingInfo_Lite", res[1].data.data);
  //       store.commit("Room_AllInfo", res[2].data.data);
  //       next();
  //     });
  //   }
  // },
  methods: {
    pusherror(val) {
      if (val === 1) this.$store.commit("AddConnectStatus", NetworkDisconnection);
      if (val === 2) this.$store.commit("AddConnectStatus", NetworkConnection);
      if (val === 3) this.$store.commit("AddConnectStatus", TestInfo);
    },
    isNull(value) {
      return !value && typeof value != "undefined" && value !== 0;
    },
    initView() {},
    Updatetime() {
      const time = new Date();
      let NowTime = time.getTime();
      let coreUp, liveUp;
      if (this.isNull(this.coreUpdateTime)) coreUp = "更新中";
      else coreUp = Math.round((NowTime - this.coreUpdateTime) / 1000);
      if (this.isNull(this.liveUpdateTime)) liveUp = "更新中";
      else liveUp = Math.round((NowTime - this.liveUpdateTime) / 1000);
      if (coreUp < 8 || coreUp === "更新中") coreUp = "刚刚";
      else coreUp = coreUp + "秒前更新";
      if (liveUp < 8 || coreUp === "更新中") liveUp = "刚刚";
      else liveUp = liveUp + "秒前更新";
      this.coreUpdateTime_time = coreUp;
      this.liveUpdateTime_time = liveUp;
    },
    requestApi(type, roomid, data) {
      console.log(type, roomid, data);
      // TODO 分配一下
    },
    UpdateDataView: async function () {
      this.coreUpdateTime_time = "更新中";
      let data = this.$store.state.System_Resources;
      let room = this.$store.state.Rec_RecordingInfo_Lite;
      let allroom = this.$store.state.Room_AllInfo;
      console.log(data, room, allroom);
      let dl_all = 0;
      for (let i = 0; i < room.length; i++) {
        let item = room[i];
        dl_all += item.TotalDownloadCount;
      }
      let HDD = {};
      if (data.Platform !== "Linux") HDD = data.HDDInfo[0];
      else {
        let dish = data.HDDInfo;
        var dishlen = dish.length;
        for (var j = 0; j < dishlen; j++) {
          if (dish[j].MountPath === this.mount) {
            HDD = dish[j];
          }
        }
      }
      this.CoreData = [
        { title: "房间数", data: allroom.length },
        { title: "正在录制", data: room.length },
        { title: "CPU占用", data: `${data.CPU_usage}%` },
        {
          title: "内存占用",
          data: `${(((data.Memory.Total - data.Memory.Available) / data.Memory.Total) * 100).toFixed(1)}%`
        },
        { title: "硬盘占用", data: HDD.Used },
        {
          title: "下载总量",
          data: dl_all > 1000000000 ? (dl_all / 1000000000).toFixed(2) + "GB" : (dl_all / 1000000).toFixed(2) + "MB"
        }
      ];
      var time = new Date();
      this.coreUpdateTime = time.getTime(); //获取当前时间,毫秒数
    },
    UpdateRoomView: async function () {
      this.liveUpdateTime_time = "更新中";
      let allRoom = this.$store.state.Room_AllInfo;
      let liveRoomData = [];
      // 开始生成本地渲染列表的索引
      allRoom.forEach((item) => {
        if (item.live_status === 1 && item.IsDownload) {
          liveRoomData.push(item);
        }
      });
      await room_data(this, liveRoomData);
      const time = new Date();
      this.liveUpdateTime = time.getTime();
    },
    Room_AllInfo: async function () {
      await getRoomAllInfo().then((res) => {
        this.$store.commit("Room_AllInfo", res.data.data);
      });
    },
    System_Resources: async function () {
      await getSystemResources().then((res) => {
        this.$store.commit("System_Resources", res.data.data);
      });
    },
    Rec_RecordingInfo_Lite: async function () {
      await getRecordingInfoLite().then((res) => {
        this.$store.commit("Rec_RecordingInfo_Lite", res.data.data);
      });
    }
  }
};
</script>

<style>
.home {
  padding: 10px;
  /* background-color: #fff; */
}
.ng-table-group {
  display: flex;
  margin-top: 1vh;
}
.ng-table {
  height: 170px;
  width: 245px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  background-color: #fff;
  border: 1px solid #e5dbdb;
  margin-right: 10px;
}
.ng-table-title {
  margin-bottom: 18px;
  font-weight: 700;
  font-size: 14px;
}
.ng-table-app-title {
  margin-bottom: 8px;
  font-size: 10px;
}
</style>
