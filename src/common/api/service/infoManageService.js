import Vue from 'vue'
const vue = new Vue()
const infoManageService = {
  // 系统账户信息
  // getSysInfo: {
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const url = '/service/user/current'
  //     const result = vue.$http.get(url, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // 获取供应商实名信息
  // getRealName: {
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const baseUrl = '/service/company/auth/current'
  //     const url = baseUrl
  //     const result = vue.$http.get(url, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // 获取协议列表
  // getProtocolList: {
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const baseUrl = '/service/user/contract/list'
  //     const url = baseUrl
  //     const result = vue.$http.post(url, param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // 获取证书信息
  getCertInfo: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/user/verify/current'
      const url = baseUrl
      const result = vue.$http.get(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
  // // 找回密码用贵阳控件
  // modifyLoginPWD: {
  //   remote (param, callback, data) {
  //     let baseUrl = '/service/user/modify/pwd'
  //     // param.pwdOriParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.pwdOriParam.newPwd))
  //     callback = callback || function () {}
  //     const url = baseUrl
  //     const result = vue.$http.post(url, param, function (response) {
  //       console.log(response)
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
    // 找回密码没有用贵阳控件
  // modifyLoginPassword: {
  //   remote (param, callback, data) {
  //     let baseUrl = '/service/user/modify/oldPwd'
  //     param.modifyParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.newPwd))
  //     if (param.modifyParam.oldPwd) {
  //       // baseUrl = '/service/user/modify/password'
  //       param.modifyParam.oldPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.oldPwd))
  //     }
  //     param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
  //     callback = callback || function () {}
  //     const url = baseUrl
  //     const result = vue.$http.post(url, param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // modifyPayPWD: {
  //   // 使用gy控件的支付密码重置方法
  //   remote (param, callback, data) {
  //     let baseUrl = '/service/user/pay/reset/paypwd'
  //     // param.pwdOriParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.pwdOriParam.newPwd))
  //     callback = callback || function () {}
  //     const url = baseUrl
  //     const result = vue.$http.post(url, param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // modifyPayPassword: {
  //   remote (param, callback, data) {
  //     param.modifyParam.newPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.newPwd))
  //     param.modifyParam.oldPwd = encodeURIComponent(vue.$jsEncrypt.encrypt(param.modifyParam.oldPwd))
  //     param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
  //     callback = callback || function () {}
  //     const baseUrl = '/service/user/pay/modify/oldPwd'
  //     const url = baseUrl
  //     const result = vue.$http.post(url, param, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // cacheSubjoin: {  // 缓存企业信息
  //   remote (param, callback, data) {
  //     let params = {
  //       address: param.address,
  //       businessFileId: param.businessFileId,
  //       city: param.city,
  //       // contactFileId: param.contactFileId,
  //       contactName: param.contactName,
  //       contactPhone: param.contactPhone,
  //       corpCardDate: param.corpCardDate,
  //       corpCardId: param.corpCardId,
  //       corpCardType: param.corpCardType,
  //       corpFileId: param.corpFileId,
  //       corpName: param.corpName,
  //       // reportFileId: param.reportFileId,
  //       otherFileId: param.otherFileId,
  //       taxCode: param.taxCode,
  //       type: param.type
  //     }
  //     params.type = (params.type === '' ? -1 : params.type) // 防止数据库对''有默认转换
  //     params.corpCardType = (params.corpCardType === '' ? -1 : params.corpCardType) // 防止数据库对''有默认转换
  //     callback = callback || function () {}
  //     const baseUrl = '/service/company/cache/subjoin'
  //     const url = baseUrl
  //     const result = vue.$http.post(url, params, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // },
  // getSubjoin: { // 获取企业信息
  //   remote (param, callback, data) {
  //     callback = callback || function () {}
  //     const url = '/service/company/cache/get/subjoin'
  //     const result = vue.$http.get(url, function (response) {
  //       callback(response.data)
  //     })
  //     return result
  //   }
  // }
}

export default infoManageService
