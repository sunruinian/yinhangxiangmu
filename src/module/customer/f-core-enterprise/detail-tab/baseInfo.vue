<template>
  <div class="content-area">
    <div v-title='title' v-if='tabShow'>{{title}}</div>
    <div class="content-body info-manage pr20 pb40">
        <div class="item-cnt">
            <table class="table-lr">
                <tbody>
                  <tr>
                      <td class="l" width="25%">核心企业名称</td>
                      <td class="r" width="75%">{{info.name}}</td>
                  </tr>
                  <tr>
                      <td class="l" width="25%">核心企业商户号</td>
                      <td class="r" width="75%">{{info.code}}</td>
                  </tr>
                  <tr>
                      <td class="l" width="25%">邀请码通知方式</td>
                      <td class="r" width="75%">{{info.contactType}}</td>
                  </tr>
                  <tr>
                      <td class="l" width="25%">手机号码</td>
                      <td class="r" width="75%">{{info.contact}}</td>
                  </tr>

                  <tr>
                      <td class="l" width="25%">创建时间</td>
                      <td class="r" width="75%">{{info.cT | timestampToDate}}</td>
                  </tr>
                  <tr>
                      <td class="l" width="25%">邀请码</td>
                      <td class="r" width="75%">{{info.invite}}</td>
                  </tr>
                  <tr>
                      <td class="l" width="25%">核心企业编号</td>
                      <td class="r" width="75%">{{info.supplierId}}</td>
                  </tr>
                  <tr>
                      <td class="l" width="25%">区块链账户</td>
                      <td class="r" width="75%">{{info.companyBlockChainAddr}}</td>
                  </tr>
                </tbody>
            </table>
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
import supplierService from 'common/api/service/supplierService'
import stringTooles from 'common/javascript/tools/stringTools'

export default {
  name: 'app',
  components: {
    modal: modal,
    layout
  },
  props: ['tabShow'],
  data () {
    return {
      title: '核心企业-账号信息',
      id: null,
      info: {
        createTime: null,
        username: null,
        comId: null,
        comName: null,
        blockchainAddress: null
      }
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.getInfo()
  },
  methods: {
    getInfo () {
      supplierService.downstreamInfo.remote(this.id, (data) => {
        this.info = data.data
        this.info.contactType = this.info.contactType ? '邮件通知' : '短信通知'
        this.info.supplierId = stringTooles.completeNo(this.info.supplierId)
      })
    }
  }
}
</script>
