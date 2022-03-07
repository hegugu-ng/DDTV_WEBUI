<template>
  <div class="room">
    <el-drawer v-model="drawer" :direction="direction" :before-close="handleClose" size="60%">
      <template #title>
        <div>
          <div>添加房间</div>
          <el-input style="margin-top: 10px" size="small" v-model="addkeywords" placeholder="搜索 房间号/昵称" clearable>
            <el-icon style="vertical-align: middle;">
              <search />
            </el-icon>
          </el-input>
          <div class="ng-ultitle">找到{{ seview.length }}位主播</div>
        </div>
      </template>

      <template class="drawer"  #default>
        <div class="ng-bntgroup" v-if="seview.length != 0">
          <ul class="ng-userGroup">
            <li class="ng-user-item" v-for="(item, index) in seview" :key="index" @click="open(item.uname,item.uid,'添加房间',Room_Add)">
              <div class="ng-user-itemvi">
                <div class="ng-faceGroup-Big ng-faceflex">
                  <div class="ng-face-Big">
                    <img
                      class="ng-image"
                      referrerPolicy="no-referrer"
                      :src="`https:${item.uface}@60w_60h_1c_1s.webp`"
                    />
                  </div>
                </div>
                <div class="ng-userinfo">
                  <div v-html="item.uname" class="ng-username"></div>
                  <div
                    class="ng-liveStuat"
                    :class="item.live_status == 0 ? 'nolive' : 'live'"
                  >
                    {{ item.live_status == 0 ? "未开播" : "直播中" }}
                  </div>
                  <div class="ng-ps ng-username">
                    {{ item.cate_name == "" ? "未选择分区" : item.cate_name }}
                  </div>
                </div>
              </div>
              <div class="iconbar" v-if="item.inlist">
                <div class="inserver"></div>
              </div>
            </li>
          </ul>
        </div>
        <el-empty v-else description="没有符合的搜索结果"></el-empty>
      </template>
      </el-drawer>

    <ng-roomcard :room="room" @request="test" @requestgroup="test2">
      <li class="ng-addroom" @click="drawer = true">
        <div class="ng-add">
          <div class="additem">
            <i class="el-icon-plus addicon"></i>
            <div class="addtitle">点击添加房间</div>
          </div>
        </div>
      </li>
    </ng-roomcard>
  </div>
