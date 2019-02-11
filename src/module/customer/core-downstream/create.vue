<template>
  <div class="operation-detail b-voucher-tpl">
      <div class="box" ref='box' v-bind:style="{  backgroundSize:  voucherHeight }">
          <div class="header">
            <!-- <span class="title"> 爽信凭证 </span> <span class="secondary">{{detail.originCreateCompany.name}}</span>
            <span class="require cashTime font10 ">凭证签发方承诺{{detail.cashDate}}付款。</span>
            <span class="no">NO.{{detail.no}} </span> -->

            <span style="position: absolute; top: 19px; left: 10px; color: #888; ">{{detail.originCreateCompany.name}}</span>
            <span style="position: absolute; top: 49px; left: 10px; color:#e82f3a; font-size: 12px;">凭证签发方承诺 {{detail.cashDate}} 付款。</span>
            <p class="title-voucher" style="display: block; text-align: center; font-size: 18px; font-weight: 600;"> 爽信凭证 </p>
            <span class="no">NO.{{detail.no}} </span>
          </div>
          <div class="certificatie-tbale-area">
            <div class="">
              <table class="certificate-table">
                  <tbody>
                      <tr colspan="24">
                          <td colspan="1" width="4.16%" rowspan="3" class="center"><span class="text-vertical title-text">付款方</span></td>
                          <td colspan="3" width="12.48%" class="center">全称</td>
                          <td colspan="8" width="33.28%">{{detail.createCompany.name}}</td>
                          <td colspan="1" width="4.16%" rowspan="3" class="center "><span class="text-vertical title-text">收款方</span></td>
                          <td colspan="3" width="12.48%" class="center">全称</td>
                          <td colspan="8">{{detail.company.name}}</td>
                      </tr>
                      <tr>
                          <td colspan="3" width="12.48%" class="center" >账号</td>
                          <td colspan="8" width="33.28%">{{detail.createCompany.subAccount.no}}</td>
                          <td colspan="3" width="12.48%" class="center">账号</td>
                          <td colspan="8" width="33.28%">{{detail.company.subAccount.no}}</td>
                      </tr>
                      <tr>
                          <td colspan="3" width="12.48%" class="center">开户行</td>
                          <td colspan="8" width="33.28%">{{detail.createCompany.subAccount.bankName}}</td>
                          <td colspan="3" width="12.48%" class="center">开户行</td>
                          <td colspan="8" width="33.28%">{{detail.company.subAccount.bankName}}</td>
                      </tr>
                      <tr>
                          <td colspan="4" width="16.64%" rowspan="2" class="center title-text">付款金额</td>
                          <td colspan="9" width="45.76%" rowspan="2">{{detail.valueBig}}</td>
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
                      <tr>
                          <td v-for='(item, index) in detail.valueArray' :key="index" class="center" >{{item}}</td>
                      </tr>
                     <tr>
                          <td colspan="4" width="16.64%" style="height: 30px;text-align:right;" class=" title-text noborder" >承诺付款日期</td>
                          <td colspan="9" width="45.76%" class="noborder">{{detail.cashDate}}</td>
                          <td colspan="11" class="noborder"></td>
                      </tr>
                  </tbody>
              </table>
            </div>
            <ul class="other-group">
              <!-- <li class="other-item"><label class="name">付款日期：</label><span>{{detail.cashDate}}</span></li> -->
              <li class="other-item"><label class="bank">凭证备注</label><span>{{detail.remark}}</span></li>
              <li class="other-item" v-show='detail.blockchainaddress'><label class="bank">付款承诺函编号</label><span>{{detail.paymentLetter}}</span></li>
              <li class="other-item" v-show='detail.blockchainaddress'><label class="bank-no">区块链智能合约编号</label><span>{{detail.blockchainaddress}}</span></li>
              <li class="other-item"><label class="bank" style="color:#e82f3a;font-size: 12px;"> 注 :</label><span class="remind">本爽信凭证经付款方签发、收款方签收后即完成凭证登记。该凭证可在爽融链平台上进行拆分、流转，上述操作生效后不可撤销及更改。</span></li>
            </ul>
            <div class="sign-ellipse" :class="{'mgTop': voucherTop}">
              <span>{{detail.createCompany.name}}</span><span>爽信凭证</span>
            </div>

              <!-- <ul class="other-group">
                <li class="other-item"><label class="name">付款日期：</label><span>{{detail.cashDate}}</span></li>
                <li class="other-item"><label class="bank">凭证备注：</label><span>{{detail.remark}}</span></li>
                <li class="other-item"><label class="bank">付款承诺函编号</label><span>{{detail.paymentLetter}}</span></li>
                <li class="other-item" v-show='detail.blockchainAddress'><label class="bank-no">区块链智能合约编号</label><span>{{detail.blockchainAddress}}</span></li>
                <li class="other-item" v-show='detail.blockchainAddress'><label class="bank-no"> 注 :</label><span>本爽信凭证经付款方签发、收款方签收后即完成凭证登记。该凭证可在爽融链平台上进行拆分、流转，上述操作生效后不可撤销及更改。</span></li>
              </ul> -->
          </div>
      </div>
  </div>
</template>

<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
import 'common/css/lib/motherplate.css'
import 'common/sass/module/regular.scss'
// import 'common/sass/module/account.scss'
// import model from 'common/api/voucherTemplate'
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
        paymentLetter: null,
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
      this.detail.valueBig = smallToBig(this.detail.value)
      // if (this.detail.createCompany.name.length > 13) {
      //   this.isBig = false
      // }
    })

    this.dealVaule(this.detail.value)
    this.detail.valueBig = smallToBig(this.detail.value)
    if (typeof this.detail.cashTime === 'string') {
      this.detail.cashDate = this.detail.cashTime
    } else {
      this.detail.cashDate = this.dateFormater(parseInt(this.detail.cashTime))
    }
    if (!isNaN(this.detail.cashTime)) {
      this.detail.cashDate = this.dateFormater(parseInt(this.detail.cashTime))
    }
  },
  mounted () {
    // if (this.detail.blockchainaddress) {
    //
    // }
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
      Array.map(array, (item, index) => {
        let l = sum - array.length + index
        tempArray[l] = item
      })
      this.detail.valueArray = tempArray
    }
  }
}

</script>

<style scoped>
  .operation-detail{
    background:#fff;
  }
  .title-voucher::before{content:''; position:absolute; top: 35px; left: 50%; margin-left: -60px; width:120px; height:2px; background:#f6ca93;}
  .title-voucher::after{content:''; position:absolute; top: 40px; left: 50%; margin-left: -40px; width:80px; height:2px; background:#f6ca93;}
  .certificatie-tbale-area{
    position: relative;
  }
  .remind{
    color:#e82f3a;
    font-size: 12px;
  }
  .mgTop{
    margin-top: -134px;
  }
  .flat{
    position: absolute;
    left: 80px;
    top: 196px;
    /* background: red; */
  }
 .other-group .other-item{width:100%;word-break:break-all; line-height: 16px;margin-bottom: 7px;}
 .other-group .other-item .bank{font-size: 14px}
 .other-group .other-item span {margin-left: 10px}
 .other-group label{display: inline-block; width:150px; font-size:14px; text-align: right;font-weight: bold;}
 /* .other-group span{font-size:14px;} */
</style>
