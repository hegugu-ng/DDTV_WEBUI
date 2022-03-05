import { postFormAPI } from "../api"
/**
 * @uid {interesting}
 * @data {str}
 * @returns {Object}
 */
export async function Room_AutoRec(uid, data) {
    let param = {
        UID: uid,
        IsAutoRec: data,
    };
    let res = await postFormAPI('Room_AutoRec', param)
    return res.data
}
export async function Room_DanmuRec(uid, data) {
    let param = {
        UID: uid,
        IsRecDanmu: data
    }
    let res = await postFormAPI('Room_DanmuRec', param)
    return res.data
}
export async function Room_Del(uid) {
    let param = {
        UID: uid
    }
    let res = await postFormAPI('Room_Del', param)
    return res.data
}