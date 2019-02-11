/**
* 核心企业/供应商 - 企业管理Api
* @create 2018-03-13
* @author: cl
*/

import Vue from 'vue'
const vue = new Vue()

const stream = {
  baseinfo: { // 条件查询全网企业的基础信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/company/baseinfo', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstreamList: {  // 条件查询上游企业列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/list', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstreamRelation: { // 确认/拒绝该上游关系的建立（对手企业为当前企业的上游企业）
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/modify/upstream/relation/status', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstream: { // 关联上游企业
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/associate/upstream', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstreamInfo: { // 获取上游供应商账户信息
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
  upstreamAuth: { // 获取上游供应商实名信息
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
  upstreamSon: { // 获取上游供应商子账户信息列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/supplier/relation/get/account/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  upstreamInvite: { // 普通企业邀请上游企业注册
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstreamList: {  // 条件查询下游供应商列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/downstream/list', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstreamRelation: { // 确认/拒绝该下游关系的建立（对手企业为当前企业的下游企业）
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/modify/downstream/relation/status', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstream: { // 关联下游企业
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/associate/downstream', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstreamInfo: { // 获取下游供应商账户信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/supplier/relation/get/downstream/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstreamAuth: { // 获取下游供应商实名信息
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
  downstreamSon: { // 获取下游供应商子账户信息列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/supplier/relation/get/downstream/account/'
      const url = baseUrl + param
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  downstreamInvite: { // 普通企业邀请下游企业注册
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/invite/downstream', param, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default stream
