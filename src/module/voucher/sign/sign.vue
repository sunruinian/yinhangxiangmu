<template>
  <div class="content-right">
      <div v-title='title'>{{title}}</div>
      <voucherOperate></voucherOperate>
      <div class="voucher-operate" style="padding:20px;">
        <div class="group form-row " style="background:#fff;">
          <div class="font1" style="width:927px;margin:20px auto;">
            <p class="mb10">签收/拒收理由</p>
            <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm">
               <el-form-item label="" prop="desc">
                 <el-input
                   type="textarea"
                   maxlength="20"
                   :autosize="{ minRows: 2, maxRows: 4}"
                   placeholder="请填写签收/拒收理由"
                   v-model="ruleForm.desc">
                 </el-input>
                 <div style="text-align: right">还能输入<span style='color: red'>{{length}}</span>个字符</div>
               </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="group form-row " style="padding-bottom:20px; text-align:center; background:#fff;">
            <span class="wrapper center center-ie9">
              <el-button class="button-bubi-theme"  type="info" size="small" @click = "back">取消</el-button>
              <el-button class="button-bubi-theme"  type="info" size="small" @click = "reject">拒收</el-button>
              <el-button class="button-bubi-theme"  type="info" size="small" v-if="this.detail.expire === 0" @click="approve">签收</el-button>
              <el-button class="button-bubi-theme button-expire" type="info" size="small" v-if="this.detail.expire === 1" @click="expireSign">签收</el-button>
            </span>
        </div>
      </div>
  </div>

</template>

<script type="text/javascript">
import cletter from 'components/entries/common/letter'
import voucherOperate from 'components/entries/common/voucher-operate'
// import supplierVoucherService from 'common/api/service/supplierVoucherService'
import supplierApi from 'common/api/voucher/supplier'

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
      voucherId: 0
    }
  },
  beforeMount () {
    this.$bus.$on('voucher-operate', info => {
      this.detail = info
      this.detail.expire = (this.detail.cashTime > (new Date()).valueOf()) ? 0 : 1
    })
  },
  mounted () {
    this.voucherId = this.$route.query.id
  },
  methods: {
    back () {
      history.back()
    },
    // 凭证签收
    approve () {
      var params = {
        'id': this.voucherId,
        'operation_reason': this.ruleForm.desc
      }
      supplierApi.receiveVoucher.remote(params, (result) => {
        if (result.success === true) {
          alert('签收成功！')
          history.back()
          this.getGrid()
        }
      })
    },
    reject () {
      var params = {
        'id': this.voucherId,
        'operation_reason': this.ruleForm.desc
      }
      supplierApi.rejectVoucher.remote(params, (result) => {
        if (result.success === true) {
          alert('拒收成功！')
          history.back()
          this.getGrid()
        }
      })
    },
    expireSign () {
      this.$message.error('该凭证已超过承诺付款日期不能操作签收。')
    }
  }
}
</script>
