<template>
  <div class="step5-ccbc">
    <div class="inner-wrap" id='bindDialog'>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="160px">
        <el-form-item class="username" prop = 'username' label="登录账号:">
          <el-input v-model="form.username" placeholder="请输入登录账号" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="onSubmit" class="okbtn" :loading="btnLoading" style="background:#FB642A;border:1px solid #FB642A">下一步</el-button>
        </el-form-item>
        <div style="border: 1px solid transparent"></div>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
import CFCATools from 'common/javascript/features/cfca'
import formExtends from 'components/entries/base/form'
// import authorityService from 'common/api/service/authorityService'
import commonLogin from 'common/api/login'
import commonMember from 'common/api/member/common'
import config from 'common/config/config'

export default formExtends({
  name: 'validate',
  components: {
  },
  props: ['active'],
  data () {
    return {
      pswShow: localStorage.type === config.project[1],
      btnLoading: false,
      form: {
        password: ''
      },
      rules: {
        username: {
          validator: (rule, value, callback) => {
            if (value.length < 4 || value.length > 16) {
              callback('用户名长度为4-16个字')
            } else if (!this.data().regular.mix.test(value)) {
              callback('请输入正确的用户名')
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      }
    }
  },
  mounted () {
    this.$refs.ruleForm.resetFields()
    // 监听页面请求错误
    this.$bus.$on('message-error', info => {
      this.btnLoading = false
    })
  },
  beforeDestroy () {
    this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
  },
  methods: {
    // 下一步
    onSubmit () {
      if (this.pswShow) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            CFCATools.selectCert('', '', '', false)
            commonMember.onece.remote({}, result => {
              if (result.success) {
                this.nonce = result.data
                localStorage.nonce = result.data
                let param = {
                  originParam: {
                    nonce: this.nonce,
                    userName: this.form.username
                  },
                  signStr: ''
                }
                const originParamStr = JSON.stringify(param.originParam)
                const signStr = this.sign(originParamStr, true)
                param.signStr = signStr
                this.check(param)
              } else {
                this.$message.error('获取加密密钥失败，请稍候重试')
              }
            })
          }
        })
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            CFCATools.selectCert('', '', '', false)
            commonLogin.loginBefore.remote({}, result => {
              if (result.success) {
                this.active.nonce = result.data.nonce
                this.active.pubKey = result.data.pubKey
                this.$jsEncrypt.setPublicKey(this.active.pubKey)
                let param = {
                  originParam: {
                    nonce: this.active.nonce,
                    userName: this.form.username
                  },
                  signStr: ''
                }
                const originParamStr = JSON.stringify(param.originParam)
                const signStr = this.sign(originParamStr, true)
                param.signStr = signStr
                this.check(param)
              } else {
                this.$message.error('获取加密密钥失败，请稍候重试')
              }
            })
          }
        })
      }
    },
    check (param) {
      commonMember.checkCount.remote(param, result => {
        if (result.success) {
          this.active.step = 2
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    }
  }
})

</script>

<style>
#bindDialog .el-form-item__error {
  width: 225px;
  top: 38px;
}
.el-step__head.is-text.is-finish{
  background-color:#FB642A;
  border-color:#FB642A;
}
.el-step__title.is-finish{
  color:#FB642A;
}
</style>
