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
        let a1 = Object.prototype.toString.call(obj1[attr]) === '[object Object]'
        let a2 = Object.prototype.toString.call(obj2[attr]) === '[object Object]'
        let arr1 = Object.prototype.toString.call(obj1[attr]) === '[object Array]'
        if (a1 && a2) {
            // 如果是对象继续判断
            return isObjectEqual(obj1[attr], obj2[attr])
        } else if (arr1) {
            // 如果是对象 判断
            if (obj1[attr].toString() !== obj2[attr].toString()) {
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
 * 输入组件内的room数组和api查询出来的room数组，先剔除掉组件内的room数组中已经不存在的部分
 * 再把api查询出来的room数组中的新的部分和老数组合并，最后返回一整个room数组
 * @param localRoomData 组件或页面的this.room
 * @param Room_AllInfo 通过Room_AllInfo这个API拿到的数组
 * @return returnArr 返回一个数组，数组中的元素是新的room
 */
export function getNewRoom(localRoomData, Room_AllInfo) {
    let returnArr = []
    let localRoomDataArr = []
    // 把每一个room的id放到一个数组中
    for (let i = 0; i < localRoomData.length; i++) {
        localRoomDataArr.push(localRoomData[i].room_id)
    }
    // 遍历api查询出来的room数组
    for (let i = 0; i < Room_AllInfo.length; i++) {
        if (localRoomDataArr.indexOf(Room_AllInfo[i].room_id) === -1) {
            returnArr.push(Room_AllInfo[i])
        }
    }
    returnArr = returnArr.concat(localRoomData)
    return [returnArr , localRoomData];
}

































/**
 * 输入组件内的room数组和api查询出来的room数组，先剔除掉组件内的room数组中已经不存在的部分
 * 再把api查询出来的room数组中的新的部分和老数组合并，最后返回一整个room数组
 * @param localRoomData 组件或页面的this.room
 * @param Room_AllInfo 通过Room_AllInfo这个API拿到的数组
 * @return returnArr 返回一个数组，数组中的元素是新的room
*/
export async function room_data(localRoomData, Room_AllInfo) {
    // 遍历本地数据 初始化 roomid 和 index 对应的索引
    let localDataIndex = []

    // 开始生成本地渲染列表的索引
    for (let i = 0; i < localRoomData.length; i++) {
        localDataIndex.push(localRoomData[i].room_id)
    }

    // 遍历API数据 初始化 roomid 和 index 对应的索引
    let apiDataIndex = []
    // 开始生成API列表的索引
    for (let j = 0; j < Room_AllInfo.length; j++) {
        apiDataIndex.push(Room_AllInfo[j].room_id)
    }

    // 拷贝数组 用onlyLocalDataHas接收localDataIndex中不在apiDataIndex中的数据 用onlyApiDataHas接收apiDataIndex中不在localDataIndex中的数据
    let _dataSet = new Set(localDataIndex),
        _arrSet = new Set(apiDataIndex),
        onlyLocalDataHas = localDataIndex.filter(item => !_arrSet.has(item)),
        onlyApiDataHas = apiDataIndex.filter(item => !_dataSet.has(item))

    // 删除本地渲染列表中和API列表中不同的数据
    for (let k = 0; k < onlyLocalDataHas.length; k++) {
        let deleteDataIndex = localDataIndex.indexOf(onlyLocalDataHas[k]);
        localRoomData.splice(deleteDataIndex, 1);
        localDataIndex.splice(deleteDataIndex, 1);
    }

    // 删除掉相同的数据后，进行数据更新
    for (let p = 0; p < localDataIndex.length; p++) {
        let updateDataIndex = apiDataIndex.indexOf(localDataIndex[p]),
            ordata = Room_AllInfo[updateDataIndex],
            ondata = localRoomData[p]

        if (ordata.live_status !== ondata.live_status) localRoomData[p].live_status = ordata.live_status
        if (ordata.live_time !== ondata.live_time) localRoomData[p].live_time = ordata.live_time
        if (ordata.uname !== ondata.uname) localRoomData[p].uname = ordata.uname
        if (ordata.cover_from_user !== ondata.cover_from_user) {
            if(ordata.cover_from_user!=='')localRoomData[p].cover_from_user = ordata.cover_from_user
        }
        if (`${ordata.face}@60w_60h_1c_1s.webp` !== ondata.face){
            if(ordata.face!=='')localRoomData[p].face = `${ordata.face}@60w_60h_1c_1s.webp`
        }
        if (ordata.keyframe !== ondata.keyframe) localRoomData[p].keyframe = ordata.keyframe
        if (ordata.title !== ondata.title) localRoomData[p].title = ordata.title
        if (ordata.IsAutoRec !== ondata.IsAutoRec) localRoomData[p].IsAutoRec = ordata.IsAutoRec
        if (ordata.IsRecDanmu !== ondata.IsRecDanmu) localRoomData[p].IsRecDanmu = ordata.IsRecDanmu
        if (ordata.IsDownload !== ondata.IsDownload) localRoomData[p].IsDownload = ordata.IsDownload
    }

    // 新增 onlyArr
    for (let l = 0; l <  onlyApiDataHas.length; l++) {
        let addindex = apiDataIndex.indexOf(onlyApiDataHas[l]),
            adddata = Room_AllInfo[addindex],
            pushdata = {
                //roomid
                "room_id": adddata.room_id,
                "title":adddata.title === '' ? ' ':adddata.title,
                // 直播状态
                "live_status": adddata.live_status,
                // 直播时间
                "live_time": adddata.live_time,
                // 用户名
                "uname": adddata.uname,
                // uid
                "uid": adddata.uid,
                // 封面
                "cover_from_user": adddata.cover_from_user === '' ? require("../assets/basecover.jpg"):adddata.cover_from_user,
                // 头像
                "face": `${adddata.face === '' ? 'https://i0.hdslb.com/bfs/face/member/noface.jpg':adddata.face}@60w_60h_1c_1s.webp`,
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
        localRoomData.push(pushdata);
    }
    return localRoomData;

}

export function sys_info_pr(self, obj) {
    console.log(self.system_info_data)
    if (!isObjectEqual(self.system_info_data, obj)) { self.system_info_data = obj }
    else console.log("数据没有发生改变")
}
