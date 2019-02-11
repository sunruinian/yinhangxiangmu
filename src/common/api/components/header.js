import Vue from 'vue'
const vue = new Vue()
const header = { // 消息通知
  querylist: { // 消息列表
    remote (callback, data) {
      callback = callback || function () {}
      const url = '/service/message/querylist'
      const result = vue.$http.post(url, function (res) {
        callback(res.data)
      })
      return result
    }
  },
  readall: { // 全部已读
    remote (callback, data) {
      callback = callback || function () {}
      const url = '/service/message/readall'
      const result = vue.$http.get(url, function (res) {
        callback(res.data)
      })
      return result
    }
  },
  read: { // 单条信息
    remote (param, callback, data) {
      callback = callback || function () {}
      const url = '/service/message/read/' + param.id
      const result = vue.$http.get(url, function (res) {
        callback(res.data)
      })
      return result
    }
  },
  longhold: {
    remote (callback, data) {
      callback = callback || function () {}
      const url = '/service/message/longhold'
      const result = vue.$http.get(url, function (res) {
        callback(res.data)
      })
      return result
    }
  },
  readed: {  // 获取上游供应商列表
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/message/read/{id}', param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  allNews: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/message/query/paging/list'
      const result = vue.$http.post(url, params, function (res) {
        callback(res.data)
      })
      return result
    }
  },
  allRead: { // 全部已读
    remote (callback, data) {
      callback = callback || function () {}
      const url = '/service/message/readall'
      const result = vue.$http.get(url, function (res) {
        callback(res.data)
      })
      return result
    }
  }
}
export default header
