<template>
  <div class="step5-ccbc">
    <div class="inner-wrap" id='bindDialog'>
      <el-form :model="form" ref="ruleForm" label-width="160px" v-if ="pswShow">
        <!-- 密码加密控件容器 -->
        <el-form-item label="登录密码">
          <span>
            <span id="PPP">
               <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入登录密码">
            </span>
            <span id="EEE"></span>
          </span>
        </el-form-item>
        <!-- <el-form-item class="username" prop = 'password' label="登录密码:">
          <el-input v-model="form.password" type='password' placeholder="请输入登录密码"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button  @click="onSubmit" :loading="btnLoading">下一步</el-button>
        </el-form-item>
        <div style="border: 1px solid transparent"></div>
      </el-form>
      <el-form :model="fromNo" ref="ruleForm1" :rules="rules" label-width="160px" v-if ="!pswShow">
        <!-- 密码加密控件容器 -->
        <!-- <el-form-item label="登录密码" v-if ="pswShow">
          <span>
            <span id="PPP">
               <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入登录密码">
            </span>
            <span id="EEE"></span>
          </span>
        </el-form-item> -->
        <el-form-item prop = 'password' label="登录密码:">
          <el-input v-model="fromNo.password" type='password' placeholder="请输入登录密码"></el-input>
          <p class="mb10" style="margin-top:10px;"><span class="require">*</span><span class="c999">密码为8-20位且至少2种以上的数字、字母或符号组合。</span></p>
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
// import authorityService from 'common/api/service/authorityService'
import formExtends from 'components/entries/base/form'
import PSWTools from 'common/javascript/features/psw.js'
import dispatch from 'module/member/service/dispatch'
import config from 'common/config/config'
import cfca from 'common/javascript/features/cfca'
import commonLogin from 'common/api/login'
import commonMember from 'common/api/member/common'

let instance = null
export default formExtends({
  name: 'validate',
  components: {
  },
  props: ['active'],
  data () {
    return {
      // pswShow: config.project[0] === localStorage.type || localStorage.typeForget,
      btnLoading: false,
      form: {
        password: ''
      },
      fromNo: {
        password: ''
      },
      rules: {
        password: [
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
        ]
      },
      pswShow: null || config.project[1] === localStorage.type
    }
  },
  mounted () {
    // 生成密码加密控件容器
    instance = this
    if (localStorage.type === '') {
      this.superBefore()
    }
    if (config.project[1] === localStorage.type) {
      var content = PSWTools.PEWritePassObject()
      var span = document.getElementById('PPP')
      span.innerHTML += content
    }
    // 监听页面请求错误
    this.$bus.$on('message-error', info => {
      this.btnLoading = false
    })
  },
  methods: {
    // 下一步
    onSubmit () {
      if (this.pswShow) {
        var powerpass = document.getElementById('powerpass')
        var nonce = localStorage.getItem('nonce')
        commonLogin.loginBefore.remote({}, result => {
          if (result.success) {
            let pubKey = result.data.pubKey
            this.form.password = PSWTools.getSM2IBSPassword(powerpass, pubKey)
            let param = {
              originParam: {
                nonce: nonce,
                password: this.form.password
              },
              signStr: ''
            }
            const originParamStr = JSON.stringify(param.originParam)
            const signStr = this.sign(originParamStr, true)
            param.signStr = signStr
            // this.active.step = 3
            this.reset(param)
          } else {
            this.$message.error('获取加密密钥失败，请稍候重试')
          }
        })
      } else {
        // const self = this
        this.$refs.ruleForm1.validate(valid => {
          if (valid) {
            cfca.selectCert('', '', '', false)
            const info = cfca.getInfo()
            var param = {
              issuerDn: info.issuerDN,
              serialNo: info.serialNumber,
              originParam: {
                nonce: this.active.nonce,
                password: this.fromNo.password
              },
              // originalStr: info.originalStr,
              // pubKey: this.active.pubKey
              pubKey: encodeURIComponent(this.active.pubKey)
            }
            param.signStr = this.sign(JSON.stringify(param.originParam), true)
            commonMember.resetNoPassWord.remote(param, (data) => {
              if (data.data) {
                this.$message.success('密码修改成功')
                this.active.step = 3
                // dispatch.logout()
              } else {
                this.$message({
                  message: data.error.errorMessage,
                  type: 'error'
                })
              }
            })
          }
        })
      }
    },
    reset (param) {
      commonMember.resetPassWord.remote(param, result => {
        if (result.success) {
          this.active.step = 3
        } else if (result.error) {
          let code = result.error.errorCode
          if (code === 201002) {
            this.onSubmit()
          }
          if (code === 201003) {
            this.$message.error(result.error.errorMessage)
            dispatch.logout()
          }
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },
    superBefore () {
      commonLogin.superBefore.remote({}, result => {
        if (result.success) {
          if (result.data.type === 'ORIGINAL') {
            this.pswShow = true
          } else {
            this.pswShow = false
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
#bindDialog .el-form-item__error {
  width: 300px;
  top: 38px;
}
/* .el-form-item__error */
</style>
