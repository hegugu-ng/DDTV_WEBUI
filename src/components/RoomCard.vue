<template>
    <div v-loading="roomitem.loading" v-show="roomitem.show" class="float-up roomcard bilibili" >
        <!--:class="item.table" 后面不要忘了平台-->
        <!--直播中小红点-->
        <el-badge  class="livebadge" value="直播中" :hidden="!roomitem.islive"></el-badge>
        <div class="room-card-config">
            <el-popover trigger="hover">
            <div style="text-align: right; margin: 0">
                <el-button :disabled="true" size="mini" >锁定配置</el-button>
                <el-button type="danger" size="mini">删除房间</el-button>
            </div>
            <i class="el-icon-setting config-ico" slot="reference" style="font-size:20px"></i>
            </el-popover>
        </div>
        <div class="room-card-item">
            <div class="username" >{{ roomitem.name }} </div>
            <div class="originname">{{ roomitem.orname }} </div>
            <div>
                <i class="el-icon-video-camera" v-if="roomitem.rec"></i>
                <i class="el-icon-video-camera" v-else style="color: #d6c3c3"></i>
                <i class="el-icon-loading" v-if="roomitem.rec && roomitem.islive"></i>
            </div>
        </div>
        <el-switch class="live-switch" v-model="roomitem.rec" active-color="#46d485" inactive-color="#efe3e3"></el-switch>
        <div class="set">
            <i class="float-up" :class="roomitem.like ? 'el-icon-star-on like-on':'el-icon-star-off like-off'"></i>
            <i class="float-up el-icon-folder"></i>
        </div>
        <div class="roomid originname">ID:{{ roomitem.roomid }}</div>
    </div>
</template>
<script>
export default {
  name: "RoomCard",
  props: {
      roomitem:Object
  },
  data(){
      return{
      }
  }
};
</script>

<style>
.roomcard {
  height: 155px;
  width: 280px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e6e4e4;  
  border-radius: 6px;
  background-color: rgb(251 251 249);
  display: grid;
  grid-template-columns: 10px 50px 45px 95px 50px 20px 10px;
  grid-template-rows: 10px 20px 95px  20px 10px;
  grid-template-areas:  '. .      .    .    .    .         .'
                        '. live   .    .    .    config    .'
                        '. item   item item item item      .'
                        '. switch set  .    rid  rid       .'
                        '. .      .    .    .    .         .';
}
.float-up{
  position: relative;
  transition:top 0.3s;
  transition-timing-function: cubic-bezier(0.4, 1.01, 0.87, 1.02);
  top:0px
}
.float-up:hover{
  top:-4px;
}
.livebadge {
  grid-area: live;
}
.bilibili{
  background-image:  url("../assets/img/bilibili.png");
  background-repeat: no-repeat;
  background-position: right bottom;
}
.room-card-config {
  grid-area: config;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.config-ico{
  color: rgba(0, 0, 0, 0.342);
  transition: color 0.2s;
}
.config-ico:hover{
  color: #000;
}
.room-card-item {
  grid-area: item;
  padding-left: 10px;
}
.username {
  font-size: 28px;
  font-weight: 300;
  max-width: 251px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.originname {
  font-size: 10px;
  color: #af8585;
}
.live-switch {
  grid-area: switch;
}
.set {
  grid-area: set;
  display: flex;
  font-size: 20px;
  flex-direction: row;
  justify-content: space-between; 
}
.roomid{
  grid-area: rid;
}
.like-on{
  color: #ffd700;
  text-shadow: 0 0px 6px #ffd700c4;
  transition:color 0.2s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
.like-on:hover{
  color: #dbbe16;
}
.like-off{
  color: #383838;
  transition:color 0.2s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
.like-off:hover{
  color: #6e6b6b;
}

</style>