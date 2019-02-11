<template>
  <div class="content-area" id='bankaccount'>
    <div class="inner-wrap"><b>*</b> 请选择一个账户号码作为您使用该平台的结算账户  <b>（不可修改请慎重选择）</b></div>
    <div class="inner-wrap">
        <div class="item-group">
          <table class="table-r table-th-block table-data">
              <thead>
                  <tr>
                      <th>支行名称</th>
                      <th>银行账户号</th>
                      <th>选择</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in cardQuery" :key="item.index">
                      <td>{{item.issuer.name}}</td>
                      <td>{{item.no}}</td>
                      <td>
                         <el-radio class="radio" :label="item.id" v-model="cardId"></el-radio>
                      </td>
                  </tr>
              </tbody>
          </table>
        </div>
        <div style="margin-top:40px;text-align:center;">
          <el-button type="primary" class="w300" @click="onSubmit" :loading="btnLoading">下一步</el-button>
        </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import 'common/sass/main.scss'
import 'common/sass/module/supplier.scss'
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import certService from 'common/api/service/certService'
import tools from 'common/javascript/tools/tools'
import commonMember from 'common/api/member/common'

const base = {
  name: 'app',
  components: {
    modal: modal,
    layout: layout,
    tools: tools
  },
  data () {
    return {
      btnLoading: false,
      cardId: null,
      cardQuery: []
    }
  },
  mounted () {
    // 监听页面请求错误
    this.$bus.$on('message-error', info => {
      this.btnLoading = false
    })
    this.getGrid()
  },
  methods: {
    getGrid () {
      // 获取当前企业结算户信息
      commonMember.getbankaccountbygyb.remote({}, (data) => {
        this.cardQuery = data.data
      })
    },
    // 下一步
    onSubmit () {
      if (this.cardId !== null) {
        this.btnLoading = true
        commonMember.cardSetDefault.remote(this.cardId, (data) => {
          if (data.success) {
            this.btnLoading = false
            this.$bus.$emit('on-step', 5)
          }
        })
      } else {
        this.$message.error('请选择结算账户')
      }
    }
  }
}
export default merge(base, table)
</script>

<style>
#bankaccount .el-radio__label {
  position: absolute;
  color: #fff;
}
#bankaccount b {
  color: #fe3748;
}
</style>
