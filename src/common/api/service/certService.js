import Vue from 'vue'
const vue = new Vue()
const certService = {
  // bindCert: { // 证书绑定接口
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //
  //     const result = vue.$http.put('/service/user/bind/cert', param, function (response) {
  //       if (response.data.data) {
  //         callback(response.data)
  //       }
  //     })
  //     return result
  //   }
  // },
  // addCompanyInfo: { // 完善企业信息
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.put('/service/company/subjoin', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // addPayPassword: { // 添加支付密码
  //   remote (param, callback, data) {
  //     param.payPassword = encodeURIComponent(vue.$jsEncrypt.encrypt(param.payPassword))
  //     param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/user/pay/add', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // addGyPayPassword: { // 添加GY支付密码
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/user/pay/add', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // userNameLogin: { // 用户名登录
  //   remote (data, callback, da) {
  //     console.log('param', data)
  //     callback = callback || function () {}
  //     const baseUrl = '/service/login'
  //     const url = baseUrl // +
  //     let param = ''
  //     // if (param.issuerDn === null) {
  //     param = 'username=' + data.username + '&password=' + data.password
  //     // } else {
  //     //   param = 'value=' + data.value + '&password=' + data.password + '&issuerDn=' + data.issuerDn + '&sequenceNo=' + data.sequenceNo + 'type='
  //     // }
  //
  //     const result = vue.$http.post(url, param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // getRelevanceCom: { // 获取关联企业
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const baseUrl = '/service/invite/check/'
  //     const url = baseUrl + param
  //     const result = vue.$http.get(url, function (response) {
  //       // console.log('response===>>>', response)
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // ConnectUser: {
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const baseUrl = '/service/invite/checkAssociate/'
  //     const url = baseUrl + param
  //     const result = vue.$http.get(url, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // checkUserName: { // 全局检查用户名
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const baseUrl = '/service/user/check/'
  //     const url = baseUrl + param.name
  //     if (param.name === '') {
  //       return
  //     }
  //     const result = vue.$http.get(url, param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // checkName: { // 检查用户名是否是该企业下的账号
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const baseUrl = '/service/customeruser/check/'
  //     const url = baseUrl + param.name
  //     if (param.name === '') {
  //       return
  //     }
  //     const result = vue.$http.get(url, param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // userRegister: { // 注册用户
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     param.password = encodeURIComponent(vue.$jsEncrypt.encrypt(param.password))
  //     param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
  //     const result = vue.$http.post('/service/user/register', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // userGyRegister: { // GY注册用户
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/user/register', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // getCurrentCompany: { // 获取当前企业
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.get('/service/company/current', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  supplierCert: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/company/approve/'
      const url = baseUrl + param.id
      const result = vue.$http.put(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
  // userAuthStep: { // 查询用户认证流程
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.get('/service/user/authStep', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // 企业管理
  // certCurrent: { // 查询当前用户证书列表
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/cert/current', param, function (response) {
  //       callback(response.data.data)
  //     })
  //     return result
  //   }
  // },
  // certQuery: { // 查询当前企业证书列表
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/cert/query', param, function (response) {
  //       callback(response.data.data)
  //     })
  //     return result
  //   }
  // },
  // certCreate: { // 添加证书
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/cert/create', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // updateremark: { // 修改证书备注
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/cert/updateremark', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // usercert: { // 为用户绑定证书
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/usercert/create', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // getbankaccountbygyb: { // 获取当前企业贵阳银行结算户列表
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const result = vue.$http.post('/service/bank/account/card/getbankaccountbygyb', param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // cardSetDefault: { // 设置默认使用的银行账户
  //   remote (id, callback, data) {
  //     callback = callback || function () {}
  //     let url = '/service/bank/account/card/setdefault/' + id
  //     const result = vue.$http.post(url, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // }
}

export default certService
