import config from 'common/config/config'
import tools from 'common/javascript/tools/tools'
import stringTools from 'common/javascript/tools/stringTools'
import moneyTools from 'common/javascript/tools/moneyTools'
import dateTools from 'common/javascript/tools/dateTools'
import cookieTools from 'common/javascript/tools/cookieTools'
import errorCode from 'common/config/errorCode'
import Vue from 'vue'
import Axios from 'axios'
// 添加工具
Vue.prototype.$tools = tools
Vue.prototype.$stringt = stringTools
Vue.prototype.$moneyt = moneyTools
Vue.prototype.$datet = dateTools
Vue.prototype.$cookie = cookieTools

Vue.$tools = tools
Vue.$stringt = stringTools
Vue.$moneyt = moneyTools
Vue.$datet = dateTools
Vue.$cookie = cookieTools

Vue.prototype.$vue = Vue// 挂在组件工具

let isLogout = false
function showError (response, _this) {
  if (!response || !response.data || !response.data.error) return true
  const isTrue = response.data.success
  const code = response.data.error.errorCode
  let info = {
    message: ''
  }
  if (!isTrue && code === 1501 || code === 501011) { // 1501不提示
    return true
  }
  if (!isTrue && code === 900001 || code === 900002 || code === 900003 || code === 301002) { // 111001-邀请码不存在； 111002-邀请码过期 ;301001-不能关联其他企业
    return true
  }
  if (!isTrue && code === 660037 || code === 660042 || code === 660043) {
    new Vue().$yn.messageBox({
      type: 'warn',
      icon: 'icon-msg-warn',
      title: errorCode.codeAndMessage[code],
      msg: '',
      leftBtn: '',
      rightBtn: '好'
    })
    return false
  }
  if (!isTrue && code === 620002) {
    // info.message = response.data.error.errorMessage
    // new Vue().$bus.$emit('message-error', info)// 获取授信信息失败
    return true
  }
  if (code === 500401 && !isLogout) { // session过期异常处理
    info.message = response.data.error.errorMessage
    isLogout = true
    cookieTools.deleteCookie('role')
    cookieTools.deleteCookie('step-register')
    cookieTools.deleteCookie('certificationStatus')
    localStorage.clear()
    sessionStorage.clear()
    if (config.noLoginJump) {
      location.href = '/'
    }
    return false
  }
  if (!isTrue && code === 501003 || code === 501004 || code === 501010) { // 用户名或密码错误
    info.message = errorCode.codeAndMessage[code]
    new Vue().$bus.$emit('dialog-error', info)
    return false
  }
  if (!isTrue && code === 660017) { // 虚账户不存在
    info.message = errorCode.codeAndMessage[code]
    new Vue().$bus.$emit('createSubAccount-error', info)
    return false
  }
  if (!isTrue && code === 630019) {
    return true
  }
  if (!isTrue && code !== 5000) { // 非系统级别的错误
    info.message = response.data.error.errorMessage
    new Vue().$bus.$emit('message-error', info)
    return false
  }

  if (!isTrue && code === 5000) { // 系统级别的错误！
    info.message = '系统错误！'
    new Vue().$bus.$emit('message-error', info)
    return false
  }

  return false
}
Vue.prototype.$http = {
  get: function (url) {
    const me = this
    const length = arguments.length
    let callback = function () {}
    let error = function () {}
    let data = {}

    if (length === 4) { // 参数包含错误方法
      error = arguments[3]
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 3) { // 参数不包含错误方法
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 2) { // 参数包含参数对象
      callback = arguments[1]
    } else {
      throw new Error('参数个数错误！')
    }

    // url += '?rand=' + Math.random()
    data.ts = new Date().getTime()
    let instance = Axios.get(url, {params: data, headers: {'Cache-Control': 'no-cache, no-store', 'Expires': '-1'}})
    .then(function (response) {
      // 处理error
      if (showError(response, me)) {
        callback(response)
      }
    })
    .catch(function (response) {
      error(response)
    })
    return instance
  },
  post: function (url) {
    const length = arguments.length
    let callback = function () {}
    let error = function () {}
    let data = {}

    if (length === 4) { // 参数包含错误方法
      error = arguments[3]
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 3) { // 参数不包含错误方法
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 2) { // 参数包含参数对象
      callback = arguments[1]
    } else {
      throw new Error('参数个数错误！')
    }

    let instance = Axios.post(url, data, {headers: {}})
    .then(function (response) {
      // 处理error
      if (showError(response)) {
        callback(response)
      }
    })
    .catch(function (response) {
      error(response)
    })
    return instance
  },
  put: function (url) {
    const length = arguments.length
    let callback = function () {}
    let error = function () {}
    let data = {}

    if (length === 4) { // 参数包含错误方法
      error = arguments[3]
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 3) { // 参数不包含错误方法
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 2) { // 参数包含参数对象
      callback = arguments[1]
    } else {
      throw new Error('参数个数错误！')
    }

    let instance = Axios.put(url, data)
    .then(function (response) {
      // 处理error
      if (showError(response)) {
        callback(response)
      }
    })
    .catch(function (response) {
      error(response)
    })
    return instance
  },
  delete: function (url) {
    const length = arguments.length
    let callback = function () {}
    let error = function () {}
    let data = {}

    if (length === 4) { // 参数包含错误方法
      error = arguments[3]
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 3) { // 参数不包含错误方法
      callback = arguments[2]
      data = arguments[1]
    } else if (length === 2) { // 参数包含参数对象
      callback = arguments[1]
    } else {
      throw new Error('参数个数错误！')
    }

    let instance = Axios.delete(url, {params: data})
    .then(function (response) {
      // 处理error
      if (showError(response)) {
        callback(response)
      }
    })
    .catch(function (response) {
      error(response)
    })
    return instance
  }
}
function constract () {
}
export default constract
