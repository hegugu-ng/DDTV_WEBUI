import axios from "axios";

/**
 * 获取系统运行情况
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
 *  "code": 0,
 *  "cmd": "System_Info",
 *  "massage": "",
 *  "data": {
 *      "DDTVCore_Ver": "3.3.6.827",
 *      "Room_Quantity": 2,
 *      "ServerName": "DDTV_Server",
 *      "ServerAID": "2864b26c-****-44c3-9816-16b5df6a00ee",
 *      "os_Info": {
 *          "OS_Ver": "Microsoft Windows 10.0.19044",
 *          "OS_Tpye": "X64",
 *          "Memory_Usage": 105267200,
 *          "Runtime_Ver": "X64",
 *          "UserInteractive": true,
 *          "Associated_Users": "root",
 *          "Current_Directory": "/usr/bin",
 *          "AppCore_Ver": ".NET 6.0.8",
 *          "WebCore_Ver": "6.0.8"
 *      },
 *      "download_Info": {
 *          "Downloading": 0,
 *          "Completed_Downloads": 0
 *      }
 *  }
 *}
 */
export function getSystemInfo() {
  const params = new URLSearchParams();
  params.append("cmd", "System_Info");
  return axios.post("api/System_Info", params);
}

/**
 * 获取系统配置文件信息
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
        "code": 0,
        "cmd": "System_Config",
        "massage": "",
        "data": [
            {
                "Key": 0,
                "KeyName": "RoomListConfig",
                "Group": 1,
                "Value": "./RoomListConfig.json",
                "Enabled": true
            },
            ...
        ]
    }
 */
export function getSystemConfig() {
  const params = new URLSearchParams();
  params.append("cmd", "System_Config");
  return axios.post("/api/System_Config", params);
}

/**
 * 获取系统硬件资源使用情况
 * 注意事项 该接口消耗的系统硬件资源较高，请勿频繁调用！！！！！
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
        "code": 0,
        "cmd": "System_Resources",
        "massage": "",
        "data": {
            "Platform": "Windows",
            "CPU_usage": 5,
            "Memory": {
                "Total": 42949672960,
                "Available": 23507283968
            },
            "HDDInfo": [
                {
                    "FileSystem": "D:",
                    "Size": "931.50GB",
                    "Used": "86%",
                    "Avail": "121.80GB",
                    "Usage": "809.70GB",
                    "MountPath": "D:"
                }
            ]
        }
    }
 */
export function getSystemResources() {
  const params = new URLSearchParams();
  params.append("cmd", "System_Resources");
  return axios.post("/api/System_Resources", params);
}

/**
 * 获取历史日志
 * @param {Number} page 第几页
 * @param {Number} quantity 每页多少条
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
        "code": 0,
        "cmd": "System_Log",
        "massage": "",
        "data": {
            "TotalLogs": 12,
            "Logs": [
                {
                    "Message": "DDTV_WEB|DDTV_Core-3.3.6.827(2022-11-26 17:04:04)",
                    "Type": 30,
                    "Time": "2023-01-09T01:41:10.8182532+08:00",
                    "RunningTime": 79,
                    "Source": "System",
                    "IsError": false,
                    "exception": null,
                    "IsDisplay": true
                }
            ]
        }
    }
 */
export function getSystemLog(page, quantity) {
  const params = new URLSearchParams();
  params.append("cmd", "System_Log");
  params.append("page", page);
  params.append("Quantity", quantity);
  return axios.post("/api/System_Log", params);
}

/**
 * 获取最新日志
 * @param {Number} quantity  最新的多少条
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
        "code": 0,
        "cmd": "System_LatestLog",
        "massage": "",
        "data": [
            {
                "Message": "哔哩哔哩本地User信息加载完成",
                "Type": 40,
                "Time": "2023-01-09T01:41:10.9639412+08:00",
                "RunningTime": 225,
                "Source": "CoreConfig",
                "IsError": false,
                "exception": null,
                "IsDisplay": true
            }
        ]
    }
 */
export function getSystemLatestLog(quantity) {
  const params = new URLSearchParams();
  params.append("cmd", "System_LatestLog");
  params.append("Quantity", quantity);
  return axios.post("/api/System_LatestLog", params);
}

