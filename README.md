# 基于DDTVWeb API 开发的web UI

## 关于本项目
本项目基于[DDTV](https://ddtv.pro/)的 [WEB API](https://ddtv.pro/API/)开发而成。

> **❓什么是WEB API**
当前DDTV的接口分为两种，**并且只对DDTV_WEB_Server有效，其他版本是不能使用WEB请求和API操作。**
具体有何不同可以参见下表。

|接口类型|请求是否需要携带cookie|请求是否需要携带sig|说明|
|:--:|:--:|:--:|:--:|
|WEB请求|✅|❌|一般用于前端请求，需要先调用login接口进行登录，之后的操作每次携带登录返回的cookie即可|
|API操作|❌|✅|一般用于程序调用，每个请求都可以直接调用，每次操作都需要携带根据key计算的sig|

具体有何区别，请参阅[两种接口的调用差异](https://ddtv.pro/API/)


## 自行构建
如果你想要走在时代前沿，引领时代潮流，可以尝试克隆仓库代码，自行构建。
```
npm install
npm run serve
npm run build
```
更多自行构建的相关信息参见 [这里](https://cli.vuejs.org/config/).

## 配置&使用
### 修改配置文件