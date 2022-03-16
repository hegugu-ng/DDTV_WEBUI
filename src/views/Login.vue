<template>
  <div class="login" v-loading="load">
    <div class="viewBox">
      <div v-if="atinput">
        <i class="el-icon-setting ng-network" @click="atinput = !atinput"></i>
        <div class="title">欢迎回来！</div>
        <div class="rd-title">登录以继续</div>
        <form>
          <div class="input-title">用户名</div>
          <input class="ng-input" v-model="login.loginname" placeholder="请输入用户名" autocomplete="username"/>
          <div class="input-title">密码</div>
          <input class="ng-input" type="password" v-model="login.password" placeholder="请输入密码" autocomplete="current-password" @keyup.enter="userlogin()"/>
          <div style="display: flex; align-items: center; margin-bottom: 10px">
            <input type="checkbox" id="save7days" v-model="login.save7days" />
            <label class="ng-check-ladel" for="save7days">七天内免登录</label>
          </div>
          <button class="ng-login" @click.prevent="userlogin()"  >登录</button>
        </form>
      </div>
      <div v-else>
        <i class="el-icon-user ng-network" @click="atinput = !atinput"></i>
        <div class="title">设置</div>
        <div class="rd-title">链接到NGWORKS事件中心</div>
        <div class="input-title">APPID</div>
        <input
          class="ng-input"
          v-model="ngevent.appid"
          placeholder="请输入你的appid"
        />
        <div class="input-title">NGKEY</div>
        <input
          class="ng-input"
          type="password"
          v-model="ngevent.key"
          placeholder="请输入NGKEY"
        />
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <input type="checkbox" id="save" v-model="ngevent.save" />
          <label class="ng-check-ladel" for="save">记住我</label>
        </div>
        <button class="ng-login">验证</button>
      </div>
    </div>
  </div>
</template>
<script>
import { postFormAPI } from "../api";
export default {
  name: "Room",
  components: {
  },
  data() {
    return {
      atinput: true,
      load:false,
      login: {
        loginname: null,
        password: null,
        save7days: true,
      },
      ngevent: {
        appid: null,
        key: null,
        save: true,
      },
    };
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
        confirmButtonText: "确定",
      });
    },
    /**
     * 本函数会进行一个Cookie保存操作
     */
    saveCookies(Cookie){
      if(this.login.save7days){
        var d = new Date();
        d.setTime(d.getTime()+(7*24*60*60*1000));
        var expires = d.toGMTString();
        document.cookie=`token=${Cookie}; expires=${expires}; path=/`;
        console.log(`token=${Cookie}; expires=${expires}; path=/`)
      }else{
        document.cookie=`token=${Cookie}; path=/`;
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
        CookieExpires:this.login.save7days
      };
      // 发请求
      try {
        let res = await postFormAPI("Login", param);
        if (res.data.code != 0)
          this.openWindows(res.data.massage, "登录出现问题");
        else {
          // this.saveCookies(res.data.data.Cookie)
          // console.log("跳转路由")
          this.$router.push("/")
        }
      } catch (err) {
        console.error("登录请求出错，请检查网络连接与网站配置。");
        this.openWindows(
          "登录出现问题,请检查网络连接与网站配置。",
          "网络连接失败"
        );
      } finally {
        this.load = false;
      }
    },
  },
};
</script>
 
<style scoped>
.login {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background-color: #484676;
  background-image: linear-gradient(90deg, #484676 0%, #00c6cd 75%);
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
  border-radius: 9px;
  box-shadow: 0px 0px 50px 20px #00000036;
  padding: 25px 25px 25px 25px;
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