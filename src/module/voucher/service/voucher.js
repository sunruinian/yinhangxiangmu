// 凭证管理-js @create: 2017-11-29*/

import config from '../../../../static/js/config'
import Vue from 'vue'

const voucherJS = {
  // 获取文件后缀名
  getFileSuffix (fileName) {
    let arr = fileName.split('.')
    return arr[arr.length - 1]
  },
  // 文件上传前钩子函数
  FileBeforeUpload (file, fileList) {
    let type = voucherJS.getFileSuffix(file.name)
    const fileType = ['pdf', 'jpg', 'png', 'jpeg', 'zip', 'rar']
    const fileMatch = (fileType.indexOf(type) !== -1)
    const isLt3M = (file.size / 1024 / 1024 < config.fileSize)
    if (!fileMatch) {
      new Vue().$message.error('格式错误')
      // new Vue().$message.error('格式要求pdf、jpg、png、jpeg、zip、rar')
    }
    if (!isLt3M) {
      new Vue().$message.error('文件大小不能超过 ' + config.fileSize + 'MB')
    }
    return fileMatch && isLt3M
  }
}

export default voucherJS
