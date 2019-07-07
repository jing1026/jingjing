import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import Qs from 'qs'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import websdk from 'easemob-websdk'

let WebIM = window.WebIM = websdk

//即时通讯开始
Vue.prototype.$WebIM = WebIM

var conn = new WebIM.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
});

const options = {
  apiUrl: WebIM.config.apiURL,
  user: 'jiaxiangapp@163.com',//通信的账户
  pwd: 'jiaxiangapp@@LJT',//通信的密码
  appKey: WebIM.config.appkey,
  success:function (re) {
    console.log('登陆成功')
  },
  error:function (err) {
    console.log(err)
  }
}
Vue.prototype.$imconn = conn
Vue.prototype.$imoption = options
//即时通讯结束
Vue.use(VueQuillEditor)//富文本  像textarea 可以插图片
//接口基本的地址 以后只要写http://www.jiaxiangapp.com/jx/management的就可以了
 axios.defaults.baseURL = 'http://www.jiaxiangapp.com/jx/management' 
 //axios.defaults.baseURL = 'http://192.168.0.120:8080/jx/' 

Vue.prototype.$http= axios
Vue.prototype.qs = Qs//把参数格式化

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
//directive自定义的一个指令可以使文本框自获取去焦点
Vue.directive('focus', function (el, option) {
  var defClass = 'el-input', defTag = 'input';
  var value = option.value || true;
  if (typeof value === 'boolean')
      value = { cls: defClass, tag: defTag, foc: value };
  else
      value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false };
  if (el.classList.contains(value.cls) && value.foc)
      el.getElementsByTagName(value.tag)[0].focus();
});

const router = new VueRouter({
  //mode:"history",
  routes
})

router.beforeEach((to, from, next) => {
  
  if (to.path == '/login') {
    // sessionStorage.removeItem('user');
    // sessionStorage.removeItem('id');
    // sessionStorage.removeItem('type');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')