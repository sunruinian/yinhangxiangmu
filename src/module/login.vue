<template>

  <div class="content-m">
     <div v-title='title'>{{title}}</div>
      <vnav></vnav>
      <div class="out-box" style="">
        <div class="container">
          <div style="float:left; height:100%; right:4">
              <div class="idea-item top-item" style="height: 80px;font-size:13px">
                <img src="../common/image/login.png" alt="" style="margin-top:70px">
              </div>
          </div>
          <div class="info-box animation-fide-in top-item" style="float:right; margin-left:0px;">
             <div class="title">
               <span class="acitve" style="font-size:14px; margin-top:0px; margin-bottom: 25px; font-weight: 600">账号登录</span>
             </div>
             <div>
               <el-form :model="form" :rules="rules" ref="ruleForm" label-width="0px">
                 <el-form-item class="username" label="" prop = 'username'>
                   <el-input v-model="form.username" placeholder="请输入注册账号信息" ></el-input>
                 </el-form-item>
                 <el-form-item v-show='gyInputShow' class="password" label="" prop = 'password'>
                   <el-input v-if='!pswShow' v-model="form.password" type='password' placeholder="请输入账号密码" ></el-input>
                   <!-- 密码加密控件容器 -->
                   <span v-if='pswShow'>
                     <span id="PPP">
                        <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入账号密码">
                     </span>
                     <span id="EEE"></span>
                   </span>
                 </el-form-item>
               </el-form>
             </div>
             <button class="login-button" @click="prepareData" style='"font-size:12px;margin-top:-20px;'>登录</button>
             <div class="tip">
               <span>邀请码用户请前往<a  @click="getRegisterDialog" style="text-decoration:none; font-size:12px;">注册</a></span>
               <a  class="forget-password" href="#/member/forget" style="text-decoration:none;">忘记密码?</a>
             </div>
          </div>
        </div>
      </div>
      <vfooter></vfooter>
      <div v-show='supplierRegister'>
        <component v-bind:is="register" v-bind:supplierRegister='supplierRegister'></component>
      </div>
  </div>
</template>

<script>
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
// import 'common/sass/component/component.scss'
import 'common/sass/module/index.scss'
import 'common/sass/module/account.scss'
import vnav from 'components/include/index-nav'
import left from 'components/include/left'
import vfooter from 'components/include/index-footer'
import CFCATools from 'common/javascript/features/cfca.js'
import PSWTools from 'common/javascript/features/psw.js'
import formExtends from 'components/entries/base/form'
// import certService from 'common/api/service/certService'
// import authorityService from 'common/api/service/authorityService'
import config from 'common/config/config'
import cookieTools from 'common/javascript/tools/cookieTools'
import merge from 'webpack-merge'
import dispatch from 'module/member/service/dispatch'
import accessControl from 'common/javascript/tools/accessControl.js'
import commonLogin from 'common/api/login'

