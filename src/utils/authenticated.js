// import { postFormAPI } from '../api'

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
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
 * @returns 布尔值
 */
 export function isAuthenticated() {
    // 获取cookies
    var cookieToken = getCookie("DDTVUser");
    // 如果为空，认定鉴权失败
    if (cookieToken == null) return false
    else return true
}