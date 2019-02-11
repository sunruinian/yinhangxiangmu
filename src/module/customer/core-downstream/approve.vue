<template>
  <div class="content-area" >
    <div class="showMore" style="position:relative;bottom:100px;right:-20px"><a href='#/payment/approve/index' style="color:#666;text-decoration:none;">查看更多></a></div>
    <div class="content-body" >
      <el-row>
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align='center'
              width="80">
            </el-table-column>
            <!-- <el-table-column
              prop="c_t"
              label="申请时间"
              :formatter = "dateFormaterPrecise"
              width="180">
            </el-table-column>
            <el-table-column
              prop="value"
              label="申请付款金额（元）"
              :formatter = "moneyShow"
              width="180">
            </el-table-column> -->
            <el-table-column
              prop="no"
              label="凭证编号"
              width = '215'
              align='center'>
            </el-table-column>

            <el-table-column
              prop="companyInfo.name"
              :show-overflow-tooltip="true"
              min-width="180"
              label="凭证签收方"
              align='center'>
            </el-table-column>

            <el-table-column
              prop="total"
              label="凭证金额（元）"
              :formatter = "moneyShow"
              align='center'
              width="180">
            </el-table-column>

            <el-table-column
              prop="total"
              label="申请付款金额（元）"
              :formatter = "moneyShow"
              align='center'
              width="180">
            </el-table-column>
<!--
            <el-table-column
              prop="cashTime"
              label="付款日期"
              align='center'
              :formatter = "dateFormater"
              width="150">
            </el-table-column> -->

            <el-table-column
              v-if="approveAccess"
              align='center'
              prop="state"
              fixed="right"
              label="操作"
              width="120">
              <template scope="scope" >
                <el-button type="text" size="small" @click='approve(scope.row.id)' >审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
import 'common/css/lib/motherplate.css'
import 'common/sass/main.scss'
import 'common/sass/module/account.scss'
import 'common/sass/module/table.scss'
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
import config from 'common/config/config'
import model from 'common/api/voucherTemplate'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import accessControl from 'common/javascript/tools/accessControl.js'
import dateTools from 'common/javascript/tools/dateTools'
import objectTools from 'common/javascript/tools/objectTools'
import status from 'common/config/status'

export default merge({
  name: 'app',
  components: {
    modal: modal,
    layout
  },
  props: ['totalNum'],
  data () {
    return {
      title: '凭证付款',
      tab: {
        activeName: 'first'
      },
      cashTime: null,
      msgShow: false,
      searchData: {
        cashTBegin: null,
        cashTEnd: null,
        companyQStr: null,
        companyStr: null,
        valueMax: '',
        valueMin: '',
        no: null,
        pageSize: config.pageSize,
        pageNum: 1,
        paystatus: [0],
        status: 0,
        statusCopy: null,
        value: null,
        originCreatedCompanyStr: null
      },
      currentPage: 1,
      dialogFormVisible: false,
      tableData: [],
      detailAccess: false,
      approveAccess: false,
      approvalOptions: status.approvalOptions
    }
  },
  beforeMount () {
    // this.searchData.status = [0]
  },
  mounted () {
    this.detailAccess = accessControl.checkAccess('/payment/approve/index/detail')
    this.approveAccess = accessControl.checkAccess('/payment/approve/approve')
    this.getGrid()
  },
  methods: {
    addContract () {
      this.$refs.addContract.show = true
    },
    stateFormat () {
      return '1'
    },
    getGrid () { // 获得表数据
      let params = objectTools.emptyStrToNull(this.searchData)
      this.$http.post('/service/payapply/queryList', params, response => {
        // 数据模型处理
        let result = model[response.config.url](response, this)
        this.totalNum.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
      })
    },
    cashTimeChange (value) { // 时间变化
      const array = value.split('到')
      this.searchData.cashTBegin = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.cashTEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    // cashChange (value, mum) {
    //   if (!isNaN(value) === true) {
    //     this.searchData[mum] = value
    //     this.msgShow = false
    //   } else {
    //     this.msgShow = true
    //     setTimeout(() => {
    //       this.searchData[mum] = null
    //     }, 1)
    //   }
    // },
    // 付款金额搜索
    cashChange (status) {
      var valueMax = ''
      var valueMin = ''
      switch (status) {
        case 1:
          {
            valueMin = '0'
            valueMax = '500000'
            break
          }

        case 2:
          {
            valueMin = '500000'
            valueMax = '1000000'
            break
          }
        case 3:
          {
            valueMin = '1000000'
            valueMax = '5000000'
            break
          }
        case 4:
          {
            valueMin = '5000000'
            valueMax = '20000000'
            break
          }
        case 5:
          {
            valueMin = '20000000'
            break
          }
        default:
          {
            valueMin = ''
            valueMax = ''
            break
          }
      }
      this.searchData.valueMax = valueMax
      this.searchData.valueMin = valueMin
    },
    handleSizeChange (page, a, b) {
    },
    approve (id) {
      location.href = '#/payment/approve/approve?id=' + id
    }
  }
}, table)
</script>
