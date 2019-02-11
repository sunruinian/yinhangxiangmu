<template>
  <div class="content-right">
      <div v-title='title'>{{title}}</div>
      <voucherOperate></voucherOperate>
      <div class="voucher-operate" style="padding:20px;">
        <div class="group form-row " style="background:#fff;">
          <div class="font1" style="width:927px;margin:20px auto;">
            <p class="mb10">审批意见</p>
            <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm">
               <el-form-item label="" prop="desc">
                 <el-input
                   type="textarea"
                   maxlength="20"
                   :autosize="{ minRows: 2, maxRows: 4}"
                   placeholder="请填写审批意见"
                   v-model="ruleForm.desc">
                 </el-input>
                 <div style="text-align: right">还能输入<span style='color: red'>{{length}}</span>个字符</div>
               </el-form-item>
            </el-form>
          </div>
        </div>

        <div id="created" class="group form-row" style="padding-bottom:20px; margin-bottom:20px; text-align:center; background:#fff;">
            <span class="wrapper center center-ie9">
              <el-button class="cancel"  type="info" size="small" @click = "back">取消</el-button>
              <el-button class="cancel"  type="info" size="small" @click = "reject">审批退回</el-button>
              <el-button class="sure back"  type="info" size="small" v-if="this.detail.expire === 0" @click="approve">审批通过</el-button>
              <el-button class="sure" type="info" size="small" v-if="this.detail.expire === 1" @click="expireSign">审批通过</el-button>
            </span>
        </div>
      </div>
      <cletter ref='letterDialog' v-on:read-letter='agreeMentChange' title='付款承诺函'></cletter>
  </div>

</template>

<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import cletter from 'components/entries/common/letter'
import voucherOperate from 'components/entries/common/voucher-operate'
// import companyService from 'common/api/service/companyService'
// import supplierVoucherService from 'common/api/service/supplierVoucherService'
import coreApi from 'common/api/voucher/core'

export default {
  name: 'app',
  components: {
    cletter,
    voucherOperate
  },
  data () {
    return {
      title: '凭证详情',
      length: 20,
      detail: {
        expire: 1
      },
      ruleForm: {
        desc: ''
      },
      checkedPromiss: false,
      canRead: true,
      rules: {
        desc: [
          {
            validator: (rule, value, callback) => {
              if (value.length <= 20) {
                this.length = 20 - value.length
              }
            },
            trigger: 'change' }
        ]
      },
      voucherId: 0,
      // 付款函相关数据
      companyId: null,
      companyName: null,
      attachmentInfo: {files: []}
    }
  },
  beforeMount () {
    this.$bus.$on('voucher-operate', info => {
      this.detail = info
      this.detail.expire = (this.detail.cashTime > (new Date()).valueOf()) ? 0 : 1
      this.companyName = this.detail.company.name
      this.checkedPromiss = false
      this.canRead = true
    })
  },
  mounted () {
    this.voucherId = this.$route.query.id
  },
  methods: {
    // 审批通过
    approve () {
      // if (confirm('确定通过吗？')) {
      //   if (this.paymentState === 2) { // 已签付款函
      //   } else {
      //     // 获取付款函
      //     const param = {
      //       no: this.detail.no,
      //       partyBComId: this.detail.company.id
      //     }
      //     companyService.paymentLetter.remote(param, (info) => {
      //       this.paymentId = info.data.id
      //       this.paymentFileId = info.data.fileId
      //       const letterInfo = {
      //         show: true,
      //         companyName: this.companyName,
      //         fileId: this.paymentFileId,
      //         id: this.paymentId
      //       }
      //       this.$refs.letterDialog.$emit('toggle-dialog', letterInfo)
      //     })
      //   }
      // }
      if (this.paymentState === 2) { // 已签付款函
      } else {
        // 获取付款函
        const param = {
          no: this.detail.no,
          partyBComId: this.detail.company.id
        }
        coreApi.paymentLetter.remote(param, (info) => {
          this.paymentId = info.data.id
          this.paymentFileId = info.data.fileId
          const letterInfo = {
            show: true,
            companyName: this.companyName,
            fileId: this.paymentFileId,
            id: this.paymentId
          }
          this.$refs.letterDialog.$emit('toggle-dialog', letterInfo)
        })
      }
    },
    agreeMentChange (info) {
      let updateInfo = {
        fileId: info.fileId,
        id: info.id
      }
      coreApi.paymentUpdate.remote(updateInfo, (info) => {
        if (info.data) {
          // 付款函上传并更新成功，进入业务
          var params = {
            'id': this.voucherId,
            'reason': this.ruleForm.desc
          }
          coreApi.applyPass.remote(params, (result) => {
            if (result.success === true) {
              alert('通过成功！')
              history.back()
              this.getGrid()
            }
          })
        } else {
          this.$message.error('付款函更新失败')
        }
      })
    },
    reject () {
      var params = {
        'id': this.voucherId,
        'reason': this.ruleForm.desc
      }
      if (confirm('确定退回吗？')) {
        coreApi.applyReject.remote(params, (result) => {
          if (result.success === true) {
            alert('退回成功！')
            history.back()
            this.getGrid()
          }
        })
      }
    },
    back () {
      history.back()
    },
    expireSign () {
      this.$message.error('该凭证已超过承诺付款日期不能操作签收。')
    }
  }
}
</script>
