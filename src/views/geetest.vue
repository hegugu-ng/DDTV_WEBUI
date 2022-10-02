<template>
  <!--极验组件-->
  <div id="dl">
    <div class="acss-header">
      <div class="verify-form">
        <div class="userbar">
          <img
            class="avatar"
            referrerPolicy="no-referrer"
            src="https://i1.hdslb.com/bfs/face/2f30ce11b11d2412c94d417d1e13899f575ab827.jpg@240w_240h_1c_1s.webp"
            width="50"
          />
          <div class="verify-property">
            <div class="username">禾咕咕Official</div>
            <div class="author-desc">
              ✨NGWORKS制作人✨，专业吉祥物。还没有群，合作联系ad@ngworks.cn
            </div>
          </div>
        </div>
        <div class="verify-input">
          <div class="NG-HeigthSpeed">
            <ng-svg
              :size="{ width: '1.5em', height: '1.5em' }"
              icon-class="od"
            />
            <div class="ossname">咕咕云</div>
            <div class="Sline"></div>
            <span class="danjia heightLight"> 全力提供免费高速下载 </span>
            <img
              class="checked"
              src="http://chsi.wanfangtech.net/pc/images/check-s.png"
            />
          </div>
          <div class="pickpw">
            <div class="verify-input-title">请输入提取码：</div>
            <div class="input-area">
              <input
                class="QKKaIE LxgeIt"
                id="accessCode"
                tabindex="1"
                type="text"
              />
              <button class="gtbnt" id="gtbutten">下载</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <button class="gtbnt" id="gtbutten">下载</button> -->
    <div class="cloud-bg">
      <div class="bg"></div>
    </div>
  </div>
</template>
<script>
import { getListAPIv2 } from "../api";
import gt from "../utils/gt";
export default {
  data() {
    return {
      tx: require("../assets/txy.png"),
      od: require("../assets/od.png"),
      GeetData: {
        product: "bind",
        gt: null,
        challenge: null,
        offline: null,
        new_captcha: null,
      },
    };
  },
  mounted: async function () {
    await this.GeetRegister();
    let GeetData = this.GeetData;
    if (
      typeof GeetData.gt == "null" ||
      typeof GeetData.challenge == "null" ||
      typeof GeetData.offline == "null" ||
      typeof GeetData.new_captcha == "null"
    ) {
      this.openWindows("极验初始化失败", "验证失败");
      return;
    }
    initGeetest(GeetData, this.Geethandle);
  },
  methods: {
    openWindows(message, title) {
      // message 与 title 对弹窗进行描述
      this.$alert(message, title, {
        confirmButtonText: "确定",
      });
    },
    // 获取极验参数
    GeetRegister: async function () {
      let res = await getListAPIv2(`/register?t=${new Date().getTime()}`);
      console.log(res);
      let GeetData = this.GeetData;
      GeetData.gt = res.data.gt;
      GeetData.challenge = res.data.challenge;
      GeetData.offline = !res.data.success;
      GeetData.new_captcha = res.data.new_captcha;
    },
    // 初始化验证码
    Geethandle: function (captchaObj) {
      let openWindows = this.openWindows,
        GeetCallBack = this.GeetCallBack;
      captchaObj
        .onReady(function () {
          console.debug("[UI] 极验已经准备好了");
        })
        .onSuccess(function () {
          var result = captchaObj.getValidate();
          if (!result) {
            openWindows("请先完成验证", "验证失败");
            return;
          }
          GeetCallBack(result);
          console.debug("[UI] 用户完成验证");
        });
      let btn = document.getElementById("gtbutten");
      btn.onclick = function () {
        captchaObj.verify();
      };
    },
    GeetCallBack: function (result) {
      console.debug("[UI]", result);
      // window.open("https://cloud.ngworks.cn/ts.mp4")
    },
  },
};
</script>
<style>
#dl {
  background-color: #eef2f6;
  position: absolute;
  width: 100%;
  height: 100%;
}
.cloud-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 400px;
}
.bg {
  position: absolute;
  width: 100%;
  height: 400px;
  background: url(https://nd-static.bdstatic.com/m-static/disk-share/widget/pageModule/init/image/footer-cloud_0e0a657.png);
  background-repeat: repeat-x;
  background-position: 0 bottom;
  bottom: 0;
}
.acss-header {
  /* display:block; */
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -170px 0 0 -230px;
  z-index: 1;
  *left: 0;
  *margin-left: 0;
}
.userbar {
  background-image: url(https://staticwx.cdn.bcebos.com/mini-program%2Fimages%2Fcertification-user-bg-web.png);
  background-size: 100% 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 15px 30px 15px 30px;
  height: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.avatar {
  border-radius: 50%;
  overflow: hidden;
  background: #ffffff91;
  padding: 2px;
  /* flex: 0; */
  height: 50px;
  width: 50px;
}
.verify-input .pickpw {
  padding: 25px 30px 40px;
}
.verify-property {
  color: #fff;
  padding-left: 15px;
}
.verify-input {
  float: left;
  width: 460px;
  background-color: #fff;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}
.ossname {
  font-weight: bolder;
  padding-left: 6px;
}
.NG-HeigthSpeed {
  height: 40px;
  border-bottom: 1px solid #e3e2e2;
  /* border-radius: 4px; */
  display: flex;
  position: relative;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  padding: 0px 20px 0px 20px;
  overflow: hidden;
}
.verify-input-title {
  margin-bottom: 10px;
  color: #666;
  font-weight: bold;
}
.verify-property .author-desc {
  display: -webkit-box;
  word-break: break-all;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: rgba(255, 255, 255, 0.52);
  overflow: hidden;
  font-size: 10px;
  width: 248px;
}
.LxgeIt {
  width: 280px;
  border: 1px solid #f2f2f2;
  padding: 8px 10px;
  height: 20px;
  line-height: 19px;
  border-radius: 4px;
}
.row {
  display: flex;
  align-items: center;
}
.rowtitle {
  font-size: 14px;
  color: #545454;
  margin-left: 14px;
  position: relative;
  padding-right: 15px;
}
.rowtitle:after {
  position: absolute;
  content: "";
  height: 14px;
  width: 2px;
  background: #2eafbb;
  left: -14px;
  top: 50%;
  margin-top: -7px;
  border-radius: 4px;
}
.danjia {
  font-size: 16px;
  /* height: 100%; */
  position: relative;
  line-height: 46px;
  font-weight: 800;
}
.heightLight {
  background-image: linear-gradient(90deg, #ff9740, #fc6372);
  background-clip: text;
  color: transparent;
}
.heightLight::before {
  content: "";
  width: 10px;
  background-color: rgb(255 255 255 / 61%);
  position: absolute;
  height: 100%;
  left: 0%;
  transform: rotate(25deg);
  z-index: 10;
  animation: mymove 2s infinite;
}
@keyframes mymove {
  from {
    left: -5%;
  }
  to {
    left: 105%;
  }
}

.caise {
  position: absolute;
  left: -2%;
  top: 33%;
}
.checked {
  position: absolute;
  /* bottom: 6px; */
  right: 10px;
  z-index: 11;
}
.gtbnt {
  background: #7e7bdf;
  outline: none;
  border: none;
  width: 80px;
  padding: 10px 0px 10px 0px;
  color: #fff;
  border-radius: 9px;
  flex: 1;
  margin-left: 18px;
}
.not-allowed {
  border: 1px solid #adadad;
  cursor: not-allowed;
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
}
.Sline {
  height: 15px;
  width: 1px;
  background: #e6e4e4;
  margin: 0px 10px 0px 10px;
}
</style>