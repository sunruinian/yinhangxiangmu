// 凭证处理服务
import Vue from 'vue'
// import cookieTools from 'common/javascript/tools/cookieTools'
const vue = new Vue()
const coreCompanyVoucherService = {
  applyPayment: { // 证书绑定接口
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/payapply/lot/create', params, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default coreCompanyVoucherService
