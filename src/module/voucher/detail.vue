 <template>
  <div class="content-area">
    <div v-title='title'>{{title}}</div>
      <div class="content-body">
        <div class="tab-bar" style="margin-top:20px;">
          <span class="tab-group">
            <span class="tab-item" v-for="(item, index) in tabsData" :index="index" :key="index" :class="item.selected ? 'active':''" v-if="item.access" @click="tabChange(index)">{{item.name}}</span>
          </span>
        </div>
      </div>
      <div v-if ="whichShow==0 && tabsData[0].access" style="overflow:hidden;background:#fff;">
        <cvoucher :voucher='detail'></cvoucher>
      </div>
      <div v-if ="whichShow==1 && tabsData[1].access" style="background:#fff;overflow: hidden;padding:0px 10px 20px 10px;">
        <voucherAttachment :voucher="attachmentInfo"></voucherAttachment>
      </div>
      <!-- 显示持有信息 -->
      <div v-if ="whichShow==2 && tabsData[2].access" style="background:#fff;overflow: hidden;padding:0px 10px 20px 10px;">
        <holdInfo :voucher="voucherObject"></holdInfo>
      </div>
      <div v-if ="whichShow==3 && tabsData[3].access" style="background:#fff;overflow: hidden;padding:0px 10px 20px 10px;">
        <voucherDownstream :voucher="voucherObject"></voucherDownstream>
      </div>
      <div v-if ="whichShow==4 && tabsData[4].access" style="background:#fff;overflow: hidden;padding:0px 10px 20px 10px;">
        <voucherUpstream :voucher="voucherObject"></voucherUpstream>
      </div>
      <div v-if ="whichShow==5 && tabsData[5].access" style="background:#fff;overflow:hidden;padding:0px 10px 20px 10px">
        <payRecord :voucher="voucherObject"></payRecord>
      </div>
      <div v-if ="whichShow==6 && tabsData[6].access" style="background:#fff;overflow:hidden;padding:0px 10px 20px 10px">
        <payLetter :voucher="voucherObject"></payLetter>
      </div>
      <div v-if ="whichShow==7 && tabsData[7].access" style="background:#fff;overflow:hidden;padding:0px 10px 20px 10px">
        <operationLog :voucher="voucherObject"></operationLog>
      </div>
  </div>
</template>

<script type="text/javascript">
import tools from 'common/javascript/tools/tools'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import cvoucher from 'components/entries/common/voucher'
import payRecord from 'components/entries/common/voucher-payRecord'
import payLetter from 'components/entries/common/voucher-payLetter'
import operationLog from 'components/entries/common/voucher-operationLog'
import voucherAttachment from 'components/entries/common/voucher-attachment'
import voucherUpstream from 'components/entries/common/voucher-upstream'
import voucherDownstream from 'components/entries/common/voucher-downstream'
import holdInfo from 'components/entries/common/voucher-hold-information'
import accessControl from 'common/javascript/tools/accessControl.js'
import commonDetail from 'common/api/common'

