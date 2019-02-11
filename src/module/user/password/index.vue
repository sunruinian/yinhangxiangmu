<template>
  <div class="content-area" >
    <div v-title='title'>
      {{title}}
    </div>
    <div class="content-body">

            <!-- <div class="item-tit"><span class="item-tit-icon"></span>{{title}}</div>
            <div class="item-cnt"> -->
                <div class="tab-bar">
                  <!-- <span class="span-wrap">
                    <span
                    class="tab-button"
                    v-for="(item, index) in tabsData"
                    :index = "index"
                    :key = "item"
                    v-show="item.access"
                    v-bind:class="item.selected ? 'active':''"
                    @click="tabChange(index)">
                    {{item.name}}
                    </span>
                  </span> -->
                  <span class="tab-group">
                    <span class="tab-item" v-for="(item, index) in tabsData" :index="index" :key="index" :class="item.selected ? 'active':''" @click="tabChange(index)">{{item.name}}</span>
                  </span>
                </div>
                <div class="long boxShadow pb20">
                  <div v-if ="whichShow==0 && tabsData[0].access" style="padding-top:0.1px;">
                    <div style="width:500px;margin:20px auto">
                      <el-form :model="loginForm" :rules="loginForm.rules" ref="loginFormRef" label-width="120px">
                        <div class="psw" v-if='!pswShow'>
                          <el-form-item label="原密码" prop="oldPwd">
                            <el-input v-model="loginForm.oldPwd" type="password"></el-input>
                          </el-form-item>
                          <el-form-item label="新密码" prop="newPwd">
                            <el-input v-model="loginForm.newPwd" type="password" @change='newPwdChange'></el-input>
                          </el-form-item>
                          <el-form-item label="确认新密码" prop="newPwd2">
                            <el-input v-model="loginForm.newPwd2" type="password"></el-input>
                          </el-form-item>
                        </div>
                        <div v-if='pswShow' style="margin-top:30px">
                          <div class="loginName">登录账号：{{loginName}}</div>
                          <el-form-item style="margin-bottom:-5px" label="新密码" prop="newPwd2">
                            <span v-if='pswShow'>
                              <span id="PPP">
                                 <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入账号密码">
                              </span>
                              <span id="EEE"></span>
                            </span>
                          </el-form-item>
                        </div>
                        <el-form-item>
                          <p class="mb10"><span class="require">*</span><span class="c999">密码为8-20位且至少2种以上的数字、字母或符号组合。</span></p>
                          <el-button class="commit" @click="loginFormSubmit">重置</el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                  <div class="step5-ccbc" v-if = "setPayDown">
                    <div id='bindDialog' style="margin-top:46px;margin-left:60px">
                      <div style="display:inline-block;vertical-align:middle"><span class="iconfont icon-success" style="font-size:80px;color:#FC5A1F;"></span></div>
                      <div style="display:inline-block;">
                        <p style="font-size:18px;font-weight:500;color:#333333;">重置成功，请使用新的支付密码</p>
                      </div>
                    </div>
                  </div>
                    <div v-if ="whichShow==1 && tabsData[1].access">
                      <modifypaypwd></modifypaypwd>
                  </div>
                  <div class="step5-ccbc" v-if = "setDown">
                    <div id='bindDialog' style="margin-top:46px;margin-left:60px">
                      <div style="display:inline-block"><span class="iconfont icon-success" style="font-size:80px;color:#fb642a;"></span></div>
                      <div style="display:inline-block;width:217px">
                        <p style="font-size:18px;font-weight:500;color:#333333;">密码设置完成，请重新登录</p>
                        <p style="font-size:14px;color:#999999;text-align: left">{{count}}秒后，将跳转至登录页面</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        <!-- </div> -->
    </div>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
// import 'common/sass/module/table.scss'
// import 'common/sass/main.scss'
// import 'common/sass/module/supplier.scss'
import formExtends from 'components/entries/base/form'
import modifypaypwd from 'module/user/password/modify-paypwd'
// import infoManageService from 'common/api/service/infoManageService'
import commonDetail from 'common/api/common'
import cfca from 'common/javascript/features/cfca'
import accessControl from 'common/javascript/tools/accessControl.js'
import config from 'common/config/config'
import PSWTools from 'common/javascript/features/psw.js'
import dispatch from 'module/member/service/dispatch'

