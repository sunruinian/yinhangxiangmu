<template><!-- 溯源信息 -->
    <div class="">
        <p class="pb15"><span class="require">*</span>关联供应商：该页面显示签收该笔凭证的供应商当前持有凭证的凭证信息。</p>
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
                <tr v-for="(item, index) in upstreamInfo.data" :key="item.index" :index="index">

                    <td>{{item.createTime | timestampToDate}}</td>
                    <td>转让</td>
                    <td>{{item.no}}</td>
                    <td>{{item.createCompany.name}}</td>
                    <td>{{item.company.name}}</td>
                    <td>{{item.total | moneyShow}}</td>
                    <td>{{item.cashTime | timestampToDay}}</td>
                </tr>
                <tr v-if="upstreamInfo.data.length === 0">
                    <td align="center" colspan="8">{{upstreamInfo.msg}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script type="text/javascript">
// import voucherService from 'common/api/service/voucherService'
import commonDetail from 'common/api/common'
export default {
  name: 'voucher-upstream',
  props: {
    voucher: null
  },
  data () {
    return {
      voucherId: 0,
      upstreamInfo: {
        data: [],
        msg: '该供应商尚未签收凭证'
      }
    }
  },
  mounted () {
    const self = this
    self.voucherId = this.voucher.voucherId
    self.upstream()
  },
  methods: {
    // 溯源信息
    upstream: function () {
      const self = this
      var param = {id: self.voucherId}
      commonDetail.upstream.remote(param, (data) => {
        if (data.success) {
          self.upstreamInfo.data = (data.data === null || data.data.length === 0) ? [] : data.data
          self.upstreamInfo.msg = (self.upstreamInfo.data.length === 0) ? '该凭证尚无溯源信息' : ''
        } else {
          self.upstreamInfo.data = []
          self.upstreamInfo.msg = '获取溯源信息失败'
        }
      })
    }
  }
}
</script>
