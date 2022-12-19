<template>
  <div class="connection-status">
    <div class="con-msg-banner">
      <div class="content disconnected">
        <ng-svg class="icon" :icon-class="show.icon" />
        <div class="msg">{{ show.message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import { NetworkConnection, NetworkDisconnection } from "../utils/error";
import TweenLite from "gsap";
import store from "@/store";

// 告警 信息的推送 解除
// 推送 是指接收到需要展示的告警信息后，展示
// 解除 是告警信息打到解除的条件 action 后 解除

// 优先级 优先级大的信息会被优先展示 如果高优先级的信息没有被解除 那么将不会推送低优先级的信息，直到高优先级的信息被解除

export default {
  name: "ConnectedBar",
  computed: {
    ...mapState(["connectStatus"]),
  },
  data() {
    return {
      show: [{ icon: "wifi", message: null }],
      color: { error: "#F56C6C", warn: "#E6A23C", info: "#909399", success: "#c1ae67" },
      orgin: undefined,
    };
  },
  watch: {
    // 监听vuex 数据变更 生成推送优先级
    connectStatus: {
      handler(Value) {
        if (Value.length === 0) {
          this.orgin = undefined;
          return;
        }
        this.Generate(Value);
      },
      deep: true,
    },
    orgin: {
      handler(newValue, oldValue) {
        // 如果 消息队列不是变成空的
        if (newValue !== undefined) {
          // 状态栏下拉
          TweenLite.to(".con-msg-banner", {
            background: this.color[newValue.level],
            height: "45px",
          });
          // 如果 消息action为 auto
          if (this.show.action === "auto") {
            if (store.state.connectStatus.length >= 3) {
              TweenLite.to(".con-msg-banner", {
                background: this.color[newValue.level],
                onComplete: store.commit("RemoveConnectStatus", newValue),
              });
            } else {
              // 自动一秒后吊销
              TweenLite.to(".con-msg-banner", {
                background: this.color[newValue.level],
                height: "0px",
                delay: 1,
                // 回调中自动吊销自己
                onComplete: store.commit("RemoveConnectStatus", newValue),
              });
            }
          }
        }
        // 如果 不是第一条消息
        if (oldValue !== undefined && this.orgin !== undefined) {
          if (newValue.type === oldValue.action) {
            store.commit("RemoveConnectStatus", oldValue);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    Generate: function (arr) {
      const newarr = this.deepCopy(arr);
      newarr.sort((a, b) => b.priority - a.priority);
      // 最高优先级的消息
      // 没有消息
      if (this.orgin === undefined || this.orgin.action === "auto") {
        this.orgin = newarr[0];
        this.show = newarr[0];
      } else {
        const keylist = [];
        for (const item of newarr) {
          keylist.push(item.type);
        }
        const dx = keylist.indexOf(this.orgin.action);
        if (dx !== -1) {
          this.orgin = newarr[dx];
          this.show = newarr[dx];
        }
      }
    },
    deepCopy: function (obj) {
      let newObj = obj.constructor === Array ? [] : {};
      for (let i in obj) {
        if (typeof obj[i] === "object") {
          newObj[i] = this.deepCopy(obj[i]);
        } else {
          newObj[i] = obj[i];
        }
      }
      return newObj;
    },
  },
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
  height: 0;
  opacity: 0;
}

.info {
  background: #03c2e6;
}

.error {
  background: #f56c6c;
}

.warn {
  background: #e6a23c;
}

.debug {
  background: #909399;
}
</style>
