import { createApp } from 'vue'
import App from './App.vue'

// 创建app
const app = createApp(App)

import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElIconModules from '@element-plus/icons'

// 统一注册Icon图标
for (const iconName in ElIconModules) {
  if (Reflect.has(ElIconModules, iconName)) {
    const item = ElIconModules[iconName]
    app.component(iconName, item)
  }
}

app.use(ElementPlus)


app.use(store)
app.use(router)
app.mount('#app')