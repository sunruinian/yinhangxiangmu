// 流转管理公用的Api  @create: 2018-03-031
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const supplier = {
  // 待签收凭证
  getSigningVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/query/tosign', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 接收凭证
  receiveVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/receive'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 拒收凭证
  rejectVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/reject'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取待签收凭证
  getAssignVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/query/totransfer', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 转让申请
  getTransferApplyRecord: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/query/applyrecord', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 转让待审批
  getTransferToapproval: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/query/applyrtoapproval', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 转让待审批
  getTransferApprovalRecord: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/query/approvalrecord', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 凭证搜索应收凭证
  getVouchers: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/query/debtreceivable', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 凭证搜索应收付证POST /voucher/query/payableAccount
  getVoucherPay: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/voucher/query/payableAccount', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 转让凭证
  transferVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/transfer'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default supplier
