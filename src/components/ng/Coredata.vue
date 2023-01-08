<template>
  <ng-infocard title="核心数据" :update="UpdateTime">
    <el-skeleton :loading="CoreData === null" :throttle="500" animated>
      <template #template>
        <div class="ng-data-group">
          <div style="border: 1px solid #e9eaec; border-radius: 8px; background: #fff; padding: 10px" v-for="count in 6"
            :key="count">
            <el-skeleton-item variant="text" style="font-size: 15px; width: 40%" />
            <el-skeleton-item variant="rect" style="margin-top: 16px; height: 30px; width: 55%; display: block" />
          </div>
        </div>
      </template>
      <template #default>
        <DataGroup :CardItem="CoreData"></DataGroup>
      </template>
    </el-skeleton>
  </ng-infocard>
</template>
<script>
import store from "@/store";
import InfoCard from "./InfoCard";
// import { postFormAPI } from "@/api";
// import DataGroupSkeleton from "./DataSkeleton";
export default {
  name: "CoreDataComponents",
  components: {
    // 基础卡片样式的组件
    "ng-infocard": InfoCard
    // 数据展示骨架屏
    // "ng-cd-skeleton": DataGroupSkeleton
  },
  data: function () {
    return {
      monitor: window.apiObj.monitor,
      mount: window.apiObj.mount,
      UpdateTime: "刚刚",
      CoreData: null
    };
  },
  mounted() {
    this.UpdateDataView()
  },
  methods: {
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
    }
  }
};
</script>
