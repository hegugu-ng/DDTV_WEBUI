<template>
  <div class="home">
    <!--核心数据-->
    <ng-infocard title="核心数据" :update="coreUpdateTime_time">
      <ng-datagroup :CardItem="CoreData"></ng-datagroup>
    </ng-infocard>
    <div class="ng-table-group" v-if="monitor">
      <div class="ng-table" v-for="(item,index) in labe" :key="index">
        <div class="ng-table-title">{{item.title}}</div>
        <div class="ng-table-app">
          <div class="ng-table-app-title">{{item.desc}}</div>
          <div :id="item.id" style="width: 245px; height: 110px"></div>
        </div>
      </div>
    </div>

    <ng-infocard title="录制中房间管理" :update="liveUpdateTime_time" style="margin-top: 3vh">
      <ng-roomcard :room="room" @requestApi="requestApi"></ng-roomcard>
    </ng-infocard>
  </div>
</template>
<script>
import InfoCard from "../components/ng/InfoCard";
import DataGroup from "../components/ng/DataGroup";
import RoomCardV2 from "../components/ng/RoomCardV2";
import { room_data } from "../utils/data_cli";
import * as echarts from "echarts";
import { mapState } from "vuex";
import { postFormAPI, getListAPIv2 } from "../api";
export default {
  computed: {
    ...mapState(["screenWidth"]),
  },
  components: {
    "ng-infocard": InfoCard,
    "ng-datagroup": DataGroup,
    "ng-roomcard": RoomCardV2,
  },
  data() {
    return {
      monitor:window.apiObj.monitor,
      mount: window.apiObj.mount,
      coreUpdateTime: null,
      coreUpdateTime_time :"",
      liveUpdateTime: null,
      liveUpdateTime_time :"",
      lp: "",
      options: [
        {
          value: "1",
          label: "停止录制",
        },
        {
          value: "2",
          label: "删除房间并停止录制",
        },
        {
          value: "3",
          label: "删除房间",
        },
      ],
      labe:[
        {title:"CPU利用率（%）",desc:"当前：97.266% 总量：2核",id:"cpu-labe"},
        {title:"内存使用量（MB）",desc:"当前：917.5MB 总量：4GB",id:"ram-labe"},
        {title:"公网带宽使用（Mbps）",desc:"当前：0.069（入）0.02（出）",id:"lan-labe"},
        ],
      OneDayFrom: null,
      room: [],
      Pic: {
        title: "CPU使用率",
        key: "cpu",
        on: { "background-color": "#23ade5", color: "#fff" },
        off: { "background-color": "#fff", color: "#000" },
      },
      CoreData: [
        { title: "房间数", data: "--" },
        { title: "正在录制", data: "--" },
        { title: "CPU占用", data: "--" },
        { title: "内存占用", data: "--" },
        { title: "硬盘占用", data: "--" },
        { title: "下载总量", data: "--" },
      ],
      OneDayData: [
        { title: "CPU使用率", key: "cpu" },
        { title: "内存使用率", key: "ram" },
        { title: "流量", key: "ll" },
        { title: "开播人数", key: "live" },
      ],
      timer_core: null,
      timer_liveroom: null,
      updateTimeManger: null,
    };
  },
  mounted: function () {
    if(this.monitor){
      this.CpuUsage();
      this.MemUsage();
      this.Lan();
    }
    // this.timer_core = (() => {    this.UpdateDataView }, 1000);
    this.timer_core = setInterval(this.UpdateDataView, 30000);
    this.timer_liveroom = setInterval(this.UpdateRoomView, 20000);
    this.updateTimeManger = setInterval(this.Updatetime, 2000);
    this.UpdateDataView();
    this.UpdateRoomView();
  },
  beforeUnmount() {
    clearInterval(this.timer_core);
    clearInterval(this.timer_liveroom);
    console.log("beforeUnmount");
  },
  methods: {
    isNull(value) {
      if (!value && typeof value != "undefined" && value != 0) {
          return true;
      } else {
          return false;
      }
    },
    Updatetime(){
      var time = new Date();
      let NowTime = time.getTime();
      let coreUp,liveUp;
      if (this.isNull(this.coreUpdateTime)) coreUp = "更新中";
      else coreUp = Math.round((NowTime - this.coreUpdateTime)/1000);

      if (this.isNull(this.liveUpdateTime)) liveUp = "更新中";
      else liveUp = Math.round((NowTime - this.liveUpdateTime)/1000);

      if (coreUp < 8) coreUp = "刚刚";
      else coreUp = coreUp + "秒前更新"

      if (liveUp < 8) liveUp = "刚刚";
      else liveUp = liveUp + "秒前更新"


      this.coreUpdateTime_time  = coreUp;
      this.liveUpdateTime_time = liveUp;
    },
    requestApi(type, roomid, data) {
      console.log(type, roomid, data);
      // 分配一下
    },
    PR(x,series,id) {
      var chartDom = document.getElementById(id);
      var myChart = echarts.init(chartDom);
      let option = {
        tooltip: {confine :false,trigger: 'axis',axisPointer: {type: 'line'}},
        xAxis: {type: "category",boundaryGap: false,data:x},
        yAxis: {type: "value",splitNumber: 2,axisPointer: {snap: true},},
        grid: {left:"0px",right: "10px", top:"10px",bottom: "0px",containLabel:true },
        series: series
      };

      option && myChart.setOption(option);
    },
    CpuUsage: async function () {
      let res = await getListAPIv2("/tencent?MetricName=CpuUsage");
      let Timestamps = res.data.data.DataPoints[0].Timestamps;
      let Values = res.data.data.DataPoints[0].Values;
      let series = [
          {
            name: "CPU占用率",
            type: "line",
            showSymbol: false,
            smooth: true,
            data: Values,
          },
        ]
      this.PR(this.valtokey(Timestamps),series,'cpu-labe');
    },
    MemUsage: async function () {
      let res = await getListAPIv2("/tencent?MetricName=MemUsed");
      let Timestamps = res.data.data.DataPoints[0].Timestamps;
      let Values = res.data.data.DataPoints[0].Values;
      let series = [
          {
            name: "内存使用量",
            type: "line",
            showSymbol: false,
            smooth: true,
            data: Values,
          },
        ]
      this.PR(this.valtokey(Timestamps),series,'ram-labe');
    },
    Lan: async function() {
      // 定一个基本日期
      let LighthouseIntraffic = await getListAPIv2("/tencent?MetricName=LighthouseIntraffic");
      let Timestamps_LighthouseIntraffic = LighthouseIntraffic.data.data.DataPoints[0].Timestamps;
      let Values_LighthouseIntraffic = LighthouseIntraffic.data.data.DataPoints[0].Values;

      let LighthouseOuttraffic = await getListAPIv2("/tencent?MetricName=LighthouseOuttraffic");
      // let Timestamps_LighthouseOuttraffic = LighthouseOuttraffic.data.data.DataPoints[0].Timestamps;
      let Values_LighthouseOuttraffic = LighthouseOuttraffic.data.data.DataPoints[0].Values;

      let series = [
          {
            name: "流入流量",
            type: "line",
            showSymbol: false,
            smooth: true,
            yAxisIndex: 0,
            data: Values_LighthouseIntraffic
          },
          {
            name: "流出流量",
            type: "line",
            showSymbol: false,
            smooth: true,
            yAxisIndex: 0,
            data: Values_LighthouseOuttraffic
          },
        ]
      this.PR(this.valtokey(Timestamps_LighthouseIntraffic),series,'lan-labe');
    },
    Format: function(Q){return Q < 10 ? '0' + Q : Q},
    valtokey(arr1) {
      let res = [];
      for (var k = 0; k < arr1.length; k++) {
        let time = arr1[k];
        let T = new Date(time*1000);
        let Result = this.Format(T.getHours()) + ':' + this.Format(T.getMinutes());
        
        res.push(Result);
      }
      return res;
    },

    UpdateDataView: async function () {
      this.coreUpdateTime_time = "更新中";
      let data = await this.System_Resources();
      let room = await this.Rec_RecordingInfo_Lite();
      let allroom = await this.Room_AllInfo();
      let dl_all = 0;
      for (let i = 0; i < room.length; i++) {
        let item = room[i];
        dl_all += item.TotalDownloadCount;
      }
      let HDD = {};
      if (data.Platform != "Linux") HDD = data.HDDInfo[0];
      else {
        let dish = data.HDDInfo;
        var dishlen = dish.length;
        for (var j = 0; j < dishlen; j++) {
          if (dish[j].MountPath == this.mount) {
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
          data: `${(
            ((data.Memory.Total - data.Memory.Available) / data.Memory.Total) *
            100
          ).toFixed(1)}%`,
        },
        { title: "硬盘占用", data: HDD.Used },
        {
          title: "下载总量",
          data:
            dl_all > 1000000000
              ? (dl_all / 1000000000).toFixed(2) + "GB"
              : (dl_all / 1000000).toFixed(2) + "MB",
        },
      ];
      var time = new Date();
      this.coreUpdateTime = time.getTime(); //获取当前时间,毫秒数
    },
    UpdateRoomView: async function () {
      this.liveUpdateTime_time = "更新中";
      let liveroom = await this.Rec_RecordingInfo_Lite();
      let allroom = await this.Room_AllInfo();
      let datalen = liveroom.length,
        dataslent = [],
        liveroomdata = [];
      // 开始生成本地渲染列表的索引
      for (var i = 0; i < datalen; i++) {
        dataslent.push(liveroom[i].Uid);
      }
      for (var j = 0; j < dataslent.length; j++) {
        for (var k = 0; k < allroom.length; k++) {
          if (dataslent[j] == allroom[k].uid) {
            liveroomdata.push(allroom[k]);
            break;
          }
        }
      }
      await room_data(this, liveroomdata);
      var time = new Date();
      this.liveUpdateTime = time.getTime();
    },
    Room_AllInfo: async function () {
      let res = await postFormAPI("Room_AllInfo");
      return res.data.data;
    },
    System_Resources: async function () {
      let res = await postFormAPI("System_Resources");
      return res.data.data;
    },
    Rec_RecordingInfo_Lite: async function () {
      let res = await postFormAPI("Rec_RecordingInfo_Lite");
      return res.data.data;
    },
  },
};
</script>


<style>
.home {
  padding: 10px;
  /* background-color: #fff; */
}
.ng-table-group{
  display:flex;
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