/**
 * 返回一个可以自行设定的初始化状态值(用于前端自行判断)
 * 注意事项 该接口用于前端自行判断，启动后默认值都为真，不能作为DDTV是否正在运行的参考
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
        "code": 0,
        "cmd": "System_QueryWebFirstStart",
        "massage": "",
        "data": true
   }
 */
export function getSystemQueryWebFirstStart() {
  const params = new URLSearchParams();
  params.append("cmd", "System_QueryWebFirstStart");
  return axios.post("/api/System_QueryWebFirstStart", params);
}

/**
 * 设置初始化状态值
 * 注意事项 用于设置初始化状态值(WEB_FirstStart)；该值无实际的逻辑处理，用于前端自行判断使用。
 * @param {Boolean} state 设置初始化状态值
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "System_SetWEBFirstStart",
    "massage": "设置初始化标志位为:True",
    "data": true
   }
 */
export function setWebFirstStart(state) {
  const params = new URLSearchParams();
  params.append("cmd", "System_SetWebFirstStart");
  params.append("state", state);
  return axios.post("/api/System_SetWebFirstStart", params);
}

/**
 * 用于判断用户登陆状态是否有效
 * 注意事项
   该接口应该是用于登陆状态是否有效的检测，检测到登陆状态失效就应该停止调用本接口，直到登陆状态恢复
   检测登陆中时是否登陆成功，应该使用/api/LoingState进行查询
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "System_QueryUserState",
    "massage": "登陆有效",
    "data": true
   }
 */
export function getSystemQueryUserState() {
  const params = new URLSearchParams();
  params.append("cmd", "System_QueryUserState");
  return axios.post("/api/System_QueryUserState", params);
}

/**
 * 设置自动转码总开关
 * 注意事项 该接口需要依赖ffmpeg，请根据进阶功能说明中的自动转码页面的内容进行检查是否已经安装ffmpeg
 * @param {Boolean} state 打开或者关闭自动转码开关调用
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "Config_Transcod",
    "massage": "",
    "data": "关闭自动转码成功"
   }
 */
export function setConfigTranscod(state) {
  const params = new URLSearchParams();
  params.append("cmd", "Config_Transcod");
  params.append("state", state);
  return axios.post("/api/Config_Transcod", params);
}

/**
 * 根据文件大小自动切片
 * 注意事项 请勿输入1-10485760(1MB)的数值，在某些清晰度较高的直播间中，
 * 初始数据包会大于这个数值，这种情况下会报错
 * @param {Number} size 设置自动分割文件大小(单位为byte)，为0时为关闭该功能
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "Config_FileSplit",
    "massage": "",
    "data": "启用录制文件大小限制(自动分割)，设置大小为:90.95TB"
   }
 */
export function setConfigFileSplit(size) {
  const params = new URLSearchParams();
  params.append("cmd", "Config_FileSplit");
  params.append("size", size);
  return axios.post("/api/Config_FileSplit", params);
}

/**
 * 弹幕录制总共开关(包括礼物、舰队、SC)
 * 注意事项 该弹幕录制接口总共开关包括礼物、舰队、SC的录制开关，
 * 并且个房间自己在房间配置列表单独设置，这个只是是否启用弹幕录制功能的总共开关，
 * 要录制某个房间除了打开这个设置还需要房间配置启动打开录制
 * @param {Boolean} state 打开或关闭弹幕录制总开关
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "Config_DanmuRec",
    "massage": "",
    "data": "关闭弹幕录制(包括礼物、舰队、SC) (每个房间自己在房间配置列表单独设置，这个只是是否启用弹幕录制功能的总共开关)"
   }
 */
export function setConfigDanmuRec(state) {
  const params = new URLSearchParams();
  params.append("cmd", "Config_DanmuRec");
  params.append("state", state);
  return axios.post("/api/Config_DanmuRec", params);
}

/**
 * 导入关注列表中的V
 * 注意事项 该接口需要依赖哔哩哔哩账号登陆，使用前请确认已经扫码登陆
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "Config_GetFollow",
    "massage": "",
    "data": [
        {
            "mid": 372984197,
            "roomid": 14052636,
            "name": "夢乃栞Yumeno_Shiori"
        },
        ...
    ]
   }
 */
