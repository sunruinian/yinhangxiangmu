<template>
  <div class="step6-ccsp">
    <div class="inner-wrap">
      <h2 class="tit2">支付密码<span>（操作资产、资金转移时需输入密码为8-20位且至少2种以上的数字、字母或符号组合。）</span></h2>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="支付密码" prop='password' v-if='pswShow'>
          <span>
            <span id="PPPPay">
                <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入账号密码">
            </span>
            <span id="EEE"></span>
          </span>
        </el-form-item>
        <div v-if='!pswShow'>
          <el-form-item label="支付密码" prop='password'>
            <el-input v-model="form.password" type='password' @change='newPwdChange'></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop='agin'>
            <el-input v-model="form.agin" type='password'></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <div class="protocol">
            <el-checkbox v-model="checkedPromiss" ref='canRead' @click='toggleAgreen' :disabled="canRead">我已同意<a @click.stop.prevent='dialogToggle'>《贵阳银行爽融链平台使用协议》</a></el-checkbox>
          </div>
        </el-form-item>
        <el-form-item v-show ="pswShow">
          <el-button class="w300" type="primary" :disabled='!checkedPromiss' @click="onGySubmit" :loading="btnLoading">下一步</el-button>
        </el-form-item>
        <el-form-item v-show ="!pswShow">
          <el-button class="w300" type="primary" :disabled='!checkedPromiss' @click="onSubmit" :loading="btnLoading">下一步</el-button>
        </el-form-item>
        <div style="border: 1px solid transparent"></div>
      </el-form>
      <regProtocol ref='letterDialog' title='布比平台协议'></regProtocol>
    </div>
  </div>

</template>

<script type="text/javascript">
import regProtocol from 'components/entries/common/reg-protocol'

import formExtends from 'components/entries/base/form'
// import certService from 'common/api/service/certService'
import cookieTools from 'common/javascript/tools/cookieTools'
import config from 'common/config/config'
import PSWTools from 'common/javascript/features/psw.js'
import commonMember from 'common/api/member/common'

let instance = null
export default formExtends({
  name: 'step6-ccsp',
  components: {
    regProtocol
  },
  data () {
    return {
      pswShow: localStorage.type === config.project[1],
      btnLoading: false,
      canRead: true,          // 读协议
      checkedPromiss: false,  // 按钮
      canNext: true,
      isShow: false,
      form: {
        password: '',
        agin: ''
      },
      formData: {
        agin: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入支付密码！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value.length < 8 || value.length > 20) {
                callback('密码长度为8到20位字符！')
              }
              if (instance.regular.num.test(value) || instance.regular.word.test(value)) {
                callback('密码包含数字、字母和字符中最少两种的组合！')
              }

              if (!(instance.regular.nonNum.test(value) || instance.regular.nonWord.test(value))) {
                callback('密码包含数字、字母和字符中最少两种的组合！')
              }
              callback()
            },
            trigger: 'change' }
        ],
        agin: [
          { required: true, message: '请输入确认密码！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value !== instance.form.password) {
                callback('两次密码不一致！')
              }
              callback()
            },
            trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    if (this.pswShow) {
      this.$nextTick(() => {
        // 生成密码加密控件容器
        var content = PSWTools.PEWritePassObject()
        var span = document.getElementById('PPPPay')
        span.innerHTML += content
      })
    }
    // 监听页面请求错误
    this.$bus.$on('message-error', info => {
      this.btnLoading = false
    })
    instance = this // 解决验证框架，this指向问题。 待优化
    this.$bus.$on('check-agreen', info => {
      this.checkedPromiss = info.promiss
      this.canRead = info.isSign
    })
  },
  methods: {
    newPwdChange (value) {
      // 先输入确认新密码，再输入新密码 - 校验
      if (instance.form.agin) {
        instance.$refs.ruleForm.validateField('agin', (valid) => {})
      }
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const param = {
            payPassword: this.form.password
          }
          this.btnLoading = true
          commonMember.addPayPassword.remote(param, (data) => {
            this.btnLoading = false
            const role = cookieTools.getCookie('role')
            if (role === '2') {
              this.$bus.$emit('reg-step', {
                tit: '身份认证已完成！',
                content: '系统将自动添加您的结算户信息。'
              })
            }
            this.$bus.$emit('on-step', 4)
          })
        }
      })
    },
    onGySubmit () {
      let powerpass = document.getElementById('powerpass')
      let pubKey = localStorage.getItem('pubKey')
      let password = PSWTools.getSM2IBSPassword(powerpass, pubKey)
      var param = {
        payPassword: password,
        pubKey: pubKey
      }
      this.btnLoading = true
      commonMember.addGyPayPassword.remote(param, (data) => {
        this.btnLoading = false
        const role = cookieTools.getCookie('role')
        if (role === '2') {
          this.$bus.$emit('reg-step', {
            tit: '身份认证已完成！',
            content: '系统将自动添加您的结算户信息。'
          })
        }
        this.$bus.$emit('on-step', 4)
      })
    },
    // 阅读协议弹框
    dialogToggle () {
      this.$refs.letterDialog.$emit('toggle-dialog', {show: true})
    },
    toggleAgreen () {
      this.checkedPromiss = !this.checkedPromiss
      if (!this.checkedPromiss) {
        this.canNext = false
      } else {
        this.canNext = true
      }
    }
  }
})
</script>
