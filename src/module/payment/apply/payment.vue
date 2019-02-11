<template>
  <div class="mask enterprise" style="z-index:999" v-if="dialogShow.show">
    <div class="dialog-box">
      <div class="dialog">
        <div class="dialog-heading" v-if='!selectShow'>
          <span class="iconfont icon-delete" @click="cancel">×</span>
        </div>
        <div class="dialog-body">
              <p>待付款总额: {{dialogShow.totalMOney}}</p>
        </div>
        <div>
          <div class="dialog-body">
            <div class="relevent-form">
              <el-form :model="formField" :rules="rules" ref="ruleForm" :inline="true">
                <el-form-item label="申请理由：" prop='applyReason'>
                  <el-input v-model="formField.applyReason" placeholder="请输入申请理由"></el-input>
                </el-form-item>
              </el-form>
              <div class="">
                <el-button class="button-left" @click='cancel'>取消</el-button>
                <el-button class="button-right" @click='sure' type="primary">确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import table from 'components/entries/base/table'
// import streamApi from 'common/api/enterprise/stream'
import merge from 'webpack-merge'
import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'

export default merge(table, {
  components: {
  },
  props: ['dialogShow'],
  data () {
    return {
      pageSize: 1,
      total: 0,
      searchData: {
        name: null,
        id: null,
        pageSize: 5,
        pageNum: 1
      },
      selectName: null,
      selectId: null,
      formField: {
        applyReason: null
      },
      rules: {
        applyReason: [
          { min: 0, max: 20, message: '备注名应在20个字以内', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let reg = /\s+/
              if (reg.test(value)) {
                callback('ERP编号不可输入空格')
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
    console.log(1, this.dialogShow)
  },
  methods: {
    sure () { // 关联企业
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            vouIds: this.dialogShow.voucherId,
            applyReason: this.formField.applyReason
          }
          coreCompanyVoucherService.applyPayment.remote(params, (data) => {
            if (data.data) {
              // this.$emit('updateTable')
              this.dialogShow.show = false
            }
          })
        }
      })
    },
    cancel () { // 取消关联企业操作
      // this.selectId = null
      // this.selectName = null
      this.formField.applyReason = null
      // this.selectShow = false
      this.dialogShow.show = false
    }
    // closeDialog () { // 关闭弹窗
    //   // 企业列表框数据清除
    //   this.searchData.name = null
    //   this.searchData.id = null
    //   this.tableData = []
    //   // 申请框数据清除
    //   this.selectShow = false
    //   this.selectId = null
    //   this.selectName = null
    //   this.formField.remark = null
    //   this.dialogShow.show = false
    // }
  }
})
</script>
