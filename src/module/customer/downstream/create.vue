<template>
  <div class="content-area" >
    <div v-title='title'>
      {{title}}
    </div>
    <div class="content-body user-manage user-supplier pt40 pr20 pb40 pl20">
        <div class="inner-wrap">
            <el-form :model="formField" :rules="rules" ref="ruleForm" label-width="170px">
              <el-form-item label="供应商名称" prop="name">
                <el-input v-model="formField.name"></el-input><br>
                <span class="right-tip">建议填写企业全称。</span>
              </el-form-item>
              <el-form-item label="邀请码通知方式" prop="contactType" class="is-required">
                <el-radio-group v-model="formField.contactType" @change='inviteChange'>
                  <el-radio :label="0">短信通知</el-radio>
                  <el-radio :label="1">邮件通知</el-radio>
                </el-radio-group>
                <div class="right-tip">注：供应商只有使用邀请码才能注册爽融链平台。</div>
              </el-form-item>
              <el-form-item label="手机号码" prop="contact">
                <el-input v-model="formField.contact"></el-input><br>
                <span class="right-tip">用于接收平台注册所需的邀请码信息。</span>
              </el-form-item>
              <el-form-item label="供应商ERP编号" prop="remark">
                <el-input v-model="formField.remark"></el-input><br>
                <span class="right-tip">如有对应的ERP系统编号，则填写。</span>
              </el-form-item>
              <el-form-item>
                <el-button class="okbtn" type="primary" @click="onSubmit" :disabled="btnHide">确认创建</el-button>
              </el-form-item>

              <!-- 邀请码弹窗 -->
              <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                size="tiny"
                :before-close="handleClose">
                <span>创建供应商{{formField.name}}成功，邀请码为<span style="color: red">{{invite}}</span>，并已发送至所填手机号中，您还可在供应商列表中查看该邀请码。</span>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ok">好</el-button>
                </span>
              </el-dialog>
            </el-form>
        </div>
    </div>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/module/table.scss'
import 'common/sass/main.scss'
// import 'common/sass/module/supplier.scss'
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
// import supplierService from 'common/api/service/supplierService'
import formExtends from 'components/entries/base/form'
import coreDown from 'common/api/customer/core'

let instance = null
export default formExtends({
  name: 'app',
  components: {
    modal: modal,
    layout
  },
  data () {
    return {
      title: '添加账号',
      radio: null,
      invite: null, // 邀请码
      dialogVisible: false,
      formField: {
        name: '',
        remark: '',
        contactType: 0,
        contact: ''
      },
      btnHide: false,
      rules: {
        name: [
          { required: true, message: '请先写供应商名称', trigger: 'change' },
          { min: 1, max: 50, message: '长度在50个字符以内', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.regular.space.test(value)) {
                callback('供应商名称不可输入空格')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        remark: [
          { min: 0, max: 50, message: 'ERP编号应在50个字以内', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.regular.space.test(value)) {
                callback('ERP编号不可输入空格')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        contactType: {required: true},
        contact: [
          { required: true, message: '请填写正确的手机号', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.formField.contactType === 0) {
                instance.isPhone(value, callback)
              } else if (instance.formField.contactType === 1) {
                instance.isEmail(value, callback)
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () {
    instance = this
    // 监听页面请求错误
    this.$bus.$on('message-error', info => {
      this.dialogVisible = false
      this.btnHide = false
    })
  },
  beforeDestroy () {
    this.$refs.ruleForm.resetFields()
  },
  methods: {
    ok () {
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = this.formField
          // 按钮置灰，避免多次请求
          this.btnHide = true
          coreDown.createdUser.remote(params, (data) => {
            this.dialogVisible = true
            this.btnHide = false
            this.formField.contact = ''
            this.invite = data.data
            this.$refs.ruleForm.resetFields()
          })
        }
      })
    }
  }
})
</script>
