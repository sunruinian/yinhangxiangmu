<template>
  <div class="content-area">
    <div v-title='title'>
      {{title}}
    </div>
    <div class="content-body user-manage user-supplier pt40 pr20 pb40 pl20">
      <div class="inner-wrap">
        <el-form :model="inviteForm" ref = 'inviteForm' :rules="inviteRules" label-width="120px" style="width:460px;margin:0px auto;">
          <el-form-item label="邀请码" prop="invite" >
            <el-input v-model="inviteForm.invite" placeholder="请输入邀请码" style="width:200px;" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邀请企业名称" prop='companyName'>
            <el-input v-model="inviteForm.companyName" style="width:200px;"  :disabled='true'  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="okbtn" type="primary" @click="onSubmit" :disabled="btnHide">创建关联</el-button>
          </el-form-item>
        </el-form>
        <div v-show="show">
          <el-dialog
            size=tiny :close-on-click-modal="true"
            :visible.sync="show"
            :modal="true"
            :show-close="false"
            width="25%"
            >
            <span style="text-align: center;display: block">已完成关联</span>
            <span style="text-align: center;display: block">客户信息可在下游列表查看</span>
            <span slot="footer" class="dialog-footer" style="text-align: center;display: block">
               <el-button type="danger" @click="showIs">好</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
// import 'common/sass/module/table.scss'
// import 'common/sass/main.scss'
import 'common/sass/module/supplier.scss'
// import formExtends from 'components/entries/base/form'
// import certService from 'common/api/service/certService'
import coreDown from 'common/api/customer/core'
// import authorityService from 'common/api/service/authorityService'
// import supplierService from 'common/api/service/supplierService'
// import merge from 'webpack-merge'
export default ({
  data () {
    return {
      title: '添加账号',
      inviteForm: {
        invite: '',
        companyName: ''
      },
      show: false,
      btnHide: false,
      inviteRules: {
        invite: [
          { required: true, message: '请填写邀请码！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value.length === 6) {
                coreDown.ConnectUser.remote(value, (data) => {
                  if (data.data) {
                    // 邀请码存在
                    this.inviteForm.companyName = data.data
                    callback()
                  } else {
                    // // 111001-邀请码不存在;111002-邀请码过期 ;301001-不能关联其他企业
                    let code = data.error.errorCode
                    let errorMessage = data.error.errorMessage
                    if (code === 900001 || code === 900002 || code === 900003) {
                      callback(errorMessage)
                    } else {
                      callback()
                    }
                  }
                })
              } else if (value.length > 6) {
                callback('邀请码不存在')
              }
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
    // this.getPubKey()
  },
  methods: {
    // getPubKey () {
    //   authorityService.loginBefore.remote({}, (result) => {
    //     if (result.success) {
    //       localStorage.pubKey = result.data.pubKey
    //       this.$jsEncrypt.setPublicKey(localStorage.getItem('pubKey'))
    //     } else {
    //       this.$message.error('获取加密密钥失败，请稍候重试')
    //     }
    //   })
    // },
    // closeInvit () {
    //   this.$bus.$emit('register-close-dialog', false)
    //   this.$refs.inviteForm.resetFields()
    // },
    onSubmit () {
      this.$refs.inviteForm.validate((valid) => {
        if (valid) {
          this.btnHide = true
          let params = {
            companyName: this.inviteForm.companyName,
            invite: this.inviteForm.invite
          }
          coreDown.createdConnect.remote(params, (data) => {
            if (data.success) {
              this.iSshow()
              this.$refs.inviteForm.resetFields()
              this.btnHide = false
            } else {
              let code = data.error.errorCode
              let errorMessage = data.error.errorMessage
              if (code === 301002) {
                this.$message.error(errorMessage)
                this.btnHide = false
                this.$refs.inviteForm.resetFields()
              }
              this.btnHide = false
            }
          })
        }
      })
    },
    iSshow () {
      this.show = true
      this.off()
    },
    off () {
      setTimeout(() => {
        this.show = false
      }, 3000)
    },
    showIs () {
      this.show = false
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
