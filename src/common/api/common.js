// 所有模块的公共的Api  @create: 2018-01-03
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const commonDetail = {
  // 凭证详情
  getVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/' + params.id
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 凭证详情里的付款记录
  getpayRecord: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/paymenthistory/' + params.voucherId
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  getOperationLog: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/history/voucher/query'
      const url = baseUrl
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstream: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/voucher/upstream/'
      const url = baseUrl + params.id
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 流转信息
  downstream: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/voucher/downstream/'
      const url = baseUrl + params.id
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 删除凭证文件
  holdmessage: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/holdmessage/get'
      const url = baseUrl + '/' + params.voucherId
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 登陆密码的公共模块接口有两处 ,找回登陆密码没有用贵阳控件
  modifyLoginPassword: {
    remote (param, callback, data) {
      let baseUrl = '/service/user/modify/oldPwd'
      param.modifyParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.newPwd))
      if (param.modifyParam.oldPwd) {
        // baseUrl = '/service/user/modify/password'
        param.modifyParam.oldPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.oldPwd))
      }
      param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
      callback = callback || function () {}
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
    // 找回登陆密码用贵阳控件
  modifyLoginPWD: {
    remote (param, callback, data) {
      let baseUrl = '/service/user/modify/pwd'
      // param.pwdOriParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.pwdOriParam.newPwd))
      callback = callback || function () {}
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        console.log(response)
        callback(response.data)
      })
      return result
    }
  },
  checkUserName: { // 全局检查用户名
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/user/check/'
      const url = baseUrl + param.name
      if (param.name === '') {
        return
      }
      const result = vue.$http.get(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取登录企业的信息
  getCurrentCompany: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/company/current'
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  getSession: { // 证书绑定接口
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/user/get/sessionid', param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default commonDetail
