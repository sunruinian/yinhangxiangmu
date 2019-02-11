<template>
  <el-form :model="loginForm" :rules="loginForm.rules" ref="loginFormRef" label-width="120px">
    <span v-if='pswShow' style="margin-left:100px">
      <span id="PPPLOGIN">
        <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入账号密码">
      </span>
      <span id="EEE"></span>
    </span>
    <div v-if='!pswShow'>
      <el-form-item label="密码" prop="newPwd">
        <el-input v-model="loginForm.newPwd" type="password" @change='newPwdChange'></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPwd2">
        <el-input v-model="loginForm.newPwd2" type="password"></el-input>
      </el-form-item>
    </div>
    <el-form-item v-show = "pswShow">
      <p class="mb10"><span class="require">*</span><span class="c999">密码为8-20位且至少2种以上的数字、字母或符号组合。</span></p>
      <el-button class="okbtn" type="primary" @click="loginGyFormSubmit">下一步</el-button>
    </el-form-item>
    <el-form-item  v-show = "!pswShow">
      <p class="mb10"><span class="require">*</span><span class="c999">密码为8-20位且至少2种以上的数字、字母或符号组合。</span></p>
      <el-button class="okbtn" type="primary" @click="loginFormSubmit">下一步</el-button>
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
// import infoManageService from 'common/api/service/infoManageService'
import commonDetail from 'common/api/common'
import cfca from 'common/javascript/features/cfca'
import config from 'common/config/config'
import PSWTools from 'common/javascript/features/psw.js'

let instance = null
export default formExtends({
  name: 'app',
  components: {
  },
  data () {
    return {
      loginName: sessionStorage.getItem('userName'),
      pswShow: localStorage.type === config.project[1],
      loginForm: {
        newPwd: null,
        newPwd2: null,
        rules: {
          newPwd: [
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
          newPwd2: [
            { required: true, message: '必须填写', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                if (instance.loginForm.newPwd !== instance.loginForm.newPwd2) {
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
        var span = document.getElementById('PPPLOGIN')
        span.innerHTML += content
      })
    }
    this.$refs.loginFormRef.resetFields()
    instance = this
  },
  beforeDestroy () {
    this.$refs.loginFormRef.resetFields()
  },
  methods: {
    newPwdChange (value) {
      // 先输入确认新密码，再输入新密码 - 校验
      if (instance.loginForm.newPwd2) {
        instance.$refs.loginFormRef.validateField('newPwd2', (valid) => {})
      }
    },
    loginGyFormSubmit () {
      var powerpass = document.getElementById('powerpass')
      const self = this
      cfca.selectCert('', '', '', false)
      let pubKey = localStorage.getItem('pubKey')
      let password = PSWTools.getSM2IBSPassword(powerpass, pubKey)
      let param = {
        pwdOriParam: {
          newPwd: password,
          userName: this.loginName
        },
        signStr: ''
      }
      const resetPwdOriParam = JSON.stringify(param.pwdOriParam)
      const signStr = this.sign(resetPwdOriParam, true)
      param.signStr = signStr
      commonDetail.modifyLoginPWD.remote(param, (data) => {
        if (data.data) {
          self.$message.success('密码修改成功')
          this.$bus.$emit('set-login', 2)
        } else {
          self.$message({
            message: data.error.errorMessage,
            type: 'error'
          })
        }
      })
    },
    loginFormSubmit () {
      const self = this
      let dn = sessionStorage.issuerDn
      if (dn === 'null' || dn === null || dn === '' || dn === undefined) {
        this.$message.error('请先绑定证书！')
      } else {
        self.$refs.loginFormRef.validate((valid) => {
          if (valid) {
            // cfca.selectCert()
            cfca.selectCert('', '', '', false)
            const info = cfca.getInfo()
            var param = {
              issuerDn: info.issuerDN,
              serialNo: info.serialNumber,
              modifyParam: {
                newPwd: self.loginForm.newPwd,
                oldPwd: 'a1b2c3d4'
              }
            }
            param.originalStr = JSON.stringify(param.modifyParam)
            // param.signStr = this.sign(JSON.stringify(param.modifyParam), true)
            const signStr = this.sign(JSON.stringify(param.modifyParam), true)
            param.signStr = signStr

            commonDetail.modifyLoginPassword.remote(param, (data) => {
              if (data.data) {
                this.$bus.$emit('set-login', 2)
              }
            })
          }
        })
      }
    }
  }
})
</script>
