<template>
  <ng-infocard title="核心数据" :update="UpdateTime">
    <el-skeleton class="ng-data-group" :loading="Loading" :count="6" animated>
      <template #template>
        <div style="border: 1px solid #e9eaec; border-radius: 8px; background: #fff; padding: 10px">
          <el-skeleton-item variant="text" style="font-size: 15px; width: 40%" />
          <el-skeleton-item variant="rect" style="margin-top: 16px; height: 30px; width: 55%; display: block" />
        </div>
      </template>
      <template #default>
        <div class="ng-data-group">
          <div class="data-item" v-for="(item, count) in CoreData" :key="count">
            <div class="title">{{ item.title }}</div>
            <div class="data">{{ item.data }}</div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </ng-infocard>
</template>
<script>
// TODO 整理逻辑和添加轮询
import InfoCard from "./InfoCard";
// import { postFormAPI } from "@/api";
import { getSystemResources, getRecordingInfoLite, getRoomAllInfo } from "@/newapi";
import store from "@/store";
export default {
  name: "CoreDataComponents",
  components: {
    // 基础卡片样式的组件
    "ng-infocard": InfoCard
  },
  data: function () {
    return {
      Loading: true,
      monitor: window.apiObj.monitor,
      mount: window.apiObj.mount,
      UpdateTime: "正在更新数据",
      CoreData: null
    };
  },
  mounted() {
    this.LoadData();
  },
  methods: {
    LoadData: function () {
      if (store.state.System_Resources && store.state.Rec_RecordingInfo_Lite && store.state.Room_AllInfo) {
        this.UpdateDataView();
        this.Loading = false;
        this.UpdateTime = Date().toString();
      } else {
        Promise.all([getSystemResources(), getRecordingInfoLite(), getRoomAllInfo()]).then((res) => {
          console.log("CoreData组件请求数据成功", res);
          store.commit("System_Resources", res[0].data.data);
          store.commit("Rec_RecordingInfo_Lite", res[1].data.data);
          store.commit("Room_AllInfo", res[2].data.data);
          this.UpdateDataView();
          this.UpdateTime = Date().toString();
          this.Loading = false;
        });
      }
    },
    UpdateDataView: async function () {
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
    }
  }
};
</script>

<style>
.ng-info-card {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  /* padding: 20px; */
  box-shadow: 0 2px 22px 0 rgb(0 0 0 / 10%);
  color: #242f57;
}

.ng-info-card > .title {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  /* padding: 0px 25px 0px 25px; */
}

.ng-info-card > .title > .desc {
  font-weight: bold;
}

.ng-info-card > .title > .date {
  font-size: 13px;
  color: #d3d3d3;
}

.ng-data-group {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  grid-row-gap: 2vh;
  grid-column-gap: 2vh;
}

.ng-data-group > .data-item {
  border: 1px solid #e9eaec;
  border-radius: 8px;
  background: #fff;

  padding: 10px;
}

.ng-data-group > .data-item:hover {
  /* margin-top: 20px; */
  box-shadow: 1px 0 20px 0 rgb(59 64 72 / 16%);
}

.ng-data-group > .data-item > .title {
  font-size: 15px;
}

.ng-data-group > .data-item > .data {
  margin-top: 7px;
  font-size: 30px;
  font-weight: bold;
}
</style>
