// 核心企业客户管理Api  @create: 2018-03-29
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const core = {
  downstreamList: {  // 获取上游供应商列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/list', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstreamInfo: { // 获取上游供应商账户信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/supplier/relation/get/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstreamAuth: { // 获取上游供应商实名信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/supplier/relation/get/auth/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  createdUser: { // 创建用户
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstreamList: {  // 获取下游供应商列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/downstream/list', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstreamAuth: { // 获取下游供应商实名信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/supplier/relation/get/downstream/auth/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  createdConnect: { // 核心企业 客户管理 创建关联
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/associate', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  inviteCore: { // 创建供应商
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/invite/core', param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default core
