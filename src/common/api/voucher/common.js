// 凭证管理公用的Api  @create: 2018-01-03
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const common = {
  // 获取凭证编号
  getVoucherNo: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/voucher/no', function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default common
