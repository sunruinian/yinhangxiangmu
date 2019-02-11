<template>
    <div class="b-voucher-tradeinfo scroll">
      <div class="tit">
        <p style="display: inline-block;"><span class="require">*</span>1、合同信息<span class="c666">（添加的合同数量不可超过5条）</span></p>
        <span class="contractInfo cbubi" @click="dialogVisible"> <span><span>+</span></span> 合同信息</span>
      </div>

      <table class="table-r table-th-block table-data" >
        <thead>
          <tr>
            <th width="28%">基础合同编号</th>
            <th width="28%">交易商品信息</th>
            <th width="28%">合同附件</th>
            <th width="16%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formShowArr" v-if='formShowArr.length !== 0'>
            <td>{{item.name}}</td>
            <td>{{item.content}}</td>
            <td><a :href="item.url">{{item.fileName}}</a></td>
            <td><el-button @click.native.prevent="deleteRow(item.flagId)" type="text" size="small">删除</el-button></td>
          </tr>
          <tr v-if="formShowArr.length === 0">
            <td align="center" colspan="4">您还没有添加合同</td>
          </tr>
        </tbody>
      </table>

      <div class="tit">
        <p>2、附件上传<span class="c666">（支持大小≤30M，且格式为pdf、jpg、png、jpeg、zip、rar的文件）</span></p>
      </div>

      <el-form class="upload-form" ref="formField2" :rules="rules" :model="formField2">
        <el-form-item class="contract-info" label="发票信息" label-width="120px">
          <el-upload
            action="service/file/upload"
            name="multipartFile"
            :on-success="invoiceFileHandleSuccess"
            :on-remove="invoiceFileHandleRemove"
            :on-preview="download"
            :before-upload="invoiceFileBeforeUpload"
            :file-list="oldInvoiceFiles">
            <div class="box">{{invoiceFileUploadTip}}</div>
            <el-button size="medium" type="primary">浏览</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
          <el-form-item class="contract-info" label="其他信息" label-width="120px">
            <el-upload
              action="service/file/upload"
              name="multipartFile"
              :on-success="otherFileHandleSuccess"
              :on-remove="otherFileHandleRemove"
              :on-preview="download"
              :before-upload="otherFileBeforeUpload"
              :file-list="oldOtherFiles">
              <div class="box">{{otherFileUploadTip}}</div>
              <el-button size="medium" type="primary">浏览</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-form-item>
      </el-form>

      <div v-show="dialogFormVisible">
        <el-dialog title="添加合同信息" :visible.sync="dialogFormVisible" size="mini">
          <el-form ref="formField2" :rules="rules" :model="formField2">
            <div class="add-contact">
              <el-form-item label="基础合同编号" label-width="120px" prop="contractNo" :class="{'is-required': true}">
                  <el-input style="width:369px"
                    placeholder="请输入不超过100字符的基础合同编号"
                    v-model="formField2.contractNo">
                  </el-input>
              </el-form-item>
              <el-form-item label="交易商品信息" label-width="120px" prop="goodsInfo" :class="{'is-required': true}">
                <el-input style="width:369px"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入不超过100字符的交易商品信息"
                  v-model="formField2.goodsInfo">
                </el-input>
              </el-form-item>
              <el-form-item class="contract-info" label="合同附件" :class="disabled ? 'disabled' : ''" label-width="120px">
                <el-upload
                  action="service/file/upload"
                  name="multipartFile"
                  :on-success="contractFileHandleSuccess"
                  :on-remove="contractFileHandleRemove"
                  :on-preview="download"
                  :before-upload="contractFileBeforeUpload"
                  :file-list="ContractFiles"
                  :disabled="disabled">
                  <div class="box"></div>
                  <el-button size="medium" type="primary">浏览</el-button>
                  <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
                <p class="c999" style="font-size:12px; line-height:16px;">支持大小≤30M，且格式为pdf、jpg、png、jpeg、zip、rar的文件</p>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="countVoucher" @click="cancel">取 消</el-button>
            <el-button id="addVoucher" class="addVoucher"  @click="add">添加  </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script type="text/javascript">
import tools from 'common/javascript/tools/tools'
// import 'common/sass/module/component.scss'
import arrayTools from 'common/javascript/tools/arrayTools'
import voucherJS from 'src/module/voucher/service/voucher'

