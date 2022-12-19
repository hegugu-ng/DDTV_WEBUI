import axios from "axios";
import Router from "../router";
import Store from "../store";
import { NetworkDisconnection, NetworkConnection } from "./error";
import { clearCookie } from "@/utils/cookie";
axios.defaults.withCredentials = true;

let host = window.apiObj.apiUrl;
if (window.apiObj.apiUrl === false) host = "./";
// location.protocol + '//' + location.host + location.pathname

const service = axios.create({
  baseURL: host,
  // timeout: 5 * 1000,
  transformRequest: [
    function (data) {
      // 造一个表单
      let param = new window.FormData();
      for (var n in data) {
        param.append(n, data[n]);
      }
      return param;
    },
  ],
  headers: { "Content-Type": "multipart/form-data" },
});

service.interceptors.request.use(
  (config) => {
    console.debug(`[UI] ${config.url} 发送 ${config.method} 请求`, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    var jsondata = response.data;

    console.debug("[UI] 收到数据返回", jsondata);
    response.data = jsondata;
    // 在存在 NetworkDisconnection 的情况下 吊销 失败信息，推送成功消息
    console.log(Store.state.connectStatus.indexOf(NetworkDisconnection));
    if (Store.state.connectStatus.indexOf(NetworkDisconnection) != -1) {
      // Store.commit('RemoveConnectStatus', NetworkDisconnection)
      if (Store.state.connectStatus.indexOf(NetworkConnection) === -1)
        Store.commit("AddConnectStatus", NetworkConnection);
    }

    if (response.data.code === 6000) {
      clearCookie();
      Router.push("/login");
    }
    if (response.status !== 200) {
      clearCookie();
      Router.push("/login");
    }
    return response;
  },
  (error) => {
    // 异常处理
    console.debug("[UI] 请求服务器异常", error.message);
    if (error && error.response) {
      console.debug(`[UI] 服务器返回错误${error.response.status}`);
    } else {
      // 超时处理
      if (JSON.stringify(error).includes("timeout")) {
        // 推送错误消息
        // 判断 是否存在 Network Disconnection 没有的话推送消息 因为 NetworkDisconnection 的动作是 在网络恢复后吊销
        if (Store.state.connectStatus.indexOf(NetworkDisconnection) === -1)
          Store.commit("AddConnectStatus", NetworkDisconnection);
        console.debug("[UI] 网络连接超时");
      }
    }
    return Promise.resolve(error.response);
  }
);
export default service;
