<template>
  <div class="content-area" >
    <div v-title='title'>
      {{title}}
    </div>
      <div class="group">
          <div class="span12 path-nav ">
              <ol>
                  <li>付款管理</li>>
                  <li><strong>{{title}}</strong></li>
              </ol>
          </div>
      </div>
      <div class="content-body">
        <cvoucher :voucher='detail'></cvoucher>

        <div class="font1" style="width:927px;margin:20px auto;">
          <div class="item-group" v-show="files.length != 0">
            <div class="item-tit">贸易信息</div>
               <!-- <table class="table-lr">
                  <tbody>
                    <tr>
                        <td class="l" width="25%">合同信息：</td>
                        <td class="r" width="75%">
                           <div>基础合同编号：{{contract.no}}</div>
                           <div>交易商品：{{contract.goodsInfo}}</div>
                           <div v-for="item in files" v-show='item.type === 0'><a :href="item.downUrl">{{item.name}}</a></div>
                        </td>
                    </tr>
                    <tr>
                        <td class="l" width="25%">发票信息：</td>
                        <td class="r" width="75%">
                          <div v-for="item in files" v-show='item.type === 1'><a :href="item.downUrl" target="_blank">{{item.name}}</a></div>
                        </td>
                    </tr>
                    <tr>
                        <td class="l" width="25%">其他信息：</td>
                        <td class="r" width="75%">
                          <div class="" v-for="item in files" v-show='item.type === 2'><a :href="item.downUrl" target="_blank">{{item.name}}</a></div>
                        </td>
                    </tr>
                  </tbody>
               </table> -->
               <table class="table-r table-th-block table-data" style="margin-top:30px">
                   <thead>
                       <tr>
                           <th>合同编号</th>
                           <th>交易商品</th>
                           <th>合同附件</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr v-for="item in files" v-show='item.detail.fileType === 0'>
                           <td>{{item.detail.name}}</td>
                           <td>{{item.detail.content}}</td>
                           <td><a :href="item.downUrl">{{item.name}}</a></td>
                       </tr>
                       <tr v-if="showMsg">
                           <td align="center" colspan="3">{{message}}</td>
                       </tr>
                   </tbody>
               </table>
               <div class="otherInfo" >
                 <table style="padding: 20px 40px;">
                   <tbody>
                     <tr>
                         <td width="25%" class="l c666">发票信息</td>
                         <td width="75%" class="r">
                             <div class="file-item" v-for="item in files" v-show='item.type === 1'><a :href="item.downUrl">{{item.name}}</a></div>
                             <div class="file-item" v-show='invoiceHidden'>未上传</div>
                         </td>
                     </tr>
                     <tr>
                         <td width="25%" class="l c666">其他信息</td>
                         <td width="75%" class="r">
                             <div class="file-item" v-for="item in files" v-show='item.type === 2'><a :href="item.downUrl">{{item.name}}</a></div>
                             <div class="file-item" v-show='otherHidden'>未上传</div>
                         </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
          </div>
          <div class="item-group">
              <div class="item-tit"></div>
              <table class="table-lr">
                  <tbody>
                    <tr>
                        <td class="l" width="25%">申请时间</td>
                        <td class="r" width="25%">{{time | timestampToDate}}</td>
                        <td class="l" width="25%">申请理由</td>
                        <td class="r" width="25%">{{applyReason}}</td>
                    </tr>
                    <!-- <tr>
                        <td class="l" width="25%">待付款金额（元）</td>
                        <td class="r" width="25%">{{cash.total}}</td>
                        <td class="l" width="25%">待付款金额大写</td>
                        <td class="r" width="25%">{{cash.totalBig}}</td>
                    </tr> -->
                    <tr>
                        <td class="l" width="25%">申请付款金额（元）</td>
                        <td class="r" width="25%">{{cash.value}}</td>
                        <td class="l" width="25%">申请付款金额大写</td>
                        <td class="r" width="25%">{{cash.valueBig}}</td>
                    </tr>
                    <!--
                    <tr>
                        <td class="l" width="25%">付款类型</td>
                        <td class="r" width="25%">{{cash.payType}}</td>
                    </tr>
                    -->
                  </tbody>
              </table>
          </div>
          <!--<div class="item-group">
              <div class="item-tit"></div>
              <table class="table-lr">
                  <tbody>
                    <tr>
                        <td class="l" width="25%">子账户银行</td>
                        <td class="r" width="25%">{{bankName}}</td>
                        <th width="25%" style="border: none"></th>
                        <th width="25%" style="border: none"></th>
                    </tr>
                    <tr>
                        <td class="l" width="25%">子账户</td>
                        <td class="r" width="25%">{{bankNo}}</td>
                    </tr>
                    <tr>
                        <td class="l" width="25%">账户余额（元）</td>
                        <td class="r" width="25%">{{mount}}</td>
                    </tr>
                  </tbody>
              </table>
          </div>-->
        </div>
        <!--<div class="font1" style="width:927px;margin:20px auto;" v-show='mountUndeal < moneyUndeal'>
           <span class="iconfont icon-iconset0144" style="color:#FFCC00"></span>当前账户余额不足，请<a>充值</a>。
        </div>-->
        <div class="font1" style="width:927px;margin:20px auto;">
          <el-form :model="ruleForm" :rules="rules" class="demo-ruleForm">
             <p class="mb10">审批意见</p>
             <el-form-item label="" prop="desc">
               <el-input
                 type="textarea"
                 maxlength="20"
                 :autosize="{ minRows: 2, maxRows: 4}"
                 placeholder="请填写审批意见"
                 v-model="ruleForm.desc">
               </el-input>
               <div style="text-align: right">还能输入<span style='color: red'>{{length}}</span>个字符</div>
             </el-form-item>
          </el-form>
        </div>
        <div id="created" class="group form-row " style="margin:20px;text-align:center">
            <span class="wrapper center center-ie9">
              <el-button class="cancel" type="info" size="small" @click = "cancle">取消</el-button>
              <el-button class="cancel back" type="info" size="small" @click = "reject">审批退回</el-button>
              <el-button class="sure" type="info" size="small" @click = "redirect">审批通过</el-button>
            </span>
        </div>
        <div class="font10" style="width:942px;margin:20px auto;font-size:14px">
          <span class="require">＊</span>审批退回，申请人需要重新提交申请。
   <br> <span style="padding-left: 14px"></span>审批通过，则完成凭证付款记录操作。
        </div>
      </div>
  </div>
