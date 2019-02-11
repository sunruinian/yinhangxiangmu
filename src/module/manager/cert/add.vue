<template>
  <div class="content-area" >
    <div v-title='title'>{{title}}</div>
    <div class="content-body content-style">
      <div class="item-group">
        <div class="item-tit"><span class="item-tit-icon"></span>添加证书</div>
      </div>
      <div class="box-shadow radius-4 pr15 table-wrap" style="padding-left:290px;">
        <el-row>
          <el-col :span='10' class="mt30 mb30">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
              <el-form-item label="证书DN码">
                <el-input v-model="ruleForm.issuerDn" :disabled='true'>
                  <el-button slot="append" style="cursor:pointer;" @click='activeDN'>激活</el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="备注" prop='remark'>
                <el-input v-model="ruleForm.remark" placeholder='请输入10位以内的备注名'></el-input>
              </el-form-item>
              <el-button @click='submit' :disabled="btnUse" class="commit" type="info" style="margin-left: 100px">添加</el-button>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
// import certService from 'common/api/service/certService'
import coreManager from 'common/api/manager/core'
import CFCATools from 'common/javascript/features/cfca'
// import manager from 'module/manager/service/manager'

export default {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '添加证书',
      ruleForm: {
        issuerDn: '',
        serialNo: '',
        remark: ''
      },
      SubjectCN: '',
      btnUse: false,
      rules: {
        remark: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 10) {
                callback('请输入10位以内的备注名')
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
  },
  methods: {
    activeDN () {
      CFCATools.selectCert('', '', '', false)
      const info = CFCATools.getInfo()
      this.ruleForm.issuerDn = info.issuerDN
      this.ruleForm.serialNo = info.serialNumber
      this.SubjectCN = info.SubjectCN
    },
    submit () {
      if (this.ruleForm.issuerDn === '') {
        this.$bus.$emit('message-error', {message: '请插入证书并激活DN码！'})
        return
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let params = {
              issuerDn: this.ruleForm.issuerDn,
              signStr: CFCATools.defaultSign(this.ruleForm.serialNo, true),
              originalStr: this.ruleForm.serialNo,
              serialNo: this.ruleForm.serialNo,
              remark: this.ruleForm.remark,
              subjectCn: this.SubjectCN
            }
            this.ruleForm.issuerDn = ''
            this.ruleForm.remark = ''
            this.btnUse = true
            coreManager.certCreate.remote(params, list => {
              if (list) {
                let hash = list.data.hash
                let blob = list.data.blob
                let url = '/service/cert/create'
                CFCATools.selectCert('', this.ruleForm.issuerDn, this.ruleForm.serialNo, false)
                coreManager.blobSign(hash, blob, url, response => {
                  if (response.data) {
                    this.$message.success('添加成功')
                  }
                })
              }
            }).then((response) => {
              this.btnUse = false
            }).catch((error) => {
              console.log('error', error)
            })
          }
        })
      }
    }
  }
}
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
