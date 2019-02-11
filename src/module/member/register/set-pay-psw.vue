<template>
    <el-form :model="payForm" :rules="payForm.rules" ref="payFormRef" label-width="120px">
      <el-form-item style="margin-bottom:-5px" label="新密码" prop="payNewPwd" v-if='pswShow'>
        <span>
          <span id="PPPPay">
              <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入账号密码">
          </span>
          <span id="EEE"></span>
        </span>
      </el-form-item>
      <div v-if='!pswShow'>
        <el-form-item label="支付密码" prop="payNewPwd">
        <el-input v-model="payForm.payNewPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="payNewPwd2">
          <el-input v-model="payForm.payNewPwd2" type="password"></el-input>
        </el-form-item>
      </div>
      <el-form-item v-if="pswShow">
        <p class="mb10"><span class="require">*</span><span class="c999">密码为8-20位且至少2种以上的数字、字母或符号组合。</span></p>
        <el-button class="okbtn" type="primary" @click="payGyFormSubmit">完成</el-button>
      </el-form-item>
      <el-form-item v-if="!pswShow">
        <p class="mb10"><span class="require">*</span><span class="c999">密码为8-20位且至少2种以上的数字、字母或符号组合。</span></p>
        <el-button class="okbtn" type="primary" @click="payFormSubmit">完成</el-button>
      </el-form-item>
    </el-form>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/module/table.scss'
import 'common/sass/main.scss'
import 'common/sass/module/supplier.scss'
import formExtends from 'components/entries/base/form'
// import certService from 'common/api/service/certService'
import dispatch from 'module/member/service/dispatch'
import cookieTools from 'common/javascript/tools/cookieTools'
import config from 'common/config/config'
import PSWTools from 'common/javascript/features/psw.js'
import commonMember from 'common/api/member/common'

let instance = null
export default formExtends({
  name: 'app',
  components: {
  },
  data () {
    return {
      pswShow: localStorage.type === config.project[1],
      payForm: {
        payNewPwd: null,
        payNewPwd2: null,
        rules: {
          payOldPwd: { required: true, message: '必须填写', trigger: 'change' },
          payNewPwd: [
            { required: true, message: '必须填写', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                if (value.length < 8 || value.length > 20) {
                  callback(new Error('密码长度为8-20位'))
                }
                if (instance.regular.num.test(value) || instance.regular.word.test(value)) {
                  callback('密码包含数字、字母和字符中最少两种的组合！')
                }

                if (!(instance.regular.nonNum.test(value) || instance.regular.nonWord.test(value))) {
                  callback('密码包含数字、字母和字符中最少两种的组合！')
                }

                callback()
              },
              trigger: 'change'
            }
          ],
          payNewPwd2: [
            { required: true, message: '必须填写', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                if (instance.payForm.payNewPwd !== instance.payForm.payNewPwd2) {
                  callback('两次密码输入不一致')
                }
                callback()
              },
              trigger: 'change'
            }
          ]
        }
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
    this.$refs.payFormRef.resetFields()
    instance = this
  },
  beforeDestroy () {
    this.$refs.payFormRef.resetFields()
  },
  methods: {
    payFormSubmit () {
      const self = this
      self.$refs.payFormRef.validate((valid) => {
        if (valid) {
          var param = {
            payPassword: self.payForm.payNewPwd
          }
          commonMember.addPayPassword.remote(param, (data) => {
            if (data.data) {
              cookieTools.setCookie('step-register', config.authStep)
              dispatch.logout()
            }
          })
        }
      })
    },
    payGyFormSubmit () {
      let powerpass = document.getElementById('powerpass')
      let pubKey = localStorage.getItem('pubKey')
      let password = PSWTools.getSM2IBSPassword(powerpass, pubKey)
      var param = {
        payPassword: password,
        pubKey: pubKey
      }
      commonMember.addGyPayPassword.remote(param, (data) => {
        if (data.data) {
          cookieTools.setCookie('step-register', config.authStep)
          dispatch.logout()
        }
      })
    }
  }
})
</script>
