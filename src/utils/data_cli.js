/**
* ddtv data_cli 用于进行api数据更新 隔离视图层和api请求的数据的一类函数
* (c) 2021 禾咕咕
* @param {arr or obj} 源数据
*/

export function isObjectEqual(obj1, obj2) {
    let o1 = obj1 instanceof Object;
    let o2 = obj2 instanceof Object;
    if (!o1 || !o2) {    // 如果不是对象 直接判断数据是否相等
        return obj1 === obj2
    }
    // 判断对象的可枚举属性组成的数组长度
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    for (let attr in obj1) {
        let a1 = Object.prototype.toString.call(obj1[attr]) == '[object Object]'
        let a2 = Object.prototype.toString.call(obj2[attr]) == '[object Object]'
        let arr1 = Object.prototype.toString.call(obj1[attr]) == '[object Array]'
        if (a1 && a2) {
            // 如果是对象继续判断
            return isObjectEqual(obj1[attr], obj2[attr])
        } else if (arr1) {
            // 如果是对象 判断
            if (obj1[attr].toString() != obj2[attr].toString()) {
                return false;
            }
        } else if (obj1[attr] !== obj2[attr]) {
            // 不是对象的就判断数值是否相等
            return false
        }
    }
    return true
}
/**
* 用于实现双向数据绑定
* @param self 组件或页面的this
* @param arr 含有数据的数组
*/
export async function room_data(self, arr) {
    // 遍历本地数据 初始化 roomid 和 index 对应的索引
    let datalen = self.room.length,
        dataslent = []

    // 开始生成本地渲染列表的索引
    if (datalen != 0) { 
        for (var i = 0; i < datalen; i++) { 
            dataslent.push(self.room[i].room_id) 
        } 
    }
    // 遍历API数据 初始化 roomid 和 index 对应的索引
    let arrlen = arr.length,
        arrslent = []
    // 开始生成API列表的索引
    if (arrlen != 0) { 
        for (var j = 0; j < arrlen; j++) { 
            arrslent.push(arr[j].room_id) 
        } 
    }
    // 拷贝数组 得到两个数组 独有roomid的新数组
    let _dataSet = new Set(dataslent),
        _arrSet = new Set(arrslent),
        onlyData = dataslent.filter(item => !_arrSet.has(item)),
        onlyArr = arrslent.filter(item => !_dataSet.has(item))

    // 删除本地渲染列表 中过期的数据
    let onlydatalen = onlyData.length
    if (onlydatalen != 0) {
        for (var k = 0; k < onlydatalen; k++) {
            let dleindex = dataslent.indexOf(onlyData[k]);
            self.room.splice(dleindex, 1);
            dataslent.splice(dleindex, 1);
        }
    }
    // 删除掉相同的数据后，进行数据更新
    let dataslentlen = dataslent.length
    if (dataslentlen != 0) {
        for (var p = 0; p < dataslentlen; p++) {
            let updatindex = arrslent.indexOf(dataslent[p]),
                ordata = arr[updatindex],
                ondata = self.room[p]

            if (ordata.live_status != ondata.live_status) self.room[p].live_status = ordata.live_status
            if (ordata.live_time != ondata.live_time) self.room[p].live_time = ordata.live_time
            if (ordata.uname != ondata.uname) self.room[p].uname = ordata.uname
            if (ordata.cover_from_user != ondata.cover_from_user) {
                if(ordata.cover_from_user!='')self.room[p].cover_from_user = ordata.cover_from_user
            }
            if (`${ordata.face}@60w_60h_1c_1s.webp` != ondata.face){ 
                if(ordata.face!='')self.room[p].face = `${ordata.face}@60w_60h_1c_1s.webp`
            }
            if (ordata.keyframe != ondata.keyframe) self.room[p].keyframe = ordata.keyframe
            if (ordata.title != ondata.title) self.room[p].title = ordata.title
            if (ordata.IsAutoRec != ondata.IsAutoRec) self.room[p].IsAutoRec = ordata.IsAutoRec
            if (ordata.IsRecDanmu != ondata.IsRecDanmu) self.room[p].IsRecDanmu = ordata.IsRecDanmu
            if (ordata.IsDownload != ondata.IsDownload) self.room[p].IsDownload = ordata.IsDownload
        }
    }
    // 新增 onlyArr
    let onlyArrlen = onlyArr.length;
    if (onlyArrlen != 0) {
        for (var l = 0; l < onlyArrlen; l++) {
            let addindex = arrslent.indexOf(onlyArr[l]),
                adddata = arr[addindex],
                pushdata = {
                    //roomid
                    "room_id": adddata.room_id,
                    "title":adddata.title == '' ? ' ':adddata.title,
                    // 直播状态
                    "live_status": adddata.live_status,
                    // 直播时间
                    "live_time": adddata.live_time,
                    // 用户名
                    "uname": adddata.uname,
                    // uid
                    "uid": adddata.uid,
                    // 封面
                    "cover_from_user": adddata.cover_from_user == '' ? require("../assets/basecover.jpg"):adddata.cover_from_user,
                    // 头像
                    "face": `${adddata.face == '' ? 'https://i0.hdslb.com/bfs/face/member/noface.jpg':adddata.face}@60w_60h_1c_1s.webp`,
                    // 关键帧
                    "keyframe": adddata.keyframe,
                    //
                    "IsDownload":adddata.IsDownload,
                    "st":'',
                    "check":false,
                    "IsAutoRec":adddata.IsAutoRec,
                    "IsRecDanmu":adddata.IsRecDanmu,
                    "load":false


                }
            self.room.push(pushdata);
        }
    }
}

export function sys_info_pr(self, obj) {
    console.log(self.system_info_data)
    if (!isObjectEqual(self.system_info_data, obj)) { self.system_info_data = obj }
    else console.log("数据没有发生改变")
}