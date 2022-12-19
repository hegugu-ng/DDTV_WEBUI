<template>
  <div class="connection-status">
    <div class="con-msg-banner">
      <div class="content disconnected">
        <ng-svg class="icon" :icon-class="icon" />
        <div class="msg">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { NetworkConnection, NetworkDisconnection } from "../utils/error"
import TweenLite from 'gsap';
export default {
  name: "ConnectedBar",
  computed: {
    ...mapState(['connectStatus']),
  },
  data() {
    return {
      message: "",
      icon: "",
      level: "success",
      color: { error: "#F56C6C", warn: "#E6A23C", info: "#909399", success: "#c1ae67" }
    };
  },
  watch: {
    connectStatus: {
      handler(newValue, oldValue) {
        let index = newValue.indexOf(NetworkDisconnection)
        if(index !== -1){
          TweenLite.to('.con-msg-banner', { background: this.color[newValue[index].level],height: "45px" })
        }
        console.log(newValue)

      },
      deep: true
    }
    // 'connectStatus.level': function (val) {
    //   let color = '#fff'
    //   switch (val) {
    //     case 'error':
    //       color = '#F56C6C';
    //       break;
    //     case 'warn':
    //       color = '#E6A23C';
    //       break;
    //     case 'info':
    //       color = '#909399';
    //       break;
    //     case 'success':
    //       color = '#c1ae67'
    //       break;
    //   }
    //   TweenLite.to('.connection-status', { background: color })
    // }
  }

};

</script>

<style scoped>
.con-msg-banner {
  color: #fff;
  /* height: 45px; */
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
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
