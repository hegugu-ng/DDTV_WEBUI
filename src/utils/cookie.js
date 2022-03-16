export function setCookie(key, val, time) {
    if (typeof key !== 'string' || typeof val !== 'string' ) {
        return false;
    }
    time = time || 7 * 24 * 3600;
    var exp = new Date();
    exp.setTime(exp.getTime() + time * 1000);
    document.cookie = key + '=' + val + ';domain='+ '.ngworks.cn' +';path=/;expires=' + exp.toGMTString();
}
//通过key来删除cookie
export function clearCookieByKey(key) {
    setCookie(key, null, -1);
}

export function clearCookie() { 
    let CookieDomain = window.apiObj.cookieDomain 
    if(CookieDomain)document.cookie = `DDTVUser=;domain=${CookieDomain};expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    else document.cookie = `DDTVUser=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    console.debug("[UI] Cookie已经清除，将退出登录！")
}