export default {
  name: 'app',
  components: {
    cvoucher,
    voucherAttachment,
    voucherDownstream,
    voucherUpstream,
    payRecord,
    payLetter,
    operationLog,
    holdInfo
  },
  data () {
    return {
      title: '凭证详情',
      tabsData: [
        {name: '基础信息', selected: true, access: false},
        {name: '贸易信息', selected: false, access: false},
        {name: '持有信息', selected: false, access: false},
        {name: '流转信息', selected: false, access: false},
        {name: '溯源信息', selected: false, access: false},
        {name: '付款记录', selected: false, access: false},
        {name: '付款承诺函', selected: false, access: false},
        {name: '操作日志', selected: false, access: false}
      ],
      whichShow: -1,
      tmpWhichShow: 0,
      detail: {
        no: null,
        paymentLetter: null,
        value: null,
        originCreateCompany: {
          name: null
        },
        createCompany: {
          name: null,
          subAccount: {
            bankName: null,
            no: null
          }
        },
        company: {
          name: null,
          subAccount: {
            bankName: null,
            no: null
          }
        },
        files: [],
        attachmentInfo: {files: []}
      }
    }
  },
  beforeMount () {
    this.voucherId = this.$route.query.id
    this.voucherObject = {voucherId: this.voucherId}
    this.showTagMenu()
  },
  mounted () {
    this.getVoucher()
  },
  methods: {
    getVoucher () {
      var self = this
      if (this.tabsData[0].access || this.tabsData[1].access) {
        commonDetail.getVoucher.remote({id: this.voucherId}, (result) => {
          let data = result.data
          this.detail = data
          this.detail.value = data.total
          this.detail.originCreateCompany = data.originCreateCompany
          this.detail.createCompany = data.createCompany
          this.detail.company = data.company
          // this.detail.paymentLetter = this.detail.paymentLetter.no
          if (this.detail.paymentLetter) {
            this.detail.paymentLetter = this.detail.paymentLetter.no
          }
          this.detail.createCompany.subAccount = {
            no: this.detail.bankAccount.no,
            bankName: this.detail.bankAccount.issuer.name === null ? this.detail.bankAccount.issuer.bankName : this.detail.bankAccount.issuer.name
          }
          this.detail.company.subAccount = {
            no: this.detail.company.subAccount.no,
            bankName: this.detail.company.subAccount.issuer.name === null ? this.detail.company.subAccount.issuer.bankName : this.detail.company.subAccount.issuer.name
          }
          this.files = data.files
          for (var i = 0; i < this.files.length; i++) {
            this.files[i].downUrl = tools.getUrl() + '/service/voucher/file/voufile/download?fileId=' + this.files[i].fileId + '&type=VOUCHER&voucherId=' + this.voucherId
          }
          this.attachmentInfo = {files: this.files}
          setTimeout(function () {
            self.whichShow = self.tmpWhichShow
          }, 50)
          // this.$bus.$emit('voucher-refurbish', this.detail)
        })
      } else {
        setTimeout(function () {
          self.whichShow = self.tmpWhichShow
        }, 50)
      }
    },
    showTagMenu () {
      var hash = location.hash.substr(1)
      var position = hash.indexOf('?')
      hash = (position > -1) ? hash.substr(0, position) : hash
      var detailStart = hash.indexOf('/detail')
      var module = hash.substr(0, detailStart)
      var detailArr = ['/detail/base', '/detail/trade', '/detail/holdInfo', '/detail/downstream', '/detail/upstream', '/detail/paymentApply', '/detail/payLetter', '/detail/operate']

      for (var i = 0; i < detailArr.length; i++) {
        this.tabsData[i].access = accessControl.checkAccess(module + detailArr[i])
      }

      for (i = 0; i < detailArr.length; i++) {
        // 第一个激活与否？与权限一致，无权限：不激活；有权限：激活
        if (i === 0) {
          this.tabsData[0].selected = this.tabsData[0].access
          this.tmpWhichShow = this.tabsData[0].selected ? 0 : this.tmpWhichShow
          continue
        }
        // 没有权限，不能激活
        if (!this.tabsData[i].access) {
          this.tabsData[i].selected = false
          continue
        }
        // i 激活的唯一条件是前面 i-1 个都没激活
        var flag = true
        for (var j = 0; j < i; j++) {
          flag = flag && !this.tabsData[j].selected
        }
        this.tabsData[i].selected = flag
        this.tmpWhichShow = flag ? i : this.tmpWhichShow
      }
    },
    tabChange (index) {
      this.tabsData.forEach(function (item) {
        item.selected = false
      })
      this.$bus.$emit('voucher-refurbish', this.detail)
      this.tabsData[index].selected = true
      this.whichShow = index
    }
  }
}
</script>
