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
### 文件结构
一个完整的项目文件结构应当如下图所示：
![文件结构示例](Docpic/wenjianjiegou.png)
|名称|说明|
|:--:|:--:|
|config |是储存配置文件的地方|
|index  |主页|
|其他|不重要，但是别删，略|

### 修改配置文件
在config文件夹中，有两个配置文件，如下图所示：
![两个配置文件](Docpic/peizhiwenjan.png)

**其中**,通过修改`barinfo.js`的内容，可以实现个性化的页面底部信息展示：
![备案信息](Docpic/beian.png)

`barinfo.js`的内容如下。

```js
window.BarInfo = {
    // 这里填入自己的备案信息，请务必修改。
    // 盗用他人备案号属违法行为，请如实填写，合规接入。
    // 是否显示
    show: false,
    // 显示的版权信息 show：是否显示 text:文字 link:需要跳转的链接 没有链接填空 "" 没有信息不显示即可
    info: { show: true, text: "Copyright © 2022 NGWORKS", link: "https://space.bilibili.com/254397112" },
    // 显示的TCP备案信息 show：是否显示 text:文字 link:需要跳转的链接 没有链接填空 "" 没有信息不显示即可
    ICP: { show: true, text: "陕ICP备2021012468号-1", link: "https://beian.miit.gov.cn/#/Integrated/index" },
    // 显示的公安备案信息 show：是否显示 text:文字 link:需要跳转的链接 没有链接填空 "" 没有信息不显示即可
    GA: { show: true, text: "陕公网安备 61010402000659号", link: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=61010402000659" },
}
```

**其中**,通过修改`config.js`的内容，可以实现更高级的部署操作：
> **⚠注意**：不正确的修改`config.js`可能造成网页无法访问的后果！

`config.js`的内容如下。
```js
window.apiObj = {
  // 如果您是前后端部署在一起，本配置填写 false 即可
  // 如果您是前端后端分离 这里配置你的后端地址
  // 如 http(s)://you.host:port (最后面不需要 / )
  apiUrl: "http://127.0.0.1:11419",
  // 这里是用来配置主要展示的挂载磁盘，仅Linux系统配置有效。
  // 默认展示的是 / 下挂载的磁盘，您可根据自身情况更改
  mount: '/ddtv',
  // 腾讯云服务器云监控插件(私有)，您无需修改。
  monitor:false,
  // cookie 域名 如果您属于跨域部署前后端 必须进行配置
  // 否则将不会清除过期cookie 如果没有，本配置填写 false 即可
  cookieDomain: false
}
```
