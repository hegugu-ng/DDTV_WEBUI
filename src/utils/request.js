import axios from 'axios'
import Router from '../router'
import Store from '../store'
import {clearCookie} from '../utils/cookie'
axios.defaults.withCredentials=true;

let host = window.apiObj.apiUrl
if (window.apiObj.apiUrl == false) host = location.protocol + '//' + location.host


const service = axios.create({
    baseURL: host,
    // timeout: 5 * 1000,
    transformRequest: [function (data) {
        // 造一个表单
        let param = new window.FormData();
        for(var n in data){
            param.append(n, data[n]);
        }
        return param;
    }],
    headers:{'Content-Type':'multipart/form-data'}
})

service.interceptors.request.use(config => {
    console.debug(`[UI] ${config.url} 发送 ${config.method} 请求`,config.data)
    return config
},error => {
    return Promise.reject(error)
})

service.interceptors.response.use(response => {

    var jsondata = response.data;

    console.debug("[UI] 收到数据返回", jsondata)
    response.data = jsondata
    // 吊销错误消息，推送成功信息
    if (Store.state.connectStatus.show && Store.state.connectStatus.type == "networkError"){
        Store.commit('setStatus', {"level": 'success',"msg": '连接成功',"type": null,"show": true});
        if (Store.state.beforestatus != null) {
            Store.dispatch('setStatusAsync',Store.state.beforestatus);
            Store.commit('beforestatus',null)
        }else{
            Store.dispatch('setStatusAsync',{"level": 'success',"msg": '连接成功',"type": null,"show": false})
        }
    }
    if(response.data.code == 6000) {
        clearCookie()
        Router.push("/login")
    }
    return response
}, error => {
    // 异常处理
    console.debug('[UI] 请求服务器异常',error.message)
    if (error && error.response) {
        console.debug(`[UI] 服务器返回错误${error.response.status}`)
    } else {
        // 超时处理
        if (JSON.stringify(error).includes('timeout')) {
            // 推送错误消息
            // 如果先前有信息展示，且不为网络错误
            if(Store.state.connectStatus.show && Store.state.connectStatus.type != "networkError"){
                Store.commit('beforestatus',Store.state.connectStatus);
            }
            Store.commit('setStatus', {"level": 'error',"msg": '无法与后端建立连接',"type": 'networkError',"show": true});
            console.debug('[UI] 网络连接超时')
        }
    }
    return Promise.resolve(error.response)
})
export default service
