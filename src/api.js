import http from './utils/http'

let resquest = "/api"

/**
* 本函数实现了一个封装好的POST请求
* 
* @param {url} api接口名称  str
* @param {param} 请求体 obj
* @return 请求返回的数据
*/
export function postFormAPI(url,params=undefined){
    if (params) params.CMD = url
    else params = {'CMD': url}
    return http.post(`${resquest}/${url}`,params)
}
export function postListAPIv2(url,params=undefined){
    return http.post(url,params)
}
// get请求
export function getListAPIv2(url,params){
    return http.get(url,params)
}

export function getListAPI(url,params){
    return http.get(`${resquest}/${url}`,params)
}

// put 请求
export function putSomeAPI(url,params){
    return http.put(`${resquest}/${url}`,params)
}
// delete 请求
export function deleteListAPI(url,params){
    return http.delete(`${resquest}/${url}`,params)
}