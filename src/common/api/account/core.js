// 账户管理Api  @create: 2018-03-29
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const core = {
  // 查询当前企业银行卡
  queryBank: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const url = '/service/bank/account/card/query'
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  loadBank: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const url = '/service//bank/account/card/getbankaccountbygyb/freshen'
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 查询银行账号是否处于激活状态
  queryActive: {
    remote (id, callback, data) {
      callback = callback || function () {}
      const url = '/service/bank/account/card/activate/' + id
      const result = vue.$http.post(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  updateremark: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const url = '/service/bank/account/card/updateremark'
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  queryDetail: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/bank/account/card/get/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default core
