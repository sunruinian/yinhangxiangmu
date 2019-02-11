<template><!-- 溯源信息 -->
    <div class="pl30 pr30">
      <div class="item-group">
        <div class="item-tit"><span class="item-tit-icon"></span>关联供应商：{{supplier}}<span style="color: #3F3F3F;">(凭证相关的贸易信息可点击下面的文件链接进行下载。)</span></div>
      </div>
      <div class="boxShadow" style="padding-left:15px;padding-right:15px;">
          <table class="table-r table-th-block table-data">
              <thead>
                  <tr>
                      <th>时间</th>
                      <th>业务类型</th>
                      <th>发生额（元）</th>
                      <th>当前持有余额（元）</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-if="tableDataLength !== 0" v-for="(item, index) in tableData.data" :key="item.index" :index="index">
                      <td>{{item.createTime | timestampToDate}}</td>
                      <td><span v-for='o in option' :key="o.index" v-if='o.value===item.businessType'>{{o.label}}</span></td>
                      <td>{{item.operateValue | moneyShow}}</td>
                      <td>{{item.holdValue | moneyShow}}</td>
                  </tr>
                  <tr v-if="tableDataLength === 0">
                      <td align="center" colspan="6">{{tableData.msg}}</td>
                  </tr>
              </tbody>
          </table>
        </div>
    </div>
</template>

<script type="text/javascript">
import status from 'common/config/status'
// import voucherService from 'common/api/service/voucherService'
import commonDetail from 'common/api/common'
export default {
  name: 'voucher-hold-information',
  props: {
    voucher: null
  },
  data () {
    return {
      voucherId: 0,
      supplier: null,
      option: status.holdInfo,
      tableDataLength: 0,
      tableData: {
        data: [],
        msg: ''
      }
    }
  },
  mounted () {
    this.voucherId = this.voucher.voucherId
    this.getOperationLog()
  },
  methods: {
    // 操作日志
    getOperationLog: function () {
      commonDetail.holdmessage.remote({voucherId: this.voucherId}, (result) => {
        if (result.success) {
          this.tableData.data = result.data
          this.supplier = this.tableData.data[0].companyName
          if (this.tableData.data[0].businessType) {
            this.tableData.msg = ''
            this.tableDataLength = this.tableData.length
          } else {
            this.tableData.msg = '暂无持有信息'
            this.tableDataLength = 0
          }
        } else {
          this.tableData.data = []
          this.tableData.msg = '获取数据失败'
        }
      })
    }
  }
}
</script>