export function getConfigGetFollow() {
  const params = new URLSearchParams();
  params.append("cmd", "Config_GetFollow");
  return axios.post("/api/Config_GetFollow", params);
}

/**
 * 获取已录制的文件列表
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "File_GetAllFileList",
    "massage": "",
    "data": [
        "./Rec/14052636_夢乃栞Yumeno_Shiori/22_12_18/2022_12_18_19_58_31_B限爱上美人_1912_1.flv"
    ]
   }
 */
export function getAllFileList() {
  const params = new URLSearchParams();
  params.append("cmd", "File_GetAllFileList");
  return axios.post("/api/File_GetAllFileList", params);
}

/**
 * 下载对应的文件
 * @param {String} filename 此处为文件的完整路径，包括文件名
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * 如果成功直接返回blob 失败返回如下
 * { "code": 0, "cmd": "File_GetFile", "massage": "", "data": "该文件不存在" }
 */
export function getFile(filename) {
  const params = new URLSearchParams();
  params.append("cmd", "File_GetFile");
  params.append("FileName", filename);
  return axios.get("/api/File_GetFile", { params: params });
}

/**
 * 根据文件树结构返回已录制的文件总列表
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "File_GetAllFileList",
    "massage": "",
    "data": [
        {
            "Name": "14052636_夢乃栞Yumeno_Shiori",
            "FileType": "",
            "Size": 0,
            "DateTime": "0001-01-01T00:00:00",
            "children": [
                {
                    "Name": "22_12_18",
                    "FileType": "",
                    "Size": 0,
                    "DateTime": "0001-01-01T00:00:00",
                    "children": [
                        {
                            "Name": "2022_12_18_19_58_31_B限爱上美人_1912_1.flv",
                            "FileType": ".flv",
                            "Size": 575321836,
                            "DateTime": "2022-12-18T19:58:32.0585786+08:00",
                            "children": null
                        }
                    ]
                }
            ]
        }
    ]
  }
 */
export function getFilePathList() {
  const params = new URLSearchParams();
  params.append("cmd", "File_GetFilePathList");
  return axios.post("/api/File_GetFilePathList", params);
}

/**
 * 根据文件类型分类获取已录制的文件总列表
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "File_GetTypeFileList",
    "massage": "",
    "data": {
        "fileLists": [
            {
                "files": [
                    "./Rec/14052636_夢乃栞Yumeno_Shiori/22_12_18/2022_12_18_19_58_31_B限爱上美人_1912_1.flv"
                ],
                "Type": "flv"
            },
            {
                "files": [],
                "Type": "mp4"
            },
            {
                "files": [],
                "Type": "xml"
            },
            {
                "files": [],
                "Type": "csv"
            },
            {
                "files": [],
                "Type": "other"
            }
        ]
    }
   }
 */
export function getTypeFileList() {
  const params = new URLSearchParams();
  params.append("cmd", "File_GetTypeFileList");
  return axios.post("/api/File_GetTypeFileList", params);
}

/**
 * web登录接口(非B站登录)
 * 此处配置文件指 ./DDTV_Config.ini
 * @param {String} username 用于登陆的用户名，默认设置为ami，在配置文件中进行设置
 * @param {String} password 用于登陆的密码，默认设置为ddtv，在配置文件中进行设置
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {"code":0,"cmd":"Login","massage":"","data":{"Cookie":"836bd1ca-56f8-4195-99a2-8af1a074df9e"}}
 * 其中Cookie会自动配置为浏览器配置，无需二次配置
 */
export function webLogin(username, password) {
  const params = new URLSearchParams();
  params.append("cmd", "Login");
  params.append("UserName", username);
  params.append("Password", password);
  return axios.post("/api/Login", params);
}

/**
 * 获取用于B站登录的登陆二维码
 * 注意事项 返回值类型为arraybuffer，建议使用vueuse的useBase64对arraybuffer进行编码，
 * 然后直接在img标签的src属性进行拼接，例如:src="'data:image/png;base64,' + a.value"
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：[object ArrayBuffer]
 */
export function biliLoginqr() {
  const params = new URLSearchParams();
  params.append("cmd", "loginqr");
  return axios.get("/api/loginqr", { params: params, responseType: "arraybuffer" });
}

