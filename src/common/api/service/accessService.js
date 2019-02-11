import Vue from 'vue'
const vue = new Vue()
const certService = {
  //
  updateRoleAccess: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.post('/service/role/privilege/save', param, response => {
        callback(response.data)
      })
      return result
    }
  },

  getAccessByRoleCode: {
    remote (params, callback, data) {
      callback = callback || function () {}
      const result = vue.$http.get('/service/role/privilege/' + params.code, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  // 创建静态资源
  roleList: {
    remote (param, callback, data) {
      const url = '/service/role/list'
      const result = vue.$http.get(url, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  // 获取code
  getPrivilegeCode: {
    remote (param, callback, data) {
      const url = '/service/privilege/generate/code/' + param.parentCode
      const result = vue.$http.get(url, {}, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  // 创建静态资源
  createPrivilege: {
    remote (param, callback, data) {
      const url = '/service/privilege/create'
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  // 删除静态资源
  deletePrivilege: {
    remote (param, callback, data) {
      const url = '/service/privilege/delete/' + param.code
      const result = vue.$http.post(url, {}, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  // 更新静态资源
  updataPrivilege: {
    remote (param, callback, data) {
      const url = '/service/privilege/update'
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  // 获取静态资源信息
  getPrivilege: {
    remote (param, callback, data) {
      callback = callback || function () {}
      const url = '/service/privilege/get/' + param.code
      const result = vue.$http.get(url, {}, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  getPrivilegeTree: { // 获取关联企业
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/privilege/tree'
      const url = baseUrl
      const result = vue.$http.get(url, {}, function (response) {
        callback(response.data)
      })
      return result
    }
  },
  getBindRelation: { // 获取关联企业
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/privilege/get/resource/'
      const url = baseUrl + param.privilegeCode
      const result = vue.$http.get(url, {}, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  saveBindRelation: { // 获取关联企业
    remote (param, callback, data) {
      callback = callback || function () {}
      const baseUrl = '/service/privilege/resource/save'
      const url = baseUrl
      const result = vue.$http.post(url, param, function (response) {
        callback(response.data)
      })
      return result
    }
  },

  // 所有的接口资源
  getAllApiResource: { // 添加支付密码
    remote (param, callback, data) {
      const result = vue.$http.post('/service/resource/list/api', {}, function (response) {
        callback(response.data)
      })
      return result
    }
  }
}

export default certService
