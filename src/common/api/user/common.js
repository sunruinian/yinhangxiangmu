// 客户管理上下游公用的Api  @create: 2018-01-03
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const common = {
  modifyPayPWD: {
    // 使用gy控件的支付密码重置方法
    remote (param, callback, data) {
      let baseUrl = '/service/user/pay/reset/paypwd'
      // param.pwdOriParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.pwdOriParam.newPwd))
      callback = callback || function () {}
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  modifyPayPassword: {
    // 没有使用gy控件的支付密码重置方法
    remote (param, callback, data) {
      param.modifyParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.newPwd))
      param.modifyParam.oldPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.oldPwd))
      param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
      callback = callback || function () {}
      const baseUrl = '/service/user/pay/modify/oldPwd'
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  }

}

export default common
