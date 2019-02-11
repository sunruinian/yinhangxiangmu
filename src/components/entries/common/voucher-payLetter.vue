<template><!-- 溯源信息 -->
    <div class="pl30 pr30">
      <div class="item-group">
        <div class="item-tit"><span class="item-tit-icon"></span>付款承诺函</div>
      </div>
        <div class="boxShadow">
          <el-table :data="tableData" stripe>
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align='center'>
            </el-table-column>
            <el-table-column
              prop="cT"
              label="签署/变更时间"
              width="180"
              align='center'
              :formatter="dateFormaterPrecise">
            </el-table-column>
            <el-table-column
              prop="name"
              align='center'
              width="120"
              label="协议名称">
            </el-table-column>
            <el-table-column
              prop="voucherNo"
              label="对应凭证编号"
              align='center'
              width="250"
              >
            </el-table-column>
            <el-table-column
              prop="blockchainAddress"
              :show-overflow-tooltip="true"
              :formatter="dealNull"
              min-width="300"
              align='center'
              label="区块链存证码">
            </el-table-column>
            <el-table-column
              prop="url"
              v-if="downAccess"
              align='center'
              position="fixed"
              width="120"
              label="操作">
              <template scope="scope">
                <a class="del" v-if="downAccess" :href="scope.row.url">下载文本</a>
                <span class="del c999" v-if="!downAccess">下载文本</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </div>
</template>

<script type="text/javascript">
import status from 'common/config/status'
// import voucherService from 'common/api/service/voucherService'
import tools from 'common/javascript/tools/tools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import commonDetail from 'common/api/common'
// import accessControl from 'common/javascript/tools/accessControl.js'

export default merge({
  name: 'voucher-payLetter',
  props: {
    voucher: null
  },
  data () {
    return {
      voucherId: 0,
      payLetterStatusOption: status.payLetterStatus,
      payLetterActionOption: status.payLetterAction,
      payLetter: {
        data: null,
        msg: '暂无数据',
        status: 0
      },
      tableData: [],
      payName: '付款承诺函'
    }
  },
  mounted () {
    this.voucherId = this.voucher.voucherId
    this.downAccess = true
    this.getPayLetter()
  },
  methods: {
    // 操作日志
    getPayLetter: function () {
      commonDetail.getVoucher.remote({id: this.voucherId}, (result) => {
        if (result.success) {
          if (result.data.paymentLetter !== null) {
            var data = result.data.paymentLetter
            data.url = tools.getUrl() + '/service/voucher/file/voufile/download?fileId=' + data.fileId + '&type=PAYMENT_LETTER&voucherId=' + this.voucherId
            data.name = this.payName
            data.voucherNo = result.data.no
            this.tableData.push(data)
          } else {
            this.tableData = []
          }
        }
      })
    }
  }
}, table)
</script>
