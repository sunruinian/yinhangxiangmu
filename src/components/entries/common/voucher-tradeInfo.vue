<template>
    <div class="b-voucher-tradeinfo scroll">
        <div class="item-tit">附：贸易信息</div>
      <div class="tit" style="margin-left: 10px;">
        <p style="display: inline-block;"><span class="require">*</span>1、合同信息<span class="c666">（添加的合同数量不可超过5条）</span></p>
        <span style="margin-right: 40px;" class="contractInfo cbubi" @click="dialogVisible"> <span><span>+</span></span> 合同信息</span>
      </div>
        <el-row>
          <el-col :span='23' class="box-shadow radius-4 pl15 pr15 table-wrap" style="margin-left: 10px;">
            <el-table
              :data="formArray">
              <el-table-column
                prop="name"
                align='center'
                :show-overflow-tooltip="true"
                label="基础合同编号"
                label-width="500px">
              </el-table-column>
              <el-table-column
                prop="content"
                align='center'
                label="交易商品信息"
                :show-overflow-tooltip="true"
                :formatter = "sixEnterpriseCode"
                label-width="500px">
              </el-table-column>
              <el-table-column
                align='center'
                prop="fileName"
                label="合同附件"
                label-width="500px">
              </el-table-column>
              <el-table-column
                align='center'
                label="操作"
                label-width="500px">
                <template scope="scope">
                  <el-button  @click='deleteRow(scope.row.index, formArray)' type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="formArray.length === 0" class="novoucher">你还没有添加合同</div>
          </el-col>
        </el-row>
      <!-- </div> -->
        <div class="tit" style="margin-left: 10px;">
          <p>2、附件上传<span class="c666">（支持大小≤30M，且格式为pdf、jpg、png、jpeg、zip、rar的文件）</span></p>
        </div>
      <div class="boxShadow" style="padding-left:15px;padding-right:15px;width: 96%;margin-left: 10px;">
        <el-form class="upload-form" ref="formField2" :rules="rules" :model="formField2">
          <el-form-item class="contract-info" label="发票信息" label-width="120px">
            <el-upload
              action="service/file/upload"
              name="multipartFile"
              :on-success="invoiceFileHandleSuccess"
              :on-remove="invoiceFileHandleRemove"
              :on-preview="download"
              :before-upload="invoiceFileBeforeUpload">
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
                :before-upload="otherFileBeforeUpload">
                <div class="box">{{otherFileUploadTip}}</div>
                <el-button size="medium" type="primary">浏览</el-button>
                <div slot="tip" class="el-upload__tip"></div>
              </el-upload>
            </el-form-item>
        </el-form>
      </div>
        <!--弹框-->
      <div v-show="dialogFormVisible">
        <el-dialog title="添加合同信息" :visible.sync="dialogFormVisible" :before-close="cancel" size="mini">
          <el-form ref="formField2" :rules="rules" :model="formField2">
            <div class="add-contact">
              <el-form-item label="基础合同编号" label-width="120px" prop="contractNo" :class="{'is-required': true}">
                  <el-input style="width:369px"
                    placeholder="请输入不超过100字符的基础合同编号"
                    :maxlength="50"
                    v-model="formField2.contractNo">
                  </el-input>
              </el-form-item>
              <el-form-item label="交易商品信息" label-width="120px" prop="goodsInfo" :class="{'is-required': true}">
                <el-input style="width:369px"
                  type="textarea"
                  :rows="4"
                  :maxlength="100"
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
                  :file-list="oldContractFiles"
                  :disabled="disabled"
                  prop="contractFile" :class="{'is-required': true}">
                  <div class="box"></div>
                  <el-button size="medium" type="primary">浏览</el-button>
                  <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
                <p class="c999" style="font-size:12px; line-height:16px;">支持大小≤30M，且格式为pdf、jpg、png、jpeg、zip、rar的文件</p>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="countVoucher" @click="cancel">取消</el-button>
            <el-button id="addVoucher" class="addVoucher" @click="add">添加</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script type="text/javascript">