</template>
<script>
import { postFormAPI } from "../api";
import { room_data } from "../utils/data_cli";
import RoomCardV2 from "../components/ng/RoomCardV2";
export default {
  name: "Room",
  components: {
    "ng-roomcard": RoomCardV2,
  },
  data() {
    return {
      drawer: false,
      direction: "ltr",
      room: [],
      addkeywords: '',
      seview: [],
    };
  },
  mounted:async function() {
    console.debug("[UI] 挂载房间配置页面");
    await this.Room_AllInfo();
    this.timer = setInterval(() => {
      this.Room_AllInfo();
    }, 10000)
  },
  watch:{
    addkeywords:async function(newval){
      if(newval!= ''){
        let res = await this.User_Search(newval)
        this.seview = res.data.data.result
      }
      else this.seview = []
    }
  },
  methods: {
    open(user,uid,active,fun) {
        this.$confirm(`确认将${user}(${uid})添加到录制列表？`, active, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fun(uid)
          this.$message({
            type: 'success',
            message: `${active}成功!`
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${active}`
          });          
        });
      },
    handleClose(done) {
      done();
      this.adduid = '';
    },
    test: async function (cmd, uid, data, index) {
      this.room[index].load = true;
      let res = { code: -1 };
      try {
        if (cmd == "Room_AutoRec") res = await this.Room_AutoRec(uid, data);
        if (cmd == "Room_DanmuRec") res = await this.Room_DanmuRec(uid, data);
        if (cmd == "Room_Del") res = await this.Room_Del(uid);
        // 抛出错误
        if (res.code != 0) throw new Error("服务器返回错误");
        if (cmd == "Room_Del") this.room.splice(index, 1);
      } catch (err) {
        if (cmd == "Room_AutoRec") this.room[index].IsAutoRec = !data;
        if (cmd == "Room_DanmuRec") this.room[index].IsRecDanmu = !data;
      } finally {
        this.room[index].load = false;
      }
    },
    test2(cmd, uidGropu) {
      console.log(cmd, uidGropu);
    },
    User_Search: async function(KeyWord){
      let param = {
        keyword:KeyWord
      }
      let res = await postFormAPI("User_Search",param);
      return res.data
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
    }
  },
  destroyed() {
    clearInterval(this.timer); //关闭
  }
};
</script>
<style>
.el-drawer__body{
  padding: 0!important;
}
.el-drawer__header{
  align-items: flex-start!important;
  margin-bottom: 10px!important;
}
.iconbar {
  position: absolute;
  right: -20px;
  top: -11px;
}
.ng-pull {
  flex: 1;
  overflow: auto;
}
.ng-pull-box {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.bottombt{
  width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #c7c8ca
}
.inserver {
  width: 110px;
  height: 110px;
  background: url("../assets/success.png") 0px 0px no-repeat;
  background-size: auto 100%;
  transform: rotate(29deg);
  /* opacity: 0.5; */
}
.live {
  background-color: #f6313e;
}
.nolive {
  background-color: #878787;
}
.ng-username {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.keyword {
  color: #888;
  font-style: normal;
  font-weight: 400;
}
.ng-inline {
  display: inline;
}
.ng-center {
  display: flex;
  justify-content: center;
}
.ng-pagelist {
  margin-top: 20px;
}
.ng-pageitem {
  color: #222;
  cursor: pointer;
  outline: none;
  text-align: center;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ddd;
  background-image: none;
  transition: all 0.2s;
  font-size: 10px;
  min-width: 15px;
  margin: 0 2px;
  padding: 0 8px;
  display: inline-block;
  height: 30px;
  line-height: 30px;
}
.ng-pageitem:hover,
.ng-pageitem-active {
  background: #00a1d6;
  color: #fff;
  border: 1px solid #00a1d6;
}
.room {
  padding: 10px;
}
.ng-addroom {
  cursor: pointer;
  display: inline-block;
  width: 226px;
  height: 175px;
  border: 2px dashed #e9eaec;
  padding: 10px 2px;
  margin: 0 0.8rem 0.8rem 0;
  border-radius: 8px;
  background: #fff;
  position: relative;
  overflow: hidden;
}
.ng-addroom:hover {
  box-shadow: 0 13px 20px 0 rgb(59 64 72 / 22%);
  transition: transform 0.3s cubic-bezier(0.63, -0.01, 0.59, 1);
}

.ng-add {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.additem {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.addicon {
  color: #888;
  font-size: 4rem;
}
.addtitle {
  color: #888;
  font-size: 1rem;
}
.ng-userGroup {
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
}
.ng-user-item {
  display: inline-block;
  border: 1px solid #e9eaec;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
}
.ng-user-itemvi {
  width: 190px;
  display: flex;
}
.ng-user-item:hover {
  box-shadow: 0 0 7px rgb(0 0 0 / 30%);
}
.ng-ultitle {
  font-size: 16px;
  font-weight: 400;
  color: #646c7a;
  padding: 10px 0px 10px 0px;
}
.ng-faceGroup-Big {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid #c2cee7;
  overflow: hidden;
  margin-right: 10px;
}
.ng-face-Big {
  width: 70px;
  height: 70px;
}
.ng-faceflex {
  flex-shrink: 0;
}
.ng-userinfo {
  flex: 1;
}
.ng-liveStuat {
  height: 20px;
  width: 50px;
  border-radius: 7px;
  font-size: 13px;
  color: #fff;
  text-indent: 6px;
  line-height: 20px;
  margin-top: 5px;
}
.ng-ps {
  color: #888;
  font-size: 13px;
  margin-top: 5px;
}
</style>
