// 认证服务类
import Vue from 'vue'
import cookieTools from 'common/javascript/tools/cookieTools'
const vue = new Vue()
const authorityService = {
  logout: { // 证书绑定接口
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/logout', param, function (response) {
        callback(response.data)
        cookieTools.deleteCookie('role')
        cookieTools.deleteCookie('step-register')
      })
      return result
    }
  },
  // superBefore: {
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.get('/service/login/superBefore', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // loginBefore: {
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.get('/service/login/before', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // onece: { // 证书绑定接口
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.get('/service/nonce', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // checkCount: { // 证书和用户名核验接口
  //   remote (param, callback, data) {
  //     // console.log('===>', param)
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/user/checkuser', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // resetPassWord: { // 重置密码接口
  //   remote (param, callback, data) {
  //     // console.log('===>', param)
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/user/reset/password', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  getSession: { // 证书绑定接口
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/user/get/sessionid', param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
  // resetNoPassWord: { // 无国密接口
  //   remote (param, callback, data) {
  //     let baseUrl = '/service/user/reset/oldPwd'
  //     // console.log('*****', vue.$jsEncrypt.encrypt(param.originParam.password))
  //     // console.log('*****!', encodeURIComponent(vue.$jsEncrypt.encrypt(param.originParam.password)))
  //     param.originParam.password = encodeURIComponent(vue.$jsEncrypt.encrypt(param.originParam.password))
  //     callback = callback || function () {}
  //     const url = baseUrl
  //     const result = vue.$http.post(url, param, function (response) {
  //       console.log(response)
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // }
}

export default authorityService
