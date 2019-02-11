// 涉及登陆  Api  @create: 2018-04-03
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const commonLogin = {
  // 登陆前获取nonce
  loginBefore: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/login/before', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  userNameLogin: { // 用户名登录
    remote (data, callback, da) {
      console.log('param', data)
      callback = callback || function () {}
      const baseUrl = '/service/login'
      const url = baseUrl // +
      let param = ''
      // if (param.issuerDn === null) {
      param = 'username=' + data.username + '&password=' + data.password
      // } else {
      //   param = 'value=' + data.value + '&password=' + data.password + '&issuerDn=' + data.issuerDn + '&sequenceNo=' + data.sequenceNo + 'type='
      // }

      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  superBefore: { // 后端控制控件接口
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/login/superBefore', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  getRelevanceCom: { // 获取关联企业,注册
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/invite/check/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        // console.log('response===>>>', response)
        callback(response.data)
      })
      return result
    }
  },
  userRegister: { // 注册用户
    remote (param, callback, data) {
      callback = callback || function () {}
      param.password = encodeURIComponent(vue.$jsEncrypt.encrypt(param.password))
      param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
      const result = vue.$http.post('/service/user/register', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  userGyRegister: { // GY注册用户
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/user/register', param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default commonLogin
