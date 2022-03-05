export function setCookie(key, val, time) {
    if (typeof key !== 'string' || typeof val !== 'string' ) {
        return false;
    }
    time = time || 7 * 24 * 3600;
    var exp = new Date();
    exp.setTime(exp.getTime() + time * 1000);
    document.cookie = key + '=' + val + ';expires=' + exp.toGMTString();
}
//通过key来删除cookie
export function clearCookieByKey(key) {
    setCookie(key, "", -1);
}