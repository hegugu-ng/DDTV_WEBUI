// import { postFormAPI } from '../api'

export function getCookie(name) {
    // 获取所有的 cookie
    const cookies = document.cookie;

    // 查找 cookie 名为 "name" 的值
    name += "=";
    let start = cookies.indexOf(name);
    if (start === -1) return null;

    // 跳过 cookie 名称，获取 cookie 值
    start += name.length;
    let end = cookies.indexOf(";", start);
    if (end === -1) end = cookies.length;
    const value = cookies.substring(start, end);

    // 将 cookie 值解码并返回
    return decodeURIComponent(value);
}

// /**
//  * 进行一次鉴权
//  * @returns 布尔值
//  */
// export async function isAuthenticated() {
//     // 获取cookies
//     var cookieToken = getCookie("DDTVUser");
//     // 如果为空，认定鉴权失败
//     if (cookieToken == null) {
//         return false
//     } else {
//         try {
//             // 尝试请求服务器
//             let res = await postFormAPI("System_QueryUserState")
//             // 如果为成功 鉴权成功
//             if (res.data.code == 0) return true
//             else return false
//         } catch (err) {
//             return false
//         }
//     }
// }

/**
 * 进行一次鉴权
 * @returns boolean
 */
 export function isAuthenticated() {
    // 获取cookies
    const cookieToken = getCookie("DDTVUser");
    // 如果为空，认定鉴权失败、
    return cookieToken != null && cookieToken !== ""
}
