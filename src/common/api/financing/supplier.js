// 流转管理公用的Api  @create: 2018-03-031
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const supplier = {
  voucherQuery: { // 融资列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/financing/info/query', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  voucherDetail: { // 融资凭证的详情
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/voucher/financing/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 凭证融资-融资
  bankQuery: { // 贷款方列表
    remote (callback, data) {
      callback = callback || function () {}
      const url = '/service/financing/info/company/query'
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  financingCreate: { // 创建融资
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/financing/info/create', param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default supplier
