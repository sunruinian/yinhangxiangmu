// 授信管理相关服务 cl*/
import Vue from 'vue'
const vue = new Vue()
const credit = {
  myCredit: { // 企业分页查询自己的授信记录
    remote (callback, data) {
      callback = callback || function () {}
      const url = '/service/workplatform/company/amount/current'
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default credit