let instance = null
export default formExtends({
  name: 'app',
  components: {
    modifypaypwd: modifypaypwd
  },
  data () {
    return {
      count: null,
      title: '安全信息',
      whichShow: 0,
      setDown: false,
      setPayDown: false,
      loginName: '',
      tabsData: [
        {name: '登录密码', selected: true, access: true},
        {name: '支付密码', selected: false, access: false}
      ],
      loginForm: {
        oldPwd: null,
        newPwd: null,
        newPwd2: null,
        rules: {
          oldPwd: { required: true, message: '必须填写', trigger: 'change' },
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
                // if (!instance.regular.password.test(value)) {
                //   callback('密码是数字和字母组合')
                // }
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
      },
      pswShow: localStorage.type === config.project[1]
    }
  },
  mounted () {
    this.loginName = sessionStorage.getItem('userName')
    this.tabChange(0)
    instance = this
    this.tabsData[0].selected = this.tabsData[0].access = accessControl.checkAccess('/user/password/modify-login')
    this.tabsData[1].access = accessControl.checkAccess('/user/password/modify-pay')
    this.tabsData[1].selected = !this.tabsData[0].access
    this.whichShow = this.tabsData[0].selected ? 0 : 1
    if (this.pswShow) {
      this.$nextTick(() => {
        // 生成密码加密控件容器
        var content = PSWTools.PEWritePassObject()
        var span = document.getElementById('PPP')
        span.innerHTML += content
      })
    }
    this.$bus.$on('resetPWD-info', info => {
      this.setPayDown = info[0]
      this.whichShow = info[1]
    })
  },
  beforeDestroy () {
    this.$refs.loginFormRef && this.$refs.loginFormRef.resetFields()
  },
  methods: {
    showTime () {
      const TIME_COUNT = 3
      this.count = TIME_COUNT
      this.timer = setInterval(() => {
        if (this.count >= 1) {
          this.count--
        }
        if (this.count === 0) {
          clearInterval(this.timer)
          dispatch.logout()
        }
      }, 1000)
    },
    tabChange: function (index) {
      // 清空表单信息
      this.$refs.loginFormRef && this.$refs.loginFormRef.resetFields()
      this.setPayDown = false
      this.setDown = false
      this.tabsData.forEach(function (item) {
        item.selected = false
      })
      this.tabsData[index].selected = true
      this.whichShow = index
      var span = document.getElementById('PPP')
      if (this.pswShow && !span) {
        // 切换tab后，判断是否有gy控件生成，没有就再生成一次
        this.$nextTick(() => {
          // 生成密码加密控件容器
          var content = PSWTools.PEWritePassObject()
          var span = document.getElementById('PPP')
          span.innerHTML += content
        })
      }
    },
    newPwdChange (value) {
      // 先输入确认新密码，再输入新密码 - 校验
      if (instance.loginForm.newPwd2) {
        instance.$refs.loginFormRef.validateField('newPwd2', (valid) => {})
      }
    },
    loginFormSubmit () {
      const self = this
      // this.whichShow = 2
      // this.showTime()
      // cfca.selectCert()
      if (this.pswShow) { // 使用加密控件
        this.loginGYSubmit()
      } else {
        self.$refs.loginFormRef.validate((valid) => {
          if (valid) {
            this.loginSubmit()
          }
        })
      }
    },
    loginGYSubmit () {
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
          this.setDown = true
          this.whichShow = 2
          this.showTime()
          // setTimeout(function () {
          //   location.reload()
          // }, 2000)
        } else {
          self.$message({
            message: data.error.errorMessage,
            type: 'error'
          })
        }
      })
    },

    loginSubmit () {
      const self = this
      cfca.selectCert('', '', '', false)
      const info = cfca.getInfo()
      var param = {
        issuerDn: info.issuerDN,
        serialNo: info.serialNumber,
        modifyParam: {
          newPwd: self.loginForm.newPwd,
          oldPwd: self.loginForm.oldPwd
        },
        originalStr: info.originalStr,
        pubKey: info.pubKey
      }
      param.signStr = this.sign(JSON.stringify(param.modifyParam), true)
      commonDetail.modifyLoginPassword.remote(param, (data) => {
        if (data.data) {
          self.$message.success('密码修改成功')
          // dispatch.logout()
          this.whichShow = 2
          this.setDown = true
          this.showTime()
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
<style scoped="scoped">
  .info-safe .form-border {
    border: none;
  }
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