/**
 * 重置B站登录状态/退出登录B站
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * { "code": 0, "cmd": "Login_Reset", "massage": "", "data": "请访问 api/login 接口进行扫码登陆" }
 */
export function biliLoginReset() {
  const params = new URLSearchParams();
  params.append("cmd", "Login_Reset");
  return axios.post("/api/Login_Reset", params);
}

/**
 * 查询内部登陆状态
 * LoginState["未登录","已登录","登录失败","登陆中"]
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * { "code": 0, "cmd": "Login_State", "massage": "", "data": { "LoginState": 3 } }
 */
export function getLoginState() {
  const params = new URLSearchParams();
  params.append("cmd", "Login_State");
  return axios.post("/api/Login_State", params);
}

/**
 * 获取录制中的任务情况详细情况
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 * {"code":0,"cmd":"Rec_RecordingInfo","massage":"","data":[]}
 */
export function getRecordingInfo() {
  const params = new URLSearchParams();
  params.append("cmd", "Rec_RecordingInfo");
  return axios.post("/api/Rec_RecordingInfo", params);
}

/**
 * 获取录制中的任务情况简略情况
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 * {"code":0,"cmd":"Rec_RecordingInfo","massage":"","data":[]}
 */
export function getRecordingInfoLite() {
  const params = new URLSearchParams();
  params.append("cmd", "Rec_RecordingInfo_Lite");
  return axios.post("/api/Rec_RecordingInfo_Lite", params);
}

/**
 * 获取已经录制完成的任务详细情况
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 * {"code":0,"cmd":"Rec_RecordCompleteInfon","massage":"","data":[]}
 */
export function getRecordCompleteInfon() {
  const params = new URLSearchParams();
  params.append("cmd", "Rec_RecordCompleteInfon");
  return axios.post("/api/Rec_RecordCompleteInfon", params);
}

/**
 * 获取已经录制完成的任务简略情况
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 * {"code":0,"cmd":"Rec_RecordCompleteInfon","massage":"","data":[]}
 */
export function getRecordCompleteInfonLite() {
  const params = new URLSearchParams();
  params.append("cmd", "Rec_RecordCompleteInfon_Lite");
  return axios.post("/api/Rec_RecordCompleteInfon_Lite", params);
}

/**
 * 取消某个录制任务
 * 注意事项 注意！是UID！是UID！不是房间号！
 * @param {Number} uid 要取消任务的账号UID
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 */
export function cancelDownload(uid) {
  const params = new URLSearchParams();
  params.append("cmd", "Rec_CancelDownload");
  params.append("UID", uid);
  return axios.post("/api/Rec_CancelDownload", params);
}

/**
 * 获取房间详细配置信息
 * 注意事项 该接口根据服务器上房间配置的多少决定，数据量可能会较多；
 * 在启动成功前30秒最好不要调用，该阶段属于API请求更新数据阶段，可能为空的数据较多。
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "Room_AllInfo",
    "massage": "",
    "data": [
        {
            "MonitoringSystem_Airtime": "2023-01-09T13:51:42.3126819+08:00",
            "MonitoringSystem_Attention": 0,
            "title": "药剂工艺（仅游戏声）",
            "description": null,
            "attention": 0,
            "room_id": 1286145,
            "uid": 7768957,
            "online": 525,
            "live_time": 0,
            "live_status": 0,
            "short_id": 0,
            "area": 1,
            "area_name": "单机联机",
            "area_v2_id": 235,
            "area_v2_name": "其他单机",
            "area_v2_parent_name": "单机游戏",
            "area_v2_parent_id": 6,
            "uname": "wosiwq",
            "face": "https://i1.hdslb.com/bfs/face/0033b4244ac9b559e53754e701cccebd79d27b42.jpg",
            "tag_name": "以撒,minecraft,饥荒,彩虹六号,东方",
            "tags": "",
            "cover_from_user": "https://i0.hdslb.com/bfs/live/new_room_cover/eda1a32c33aeaf5636ec85bde2b7f1f1481a904c.jpg",
            "keyframe": "https://i0.hdslb.com/bfs/live-key-frame/keyframe12222224000001286145irjnjr.jpg",
            "lock_till": "0000-00-00 00:00:00",
            "hidden_till": "0000-00-00 00:00:00",
            "broadcast_type": 0,
            "need_p2p": 0,
            "is_hidden": false,
            "is_locked": false,
            "is_portrait": false,
            "encrypted": false,
            "pwd_verified": false,
            "room_shield": 0,
            "is_sp": 0,
            "special_type": 0,
            "IsTemporaryPlay": false,
            "roomStatus": 0,
            "roundStatus": 0,
            "url": "",
            "Description": null,
            "IsAutoRec": false,
            "IsRemind": false,
            "IsRecDanmu": false,
            "Like": false,
            "level": 0,
            "sex": null,
            "sign": null,
            "roomWebSocket": null,
            "IsDownload": false,
            "DownloadingList": null,
            "IsUserCancel": false,
            "DownloadedLog": null,
            "DanmuFile": null,
            "IsCliping": false,
            "CreationTime": "2023-01-09T13:51:42.3126815+08:00",
            "DownloadedFileInfo": {
                "AfterRepairFiles": [],
                "BeforeRepairFiles": [],
                "DanMuFile": null,
                "SCFile": null,
                "GuardFile": null,
                "GiftFile": null
            },
            "Shell": "",
            "Host": "",
            "Files": []
        },
        ...
    ]
}
 */
