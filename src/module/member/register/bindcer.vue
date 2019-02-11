<template>
  <div class="step5-ccbc">
    <div class="inner-wrap" id='bindDialog'>
      <h2 class="tit2">数字证书<span class="tip-text font1">(绑定数字证书，进行付款、签收凭证、提现等涉及金额支出的操作需插入数字证书。)</span></h2>

      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="160px">
        <el-form-item label="公司名称" prop = 'name'>
          <el-input v-model="form.name" ></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用证代码" prop = 'companyCode'>
          <el-input v-model="form.companyCode" ></el-input>
        </el-form-item>
        <el-form-item label="证书DN码" >
          <el-input v-model="form.issuerDn" :disabled='true' style="width:150px;">
            <el-button slot="append" style="cursor:pointer;" @click='activeDN'>激活</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="onSubmit" class="okbtn" :loading="btnLoading">下一步</el-button>
        </el-form-item>
        <div style="border: 1px solid transparent"></div>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
import CFCATools from 'common/javascript/features/cfca'
import formExtends from 'components/entries/base/form'
// import certService from 'common/api/service/certService'
import commonMember from 'common/api/member/common'
import merge from 'webpack-merge'
export default formExtends({
  name: 'step5-ccbc',
  components: {
  },
  data () {
    return {
      btnLoading: false,
      form: {
        name: '',
        serialNo: '',
        issuerDn: '',
        companyCode: '',
        subjectCn: ''
      },
      formData: {
      },
      rules: {
        name: [
          { required: true, message: '请输入公司名称！', trigger: 'change' }
        ],
        companyCode: [
          { required: true, message: '请输入统一社会信用证代码！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              this.methods.isSocialCode(value, callback)
            },
            trigger: 'change'
          }
        ],
        DN: [
          // { required: true, message: '请插入UK选择证书！', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    // 监听页面请求错误
    this.$bus.$on('message-error', info => {
      this.btnLoading = false
    })
  },
  methods: {
    onSubmit () {
      if (this.form.issuerDn === '') {
        this.$bus.$emit('message-error', {message: '请插入证书并激活DN码！'})
        return
      }

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let param = merge({}, this.form)
          param.signStr = this.sign(param.companyCode, true)
          this.btnLoading = true
          commonMember.bindCert.remote(param, (data) => {
            this.btnLoading = false
            sessionStorage.setItem('serialNo', this.form.serialNo)
            sessionStorage.setItem('issuerDn', this.form.issuerDn)
            this.$bus.$emit('on-step', 2)
          }).then(() => {
          })
        }
      })
    },
    login () {
      // 登录
    },
    activeDN () {
      this.form.issuerDn = ''
      // CFCATools.selectCert()
      CFCATools.selectCert('', '', '', false)
      const info = CFCATools.getInfo()
      this.form.issuerDn = info.issuerDN
      this.form.serialNo = info.serialNumber
      this.form.subjectCn = info.SubjectCN
    }
  }
})

</script>

<style>
#bindDialog .el-form-item__error {
  width: 225px;
  top: 38px;
}
</style>
