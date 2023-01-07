export let NetworkDisconnection = {
  message: "无法与后端建立连接",
  level: "error",
  priority: 99,
  action: "Network Restored",
  type: "Network Disconnection",
  icon: "link"
};
export let NetworkConnection = {
  message: "已经建立连接",
  level: "success",
  priority: 99,
  action: "auto",
  type: "Network Restored",
  icon: "link"
};
export let TestInfo = {
  message: "消息",
  level: "info",
  priority: 9,
  action: "Until Network Restored",
  type: "1Network Disconnection",
  icon: "wifi"
};