// var instance = null
export default formExtends({
  name: 'app',
  components: {
    vnav,
    left,
    vfooter
  },
  data () {
    return {
      title: '爽融链平台',
      supplierRegister: false,
      checkName: false,
      register: null,
      form: {
        username: '',
        password: ''
      },
      loginData: null,
      inviteForm: {
        invite: '',
        enable: '',
        name: '',
        password: '',
        companyName: '',
        agin: ''
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
      },
      nonce: null,
      pswShow: null,
      gyInputShow: true
    }
  },
  created () {

  },
  mounted () {
    this.superBefore()
    this.$bus.$on('GY-input', data => {
      this.gyInputShow = data
    })
    this.$bus.$on('register-close-dialog', switchOpen => {
      this.supplierRegister = switchOpen
    })
    this.form.password = ''
    const role = cookieTools.getCookie('role')
    if (role) {
      this.direct()
    }
  },
  beforeUpdate () {
    // var spanDialog = document.getElementById('PPPLOGIN')
    // var span = document.getElementById('PPP')
    // span.style.display = 'none'
    // if (spanDialog) {
    //   span.style.display = 'none'
    // } else {
    //   span.style.display = 'block'
    // }
  },
  methods: {
    selectCert () {
      CFCATools.selectCert('', '', '', false)
      this.signModel = CFCATools.getCertInfo('SubjectDN')
      this.IssuerDN = CFCATools.getCertInfo('IssuerDN')
    },
    prepareData () {
      if (this.pswShow) {
        // 密码用贵阳的加密控件加密
        var powerpass = document.getElementById('powerpass')
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            CFCATools.selectCert('', '', '', false)
            commonLogin.loginBefore.remote({}, result => {
              if (result.success) {
                this.nonce = result.data.nonce
                localStorage.pubKey = result.data.pubKey
                this.form.password = PSWTools.getSM2IBSPassword(powerpass, localStorage.getItem('pubKey'))
                const info = CFCATools.getInfo()
                const signStr = encodeURI(this.sign(this.nonce, true))
                sessionStorage.setItem('serialNo', info.serialNumber)
                sessionStorage.setItem('issuerDn', info.issuerDN)
                this.loginData = merge({}, this.form)
                this.loginData.username = encodeURI(
                  JSON.stringify({
                    type: 0,
                    value: this.form.username,
                    serialNo: info.serialNumber,
                    issuerDn: info.issuerDN,
                    sequenceNo: this.nonce,
                    signStr: signStr,
                    pubKey: encodeURIComponent(localStorage.getItem('pubKey'))
                  })
                )
                this.login(this.loginData)
              } else {
                this.$message.error('获取加密密钥失败，请稍候重试')
              }
            })
          }
        })
      } else {
        // 登录操作-获取公钥加密
        if (this.form.username === '') {
          this.$message.error('请输入用户名')
          return
        } else if (this.form.password === '') {
          this.$message.error('请输入密码')
          return
        }
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            CFCATools.selectCert('', '', '', false)
            commonLogin.loginBefore.remote({}, result => {
              if (result.success) {
                this.nonce = result.data.nonce
                localStorage.pubKey = result.data.pubKey
                this.$jsEncrypt.setPublicKey(localStorage.getItem('pubKey'))
                const info = CFCATools.getInfo()
                const signStr = encodeURI(this.sign(this.nonce, true))
                sessionStorage.setItem('serialNo', info.serialNumber)
                sessionStorage.setItem('issuerDn', info.issuerDN)
                this.loginData = merge({}, this.form)
                this.loginData.password = encodeURIComponent(this.$jsEncrypt.encrypt(this.form.password))
                this.loginData.username = encodeURI(
                  JSON.stringify({
                    type: 0,
                    value: this.form.username,
                    serialNo: info.serialNumber,
                    issuerDn: info.issuerDN,
                    sequenceNo: this.nonce,
                    signStr: signStr,
                    pubKey: encodeURIComponent(localStorage.getItem('pubKey'))
                  })
                )
                this.login(this.loginData)
              } else {
                this.$message.error('获取加密密钥失败，请稍候重试')
              }
            })
          }
        })
      }
    },
    login (loginData) {
      commonLogin.userNameLogin.remote(loginData, result => {
        if (result.success) {
          this.loginHandle(result)
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },
    loginHandle (data) {
      // 登录成功
      var accessArr = []
      var companyType = 1
      const info = data.data
      const isReal = !(info.userInfo.registerStep < 5) // true表未实名，false表实名了
      if (info.staticResources) {
        localStorage.resource = JSON.stringify(info.staticResources)
        accessControl.initResourceStr()
        accessArr = accessControl.getAllAccess()
        for (var i = 0; i < accessArr.length; i++) {
          if (accessArr[i].url.indexOf('/voucher/create') !== -1) {
            companyType = 1
            break
          } else if (accessArr[i].url.indexOf('/voucher/sign') !== -1) {
            companyType = 2
            break
          } else if (accessArr[i].url.indexOf('/customer/f-core-enterprise') !== -1) {
            companyType = 3
            break
          }
        }
        cookieTools.setCookie('role', companyType, 0.05) // 1 核心企业 2. 供应商 3. 资金方
      }

      cookieTools.setCookie('certificationStatus', isReal ? 1 : 0)
      cookieTools.setCookie('step-register', info.userInfo.registerStep)
      sessionStorage.setItem('userStatus', info.userInfo.status)
      sessionStorage.setItem('userName', info.userInfo.name)
      sessionStorage.setItem('companyName', info.userInfo.companyName)
      // accountService.userCurrent.remote({}, (user) => {
      //   sessionStorage.setItem('serialNo', user.data.cert.serialNo)
      //   sessionStorage.setItem('issuerDn', user.data.cert.issuerDn)
      // }).catch(error => {
      // })

      if (!isReal) {
        // 实名未完成
        // accountService.userCurrent.remote({}, (user) => {
        //   sessionStorage.setItem('serialNo', user.data.cert.serialNo)
        //   sessionStorage.setItem('issuerDn', user.data.cert.issuerDn)
        // })
        location.href = '#/member/register'
        return
      } else if (info.staticResources === undefined || info.staticResources === null || info.staticResources === '') {
        // 已实名但没有权限
        // 没有权限跳不跳
        if (config.noAccessJump) {
          location.href = '#/noaccess'
        }
        return
      }
      for (let i = 0; i < accessArr.length; i++) {
        if (accessArr[i].level === 1) {
          location.href = '#' + accessArr[i].url
          return
        }
      }
      // 特殊情况下（如添加融资意向的路由没出来），没有有效路由
      // 没有权限跳不跳
      if (config.noAccessJump) {
        location.href = '#/noaccess'
      }
      return
    },
    direct () {
      dispatch.login()
    },
    getRegisterDialog () {
      require.ensure(
        ['module/member/register/dialogForm'],
        () => {
          const register = require('module/member/register/dialogForm')
          this.register = this.$vue.component('dialogForm', register)
          this.supplierRegister = true
          this.$bus.$emit('GY-input', false)
        },
        'register'
      )
    },
    superBefore () {
      commonLogin.superBefore.remote({}, result => {
        if (result.success) {
          localStorage.type = result.data.type
          if (result.data.type === 'ORIGINAL') {
            this.pswShow = false
          } else {
            this.pswShow = true
          }
        }
        this.$nextTick(() => {
          if (this.pswShow) {
            // 生成密码加密控件容器
            var content = PSWTools.PEWritePassObject()
            var span = document.getElementById('PPP')
            span.innerHTML += content
          }
        })
      })
    }
  }
})
</script>

<style>
.info-box .login-button{height:36px; border-radius: 4px;}
.container{ position: absolute; top: 50%; left: 50%; width: 720px; margin-top: -140px; margin-left: -360px; }
.info-box { padding: 25px 20px 25px;}
.el-form-item.username{margin-bottom:20px;}
.el-form-item.password{margin-bottom:30px;}
.info-box .tip {height:auto; margin-top: 16px;}
.info-box .tip .forget-password{ color: #fb642a}
</style>
