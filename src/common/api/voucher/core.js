// 核心企业-凭证Api  @create: 2018-01-03
import Vue from 'vue'
// import moneyTools from 'common/javascript/tools/moneyTools'

const vue = new Vue()
const core = {
  getVoucherForDelete: { // 证书绑定接口
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/template/voucher/queryForDelete', params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取登录企业的授信信息
  getCurrentCompanyCredit: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/credit/current'
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取暂存凭证
  getScratchedVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/query/scratched'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 编辑凭证
  editSave: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/save'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 提交审批
  applyApproval: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/commit'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 修改提交
  saveandcommit: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/saveandcommit'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 删除凭证
  delete: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/delete'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 已删除凭证数据
  getDeletedVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/query/deleted'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 已tijiao凭证数据 待审批凭证
  getSubmittedVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/query/commited'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 待审批凭证
  getToapproveVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/query/toapprove'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取付款函
  paymentLetter: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/paymentletter/create'
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 已审批凭证
  getApprovedVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/query/approved'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  //  审批退回列表
  getReturnedVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/query/bounced'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  paymentUpdate: { // 付款函甲方更新接口
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/paymentletter/update'
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // approve
  approveVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/approve'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // reject 退回
  rejectVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/rejectvoucher'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  applyPass: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/applypass'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  applyReject: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/applyreject'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  returnedVoucher: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/voucher/query/rejected'
      const result = vue.$http.post(url, params, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  // 获取核心企业关联的供应商
  supplierList: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/supplier/relation/query', param, response => {
        Array.map(response.data.data, function (item) {
          item.value = item.name
        })
        callback(response.data.data)
      })
      return result
    }
  },
  // 获取当前企业所有子账户信息
  subAccountList: {
    remote (param, callback, data) {
      callback = callback || function () {}
      // 贵阳银行为实体账户，用/bank/account/card/list
      const result = vue.$http.post('/service/bank/account/card/list', param, response => {
        callback(response.data.data)
      })
      return result
    }
  },
  // 获取公司信息
  getCompanyById: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const url = '/service/company/' + params.id
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default core
