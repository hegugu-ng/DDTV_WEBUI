<template>
  <div class="login" v-loading="load">
    <div class="login-element">
      <div class="login-card">
        <div class="login-banner">
          <div class="banner-image"></div>
        </div>
        <div class="viewBox">
          <i class="el-icon-setting ng-network" @click="atinput = !atinput"></i>
          <div class="title">欢迎回来！</div>
          <div class="rd-title">登录以继续</div>
          <form @submit.prevent="onSubmit">
            <div class="input-title">用户名</div>
            <input class="ng-input" v-model="login.loginname" placeholder="请输入用户名" autocomplete="username" />
            <div class="input-title">密码</div>
            <input
              class="ng-input"
              type="password"
              v-model="login.password"
              placeholder="请输入密码"
              autocomplete="current-password"
            />
            <div style="display: flex; align-items: center; margin-bottom: 10px">
              <input type="checkbox" id="save7days" v-model="login.save7days" />
              <label class="ng-check-ladel" for="save7days">七天内免登录</label>
            </div>
            <button class="ng-login" id="btn" @click="userlogin">登录</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { postFormAPI, postListAPIv2 } from "@/api";
// import gt from "../utils/gt";
import { isAuthenticated } from "@/utils/authenticated";
export default {
  name: "Room",
  components: {},
  data() {
    return {
      atinput: true,
      load: false,
      login: {
        loginname: null,
        password: null,
        save7days: true
      },
      ngevent: {
        appid: null,
        key: null,
        save: true
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    if (isAuthenticated()) {
      next(false);
    } else {
      next();
    }
  },
  methods: {
    /**
     * 本函数会使用所给的title和message构造一个全屏黑底弹窗
     *
     * @param {massage} 弹窗展示的消息  str
     * @param {title}  弹窗展示的标题  str
     */
    openWindows(message, title) {
      // message 与 title 对弹窗进行描述
      this.$alert(message, title, {
        confirmButtonText: "确定"
      });
    },
    /**
     * 本函数会进行一个Cookie保存操作
     */
    is_login: async function () {
      let res = await postListAPIv2("/api/Login_State");
      return res;
    },
    saveCookies(Cookie) {
      let CookieDomain = window.apiObj.cookieDomain;
      if (this.login.save7days) {
        var d = new Date();
        d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
        var expires = d.toGMTString();
        document.cookie = `DDTVUser=${Cookie};domain=${CookieDomain};expires=${expires}; path=/`;
        console.log(`DDTVUser=${Cookie};domain=${CookieDomain};expires=${expires}; path=/`);
      } else {
        document.cookie = `DDTVUser=${Cookie};domain=${CookieDomain};path=/`;
      }
    },
    /**
     * 本函数会进行登录请求，成功会保存token至session
     * 失败会弹窗提示
     * @param {loginname} 登录名  str
     * @param {password}  密码  str
     */
    userlogin: async function () {
      // 构建请求参数
      this.load = true;
      let param = {
        UserName: this.login.loginname,
        Password: this.login.password,
        CookieExpires: this.login.save7days
      };
      // 发请求
      try {
        let res = await postListAPIv2("/api/Login", param);
        let loginres = await postFormAPI("Login_State");
        if (res.data.code != 0) {
          let message = res.data.massage;
          if (message === undefined) message = "数据异常，请检查网络连接与网站配置。";
          console.log(message);
          this.openWindows(message, "登录出现问题");
        } else {
          this.saveCookies(res.data.data.Cookie);
          console.log(loginres);
          if (loginres.data.data.LoginState != 1) {
            this.$router.push("/blogin");
          } else {
            this.$router.push("/");
          }
        }
      } catch (err) {
        console.error("登录请求出错，请检查网络连接与网站配置。");
        this.openWindows("登录出现问题,请检查网络连接与网站配置。", "网络连接失败");
      } finally {
        this.load = false;
      }
    }
  }
};
</script>

<style scoped>
.login {
  background-image: url("../assets/img/login_bg.png");
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}

.banner-image {
  height: 100%;
  width: 325px;
  background-image: url("../assets/img/banner.png");
}

.login-element {
  justify-content: center;
  align-items: center;
  flex: 1 1 0%;
  display: flex;
}

.login-card {
  display: flex;
  border-radius: 0.375rem;
  height: 400px;
}

/* banner */
.login-banner {
  flex: 1 1 0%;
  height: 100%;
  z-index: 2;
  border-radius: 20px 0px 0px 20px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .login-banner {
    display: inline-block;
  }
}

.ng-network {
  float: right;
  font-weight: bold;
  color: #474747;
  cursor: pointer;
}

.ng-network:hover {
  color: #8d8080;
}

.viewBox {
  background-color: #fff;
  width: 250px;
  /* border-radius: 9px; */
  /* box-shadow: 0px 0px 50px 20px #00000036; */
  padding: 60px 25px 25px 25px;
  border: 1px solid rgb(233, 234, 236);
}

.rd-title {
  font-size: 14px;
  color: #000000;
  font-weight: normal;
  padding-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: bold;
}

.input-title {
  font-size: 12px;
  font-weight: bold;
}

.ng-input {
  background: none;
  outline: none;
  border: none;
  width: 100%;
  padding: 10px 0px 10px 0px;
  border-bottom: 1px solid #e8e0e0;
  margin-bottom: 14px;
}

.ng-input:focus {
  border: none;
  border-bottom: 1px solid rgb(0, 0, 0);
}

.ng-check-ladel {
  font-size: 12px;
}

.ng-login {
  background: #7e7bdf;
  outline: none;
  border: none;
  width: 100%;
  padding: 10px 0px 10px 0px;
  color: #fff;
  border-radius: 9px;
}
</style>