export function getRoomAllInfo() {
  const params = new URLSearchParams();
  params.append("cmd", "Room_AllInfo");
  return axios.post("/api/Room_AllInfo", params);
}

/**
 * 获取房间简要配置信息
 * 注意事项 该接口根据服务器上房间配置的多少决定，数据量可能会较多；
 * 在启动成功前30秒最好不要调用，该阶段属于API请求更新数据阶段，可能为空的数据较多。
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "Room_AllInfo",
    "massage": "",
    "data": [
        {
            "MonitoringSystem_Airtime": "2023-01-09T13:55:54.6379515+08:00",
            "MonitoringSystem_Attention": 0,
            "title": "",
            "description": "",
            "attention": 0,
            "room_id": 1286145,
            "uid": 7768957,
            "online": 0,
            "live_time": 0,
            "live_status": 0,
            "short_id": 0,
            "area": 0,
            "area_name": "",
            "area_v2_id": 0,
            "area_v2_name": "",
            "area_v2_parent_name": "",
            "area_v2_parent_id": 0,
            "uname": "wosiwq",
            "face": "",
            "tag_name": "",
            "tags": "",
            "cover_from_user": "",
            "keyframe": "",
            "lock_till": "",
            "hidden_till": "",
            "broadcast_type": 0,
            "need_p2p": 0,
            "is_hidden": false,
            "is_locked": false,
            "is_portrait": false,
            "encrypted": false,
            "pwd_verified": false,
            "room_shield": 0,
            "is_sp": 0,
            "special_type": 0,
            "IsTemporaryPlay": false,
            "roomStatus": 0,
            "roundStatus": 0,
            "url": "",
            "Description": "",
            "IsAutoRec": false,
            "IsRemind": false,
            "IsRecDanmu": false,
            "Like": false,
            "level": 0,
            "sex": null,
            "sign": null,
            "roomWebSocket": {
                "IsConnect": false,
                "dokiTime": 0,
                "LiveChatListener": {
                    "m_ReceiveBuffer": null,
                    "m_innerRts": null,
                    "TroomId": 0,
                    "startIn": false,
                    "wss_S": "",
                    "mid": 0,
                    "IsUserDispose": false,
                    "IsWatchMode": false,
                    "host": null
                }
            },
            "IsDownload": false,
            "DownloadingList": [],
            "IsUserCancel": false,
            "DownloadedLog": [],
            "DanmuFile": {
                "FileName": null,
                "TimeStopwatch": null,
                "Danmu": [],
                "SuperChat": [],
                "Gift": [],
                "GuardBuy": []
            },
            "IsCliping": false,
            "CreationTime": "2023-01-09T13:55:54.6379506+08:00",
            "DownloadedFileInfo": {
                "AfterRepairFiles": [],
                "BeforeRepairFiles": [],
                "DanMuFile": null,
                "SCFile": null,
                "GuardFile": null,
                "GiftFile": null
            },
            "Shell": "",
            "Host": "",
            "Files": []
        },
        ...
    ]
}
 */
