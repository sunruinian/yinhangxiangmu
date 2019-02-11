<template>
  <div class="content-area" >
    <div v-title='title'>
    {{title}}
  </div>
    <div class="group">
        <div class="span12 path-nav ">
            <ol>
                <li><a href="#">客户管理</a></li>>
                <li><a href="#"><strong>{{title}}</strong></a></li>
            </ol>
        </div>
    </div>
    <div class="content-body user-manage user-supplier pt40 pr20 pb40 pl20">
        <div class="inner-wrap">
            <el-form :model="formField" :rules="rules" ref="ruleForm" label-width="170px">
              <el-form-item label="核心企业名称" prop="name">
                <el-input v-model="formField.name"></el-input><br>
                <span class="right-tip">建议填写企业全称。</span>
              </el-form-item>
              <el-form-item label="手机号码" prop="contact">
                <el-input v-model="formField.contact"></el-input><br>
                <span class="right-tip">用于接收平台注册所需的邀请码信息。</span>
              </el-form-item>
              <el-form-item label="核心企业商户号" prop="remark">
                <el-input v-model="formField.remark"></el-input><br>
                <span class="right-tip">如有对应的商户号，则填写。</span>
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
                <span>创建核心企业{{formField.name}}成功，邀请码为<span style="color: red">{{invite}}</span>，并已发送至所填手机号中，您还可在核心企业列表中查看该邀请码</span>
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
import 'common/sass/module/supplier.scss'
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
// import supplierService from 'common/api/service/supplierService'
import coreDown from 'common/api/customer/core'
// import supplierService from 'common/api/service/supplierService'
import formExtends from 'components/entries/base/form'

let instance = null
export default formExtends({
  name: 'app',
  components: {
    modal: modal,
    layout
  },
  data () {
    return {
      title: '创建核心企业',
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
          { required: true, message: '请先写核心企业名称', trigger: 'change' },
          { min: 1, max: 50, message: '长度在50个字符以内', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.regular.space.test(value)) {
                callback('核心企业名称不可输入空格')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        remark: [
          { min: 0, max: 50, message: '商户号应在50个字符以内', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.regular.space.test(value)) {
                callback('商户号不可输入空格')
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
          coreDown.inviteCore.remote(params, (data) => {
            this.dialogVisible = true
            this.btnHide = false
            this.invite = data.data
            this.$refs.ruleForm.resetFields()
          })
        }
      })
    }
  }
})
</script>