export default {
  name: 'voucher-edit-tradeInfo',
  props: {
    vouId: null
  },
  data () {
    return {
      voucherId: null,
      tradeGoods: null,
      oldContractFiles: [],
      oldInvoiceFiles: [],
      oldOtherFiles: [],
      contractFiles: [],
      invoiceFiles: [],
      otherFiles: [],
      delOldFile: [],
      uploadFile: [], // 用户最终需要上传的新文件列表（暂无用）
      deletedFile: [], // 用户最终要删除的文件
      contractNoFlag: false,
      dialogFormVisible: false,
      is_Delete: null,
      goodsInfoFlag: false,
      disabled: false,
      formShowArr: [],
      formSubmitArr: [],
      flagId: 0,
      invoiceFileUploadTip: '',
      otherFileUploadTip: '',
      formField2: {
        deleteFlag: false,
        detailId: null,
        contractNo: null,
        goodsInfo: null
      },
      rules: {
        contractNo: [
          // {required: true, message: '必须填写', trigger: 'blur'}, // 不能使用该语句，因为要告知父级及时更新状态
          {
            validator: (rule, value, callback) => {
              if (!value) {
                // 实现上面注释的 required 功能
                this.contractNoFlag = false
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('必须填写'))
              } else if (value && value.length > 100) {
                this.contractNoFlag = false
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('编号超出100字符'))
              } else if (value.trim() === '') {
                this.contractNoFlag = false
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('不得填写空白信息'))
              } else {
                this.contractNoFlag = true
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback()
              }
            },
            trigger: 'blur' }
        ],
        goodsInfo: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                // 实现上面注释的 required 功能
                this.goodsInfoFlag = false
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('必须填写'))
              } else if (value && value.length > 100) {
                this.goodsInfoFlag = false
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('商品信息超出100字符'))
              } else if (value.trim() === '') {
                this.goodsInfoFlag = false
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('不得填写空白信息'))
              } else {
                this.goodsInfoFlag = true
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback()
              }
            },
            trigger: 'blur' }
        ]
      }
    }
  },
  beforeMount () {
    const self = this
    self.oldFiles = {}
    this.$bus.$on('voucher-tradeinfo-fiels', info => {
      self.oldFiles = info
      for (var i = 0; i < self.oldFiles.length; i++) {
        if (info[i].detail.fileType === 0 && info[i].detail.name !== '') {
          var formObject = {}
          formObject.name = info[i].detail.name
          formObject.content = info[i].detail.content
          formObject.fileName = info[i].name
          formObject.fileId = info[i].fileId
          formObject.detailId = info[i].detail.detailId
          formObject.isDelete = 0
          formObject.flagId = this.flagId ++
          formObject.url = tools.getUrl() + '/service/voucher/file/voufile/download?fileId=' + formObject.fileId + '&type=VOUCHER&voucherId=' + this.voucherId
          this.formShowArr.push(formObject)
          this.formSubmitArr.push(formObject)
        }
      }
      self.getOldFiles()
    })
    this.$bus.$on('contractStatus', info => {
      this.$bus.$emit('contractStatusCallBack', this.formShowArr.length === 0)
    })
  },
  mounted () {
    this.voucherId = this.vouId
  },
  methods: {
    getOldFiles () {
      var i = 0
      for (i; i < this.oldFiles.length; i++) {
        if (this.oldFiles[i].type === 0) {
          this.oldContractFiles.push(this.oldFiles[i])
          // this.contractFiles.push(this.oldFiles[i].fileId)
        } else if (this.oldFiles[i].type === 1) {
          this.oldInvoiceFiles.push(this.oldFiles[i])
          // this.invoiceFiles.push(this.oldFiles[i].fileId)
        } else if (this.oldFiles[i].type === 2) {
          this.oldOtherFiles.push(this.oldFiles[i])
          // this.otherFiles.push(this.oldFiles[i].fileId)
        }
      }
      this.$bus.$emit('voucher-tradeinfo', this.files())
    },
    // 合同信息文件上传
    contractFileBeforeUpload (file, fileList) {
      return voucherJS.FileBeforeUpload(file, fileList)
    },
    // 成功 - 合同信息文件上传
    contractFileHandleSuccess (response, file, fileList) {
      // this.uploadFile.push(file.response.data)
      this.contractFiles.push(response.data)
      this.formField2.fileId = response.data
      this.formField2.fileName = file.name
      this.disabled = true
      this.$bus.$emit('voucher-tradeinfo', this.files())
    },
    // 移除 - 合同信息文件上传
    contractFileHandleRemove (file, fileList) {
      if (!file) return
      if (file.response) {
        // 新上传文件的移除
        this.removeByValue(this.contractFiles, file.response.data)
        this.formField2.fileName = ''
        this.ContractFiles = []
        this.disabled = false
      } else {
        // 原有文件的移除
        this.removeByValue2(this.oldContractFiles, file.fileId)
      }
      // this.formField2.deleteFlag = true
      this.$bus.$emit('voucher-tradeinfo', this.files())
      this.oldContractFiles = []
      this.disabled = false
    },

    // 发票信息文件上传
    invoiceFileBeforeUpload (file, fileList) {
      return voucherJS.FileBeforeUpload(file, fileList)
    },
    download (file) {
      let params = {}
      if (file.response) {
        location.href = tools.getUrl() + '/service/file/download/' + file.response.data
      } else {
        params = {fileId: file.fileId, voucherId: this.voucherId}
        location.href = tools.getUrl() + '/service/voucher/file/voufile/download?fileId=' + params.fileId + '&type=VOUCHER&voucherId=' + params.voucherId
      }
    },
    // 成功 - 发票信息文件上传
    invoiceFileHandleSuccess (response, file, fileList) {
      // this.uploadFile.push(file.response.data)
      this.invoiceFiles.push(response.data)
      this.$bus.$emit('voucher-tradeinfo', this.files())
      this.scrollheight()
    },
    // 移除 - 发票信息文件上传
    invoiceFileHandleRemove (file, fileList) {
      if (!file) return
      if (file.response) {
        // 新上传文件的删除
        this.removeByValue(this.invoiceFiles, file.response.data)
      } else {
        // 原有文件的移除
        this.delOldFile.push(file.fileId)
      }
      this.$bus.$emit('voucher-tradeinfo', this.files())
      // this.scrollheight()
    },

    // 其他信息文件上传
    otherFileBeforeUpload (file, fileList) {
      return voucherJS.FileBeforeUpload(file, fileList)
    },
    // 成功 - 其他信息文件上传
    otherFileHandleSuccess (response, file, fileList) {
      // this.uploadFile.push(file.response.data)
      this.otherFiles.push(response.data)
      this.$bus.$emit('voucher-tradeinfo', this.files())
      this.scrollheight()
    },
    // 移除 - 其他信息文件上传
    otherFileHandleRemove (file, fileList) {
      if (!file) return
      if (file.response) {
        // 新上传文件的删除
        this.removeByValue(this.otherFiles, file.response.data)
      } else {
        // 原有文件的移除
        this.delOldFile.push(file.fileId)
      }
      this.$bus.$emit('voucher-tradeinfo', this.files())
      // this.scrollheight()
    },
    scrollheight () {
      let isscroll = document.querySelector('.scroll').clientHeight
      this.$bus.$emit('isscroll', isscroll)
    },
    // 移除文件
    removeFile (obj, file) {
      if (!file) return
      if (file.response) {
        this.removeByValue(obj, file.response.data)
      } else {
        this.removeByValue(obj, file.fileId)
      }
      this.$bus.$emit('voucher-tradeinfo', this.files())
    },
    removeByValue (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1)
          break
        }
      }
    },
    removeByValue2 (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].fileId === val) {
          arr.splice(i, 1)
          break
        }
      }
    },
    // 文件
    files () {
      var i
      var filesArr = []
      var otherFilesAccount = 0
      var invoiceFilesAccount = 0
      // 修改了文件，编号等修改也在此处理
      for (i = 0; i < this.formSubmitArr.length; i++) {
        var isDelete = this.formSubmitArr[i].isDelete
        if (isDelete === 0) {
          filesArr.push({
            fileId: this.formSubmitArr[i].fileId,
            fileType: 0,
            name: this.formSubmitArr[i].name,
            content: this.formSubmitArr[i].content,
            detailId: this.formSubmitArr[i].detailId
          })
        } else {
          filesArr.push({
            fileId: null,
            fileType: 0,
            name: this.formSubmitArr[i].name,
            content: this.formSubmitArr[i].content,
            detailId: this.formSubmitArr[i].detailId
          })
        }
      }

      // if ((this.contractFiles.length + this.oldContractFiles.length) >= 5) {
      //   this.disabled = true
      // } else {
      //   this.disabled = false
      // }
      invoiceFilesAccount = this.invoiceFiles.length
      for (i = 0; i < this.invoiceFiles.length; i++) {
        filesArr.push({
          fileId: this.invoiceFiles[i],
          fileType: 1,
          name: null,
          content: null
        })
      }

      for (i = 0; i < this.oldInvoiceFiles.length; i++) {
        if (this.delOldFile && arrayTools.contains(this.delOldFile, this.oldInvoiceFiles[i].fileId)) {
          filesArr.push({
            fileId: null,
            fileType: 1,
            detailId: this.oldInvoiceFiles[i].detail.detailId,
            name: null,
            content: null
          })
        } else {
          filesArr.push({
            fileId: this.oldInvoiceFiles[i].fileId,
            fileType: 1,
            detailId: this.oldInvoiceFiles[i].detail.detailId,
            name: null,
            content: null
          })
          invoiceFilesAccount++
        }
      }

      otherFilesAccount = this.otherFiles.length
      for (i = 0; i < this.otherFiles.length; i++) {
        filesArr.push({
          fileId: this.otherFiles[i],
          fileType: 2,
          name: null,
          content: null
        })
      }

      for (i = 0; i < this.oldOtherFiles.length; i++) {
        if (this.delOldFile && arrayTools.contains(this.delOldFile, this.oldOtherFiles[i].fileId)) {
          filesArr.push({
            fileId: null,
            fileType: 2,
            detailId: this.oldOtherFiles[i].detail.detailId,
            name: null,
            content: null
          })
        } else {
          filesArr.push({
            fileId: this.oldOtherFiles[i].fileId,
            fileType: 2,
            detailId: this.oldOtherFiles[i].detail.detailId,
            name: null,
            content: null
          })
          otherFilesAccount++
        }
      }

      this.invoiceFileUploadTip = invoiceFilesAccount === 0 ? '' : '已上传' + invoiceFilesAccount + '个文件'
      this.otherFileUploadTip = otherFilesAccount === 0 ? '' : '已上传' + otherFilesAccount + '个文件'
      return filesArr
    },
    add () {
      // 存储列表信息
      this.$refs.formField2.validate(valid => {
        if (valid) {
          var formObject = {}
          formObject.name = this.formField2.contractNo
          formObject.content = this.formField2.goodsInfo
          formObject.fileName = this.formField2.fileName
          formObject.fileId = this.formField2.fileId
          formObject.fileType = 0
          formObject.isDelete = 0
          formObject.detailId = null
          formObject.flagId = this.flagId ++
          formObject.url = tools.getUrl() + '/service/file/download/' + formObject.fileId
          this.formShowArr.push(formObject)
          this.formSubmitArr.push(formObject)

          this.$bus.$emit('voucher-tradeinfo', this.files())
          this.$bus.$emit('formArray', {formArray: this.formSubmitArr})
          this.formField2.contractNo = ''
          this.formField2.goodsInfo = ''
          this.formField2.fileName = ''
          this.ContractFiles = []
          this.formField2.fileId = null
          this.dialogFormVisible = false
          this.disabled = false

          this.scrollheight()
        }
      })
    },
    cancel () {
      this.dialogFormVisible = false
      this.formField2.contractNo = ''
      this.formField2.goodsInfo = ''
      this.formField2.fileName = ''
      this.ContractFiles = []
      this.disabled = false
      this.$refs.formField2.resetFields()
    },
    // 删除合同信息
    deleteRow (flagId) {
      for (var i = 0; i < this.formSubmitArr.length; i++) {
        if (this.formSubmitArr[i].flagId === flagId) {
          this.formSubmitArr[i].isDelete = 1
        }
      }
      for (i = 0; i < this.formShowArr.length; i++) {
        if (this.formShowArr[i].flagId === flagId) {
          this.formShowArr.splice(i, 1)
        }
      }
      this.$bus.$emit('voucher-tradeinfo', this.files())
      // this.scrollheight()
    },
    dialogVisible () {
      if (this.formShowArr.length === 0) {
        this.dialogFormVisible = true
      } else {
        // for (var i = 0; i < this.formShowArr.length; i++) {s
        //   if (i < 5) {
        //     this.dialogFormVisible = true
        //   } else {
        //     this.dialogFormVisible = false
        //     this.$message.error('最多只能上传5条合同信息')
        //   }
        // }
        if (this.formShowArr.length < 5) {
          this.dialogFormVisible = true
        } else {
          this.dialogFormVisible = false
          this.$message.error('最多只能上传5条合同信息')
        }
      }
    }
  }
}
</script>
<style>
.disabled .el-button{border-color:#ccc; background:#ccc;}
#addVoucher:hover{
  color: #fff;
}
</style>
