import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.css'
import 'assets/css/params.less'
import 'assets/css/transition.less'
import "assets/iconfont/iconfont.css"
import './plugins/antd'
import './plugins/bus/bus'
import './plugins/chat/chat'
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