export function getRoomSummaryInfo() {
  const params = new URLSearchParams();
  params.append("cmd", "Room_SummaryInfo");
  return axios.post("/api/Room_SummaryInfo", params);
}

/**
 * 增加一个加房间配置
 * 注意事项 该接口的调用频率不能超过3秒/次，该接口后面封装的B站原生API较为复杂，
 * 如果请求过多，可能会造成频率过高导致412鉴权错误导致IP被黑名单半小时左右。
 * @param {Number} uid 要增加到房间配置中的账号UID
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 */
export function addRoom(uid) {
  const params = new URLSearchParams();
  params.append("cmd", "Room_Add");
  params.append("UID", uid);
  return axios.post("/api/Room_Add", params);
}

/**
 * 删除一个房间配置
 * @param {Number} uid 要增加到房间配置中的账号UID
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 */
export function deleteRoom(uid) {
  const params = new URLSearchParams();
  params.append("cmd", "Room_Del");
  params.append("UID", uid);
  return axios.post("/api/Room_Del", params);
}

/**
 * 修改房间自动录制配置
 * @param {Number} uid 要修改自动录制配置的账号UID
 * @param {Boolean} is_auto_rec 打开\关闭开播自动录制
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 */
export function updateRoomAutoRec(uid, is_auto_rec) {
  const params = new URLSearchParams();
  params.append("cmd", "Room_AutoRec");
  params.append("UID", uid);
  params.append("IsAutoRec", is_auto_rec);
  return axios.post("/api/Room_AutoRec", params);
}

/**
 * 修改房间弹幕录制配置
 * @param {Number} uid 要修改弹幕录制配置的账号UID
 * @param {Boolean} is_auto_rec 打开\关闭该房间的弹幕录制功能
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * //FIXME 待补充
 */
export function updateRoomDanmuRec(uid, is_rec_danmu) {
  const params = new URLSearchParams();
  params.append("cmd", "Room_DanmuRec");
  params.append("UID", uid);
  params.append("IsRecDanmu", is_rec_danmu);
  return axios.post("/api/Room_DanmuRec", params);
}

/**
 * 通过B站搜索搜索直播用户
 * @param {String} keyword 需要搜索的关键词
 * @returns {Promise<AxiosResponse<any, any>>} 返回一个axios生成的promise对象，返回值样例：
 * {
    "code": 0,
    "cmd": "User_Search",
    "massage": "",
    "data": {
        "code": 0,
        "message": "0",
        "ttl": 1,
        "data": {
            "seid": "8025948085572130530",
            "page": 1,
            "pagesize": 30,
            "numResults": 1,
            "numPages": 1,
            "suggest_keyword": "",
            "rqt_type": "search",
            "cost_time": {
                "params_check": "0.000524",
                "is_risk_query": "0.000089",
                "illegal_handler": "0.019744",
                "deserialize_response": "0.000122",
                "as_response_format": "0.003681",
                "as_request": "0.004604",
                "save_cache": "0.000883",
                "as_doc_request": "0.002981",
                "as_request_format": "0.000312",
                "total": "0.032976",
                "main_handler": "0.008904"
            },
            "exp_list": {
                "5507": true,
                "6602": true,
                "7703": true
            },
            "egg_hit": 0,
            "result": [
                {
                    "rank_offset": 1,
                    "uid": 7768957,
                    "tags": "明日方舟",
                    "type": "live_user",
                    "live_time": "2022-12-22 22:38:45",
                    "hit_columns": [
                        "uname"
                    ],
                    "cate_name": "其他单机",
                    "live_status": 0,
                    "area": 1,
                    "is_live": false,
                    "uname": "<em class=\"keyword\">wosiwq</em>",
                    "area_v2_id": 235,
                    "uface": "//i0.hdslb.com/bfs/face/0033b4244ac9b559e53754e701cccebd79d27b42.jpg",
                    "rank_index": 1,
                    "rank_score": 30627,
                    "roomid": 1286145,
                    "attentions": 627
                }
            ],
            "show_column": 0,
            "in_black_key": 0,
            "in_white_key": 0
        }
    }
   }
 */
export function userSearch(keyword) {
  const params = new URLSearchParams();
  params.append("cmd", "User_Search");
  params.append("keyword", keyword);
  return axios.post("/api/User_Search", params);
}
