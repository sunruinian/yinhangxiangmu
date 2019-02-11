<template><!-- 溯源信息 -->
    <div class="pl30 pr30">
        <div class="item-group">
          <div class="item-tit"><span class="item-tit-icon"></span>操作日志：显示该笔凭证登记/审批等信息。</div>
        </div>
        <div class="boxShadow" style="padding-left:15px;padding-right:15px;">
          <table class="table-r table-th-block table-data">
              <thead>
                  <tr>
                      <th>序号</th>
                      <th>操作时间</th>
                      <th>操作内容</th>
                      <th>状态</th>
                      <th>备注</th>
                      <th>操作员账号</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in operationLog.data" :key="item.index" :index="index">
                      <td>{{index + 1}}</td>
                      <td>{{item.createTime | timestampToDate}}</td>
                      <td>
                        <span v-for='o in operationLogActionOption' :key="o.index" v-if='o.value===item.action'>{{o.label}}</span>
                      </td>
                      <td>
                        <span v-for='o in operationLogStatusOption' :key="o.index" v-if='o.value===item.status'>{{o.label}}</span>
                      </td>
                      <td>{{item.remark | dealNull}}</td>
                      <td>{{item.userName}}</td>
                  </tr>
                  <tr v-if="operationLog.data.length === 0">
                      <td align="center" colspan="6">{{operationLog.msg}}</td>
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
  name: 'voucher-operationLog',
  props: {
    voucher: null
  },
  data () {
    return {
      voucherId: 0,
      operationLogStatusOption: status.operationLogStatus,
      operationLogActionOption: status.operationLogAction,
      operationLog: {
        data: [],
        msg: '暂无数据'
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
      commonDetail.getOperationLog.remote({voucherId: this.voucherId}, (result) => {
        if (result.success) {
          this.operationLog.data = result.data.content
          this.operationLog.msg = (this.operationLog.data.length === 0) ? '暂无数据' : ''
        } else {
          this.operationLog.data = []
          this.operationLog.msg = '获取操作日志失败'
        }
      })
    }
  }
}
</script>
