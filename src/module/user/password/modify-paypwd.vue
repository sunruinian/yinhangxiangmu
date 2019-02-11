<template>
  <div style="width:500px;margin:0 auto;padding-top:20px">
    <el-form :model="payForm" :rules="payForm.rules" ref="payFormRef" label-width="120px">
      <div v-if='!pswShow'>
        <el-form-item label="原支付密码" prop="payOldPwd">
          <el-input v-model="payForm.payOldPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="payNewPwd">
          <el-input v-model="payForm.payNewPwd" type="password" @change='newPwdChange'></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="payNewPwd2">
          <el-input v-model="payForm.payNewPwd2" type="password"></el-input>
        </el-form-item>
      </div>
      <div v-if='pswShow' style="margin-top:30px">
        <div class="loginName">登录账号：{{loginName}}</div>
        <el-form-item style="margin-bottom:-5px" label="新密码" prop="payNewPwd2">
          <span v-if='pswShow'>
            <span id="PPPPay">
               <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入账号密码">
            </span>
            <span id="EEE"></span>
          </span>
        </el-form-item>
      </div>
      <el-form-item>
        <p class="mb10"><span class="require">*</span><span class="c999">密码为8-20位且至少2种以上的数字、字母或符号组合。</span></p>
        <el-button class="commit" type="primary" @click="payFormSubmit">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script type="text/javascript">
import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/module/table.scss'
import 'common/sass/main.scss'
import 'common/sass/module/supplier.scss'
import formExtends from 'components/entries/base/form'
// import infoManageService from 'common/api/service/infoManageService'
import commonPayPWD from 'common/api/user/common'
import cfca from 'common/javascript/features/cfca'
import PSWTools from 'common/javascript/features/psw.js'
import config from 'common/config/config'

let instance = null
export default formExtends({
  name: 'app',
  components: {
  },
  data () {
    return {
      loginName: '',
      payForm: {
        payOldPwd: null,
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
      },
      pswShow: localStorage.type === config.project[1]
    }
  },
  mounted () {
    this.loginName = sessionStorage.getItem('userName')
    this.$refs.payFormRef.resetFields()
    instance = this
    if (this.pswShow) {
      this.$nextTick(() => {
        // 生成密码加密控件容器
        var content = PSWTools.PEWritePassObject()
        var span = document.getElementById('PPPPay')
        span.innerHTML += content
      })
    }
  },
  beforeDestroy () {
    this.$refs.payFormRef.resetFields()
  },
  methods: {
    newPwdChange (value) {
      // 先输入确认新密码，再输入新密码 - 校验
      if (instance.payForm.payNewPwd2) {
        instance.$refs.payFormRef.validateField('payNewPwd2', (valid) => {})
      }
    },
    payFormSubmit () {
      const self = this
      if (this.pswShow) { // 使用加密控件
        this.modifySubmit()
        // this.$bus.$emit('resetPWD-info', [true, 2])
      } else {
        self.$refs.payFormRef.validate((valid) => {
          if (valid) {
            this.submit()
          }
        })
      }
    },
    modifySubmit () {
      // 使用gy控件的重置支付密码
      var powerpass = document.getElementById('powerpass')
      const self = this
      cfca.selectCert('', '', '', false)
      let pubKey = localStorage.getItem('pubKey')
      let password = PSWTools.getSM2IBSPassword(powerpass, pubKey)
      let param = {
        resetOriParam: {
          payPwd: password,
          userName: this.loginName
        },
        signStr: ''
      }
      const resetOriParam = JSON.stringify(param.resetOriParam)
      const signStr = this.sign(resetOriParam, true)
      param.signStr = signStr
      commonPayPWD.modifyPayPWD.remote(param, (data) => {
        if (data.data) {
          self.$message.success('密码修改成功')
          this.$bus.$emit('resetPWD-info', [true, 2])
        } else {
          self.$message({
            message: data.error.errorMessage,
            type: 'error'
          })
        }
      })
    },
    submit () {
      const self = this
      cfca.selectCert('', '', '', false)
      const info = cfca.getInfo()
      var param = {
        modifyParam: {
          newPwd: self.payForm.payNewPwd,
          oldPwd: self.payForm.payOldPwd
        },
        serialNo: info.serialNumber,
        issuerDn: info.issuerDN
      }
      param.signStr = this.sign(JSON.stringify(param.modifyParam), true)
      commonPayPWD.modifyPayPassword.remote(param, (data) => {
        if (data.data) {
          self.$message.success('密码修改成功')
          setTimeout(function () {
            location.reload()
          }, 2000)
        } else {
          self.$message({
            message: data.error.errorMessage,
            type: 'error'
          })
        }
      })
    }
  }
})
</script>
<style scoped>
.commit{
  width: 160px;
  height: 36px;
  background: #FB642A;
  border: 1px solid #FB642A;
  border-radius: 4px;
  color: #FFFFFF;
  font-family: "SourceHanSansCN-Medium";
}
</style>
