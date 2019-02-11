<template>
  <div class="content-area" >
    <div class="showMore" style="position:relative;bottom:100px;right:-20px"><a href='#/payment/apply/index' style="color:#666;text-decoration:none;">查看更多></a></div>
    <div class="content-body" >
      <el-row>
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            align='center'>
             <el-table-column
              type="index"
              label="序号"
              align='center'
              width="80">
            </el-table-column>
            <el-table-column
              prop="no"
              label="凭证编号"
              align='center'
              width = '215'>
            <template scope="scope">
              <el-button v-if="detailAccess" @click='toInfo(scope.row.voucherId)' type="text" size="small">{{scope.row.no}}</el-button>
              <span v-if="!detailAccess">{{scope.row.no}}</span>
            </template>
            </el-table-column>

            <el-table-column
              prop="company.name"
              align='center'
              :show-overflow-tooltip="true"
              min-width="160"
              label="凭证签收方">
            </el-table-column>

            <el-table-column
              prop="total"
              align='center'
              label="凭证金额（元）"
              :formatter = "moneyShow"
              width="150">
            </el-table-column>
            <el-table-column
              align='center'
              prop="value"
              label="待付款金额（元）"
              :formatter = "moneyShow"
              width="150">
            </el-table-column>

            <el-table-column
              align='center'
              prop="cashTime"
              label="付款日期"
              :formatter = "dateFormater"
              width="120">
            </el-table-column>

            <el-table-column
              v-if="applyAccess"
              align='center'
              prop="state"
              fixed="right"
              label="操作"
              width="120">
              <template scope="scope" >
                <el-button type="text" size="small" @click='toApply(scope.row.voucherId)' >申请</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <applyPaySome :dialogShow.sync='dialogShow'></applyPaySome>
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
// import layout from 'components/include/layout-l-r'
// import config from 'common/config/config'
import model from 'common/api/voucherTemplate'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import applyPaySome from 'module/payment/apply/payment'
import accessControl from 'common/javascript/tools/accessControl.js'
import dateTools from 'common/javascript/tools/dateTools'
import objectTools from 'common/javascript/tools/objectTools'
import status from 'common/config/status'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
export default merge({
  name: 'app',
  components: {
    modal: modal,
    // layout,
    applyPaySome
  },
  props: ['totalNum'],
  data () {
    return {
      title: '凭证付款',
      tab: {
        activeName: 'first'
      },
      msgShow: false,
      pageSize: 5,
      cashTime: null,
      searchData: {
        cashTimeBegin: null,
        cashTimeEnd: null,
        companyStr: null,
        pageNum: 1,
        valueMax: '',
        valueMin: '',
        status: null,
        needLimit: false,
        orderType: 'CASHTIME_ASC'
      },
      transferOptions: status.transferOptions,
      currentPage: 1,
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      applyAccess: false,
      detailAccess: false,
      dialogShow: {
        show: false,
        totalMOney: 0,
        voucherId: []
      },
      selected: []
    }
  },
  beforeMount () {
    // this.searchData.status = 1
    this.searchData.hasParent = null
  },
  mounted () {
    this.detailAccess = accessControl.checkAccess('/payment/apply/index/detail')
    this.applyAccess = accessControl.checkAccess('/payment/apply/apply')
    this.getGrid()
  },
  methods: {
    addContract () {
      this.$refs.addContract.show = true
    },
    stateFormat () {
      return '1'
    },
    handleSizeChange (page, a, b) {
    },
    getGrid () { // 获得表数据
      let params = objectTools.emptyStrToNull(this.searchData)
      this.$http.post('/service/clearingrule/query', params, response => {
        // 数据模型处理
        let result = model[response.config.url](response, this)
        this.totalNum.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
      })
    },
    toApply (id) {
      location.href = '#/payment/apply/apply?id=' + id
    },
    toInfo (id) {
      location.href = '#/payment/apply/index/detail?id=' + id
    },
    cashChange (status) {
      var valueMax = ''
      var valueMin = ''
      switch (status) {
        case 1:
          {
            valueMin = '0'
            valueMax = '100000'
            break
          }

        case 2:
          {
            valueMin = '100000'
            valueMax = '500000'
            break
          }
        case 3:
          {
            valueMin = '500000'
            valueMax = '1000000'
            break
          }
        case 4:
          {
            valueMin = '1000000'
            valueMax = '5000000'
            break
          }
        case 5:
          {
            valueMin = '5000000'
            valueMax = '20000000'
            break
          }
        case 6:
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
    // 时间搜索框
    cashTimeChange (value) {
      if (value === '' || value === null) {
        this.searchData.cashTimeBegin = ''
        this.searchData.cashTimeEnd = ''
        return
      }
      const array = value.split('到')
      this.searchData.cashTimeBegin = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.cashTimeEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    }
  }
}, table)
</script>
