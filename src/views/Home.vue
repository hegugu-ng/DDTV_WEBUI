<template>
  <div class="home">
    <!--核心数据-->
    <ng-infocard title="核心数据" update="23秒前">
      <ng-datagroup :CardItem="CoreData"></ng-datagroup>
    </ng-infocard>
    <ng-infocard title="录制中房间管理" update="刚刚" style="margin-top: 1vh">
      <ng-roomcard :room="room" @requestApi="requestApi"></ng-roomcard>
    </ng-infocard>
    <ng-infocard title="近24小时数据" update="1分钟前" style="margin-top: 1vh">
      <div :style="{ 'margin-top': '2vh' }">
        <div class="ng-hlbt" v-for="(item, count) in OneDayData" @click="Pic.key = item.key;Pic.title = item.title;" :style="item.key == Pic.key ? Pic.on : Pic.off"
          :key="count"
        >
          {{ item.title }}
        </div>
      </div>
      <div id="Oneday" style="height: 300px"></div>
    </ng-infocard>
  </div>
</template>
<script>
import InfoCard from "../components/ng/InfoCard";
import DataGroup from "../components/ng/DataGroup";
import RoomCardV2 from "../components/ng/RoomCardV2"
import {room_data} from '../utils/data_cli'
import * as echarts from "echarts";
import { mapState } from 'vuex';
import { postFormAPI } from "../api";
export default {
  computed:{
    ...mapState(['screenWidth']),
  },
  components: {
    "ng-infocard": InfoCard,
    "ng-datagroup": DataGroup,
    "ng-roomcard":RoomCardV2
  },
  data() {
    return {
      lp:'',
      options: [{
          value: '1',
          label: '停止录制'
        }, {
          value: '2',
          label: '删除房间并停止录制'
        }, {
          value: '3',
          label: '删除房间'
        }],
      OneDayFrom: null,
      room:[],
      Pic: {
        title: "CPU使用率",
        key: "cpu",
        on: { "background-color": "#23ade5", color: "#fff" },
        off: { "background-color": "#fff", color: "#000" },
      },
      CoreData: [
        { title: "房间数", data: '--' },
        { title: "正在录制", data: '--' },
        { title: "CPU占用", data: '--'},
        { title: "内存占用", data: '--'},
        { title: "硬盘占用", data: '--'},
        { title: "下载总量", data: '--'}
      ],
      OneDayData: [
        { title: "CPU使用率", key: "cpu" },
        { title: "内存使用率", key: "ram" },
        { title: "流量", key: "ll" },
        { title: "开播人数", key: "live" },
      ],
    };
  },
  watch: {
    'screenWidth': function() {
      this.OneDayFrom.resize()
    },
    "Pic.key": function (newval, oldval) {
      // 监听表格变换，进行新建与销毁
      console.log(newval, oldval);
      // 表单被切换先清理
      this.OneDayFrom.dispose();
      if (newval == "cpu") this.Cpu();
      if (newval == "ram") this.Ram();
      if(newval == "ll")this.ll()
    },
  },
  mounted() {
    this.Cpu();
    this.UpdateDataView()
    this.UpdateRoomView()
  },
  methods: {  
    requestApi(type,roomid,data){
      console.log(type,roomid,data)
      // 分配一下
    },
    PR(Series) {
      this.OneDayFrom = echarts.init(document.getElementById("Oneday"));
      let last = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      );
      var myChart = this.OneDayFrom;
      var option;
      option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          min: new Date(new Date().toLocaleDateString()).getTime(),
          max: last,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        grid: {
          left: 30,
          top: 30,
          right: 30,
          bottom: 70,
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
          },
        ],
        series: Series,
      };

      option && myChart.setOption(option);
    },
    Cpu() {
      // 定一个基本日期
      let base = +new Date(new Date().toLocaleDateString()).getTime();
      let OneMin = 1000 * 60;
      let data = [[base, Math.floor(Math.random() * 100)]];
      for (let i = 1; i < 2000; i++) {
        let now = new Date((base += OneMin));
        if (now > new Date()) break;
        data.push([+now, Math.floor(Math.random() * 100)]);
      }
      data = [
        {
          name: "CPU占用",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: data,
        },
      ];
      this.PR(data);
    },
    Ram() {
      // 定一个基本日期
      let base = +new Date(new Date().toLocaleDateString()).getTime();
      let OneMin = 1000 * 60;
      let data = [[base, Math.floor(Math.random() * 20 -10) + 10]];
      for (let i = 1; i < 2000; i++) {
        let now = new Date((base += OneMin));
        if (now > new Date()) break;
        data.push([+now, 50 + Math.floor(Math.random() * 30 -20)]);
      }
      data = [
        {
          name: "内存占用",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: data,
        },
      ];
      this.PR(data);
    },
    ll() {
      // 定一个基本日期
      let base = +new Date(new Date().toLocaleDateString()).getTime();
      let OneMin = 1000 * 60;
      let data = [[base, Math.floor(Math.random() * 20 -10) + 10]];
      let base1 = base
      for (let i = 1; i < 20000; i++) {
        let now = new Date((base1 += OneMin));
        if (now > new Date()) break;
        data.push([+now, 10 + Math.floor(Math.random() * 20 -10)]);
      }
      
      let data2 = [[base, Math.floor(Math.random() * 80 -60) + 60]];
      for (let i = 1; i < 2000; i++) {
        let now = new Date((base += OneMin));
        if (now > new Date()) break;
        let p = 350
        if(i<100) p = 50
        if(i<400) p = 80
        if(i<800) p = 150
         
        data2.push([+now, p+Math.floor(Math.random() * 10)]);
      }
      data = [
        {
          name: "上传",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: data,
        },
        {
          name: "下载",
          type: "line",
          data: data2,
        },
      ];
      this.PR(data);
    },
    UpdateDataView:async function(){
      let data = await this.System_Resources()
      let room = await this.Rec_RecordingInfo_Lite()
      let allroom = await this.Room_AllInfo()
      let dl_all = 0
      for (let i = 0; i < room.length; i++) {
          let item = room[i]
          dl_all += item.TotalDownloadCount
        }
      this.CoreData = [
        { title: "房间数", data: allroom.length },
        { title: "正在录制", data: room.length },
        { title: "CPU占用", data:`${data.CPU_usage}%` },
        { title: "内存占用", data: `${(((data.Memory.Total - data.Memory.Available)/data.Memory.Total)*100).toFixed(1)}%`},
        { title: "硬盘占用", data: `${data.HDDInfo[0].Used}` },
        { title: "下载总量", data: dl_all > 1000000000 ? (dl_all/1000000000).toFixed(2) + "GB":(dl_all/1000000).toFixed(2)+ "MB" }
      ]

    },
    UpdateRoomView:async function(){
      let liveroom = await this.Rec_RecordingInfo_Lite()
      let allroom = await this.Room_AllInfo()
      let datalen = liveroom.length,
          dataslent = [],
          liveroomdata = []
      // 开始生成本地渲染列表的索引
      for (var i = 0; i < datalen; i++) { 
        dataslent.push(liveroom[i].Uid) 
      } 
      for (var j = 0; j < dataslent.length; j++) { 
        for (var k = 0; k < allroom.length; k++) { 
          if(dataslent[j] == allroom[k].uid){
            liveroomdata.push(allroom[k])
            break
          }
        } 
      } 
      await room_data(this,liveroomdata)
    },
    Room_AllInfo:async function() {
      let res = await postFormAPI('Room_AllInfo')
      return res.data.data
    },
    System_Resources:async function(){
      let res = await postFormAPI('System_Resources')
      return res.data.data
    },
    Rec_RecordingInfo_Lite:async function(){
      let res = await postFormAPI('Rec_RecordingInfo_Lite')
      return res.data.data
    }
  },
};
</script>


<style>
.home {
  padding: 10px;
  background-color: #f1f1f1f1;
}
</style>