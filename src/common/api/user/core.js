// 信息管理Api  @create: 2018-03-29
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const core = {
  // 系统账户信息
  getSysInfo: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const url = '/service/user/current'
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取供应商实名信息
  getRealName: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/company/auth/current'
      const url = baseUrl
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取协议列表
  getProtocolList: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/user/contract/list'
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 企业管理
  certCurrent: { // 查询当前用户证书列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/cert/current', param, function (response) {
        callback(response.data.data)
      })
      return result
    }
  }
}

export default core
