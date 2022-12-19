<template>
  <div class="blogin">
    <p class="info-text-box info-text-war">
      DDTV的一些功能需要登录以实现，如果不登录，可能造成一些无法预料到的异常，建议您登录B站账号后使用。
    </p>
    <ng-infocard title="登录工具" v-loading="loginState_n === -1" update="">
      <div class="loginta">
        <!-- <el-icon class="is-loading">
                    <Loading />
                </el-icon> -->
        <div>
          当前登录状态：<em>{{ loginState_t }}</em>
        </div>
      </div>
      <div v-if="loginState_n === 1">
        <el-button type="success" @click="open('切换账号', ReLogin)">切换账号</el-button>
      </div>
      <div class="Blibili-login-box" v-else>
        <div class="qrcode-login">
          <div class="qrcode-con">
            <i class="tv-icon"></i>
            <div class="qrcode-box">
              <div class="qrcode-tips"></div>
              <img width="140" height="140" style="background-color: #fff; border: 1px solid #cdd0d9" :src="traceSrc" />
              <div class="status" v-if="!is_effect">
                <div class="overdue" @click="ReLogin">二维码已失效</div>
              </div>
            </div>
          </div>
          <div class="qrcode-footer">
            <p class="status-txt">
              {{ is_effect ? "扫描二维码登录" : "二维码已失效" }}
            </p>
            <p class="app-link">
              请使用
              <a href="//app.bilibili.com/" target="_blank">哔哩哔哩客户端</a><br />扫码登录<br />或扫码下载APP
            </p>
          </div>
        </div>
      </div>
    </ng-infocard>
  </div>
</template>

<script>
import InfoCard from "../components/ng/InfoCard";
import {
  postFormAPI,
  // getListAPI
} from "../api";
import axios from "axios";

