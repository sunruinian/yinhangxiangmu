// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
// import 'common/css/lib/theme-bubi/index.css'
import integration from 'common/javascript/integration'
import vfilter from 'common/javascript/vfilter'
import dispatch from 'module/member/service/dispatch'
import cookieTools from 'common/javascript/tools/cookieTools'
import accessControl from 'common/javascript/tools/accessControl.js'
import config from 'common/config/config'
import JsEncrypt from 'jsencrypt/bin/jsencrypt'

// 将jsencrypt压入到Vue
Vue.prototype.$jsEncrypt = new JsEncrypt.JSEncrypt({default_key_size: 1024})
if (localStorage.getItem('pubKey')) {
  Vue.prototype.$jsEncrypt.setPublicKey(localStorage.getItem('pubKey'))
}

// 添加vue整合
integration()
// 添加vueFilter
vfilter()

import {
  Input,
  DatePicker,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Form,
  FormItem,
  Autocomplete,
  Table,
  TableColumn,
  Tree,
  Tag,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Pagination,
  Select,
  Option,
  Dialog,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  ButtonGroup,
  Tabs,
  TabPane,
  Tooltip,
  Upload,
  Loading,
  Collapse,
  CollapseItem,
  Steps,
  Step,
  MessageBox,
  Message,
  Transfer,
  popover
} from 'element-ui'
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Button)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Autocomplete)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(ButtonGroup)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(Upload)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Steps)
Vue.use(Step)
// Vue.use(VueBus)
Vue.use(Transfer)
Vue.use(popover)

Vue.config.productionTip = false
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading
// vue bus
function vueBus (Vue) {
  var bus = new Vue()
  bus.data = {
    host: 'glob'
  }
  Object.defineProperty(Vue.prototype, '$bus', {
    get: function () {
      return bus
    }
  })
}
vueBus(Vue)

// 请求前拦截
let payInfo = {}
Axios.interceptors.request.use((config) => {
  // console.log('config==>>', config)
  payInfo.url = config.url
  payInfo.method = config.method
  payInfo.params = config.data
  payInfo.href = location.href
  return config
}, (err) => {
  return Promise.reject(err)
})

// 响应拦截
Axios.interceptors.response.use(function (response) {
  const info = {
    message: ''
  }
  if (response.status === 403) {
    info.message = '用户无权限！'
    new Vue().$bus.$emit('message-error', info)
  }
  if (response.status === 302) {
    // info.message = '请登录！'
    cookieTools.deleteCookie('role')
    cookieTools.deleteCookie('step-register')
    cookieTools.deleteCookie('certificationStatus')
    localStorage.clear()
    sessionStorage.clear()
    if (config.noLoginJump) {
      location.href = '#/login'
    }
    new Vue().$bus.$emit('message-error', info)
  }
  // 需支付密码的响应拦截
  if (response.data.error) {
    let code = response.data.error.errorCode
    if (code === 650001) {
      new Vue().$bus.$emit('pay-popup', payInfo)
      return
    }
  }
  setTimeout(() => {
    new Vue().$bus.$emit('left-resize')
  }, 500)
 // 处理响应数据
  return response
}, function (error) {
 // 处理响应失败
  if (error.response.status === 403) {
    Message.error('没有权限访问该资源')
  }
  return Promise.reject(error)
})

// 删除
function removeElement (_element) {
  var _parentElement = _element.parentNode
  if (_parentElement) {
    _parentElement.removeChild(_element)
  }
}
// set page title
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.innerText
    removeElement(el)
  }
})

const isDebugmode = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebugmode
Vue.config.devtools = isDebugmode
Vue.config.productionTip = isDebugmode

/* 过滤器 end */
Vue.prototype.$yn = {}
Vue.prototype.$yn.message = {}
Vue.prototype.$yn.message.error = function (data) {
  var obj = {
    msg: '不能为空',
    type: 'error',
    icon: 'icon-flash-warn',
    show: true
  }
  obj.msg = data
  new Vue().$bus.$emit('yn-message', obj)
}
Vue.prototype.$yn.message.success = function (data) {
  var obj = {
    msg: '不能为空',
    type: 'success',
    icon: 'icon-flash-success',
    show: true
  }
  obj.msg = data
  new Vue().$bus.$emit('yn-message', obj)
}
Vue.prototype.$yn.messageBox = function (data) {
  new Vue().$bus.$emit('yn-messageBox', data)
}
// router 跳转动画
let loading = null
router.beforeEach((to, from, next) => {
  var path = to.fullPath
  // path = (path.indexOf('#') === -1) ? path : path.substring(0, path.indexOf('#'))
  path = (path.indexOf('?') === -1) ? path : path.substring(0, path.indexOf('?'))
  if (accessControl.checkAccessWhiteList(path)) { // 在白名单中
    next()
  } else { // 不在白名单中
    if (sessionStorage.userName === 'admin') { // admin路由不做限制
      next()
    } else if (accessControl.checkAccess(path) || path === '/member/register') { // 在静态资源列表中
      if (!dispatch.isRealName() && path !== '/member/register') { // 未实名且不在实名页面
        next({path: '/member/register'})
      } else { // 已实名
        if (sessionStorage.getItem('companyName') === null || typeof (sessionStorage.getItem('companyName')) === 'undefined' && config.noLoginJump) {
          next({path: '/login'}) // 未登录跳登录页
        } else {  // 已登录
          loading = Loading.service({
            fullscreen: true
          })
          next()
        }
      }
    } else { // 不在静态资源列表中
      if (sessionStorage.getItem('companyName') === null || typeof (sessionStorage.getItem('companyName')) === 'undefined' && config.noLoginJump) {
        next({path: '/login'}) // 未登录跳登录页
      } else {  // 已登录跳无权限提示页
        Message.error('没有权限访问!')
        next({path: '/noaccess'})
      }
    }
  }
})
router.afterEach(route => {
  document.getElementById('app').scrollTop = 0
  if (loading !== null) {
    loading.close()
    // 手动清除loading对象
    loading.$el && loading.$el.parentNode && loading.$el.parentNode.removeChild(loading.$el)
    loading.$destroy()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