import tools from 'common/javascript/tools/tools'
// import 'common/sass/module/component.scss'
import voucherJS from 'src/module/voucher/service/voucher'
export default {
  name: 'voucher-tradeinfo',
  data () {
    return {
      contractFileArr: [],
      invoiceFileArr: [],
      otherFileArr: [],
      contractNoFlag: false,
      goodsInfoFlag: false,
      disabled: false,
      // 弹框显示
      dialogFormVisible: false,
      oldContractFiles: [],
      contractObject: {},
      fileListArr: [],
      formField2: {
        // 基础合同编号
        contractNo: null,
        // 交易商品信息
        goodsInfo: null,
        fileName: null,
        fileId: null,
        fileType: null,
        status: false
      },
      invoiceFileUploadTip: '',
      otherFileUploadTip: '',
      contractLength: null,
      contractStatus: false,
      // 合同信息
      formArray: [],
      rules: {
        contractNo: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                // 实现上面注释的 required 功能
                this.contractNoFlag = false
                // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                callback(new Error('必须填写'))
              } else if (value && value.length > 100) {
                this.contractNoFlag = false
                // // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                callback(new Error('编号超出100字符'))
              } else if (value.trim() === '') {
                this.contractNoFlag = false
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                // this.contractNoFlag = false
                // // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('不得填写空白信息'))
              } else {
                // this.contractNoFlag = true
                // // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                this.contractNoFlag = true
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                callback()
              }
            },
            trigger: 'blur' }
        ],
        goodsInfo: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                this.goodsInfoFlag = false
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                // 实现上面注释的 required 功能
                // this.goodsInfoFlag = false
                // // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('必须填写'))
              } else if (value && value.length > 100) {
                this.goodsInfoFlag = false
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                // this.goodsInfoFlag = false
                // // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('商品信息超出100字符'))
              } else if (value.trim() === '') {
                this.goodsInfoFlag = false
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                // this.goodsInfoFlag = false
                // // this.$bus.$emit('voucher-tradeinfo', this.files())
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag, goodsInfo: this.formField2.goodsInfo, contractNo: this.formField2.contractNo})
                callback(new Error('不得填写空白信息'))
              } else {
                this.goodsInfoFlag = true
                // this.$bus.$emit('contractInfo', {status: this.goodsInfoFlag && this.contractNoFlag})
                // this.goodsInfoFlag = true
                // // this.$bus.$emit('voucher-tradeinfo', this.files())
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
    this.$bus.$on('contractStatus', info => {
      this.$bus.$emit('contractStatusCallBack', this.formArray.length === 0)
    })
  },
  // updated () {
  //   var file = {}
  //   var fileList = []
  //   file = this.contractObject
  //   fileList = fileList.concat(this.fileListArr)
  //   this.contractFileHandleRemove(file, fileList)
  // },
  methods: {

    // 合同信息文件上传
    contractFileBeforeUpload (file, fileList) {
      return voucherJS.FileBeforeUpload(file, fileList)
    },
    // 成功 - 合同信息文件上传
    contractFileHandleSuccess (response, file, fileList) {
      this.contractFileArr.push(response.data)
      this.formField2.fileName = file.name
      this.formField2.fileId = response.data
      this.contractObject = file
      this.fileListArr = this.fileListArr.concat(fileList)
      this.disabled = true
      // 合同信息传送到待提交凭证
      this.$bus.$emit('voucher-tradeinfo', this.files())
    },
    // 移除 - 合同信息文件上传
    contractFileHandleRemove (file, fileList) {
      this.removeByValue(this.contractFileArr, file && file.response.data)
      this.disabled = false
      this.oldContractFiles = []
      this.$bus.$emit('voucher-tradeinfo', this.files())
    },

    // 发票信息文件上传
    invoiceFileBeforeUpload (file, fileList) {
      return voucherJS.FileBeforeUpload(file, fileList)
    },
    // 成功 - 发票信息文件上传
    invoiceFileHandleSuccess (response, file, fileList) {
      this.invoiceFileArr.push(response.data)
      this.$bus.$emit('voucher-tradeinfo', this.files())
      this.scrollheight()
    },
    // 移除 - 发票信息文件上传
    invoiceFileHandleRemove (file, fileList) {
      this.removeByValue(this.invoiceFileArr, file && file.response.data)
      this.$bus.$emit('voucher-tradeinfo', this.files())
      // this.scrollheight()
    },
    scrollheight () {
      let isscroll = document.querySelector('.scroll').clientHeight
      this.$bus.$emit('isscroll', isscroll)
    },

    // 其他信息文件上传
    otherFileBeforeUpload (file, fileList) {
      return voucherJS.FileBeforeUpload(file, fileList)
    },
    // 成功 - 其他信息文件上传
    otherFileHandleSuccess (response, file, fileList) {
      this.otherFileArr.push(response.data)
      this.$bus.$emit('voucher-tradeinfo', this.files())
      this.scrollheight()
    },
    // 移除 - 其他信息文件上传
    otherFileHandleRemove (file, fileList) {
      this.removeByValue(this.otherFileArr, file && file.response.data)
      this.$bus.$emit('voucher-tradeinfo', this.files())
      // this.scrollheight()
    },
    // 文件
    files () {
      // var flag = false
      var filesArr = []
      // for (var i = 0; i < this.contractFileArr.length; i++) {
      //   if (i === 0) {
      //     flag = true
      //     filesArr.push({
      //       fileId: this.contractFileArr[i],
      //       fileType: 0,
      //       name: this.formField2.contractNo,
      //       content: this.formField2.goodsInfo
      //     })
      //   } else {
      //     filesArr.push({
      //       fileId: this.contractFileArr[i],
      //       fileType: 0,
      //       name: null,
      //       content: null
      //     })
      //   }
      // }
      // if (this.contractFileArr.length >= 1) {
      //   this.disabled = true
      // } else {
      //   this.disabled = false
      // }
      for (var i = 0; i < this.invoiceFileArr.length; i++) {
        filesArr.push({
          fileId: this.invoiceFileArr[i],
          fileType: 1,
          name: null,
          content: null
        })
      }
      for (i = 0; i < this.otherFileArr.length; i++) {
        filesArr.push({
          fileId: this.otherFileArr[i],
          fileType: 2,
          name: null,
          content: null
        })
      }
      this.invoiceFileUploadTip = this.invoiceFileArr.length === 0 ? '' : '已上传' + this.invoiceFileArr.length + '个文件'
      this.otherFileUploadTip = this.otherFileArr.length === 0 ? '' : '已上传' + this.otherFileArr.length + '个文件'
      filesArr = filesArr.concat(this.formArray)
      // if (!flag) {
      //   filesArr.push({
      //     fileId: null,
      //     fileType: 0,
      //     name: this.formField2.contractNo,
      //     content: this.formField2.goodsInfo
      //   })
      // }
      return filesArr
    },
    removeByValue (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1)
          break
        }
      }
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
    // 合同信息添加
    add () {
      // 存储列表信息
      this.$refs.formField2.validate(valid => {
        if (valid) {
          var Array = []
          var formObject = {}
          formObject.name = this.formField2.contractNo
          formObject.content = this.formField2.goodsInfo
          formObject.fileName = this.formField2.fileName
          formObject.fileId = this.formField2.fileId
          formObject.fileType = 0
          formObject.status = true
          formObject.url = tools.getUrl() + '/service/file/download/' + formObject.fileId
          Array.push(formObject)
          this.formArray = this.formArray.concat(Array)
          this.contractLength = this.formArray.length
          this.formField2.contractNo = ''
          this.formField2.goodsInfo = ''
          this.formField2.fileName = ''
          this.oldContractFiles = []
          this.formField2.fileId = null
          this.disabled = false
          this.$bus.$emit('voucher-tradeinfo', this.files())
          this.dialogFormVisible = false

          this.scrollheight()
        }
      })
    },
    cancel () {
      this.$refs.formField2.resetFields()
      this.formField2.contractNo = ''
      this.formField2.goodsInfo = ''
      this.formField2.fileName = ''
      this.oldContractFiles = []
      this.disabled = false
      this.dialogFormVisible = false
    },
    // 删除合同信息
    deleteRow (index, rows) {
      rows.splice(index, 1)
      // this.scrollheight()
    },
    dialogVisible () {
      if (this.formArray.length === 0) {
        this.dialogFormVisible = true
      } else {
        if (this.formArray.length < 5) {
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
/* .el-button--default:focus, .el-button--default:hover{
  color: #fff;
} */
.disabled .el-button{
  border-color:#ccc; background:#ccc;
}
.novoucher{
  width:60%;height:43px;background:#fff;line-height:43px;position:absolute;left:183px;top:60px;
  text-align: center;color: #999999;
}
#addVoucher:hover{
  color: #fff;
}
</style>