export default {
  components: {
    "ng-infocard": InfoCard,
  },
  data() {
    return {
      traceSrc: null,
      loginState_n: -1,
      loginState_t: "正在获取...",
      is_effect: false,
      qreffect: null,
      tscount: 0,
      loginst: null,
    };
  },
  mounted: async function () {
    await this.loginqr();
    await this.Login_State();
    this.loginst = setInterval(this.Login_State, 3000);
  },
  beforeUnmount() {
    if (this.qreffect != null) {
      clearInterval(this.qreffect);
    }
    clearInterval(this.loginst);
  },

  methods: {
    open(active, fun) {
      this.$confirm("您当前已经登录了，重新登录可能中断正在运行的任务，还需要继续吗？", active, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          fun();
          this.$message({
            type: "success",
            message: `正在执行${active}`,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消${active}`,
          });
        });
    },
    QReffect: async function () {
      await this.Login_State();
      this.tscount += 1;
      if (this.tscount > 60 || this.loginState_n == 1) {
        this.is_effect = false;
        clearInterval(this.qreffect);
      }
    },
    ReLogin: async function () {
      await this.Login_Reset();
      await this.loginqr();
      this.is_effect = true;
      this.qreffect = setInterval(this.QReffect, 1000);
    },
    arrayBufferToBase64(buffer) {
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    Login_State: async function () {
      let loginres = await postFormAPI("Login_State");
      console.log(loginres);
      let loginState = loginres.data.data.LoginState;
      this.loginState_n = loginState;
      switch (loginState) {
        case 0:
          this.loginState_t = "未登录，请扫描下方二维码";
          break;
        case 1:
          this.loginState_t = "已登录";
          break;
        case 2:
          this.loginState_t = "登录失效，请扫描下方二维码";
          break;
        default:
          this.loginState_t = "正在登录，请扫描下方二维码";
      }
      return loginState;
    },
    Login_Reset: async function () {
      let loginres = await postFormAPI("Login_Reset");
      console.log(loginres);
    },
    loginqr: async function () {
      let host = window.apiObj.apiUrl;
      if (window.apiObj.apiUrl == false) host = location.protocol + "//" + location.host;

      axios({
        method: "get",
        url: host + "/api/loginqr",
        responseType: "blob",
      })
        .then((response) => {
          const content = response.data;
          this.download(content);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    download(data) {
      let url = window.URL.createObjectURL(new Blob([data]));
      this.traceSrc = url;
      console.log(url);
    },
  },
};
</script>

<style>
.Blibili-login-box {
  width: 489px;
}

.qrcode-login {
  position: relative;
  width: 480px;
}

.qrcode-login .qrcode-con {
  padding-top: 72px;
}

.qrcode-login .qrcode-con .tv-icon {
  position: absolute;
  width: 70px;
  height: 70px;
  left: 160px;
  top: 10px;
  background: url(//i0.hdslb.com/bfs/static/e6f2388d454c82004905753802e9cfe709d80d08.png) no-repeat;
}

.qrcode-login .qrcode-con .qrcode-box {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  background: #ddd;
  position: relative;
}

.qrcode-login .qrcode-con .qrcode-box .status {
  position: absolute;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 100%, 0.8);
}

.qrcode-login .qrcode-con .qrcode-box .qrcode-tips {
  z-index: 10;
  position: absolute;
  width: 480px;
  height: 192px;
  top: -50px;
  left: 50%;
  margin-left: -240px;
  background: url(//s1.hdslb.com/bfs/static/passport/static/img/qr-tip.20e4055.png) no-repeat;
  background-size: cover;
  background-color: #fff;
  opacity: 0;
  -webkit-transition: opacity 0.5s;
  -o-transition: opacity 0.5s;
  -moz-transition: opacity 0.5s;
  transition: opacity 0.5s;
}
.qrcode-login .qrcode-con .qrcode-box .qrcode-tips:hover {
  opacity: 1;
}
.qrcode-login .qrcode-con .qrcode-box .status .overdue {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAABLCAYAAADpqX6aAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRBNzBCMDQwNTQ4MjExRTU4RDEzQTlFMjZCMEJCMkEyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRBNzBCMDQxNTQ4MjExRTU4RDEzQTlFMjZCMEJCMkEyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEE3MEIwM0U1NDgyMTFFNThEMTNBOUUyNkIwQkIyQTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEE3MEIwM0Y1NDgyMTFFNThEMTNBOUUyNkIwQkIyQTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6fG4sXAAAD5klEQVR42uyaTUhVQRTHfZGakZURlmCblJRILaWIIitcZGAkYQsXFdXGNDMLXKSFfUGBQl8mFARWtNFSWhWECZGlZVgS1cIirExdaH6UWvr6HzoPDtN9va+57/XwHvjxZu7Mmfk7d+7MmUGb3W4PCRabFhJEZom1xAab2OmuKthq3vlVkH1XwhQZWU02H6wH6WAZ2AK+B0psFMjiN1XDz7aBDQwJtPHzI94I1SE2BhwDO8FMFnEP9PCzrUr9SXA7EKtBLngD8lhoCP+WcLqcvheD/lrY129iy8AtMEc8GwQ3wWvOt4MGA9+57FvqD7E0kidFfhQcBbFgB7gmyuToPgE/Rdkpbss0scngvMh3g7Xc8ZBB/Vc8R2kuZ3PdPlFObaWYJfYcCOM0CdgEXrjwOQGqQS94BjaDES6jtirNEJsGNoo8rQIdbvh18HLlsDaeNg7LAIm6xcoveABc8sB3XMlX8fLmsN26xa4T6Xow5sOyR+Lviny6brHxIt2uYdd77qRtLWKjRLpHg9hBkZ6nW2y/SEdqCm6MhGsR+0GkV2gQmyTSnbrFPhbpHLHeemOhHJUZta1FbJ1IR4O9Snm4B23tU6ZBnW6xj0CryJ9RvuIikOnmqnJa5Fu5be3bLQma4PRs8BDEgQhQDI678Ke698Eszk+wnymxwVMOWhwWy+vldbAQrOITg9EczeetdrESeTWbGSLS6F1W4tMcpdwm9n0KVN7zFivj34tuvAmfxVJ8WgAOOtlyU8VxZik4xG/AYcNgPzhgcJIw7VjjiEXHnYw+je5V8Fmcv+r4D6gKxIExVVlv34Im0MjP6RRRyPOUhH4M1L0Bjdx2cIUFNvHJQbX6/+GSw67sQqabzbr5tsRaYi2xWjYFT44wU+t+NoTWWR+IAdVgxP7H6HcBlzXY/7YJsMTb/nwRmgsGDARVcvlyMGlQ3s++fhNbZiDiG7gB9oh6d+zOrdQfYvOUTn+w+EiDuslidJvBuOKbZ6ZY6nxMdPYFpLrwqeW5HA1Wgl7hT22lmCW2UXREApLc8KE6FSKfBoZFOw/MEJumvMLDHviGKflipa1E3WIrlC863IeVhMR/Fe2ddcfPup+17met+1nrfjYI72c9XR9blMAlXpSVgEw32iCfIdFOi1nb7WrwS3TUBeJABOh2o2Oq2yn8qa01ZkZd5Qbxaa3IZxn4hIJ8g/i33OwQkW5xqv4Rp7ZxHaqbwcF4l0G9C6Ke6SeFIjDqRHA21yk0KKP5WuDvYw2RoMS3DnvJozYDfBLnL5oui7ztL6juZ325RaSjNf2XRp+L+1nrytMSa4m1xFpiLbFTXOxvAQYATXs+1rA84iYAAAAASUVORK5CYII=)
    8px 3px no-repeat #fff;
  border-radius: 3px;
  -webkit-box-shadow: 0 3px 10px rgb(0 0 0 / 50%);
  box-shadow: 0 3px 10px rgb(0 0 0 / 50%);
  cursor: pointer;
  margin: 29px auto;
  width: 60px;
  padding: 40px 0 5px;
  color: #0594c7;
  text-align: center;
}

.qrcode-login .qrcode-footer {
  width: 480px;
  height: 155px;
  background: url(//s1.hdslb.com/bfs/static/passport/static/img/2233login.af9c53d.png) 0 -7px no-repeat;
}

.qrcode-login .qrcode-footer .status-txt {
  padding-top: 15px;
  text-align: center;
  color: #222;
  font-size: 18px;
  letter-spacing: 3px;
  margin-bottom: 0px;
}
.qrcode-login .qrcode-footer .app-link,
.qrcode-login .qrcode-footer .suc-txt {
  text-align: center;
  color: #717171;
  font-size: 14px;
}
a {
  text-decoration: none;
  border: none;
  color: #00a1d6;
}
.blogin {
  padding: 15px;
}

.loginta {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
</style>
