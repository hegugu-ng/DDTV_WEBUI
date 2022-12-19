window.apiObj = {
  // 如果您是前后端部署在一起，本配置填写 false 即可
  // 如果您是前端后端分离 这里配置你的后端地址
  // 如 http(s)://you.host:port (最后面不需要 / )
  apiUrl: "http://localhost:8080/",
  // 这里是用来配置主要展示的挂载磁盘，仅Linux系统配置有效。
  // 默认展示的是 / 下挂载的磁盘，您可根据自身情况更改
  mount: '/ddtv',
  // 腾讯云服务器云监控插件，如果您不是腾讯云服务器，无需修改。
  monitor:false,
  // cookie 域名 如果您属于跨域部署前后端 必须进行配置
  // 否则将不会清除过期cookie 如果没有，本配置填写 false 即可
  cookieDomain: false
}
