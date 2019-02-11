<template>
  <div class="operation-detail b-voucher-tpl">
      <div class="box" ref='box' v-bind:style="{  backgroundSize:  voucherHeight }">
          <div class="header">
            <div class="header_left">
              <p>{{detail.originCreateCompany.name}}</p>
              <div>凭证签发方承诺{{detail.cashDate}}付款。</div>
            </div>
            <p class="no">NO.{{detail.no}} </p>
          </div>
          <div class="certificatie-tbale-area">
            <div class="content_top">
              <div class="content_top_left">
                <div class="pay"><span><i class="icon iconfont" style="font-size:12px;color:#FB642A">&#xe608;</i></span> 付款方</div>
                <div class="payName">
                      全 称 : {{detail.createCompany.name}}
                </div>
                <div class="payName">
                      账 号 : {{detail.createCompany.subAccount.no}}
                </div>
                <div class="payName">
                      开户行 : {{detail.createCompany.subAccount.bankName}}
                </div>

              </div>
              <div class="content_top_right">
                <div class="pay"><span><i class="icon iconfont" style="font-size:12px;color:#FB642A">&#xe608;</i></span> 收款方</div>
                <div class="payName" :title= detail.company.name>
                      全 称 : {{detail.company.name}}
                </div>
                <div class="payName">
                      账 号 : {{detail.company.subAccount.no}}
                </div>
                <div class="payName">
                      开户行 : {{detail.company.subAccount.bankName}}
                </div>
              </div>
            </div>
            <div class="content_foot">
              <div class="money_header">
                <div class="money_header_left">
                  <p class="moneyPay">付款金额 (元)</p>
                  <p class="moneyNume">{{detail.valueBig}}</p>
                </div>
                <div class="money_header_right">
                  <table>
                    <tr class="hd">
                      <td class="center">亿</td>
                      <td class="center">千</td>
                      <td class="center">百</td>
                      <td class="center">十</td>
                      <td class="center">万</td>
                      <td class="center">千</td>
                      <td class="center">百</td>
                      <td class="center">十</td>
                      <td class="center">元</td>
                      <td class="center">角</td>
                      <td class="center">分</td>
                    </tr>
                    <tr class="bd">
                      <td v-for='(item, index) in detail.valueArray' :key="index" class="center" >{{item}}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="money_time">
                <ul class="other-group">
                  <!-- <li class="other-item"><label class="name">付款日期：</label><span>{{detail.cashDate}}</span></li> -->
                  <li class="other-item"><label class="bank">凭证备注 :</label><span>{{detail.remark}}</span></li>
                  <li class="other-item" v-show='detail.blockchainaddress'><label class="bank">付款承诺函编号 :</label><span>{{detail.paymentLetter}}</span></li>
                  <li class="other-item" v-show='detail.blockchainaddress'><label class="bank-no">区块链智能合约编号 :</label><span>{{detail.blockchainaddress}}</span></li>
                  <li class="other-item"><label class="bank" style="color:#FB642A;font-size: 12px;"> 注 :</label><span class="remind" style="color:#FB642A;">本爽信凭证经付款方签发、收款方签收后即完成凭证登记。该凭证可在爽融链平台上进行拆分、流转，上述操作生效后不可撤销及更改。</span></li>
                </ul>
              </div>
              <div class="sign-ellipse" :class="{'mgTop': voucherTop}">
                <span>{{detail.createCompany.name}}</span><span>爽信凭证</span>
              </div>
            </div>
          </div>
      </div>
  </div>
</template>
<script type="text/javascript">
import 'common/sass/module/account.scss'
import smallToBig from 'common/javascript/tools/smallToBig'
import dateTools from 'common/javascript/tools/dateTools'
import moneyTools from 'common/javascript/tools/moneyTools'
export default {
  name: 'c-voucher',
  components: {
  },
  props: {
    voucher: {
      type: Object,
      default: {
        no: null,
        cashDate: null,
        valueBig: null,
        valueArray: null,
        remark: null,
        hasBlockChainNo: null,
        origincreateCompany: {
          name: null
        },
        createCompany: {
          name: null,
          subAccount: {
            no: null,
            bankName: null
          }
        },
        company: {
          name: null,
          subAccount: {
            no: null,
            bankName: null
          }
        }
      }
    }
  },
  data () {
    return {
      isBig: true,
      detail: this.voucher,
      voucherHeight: '930px 400px',
      voucherTop: this.voucher.paymentLetter
    }
  },
  beforeMount () {
    this.$bus.$on('voucher-refurbish', info => {
      this.detail = info
      if (typeof this.detail.cashTime === 'string') {
        this.detail.cashDate = this.detail.cashTime
      } else {
        this.detail.cashDate = this.dateFormater(parseInt(this.detail.cashTime))
      }
      if (!isNaN(this.detail.cashTime)) {
        this.detail.cashDate = this.dateFormater(parseInt(this.detail.cashTime))
      }
      this.dealVaule(this.detail.value)
      this.detail.valueBig = moneyTools.moneyShow(this.detail.value)
      // this.detail.valueBig = smallToBig(this.detail.value)
      // if (this.detail.createCompany.name.length > 13) {
      //   this.isBig = false
      // }
    })

    this.dealVaule(this.detail.value)
    this.detail.valueBig = moneyTools.moneyShow(this.detail.value)

    if (!this.detail.cashTime) {
      this.detail.cashDate = '0000.00.00'
    } else if (typeof this.detail.cashTime === 'string') {
      this.detail.cashDate = this.detail.cashTime
    } else {
      this.detail.cashDate = this.dateFormater(parseInt(this.detail.cashTime))
    }
  },
  mounted () {
    // const me = this
    // setTimeout(function () {
    //   me.detail.cashDate = me.dateFormater(me.detail.cashTime)
    // }, 1000)

    this.detail.valueBig = smallToBig(parseFloat(this.detail.value))
    // let name = this.detail.createCompany
    // if (name !== null && name.length > 13) {
    //   this.isBig = false
    // }

    // 根据表格高度设置背景图高度
    // setTimeout(() => {
    //   this.voucherHeight = this.$refs.box.getBoundingClientRect().height + 'px'
    //   this.voucherHeight = '930px ' + this.voucherHeight
    // }, 300)
  },
  methods: {
    // 日期转时间戳
    dateFormater (value) {
      return dateTools.dateFormater(value, 'YYYY 年 MM 月 DD 日')
    },
    dealVaule (value) {
      const sum = 11
      if (!value) value = 0
      value = moneyTools.accMul(parseFloat(value).toFixed(2), 100)
      value = parseInt(value)
      let array = value.toString().split('')
      let tempArray = []
      let i = 0
      while (i < sum) {
        tempArray.push('')
        i++
      }
      var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      Array.map(array, (item, index) => {
        let l = sum - array.length + index
        tempArray[l] = digit[item]
      })
      this.detail.valueArray = tempArray
    }
  }
}

</script>

<style scoped>
.mgTop{
	margin-top: -134px;
}
</style>
