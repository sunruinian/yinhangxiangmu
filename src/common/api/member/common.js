// 客户管理上下游公用的Api  @create: 2018-01-03
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const commonMember = {
  onece: { // 证书绑定接口
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/nonce', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  checkCount: { // 证书和用户名核验接口
    remote (param, callback, data) {
      // console.log('===>', param)
      callback = callback || function () {}
      const result = vue.$http.post('/service/user/checkuser', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  resetNoPassWord: { // 无国密接口重置密码
    remote (param, callback, data) {
      let baseUrl = '/service/user/reset/oldPwd'
      // console.log('*****', vue.$jsEncrypt.encrypt(param.originParam.password))
      // console.log('*****!', encodeURIComponent(vue.$jsEncrypt.encrypt(param.originParam.password)))
      param.originParam.password = encodeURIComponent(vue.$jsEncrypt.encrypt(param.originParam.password))
      callback = callback || function () {}
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        console.log(response)
        callback(response.data)
      })
      return result
    }
  },
  resetPassWord: { // 重置密码接口
    remote (param, callback, data) {
      // console.log('===>', param)
      callback = callback || function () {}
      const result = vue.$http.post('/service/user/reset/password', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  bindCert: { // 证书绑定接口
    remote (param, callback, data) {
      callback = callback || function () {}

      const result = vue.$http.put('/service/user/bind/cert', param, function (response) {
        if (response.data.data) {
          callback(response.data)
        }
      })
      return result
    }
  },
  addCompanyInfo: { // 完善企业信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.put('/service/company/subjoin', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  cacheSubjoin: {  // 缓存企业信息
    remote (param, callback, data) {
      let params = {
        address: param.address,
        businessFileId: param.businessFileId,
        city: param.city,
        // contactFileId: param.contactFileId,
        contactName: param.contactName,
        contactPhone: param.contactPhone,
        corpCardDate: param.corpCardDate,
        corpCardId: param.corpCardId,
        corpCardType: param.corpCardType,
        corpFileId: param.corpFileId,
        corpName: param.corpName,
        // reportFileId: param.reportFileId,
        otherFileId: param.otherFileId,
        taxCode: param.taxCode,
        type: param.type
      }
      params.type = (params.type === '' ? -1 : params.type) // 防止数据库对''有默认转换
      params.corpCardType = (params.corpCardType === '' ? -1 : params.corpCardType) // 防止数据库对''有默认转换
      callback = callback || function () {}
      const baseUrl = '/service/company/cache/subjoin'
      const url = baseUrl
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  getSubjoin: { // 获取企业信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const url = '/service/company/cache/get/subjoin'
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  addPayPassword: { // 添加支付密码
    remote (param, callback, data) {
      param.payPassword = encodeURIComponent(vue.$jsEncrypt.encrypt(param.payPassword))
      param.pubKey = encodeURIComponent(localStorage.getItem('pubKey'))
      callback = callback || function () {}
      const result = vue.$http.post('/service/user/pay/add', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  addGyPayPassword: { // 添加GY支付密码
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/user/pay/add', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  userAuthStep: { // 查询用户认证流程
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/user/authStep', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  getbankaccountbygyb: { // 获取当前企业贵阳银行结算户列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/bank/account/card/getbankaccountbygyb', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  cardSetDefault: { // 设置默认使用的银行账户
    remote (id, callback, data) {
      callback = callback || function () {}
      let url = '/service/bank/account/card/setdefault/' + id
      const result = vue.$http.post(url, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default commonMember