</template>

<script type="text/javascript">
import 'common/sass/module/voucher.scss'
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/main.scss'
import 'common/sass/module/regular.scss'
import 'common/sass/module/account.scss'
import 'common/sass/module/table.scss'
import model from 'common/api/voucherTemplate'
import cvoucher from 'components/entries/common/voucher'
import moneyTools from 'common/javascript/tools/moneyTools'
import tools from 'common/javascript/tools/tools'
import smallToBig from 'common/javascript/tools/smallToBig'

export default {
  name: 'app',
  components: {
    cvoucher: cvoucher
  },
  beforeMount () {
    this.getGrid()
  },
  data () {
    return {
      // mount: 0,
      mountUndeal: 0,
      moneyUndeal: 0,
      voucherId: null,
      title: '付款申请审批',
      length: 20,
      applyReason: '',
      money: 0,
      files: [],
      showMsg: true,
      invoiceHidden: true,
      otherHidden: true,
      contract: {
        goodsInfo: null,
        no: null
      },
      detail: {
        no: null,
        value: null,
        capitalValue: null,
        cashTime: null,
        remark: null,
        paymentLetter: null,
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
        }
      },
      time: '',
      bankName: '',
      // bankNo: '',
      cash: {
        value: '',
        total: '',
        valueBig: '',
        totalBig: '',
        payType: ''
      },
      ruleForm: {
        desc: ''
      },
      rules: {
        desc: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback(new Error('请输入少于20个字符'))
                // setTimeout(() => {
                // this.ruleForm.desc = value.substring(0, 20)
                // this.length = 0
                // }, 1)
              } else {
                this.length = 20 - value.length
              }
            },
            trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    redirect () {
      let params = {
        approvalReason: this.ruleForm.desc,
        id: this.detail.id
      }
      let url = '/service/payapply/adopt'
      this.$http.post(url, params, response => {})
      // if (this.mountUndeal < this.moneyUndeal) {
      //   this.$message.error('当前账户余额不足，请充值')
      // } else {
      // }
    },
    reject () {
      let params = {
        approvalReason: this.ruleForm.desc,
        id: this.detail.id
      }
      let url = '/service/payapply/reject'
      this.$http.post(url, params, response => {
        // location.href = '#/payment/approve'
      })
    },
    cancle () {
      location.href = '#/payment/approve'
    },
    getGrid () {
      this.id = this.$route.query.id
      const baseUrl = '/service/payapply/'
      let url = baseUrl + this.id
      this.$http.get(url, response => {
        let result = model[baseUrl + ':id'](response, this)
        let data = result.data
        this.detail = data
        this.cash.value = moneyTools.commafy(moneyTools.doubleDigit(data.value)) || ''
        this.cash.total = moneyTools.commafy(moneyTools.doubleDigit(data.restValue)) || ''
        this.cash.valueBig = smallToBig(moneyTools.delcommafy(data.value))
        this.cash.totalBig = smallToBig(moneyTools.delcommafy(data.restValue))
        this.moneyUndeal = parseFloat(data.value)
        this.cash.payType = data.type === 'CASH_PAYMENT' ? '现金' : '票据'
        if (this.detail.paymentNo) {
          this.detail.paymentLetter = this.detail.paymentNo
        }
        this.detail.company = data.companyInfo
        this.detail.originCreateCompany = data.originCreatedCompany || ''
        this.detail.createCompany = data.createdCompany || ''
        this.detail.value = data.total
        // if (this.detail.paymentLetter) {
        //   this.detail.paymentLetter = this.detail.paymentLetter.no
        // }
        this.detail.createCompany.subAccount = {
          no: this.detail.bankAccount.no,
          bankName: this.detail.bankAccount.issuer.name === null ? this.detail.bankAccount.issuer.bankName : this.detail.bankAccount.issuer.name
        }
        this.detail.company.subAccount = {
          bankName: this.detail.company.subAccount.issuer.name === null ? this.detail.company.subAccount.issuer.bankName : this.detail.company.subAccount.issuer.name,
          no: this.detail.company.subAccount.no
        }
        this.$bus.$emit('voucher-refurbish', this.detail)

        this.voucherId = data.vou_id
        this.files = data.file || []
        for (var i = 0; i < this.files.length; i++) {
          this.files[i].downUrl = tools.getUrl() + '/service/voucher/file/voufile/download?fileId=' + this.files[i].fileId + '&type=VOUCHER&voucherId=' + this.voucherId
          if (this.files[i].detail.name) {
            this.showMsg = false
            this.contract.no = this.files[i].detail.name
            this.contract.goodsInfo = this.files[i].detail.content
          }
          if (this.files[i].type === 1) {
            this.invoiceHidden = false
          }
          if (this.files[i].type === 2) {
            this.otherHidden = false
          }
        }
        this.time = data.c_t
        this.applyReason = this.detail.applyReason || ''
      })

      // 获取账户余额
      // let mountUrl = '/service/account/company/account'
      // this.$http.get(mountUrl, response => {
        // let result = model[response.config.url](response, self)
        // if (result.success === false) {
        //   throw new Error('获取当前企业授信失败！')
        // }
        // this.mountUndeal = parseFloat(response.data.data.kyBalance / 100)
        // this.mount = moneyTools.commafy(moneyTools.doubleDigit(response.data.data.kyBalance / 100 || 0))
      // })
      // 获取子账户信息
      // subAccountService.getBaseInfo.remote({}, (data) => {
      //   this.bankName = data.data.bankName
      //   this.bankNo = data.data.bankNo
      // })
    }
  }
}
</script>
<style media="screen" scoped>
   .operation-info {
     width: 927px;
     margin: 20px auto;
   }
   .el-collapse-item__header__arrow {
     float: right;
     padding: 15px 1px;
   }
   .tableApprove {
     border-collapse: collapse;
     border-spacing: 0;
     border: 1px solid #e4e4e4;
   }
   .tableApprove td {
     font-size: 14px;
     border: 1px solid #e4e4e4;
     text-align: left;
   }
   table{
     table-layout:fixed;
   }
   td{
     word-wrap: break-word;
   }
   .otherInfo {
     width: 100%;
     border: 1px solid #ddd;
   }
</style>
