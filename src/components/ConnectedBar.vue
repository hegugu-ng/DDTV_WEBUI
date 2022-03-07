<template>
  <div class="connection-status" :class="connectStatus.level" v-show="$route.path=='/login' ? connectStatus.type == 'networkError':true">
    <transition name = "fade">
      <div class="banner" v-if="connectStatus.show">
        <div class="content disconnected">
          <ng-svg class="icon" icon-class="link"/>
          <div class="msg">{{ connectStatus.msg }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TweenLite from 'gsap';
export default {
  name: "ConnectedBar",
  computed:{
    ...mapState(['connectStatus']),
  },
  watch:{
    'connectStatus.level': function(val) {
      let color = '#fff'
      switch(val){
        case 'error':
          color = '#F56C6C';
          break;
        case 'warn':
          color = '#E6A23C';
          break;
        case 'info':
          color = '#909399';
          break;
        case 'success': 
          color = '#c1ae67'
          break;
      }
      TweenLite.to('.connection-status',{background:color})
    }
  }

};

</script>

<style scoped>
.connection-status {
  flex: auto 0 0;
}
.banner {
  color: #fff;
  height: 45px;
  position: relative;
}
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 90000;
  align-content: center;
  flex-direction: row;
}
.content .icon {
  margin-right: 10px;
  font-size: 20px;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter, .fade-leave-to {
  height: 0px;
  opacity: 0;
}
.info {
  background: #03c2e6;
}
.error {
  background: #F56C6C;
}
.warn {
  background: #E6A23C;
}
.debug {
  background: #909399;
}

</style>
