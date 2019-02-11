/*eslint-disable */
import cfca from 'common/javascript/features/cfca'
import config from 'common/config/config'
import merge from 'webpack-merge'
import Vue from 'vue'
const form = {
  name: 'table',
  data: {
    regular: {
      password: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]]+$)[~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]0-9A-Za-z]{8,20}$/, // 8~20位数字,英文,符号至少两种组合的字符
      passwordCharacter: /^[~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]0-9A-Za-z]*$/,
      userName: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{4,16}$/, // 字母和数字组合
      phone: /^1\d{10}$/,
      email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
      chinese: /^[\u4e00-\u9fa5]{0,}$/,
      includChinese: /[\u4e00-\u9fa5]+/,
      idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      socialCode: /^[a-zA-Z0-9]{18}$/, // 18位数字或字母
      taxCode: /^[a-zA-Z0-9]{15,18}$/,
      num: /^\d+$/,
      word: /^[a-zA-Z]*$/,
      mix: /^[0-9a-zA-Z]*$/,
      nonNum: /\d+/,
      nonWord: /[a-zA-Z]+/,
      contactNo: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{1,30}$/,
      cash: /^\d+(\.\d{1,2})?$/, // 金额保留两位小数
      space: /\s+/, // 空格校验
      wordNum: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/ // 数字，字母，汉字
    },
    uploadPath: 'service/file/upload'
  },
  methods: {
    sign(source, isBase64, selectedAlg, signType) {
      // 签名 PKCS#7 Attach PKCS#7 Detach
      return cfca.defaultSign(source, isBase64)
    },
    clearForm(object) {
      for (var key in object) {
        let temp = object[key]
        if (typeof temp === 'string') {
          temp = ''
        }
      }
      return object
    },
    beforeImageUpload(file) {
      const fileType = ['image/jpeg', 'image/png']
      const fileMatch = fileType.indexOf(file.type) !== -1
      const isLt3M = file.size / 1024 / 1024 < 30
      if (!fileMatch) {
        new Vue().$message.error('格式要求 jpg jpeg png')
      }
      if (!isLt3M) {
        new Vue().$message.error('文件大小不能超过 30MB')
      }
      return fileMatch && isLt3M
    },
    getImagePath(id) {
      return config.imgDownUrl + id
    },

    // form所用正则校验 start  cl**/
    isLoginName(value, callback) {
      // 登录账号
      if (value.length < 4 || value.length > 16) {
        callback('登录账号长度为4~16位')
      }
      if (!form.data.regular.userName.test(value)) {
        callback('登录账号应为数字与字母组合')
      }
      callback()
    },
    isUserName(value, callback) {
      // 用户名
      if (value.length < 4 || value.length > 16) {
        callback('用户名长度为4-16个字')
      }
      if (!form.data.regular.userName.test(value)) {
        callback('用户名应为数字与字母组合')
      }
      callback()
    },
    isPassword(value, callback) {
      // 登录密码
      if (value === '' || value === null) {
        return
      }
      if (value.length < 8 || value.length > 20) {
        callback('密码长度为8~20位')
      }
      for (var i = 0; i < value.length; i++) {
        if (!form.data.regular.passwordCharacter.test(value[i])) {
          callback('密码中使用了非法字符，请使用a-z、A-Z、0-9和常用英文标点符号')
        }
      }
      if (!form.data.regular.password.test(value)) {
        callback('密码应含数字、字母和字符中最少两种的组合')
      }
      callback()
    },
    phoneAndEmail(value, callback) {
      // 手机或邮箱
      let reg = /^1\d{10}$|^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的联系方式'))
      }
      callback()
    },
    isPhone(value, callback) {
      // 手机号校验
      const reg = form.data.regular.phone.test(value)
      if (!reg) {
        callback(new Error('请填写正确的手机号'))
      }
      callback()
    },
    isEmail(value, callback) {
      // 邮箱校验
      let reg = form.data.regular.email.test(value)
      if (!reg) {
        callback(new Error('请输入正确的邮箱地址'))
      }
      callback()
    },
    isCardNo(value, callback) {
      // 身份证号校验
      let reg = form.data.regular.idCard.test(value)
      if (!reg) {
        callback(new Error('身份证号码格式错误'))
      }
      callback()
    },
    isSocialCode(value, callback) {
      // 统一社会信用证代码校验
      let chinese = form.data.regular.includChinese.test(value)
      let reg = form.data.regular.socialCode.test(value)
      if (chinese) {
        callback(new Error('不可输入汉字'))
      }
      if (!reg) {
        callback(new Error('请输入正确的社会统一信用证代码'))
      }
      callback()
    },
    isTaxCode(value, callback) {
      // 税务登记号
      return form.data.regular.taxCode.test(value)
    },
    // form所用正则校验 end **/

    // 为null,'',undefined处理函数
    noValue(value) {
      if (value === '' || value === null || value === undefined) {
        return true
      } else {
        return false
      }
    }
  }
}
function formExtends(object) {
  let oldData = object.data()
  let newData = merge(oldData, form.data)
  object.data = function() {
    return newData
  }
  object.methods = merge(object.methods, form.methods)
  return object
}

export default formExtends
