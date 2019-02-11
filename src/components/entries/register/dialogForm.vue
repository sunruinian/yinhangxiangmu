<template>
  <el-dialog id='inviteDialog' title="邀请码注册" :before-close='closeInvit' v-model="supplierRegister" size=tiny :close-on-click-modal="false">
    <el-form :model="inviteForm" ref = 'inviteForm' :rules="inviteRules" label-width="100px" style="width:460px;margin:0px auto;">
      <el-form-item label="邀请码" prop="invite" >
        <el-input v-model="inviteForm.invite" placeholder="请输入邀请码" style="width:200px;" @change="getRelevanceCom" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="关联企业" prop='companyName'>
        <el-input v-model="inviteForm.companyName" style="width:200px;"  :disabled='true'  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="name">
        <el-input v-model="inviteForm.name" style="width:200px;"  placeholder="请输入登录账号" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="inviteForm.password" @change='pswChange' style="width:200px;" placeholder="请输入登录密码" type="password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="agin">
        <el-input v-model="inviteForm.agin" style="width:200px;" placeholder="请输入确认密码" type="password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin:-20px auto 0px; width:180px;">
      <el-button @click="closeInvit">取 消</el-button>
      <el-button type="primary" @click="userRegister">确定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import formExtends from 'components/entries/base/form'
import certService from 'common/api/service/certService'
// import authorityService from 'common/api/service/authorityService'
import commonDetail from 'common/api/common'
import merge from 'webpack-merge'
import commonLogin from 'common/api/login'

let instance = null
export default formExtends({
  name: 'registerForm',
  props: {
    supplierRegister: {
      type: Boolean,
      'default': true
    }
  },
  data () {
    return {
      inviteForm: {
        invite: '',
        enable: '',
        name: '',
        password: '',

        companyName: '',
        agin: ''
      },
      inviteRules: {
        name: [
          { required: true, message: '请填写登录账号！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              instance.isLoginName(value, callback)
            },
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              const param = {
                name: value
              }
              if (value === '') {
                callback('请填写登录账号！')
              } else {
                // instance.isLoginName(value, callback)
                if (value.length < 4 || value.length > 16) {
                  callback('登录账号长度为4~16位')
                }
                if (!this.data().regular.userName.test(value)) {
                  callback('登录账号应为数字与字母组合')
                }
                commonDetail.checkUserName.remote(param, (data) => {
                  if (data.data) {
                    callback('该用户名后台已存在！')
                  } else {
                    callback()
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ],
        invite: [
          { required: true, message: '请填写邀请码！', trigger: 'change' }
        ],
        password: [

          { required: true, message: '请填写登录密码！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              instance.isPassword(value, callback)
            },
            trigger: 'change'
          }
        ],
        agin: [
          { required: true, message: '请填写确认密码！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.inviteForm.password !== instance.inviteForm.agin) {
                callback('两次输入不一致请重新设置')
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        companyName: [
          { required: true, message: '请获取关联企业！', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    instance = this
    this.getPubKey()
  },
  methods: {
    getPubKey () {
      commonLogin.loginBefore.remote({}, (result) => {
        if (result.success) {
          localStorage.pubKey = result.data.pubKey
          this.$jsEncrypt.setPublicKey(localStorage.getItem('pubKey'))
        } else {
          this.$message.error('获取加密密钥失败，请稍候重试')
        }
      })
    },
    pswChange () {
      // 先输入确认密码，再输入密码 - 校验
      if (this.inviteForm.agin) {
        this.$refs.inviteForm.validateField('agin', (valid) => {})
      }
    },
    userRegister () { // 邀请码注册
      this.$refs.inviteForm.validate((valid) => {
        if (valid) {
          const param = merge({}, this.inviteForm)
          this.inviteForm = this.clearForm(this.inviteForm)
          param.enable = true
          commonLogin.userRegister.remote(param, (data) => {
            this.supplierRegister = false
            this.checkName = data.data
            if (data.success) {
              this.closeInvit()
              this.$message('注册成功,请登录！')
              // location.href = '/'
            }
          })
        }
      })
    },
    closeInvit () {
      this.$bus.$emit('register-close-dialog', false)
      this.$refs.inviteForm.resetFields()
    },
    getRelevanceCom () { // 获取关联公司
      const param = merge({}, this.inviteForm)
      if (param.invite.length < 6) return
      commonLogin.getRelevanceCom.remote(param, (data) => {
        this.inviteForm.companyName = data.data
      })
    },
    checkedAccount () { // 检测
      const param = merge({}, this.inviteForm)
      commonDetail.checkUserName.remote(param, (data) => {
        this.checkName = data.data
      })
      return this.checkName
    }
  }
})
</script>

<style>
#inviteDialog .el-form-item__error {
  width: 225px;
  top: 38px;
}
</style>
