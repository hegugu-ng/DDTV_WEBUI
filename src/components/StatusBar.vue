<template>
  <div class="status-bar" v-if="$route.meta.show">
    <!--LoggerBox-->
    <transition name = "fade">
      <div class="logger-view" v-if="show">
        <div class="pane-toolbar">
          <div class="title">日志</div>
          <button type="button" class="ddtv-ui-bt toolbar-button flat icon-button" @click="ToBottom('#logsbox');Scroll = true">
            <div class="bt-content">
              <i class="el-icon-download"></i>
              <span class="default-slot"></span>
            </div>
          </button>
          <button type="button" class="ddtv-ui-bt toolbar-button flat icon-button" @click="clearLog()">
            <div class="bt-content">
              <i class="el-icon-delete-solid"></i>
              <span class="default-slot"></span>
            </div>
          </button>
          <button type="button" class="ddtv-ui-bt toolbar-button flat icon-button" @click="show = false">
            <div class="bt-content">
              <i class="el-icon-close"></i>
              <span class="default-slot"></span>
            </div>
          </button>
        </div>
        <div class="logs" id="logsbox" @mousewheel="Scroll = false">
          <transition-group name="R_slide-fade">
            <div class="logger-message" v-for="(log,count) in log" :key="count">
              <ng-lever :level="log.level" :levelshow="log.level != null ? true:false" />
              <div class="message" :class="log.level != null ? 'm12':null">{{ log.msg }}</div>
              <div class="date">{{ log.time }}</div>
            </div>
          </transition-group>
        </div>
      </div>
    </transition>
    <div class="content">
      <div class="section action current-project">
        <i class="el-icon-s-home icon-bar"></i>
      </div>
      <div class="section action console-log"  @click="show = !show">
        <i class="el-icon-s-order icon-bar"></i>
        <div class="massgelist">
          <transition-group name="slide-fade" appear>
            <div class="logger-message" v-for="(item,count) in logpool" :key="count" :v-if="false">
              <ng-lever :level="item.level" :levelshow="item.level != null ? true:false"></ng-lever>
              <div class="message" :class="item.level != null ? 'm12':null">{{ item.msg }}</div>
              <div class="date" v-if="item.time">{{ item.time }}</div>
            </div>
          </transition-group>
        </div>

      </div>
      <div class="section action current-project" >
        <i class="el-icon-question icon-bar"></i>
      </div>
      <div class="section action current-project" @click="reload()">
        <i class="el-icon-refresh icon-bar"></i>
      </div>
    </div>
  </div>
</template>

<script>
import loglever from "./TypeTag.vue";
import { mapState,mapMutations,mapGetters} from 'vuex';

export default {
  name: "status-bar",
  components: {
    "ng-lever":loglever
  },
  data() {
    return {
      show: false,
      logpool:[{"level":null,"msg":"没有日志","time":null}],
      Scroll: true
    };
  },
  computed:{
    ...mapState(['log']),
    ...mapGetters(['newLog','log'])
  },
  watch:{
    //监听newLog发生的变化
    "newLog": function(val,oldval){
      let nulldata = {"level":null,"msg":"没有日志","time":null};
      // 当用户删除了日志
      if (val == null) val = nulldata;
      if (oldval == null) oldval = nulldata;
      this.logpool=[oldval,val];
      // 当显示日志模块的时候，同时符合自动滚动的条件，进行自动滚动
      if (this.Scroll && this.show) this.ToBottom('#logsbox');
      setTimeout(() => {
        this.logpool=[val];
      },150)   
      this.logprint(val.level,val.msg,val.time)
    },
    // 监听用户触发日志模块的情况并处理
    show: function(val){
      // 当用户关闭日志模块时，复位
      if (val){ 
        this.Scroll = true;
        this.ToBottom('#logsbox')
      }
    }
  },
  props: {},
  methods:{
    ...mapMutations(['clearLog']),

    reload(){
      location.reload();
    },
    logprint(level,msg,time){
      // 将日志打印到控制台
      let data = "后端日志：" + msg + "  - ["+time+"]";
      if (level == "info" || level == null) console.info(data);
      if (level == "error") console.error(data);
      if (level == "warn") console.warn(data);
      if (level == "debug") console.debug(data);
    },
    ToBottom(elementId){
      // 将日志滚动到最下方
      this.$nextTick(() => {
        var container  = this.$el.querySelector(elementId);
        container.scrollTop = container.scrollHeight
      })
    }
  }
};
</script>

<style scoped>
.ddtv-ui-bt.icon-button {
  padding: 0;
  width: 32px;
  height: 32px;
}
.status-bar {
  flex: auto 0 0;
}
.status-bar {
  position: relative;
  z-index: 3;
  box-shadow: 0 -2px 10px rgb(0 0 0 / 10%);
}
.status-bar .content {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  height: 28px;
  background: #1d2935;
  color: #fff;
}
.logger-view .pane-toolbar{
  grid-area: toolbar;
}
.logger-message  {
  font-size: 12px;
}
.massgelist{
  flex: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.logger-view {
  background: #fff;
  height: 174px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
      "toolbar"
      "logs";
}
.logger-message{
  display: flex;
  flex-direction: row;
  align-items: baseline;
  font-family: Roboto Mono,monospace;
  box-sizing: border-box;
  padding: 2px 4px;
  flex: 100% 1 1;
}
.pane-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 6px 6px 16px;
}
.pane-toolbar .title {
  flex: 100% 1 1;
  width: 0;
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bt-content {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 18px;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.logs {
  grid-area: logs;
  padding: 0 16px;
  overflow-x: hidden;
  overflow-y: auto;
}
.logger-message .message {
  white-space: pre-wrap;
  flex: 100% 1 1;
  width: 0;
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.logger-message .date {
  opacity: .5;
}
.logger-message>.date {
    flex: auto 0 0;
}
.m12{
  margin-left: 12px;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter, .fade-leave-to {
  height: 0px;
  opacity: 0;
}
.logger-view .logger-message:hover {
    background: rgb(66 185 131 / 10%);
}
.status-bar .section.action {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
}
.status-bar .section {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
    height: 100%;
    cursor: default;
}
.status-bar .section:hover {
    background: #2c3e51;
}
.icon-bar{
  font-size: 15px;
}
.status-bar .console-log {
    flex: 100% 1 1;
    width: 0;
}

.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .2s ease;
}
.slide-fade-enter{
  height: 0px;
  opacity: 0;
}
.slide-fade-leave-to{
  height: 0px;
  opacity: 0;
}
.logs::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
.logs::-webkit-scrollbar-thumb {
    background-color: #b4c7d0c0;
    border: 3px solid transparent;
    background-clip: padding-box;
    border-radius: 5px;
}
.logs::-webkit-scrollbar-thumb:hover {
    background-color: #b2c4cc;
}
.logs::-webkit-scrollbar-track-piece {
    background: 0 0;
}
.R_slide-fade-enter-active ,.R_slide-fade-leave-active {
  transition: all .2s ease;
}
.R_slide-fade-enter, .R_slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
