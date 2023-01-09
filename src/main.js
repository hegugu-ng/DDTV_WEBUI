import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import "default-passive-events";
const app = createApp(App).use(store);

import SvgIcon from "@/components/svgIcon";
app.component("ng-svg", SvgIcon);

import "./icons";

import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import * as ElIconModules from "@element-plus/icons";
import store from "./store";

// 统一注册Icon图标
for (const iconName in ElIconModules) {
  if (Reflect.has(ElIconModules, iconName)) {
    const item = ElIconModules[iconName];
    app.component(iconName, item);
  }
}
app.use(ElementPlus);

app.use(router);
app.mount("#app");

axios.interceptors.response.use(function (response) {
  if (response.data.code === 6000) {
    router.push("login");
    return Promise.reject(new Error("web登录失效"));
  }
  // 正常响应处理
  return response;
});
