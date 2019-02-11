<template>
  <div class="content-area" >
    <div v-title='title'>
      {{title}}
    </div>
    <div class="content-body">
        <div class="content-body pl30 pr30" >
          <div class="box">
              <el-row :gutter="16" type="flex">
                <el-col :span="14" :offset="4">
                  <el-form :model="formField" :rules="rules" ref="ruleForm" label-width="170px">
                    <el-form-item label="企业名称" prop="name">
                      <el-input v-model="formField.name"
                      placeholder="建议与工商营业执照一致。"></el-input>
                    </el-form-item>
                    <el-form-item label="邀请码通知方式" prop="contactType">
                      <el-radio-group v-model="formField.contactType" @change='inviteChange'>
                        <el-radio :label="1">短信通知</el-radio>
                        <!-- <el-radio :label="1">邮件通知</el-radio> -->
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="contact">
                      <el-input v-model="formField.contact"
                        placeholder="用来接收邀请码"></el-input>
                    </el-form-item>
                    <el-form-item label="企业商户号" prop="remark">
                      <el-input v-model="formField.remark"
                      placeholder="如有对应的商户号，则填写"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button class="cancel" type="primary" @click="onSubmit" :disabled="btnHide">创建企业</el-button>
                    </el-form-item>

                    <!-- 邀请码弹窗 -->
                    <!-- <el-dialog
                      title="提示"
                      :visible.sync="dialogVisible"
                      size="tiny"
                      :before-close="handleClose">
                      <span>创建供应商{{formField.name}}成功，邀请码为<span style="color: red">{{invite}}</span>，并已发送至所填手机号中，您还可在供应商列表中查看该邀请码。</span>
                      <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="ok">好</el-button>
                      </span>
                    </el-dialog> -->
                  </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
// import supplierService from 'common/api/service/supplierService'
import formExtends from 'components/entries/base/form'
// import coreDown from 'common/api/customer/core'

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
        contactType: null,
        contact: ''
      },
      btnHide: false,
      rules: {
        name: [
          { required: true, message: '企业名称不可输入空格', trigger: 'change' },
          { min: 1, max: 50, message: '长度在50个字符以内', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.regular.space.test(value)) {
                callback('企业名称不可输入空格')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        contactType: [
          { required: true, message: '必须填写', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '请填写正确的手机号', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (instance.regular.phone.test(value)) {
                callback()
              } else {
                callback('请填写正确的手机号')
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
        ]
      }
    }
  },
  mounted () {
    instance = this
  },
  beforeDestroy () {
    this.$refs.ruleForm.resetFields()
  },
  methods: {
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // let params = this.formField
          // // 按钮置灰，避免多次请求
          this.btnHide = true
          location.href = '#/assistant/success?content=操作完成！'
          // coreDown.createdUser.remote(params, (data) => {
          //   this.dialogVisible = true
          //   this.btnHide = false
          //   this.formField.contact = ''
          //   this.invite = data.data
          //   this.$refs.ruleForm.resetFields()
          // })
        }
      })
    }
  }
})
</script>
<style scoped="scoped">
  .box{
    width: 80%;
    margin: 35px auto;
    background: #FFFFFF;
    box-shadow: 0 0 24px 0 #EFEFEF;
    border-radius: 4px;
  }
  .el-col{
    padding-top: 30px;
  }
  .el-button{
    padding: 0;
  }
  .cancel{
    width: 160px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-family: "SourceHanSansCN-Medium";
    background: #FB642A;
    border: 1px solid #FB642A;
    border-radius: 4px;
  }
</style>
