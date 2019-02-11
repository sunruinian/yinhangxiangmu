<template>
  <div class="content-right" >
      <div v-title='title'>{{title}}</div>
      <voucherOperate></voucherOperate>

      <div class="voucher-operate">
        <div class="group form-row " style="background:#fff;">
          <div class="font1" style="width:927px;margin:20px auto;">
            <p class="mb10">审批意见</p>
            <el-form :model="formField" :rules="rules" class="demo-ruleForm">
               <el-form-item label="" prop="reason">
                 <el-input
                   type="textarea"
                   :autosize="{ minRows: 2, maxRows: 4}"
                   :maxlength="20"
                   placeholder="请填写审批意见。"
                   v-model="formField.reason">
                   <!-- @keyup.native="handleKeyUp"> -->
                 </el-input>
                 <div style="text-align: right">还能输入<span style='color: red'>{{length}}</span>个字符</div>
               </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- <div class="protocol" style="padding-left:30px; background:#fff;">
          <el-checkbox v-model="checkedPromiss" ref='canRead' :disabled="canRead">我已同意<a @click.stop.prevent='dialogToggle'>《付款承诺函》</a></el-checkbox>
        </div> -->
        <div id="created" class="group form-row" style=" text-align:center; background:#fff;">
            <span class="wrapper center center-ie9">
              <el-button class="cancel"  type="info" size="small" @click = "back">取消</el-button>
              <el-button class="cancel back"  type="info" size="small" @click = "reject">审批退回</el-button>
              <el-button class="sure"  type="info" size="small" v-if="this.detail.expire === 0" @click="approve">审批通过</el-button>
              <el-button class="sure" type="info" size="small" v-if="this.detail.expire === 1" @click="expireSign">审批通过</el-button>
            </span>
        </div>
      </div>
      <cletter ref='letterDialog' @read-letter='agreeMentChange' title='付款承诺函'></cletter>
  </div>

</template>

<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import cletter from 'components/entries/common/letter'
import voucherOperate from 'components/entries/common/voucher-operate'
// import companyService from 'common/api/service/companyService'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import coreApi from 'common/api/voucher/core'

export default {
  name: 'app',
  components: {
    cletter,
    voucherOperate
  },
  data () {
    return {
      title: '凭证审批',
      length: 20,
      detail: {
        expire: 1
      },
      formField: {
        reason: ''
      },
      rules: {
        reason: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback(new Error('已超出20个汉字'))
                // setTimeout(() => {
                //   this.formField.reason = value.substring(0, 20)
                //   this.length = 0
                // }, 1)
              } else {
                this.length = 20 - value.length
              }
            },
            trigger: 'change' }
        ]
      }
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
    back () {
      history.back()
    },
    approve () {
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
          companyName: this.detail.company.name,
          fileId: this.paymentFileId,
          id: this.paymentId
        }
        this.$refs.letterDialog.$emit('toggle-dialog', letterInfo)
      })
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
            'reason': this.formField.reason
          }
          coreApi.approveVoucher.remote(params, (result) => {
            if (result.success === true) {
              this.$message.success('审批通过成功')
              // this.form.operator = ''
              this.formField.reason = ''
              this.approveDialogForm = false
              location.href = '#/assistant/success?content=审批通过成功 :)&active=/voucher/approving'
              // this.getGrid()
            } else {
              this.$message.error('审批通过失败')
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
        'reason': this.formField.reason
      }
      coreApi.rejectVoucher.remote(params, (result) => {
        if (result.success === true) {
          this.$message.success('审批退回成功')
          this.form.operator = ''
          this.form.reason = ''
          this.approveDialogForm = false
          this.getGrid()
        } else {
          this.$message.error('审批退回失败')
        }
      })
    },
    expireSign () {
      this.$message.error('该凭证已超过承诺付款日期不能审批通过。')
    },
    handleKeyUp () {
      if (this.formField.reason.length > 20) {
        this.length = 0
        this.formField.reason = this.formField.reason.substring(0, 20)
      } else {
        this.length = 20 - this.formField.reason.length
      }
    }
  }
}
</script>
