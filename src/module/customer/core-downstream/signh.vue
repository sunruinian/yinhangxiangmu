<template>
  <div class="content-area" >
  <div class="showMore" style="position:relative;bottom:100px;right:-20px"><a href='#/voucher/sign' style="color:#666;text-decoration:none;">查看更多></a></div>
    <div class="content-body" style='background: #fff;'>
      <el-row>
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%;text-align:center"
            >
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
            </el-table-column>

            <el-table-column
              prop="originCreateCompany.name"
              :show-overflow-tooltip="true"
              label="凭证登记方"
              width="200">
            </el-table-column>

            <el-table-column
              prop="total"
              label="凭证金额（元）"
              align="center"
              :formatter = "moneyShow"
              width="180">
            </el-table-column>

            <el-table-column
              prop="cashTime"
              label="付款日期"
              align="center"
              :formatter = "dateFormater"
              width="180">
            </el-table-column>

            <el-table-column
              v-if="signAccess"
              prop="id"
              fixed="right"
              label="操作"
              width="90">
              <template scope="scope" >
                <el-button v-if="signAccess" @click='sign(scope.row.id)' type="text" size="small">签收</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
import status from 'common/config/status'
import config from 'common/config/config'
import dateTools from 'common/javascript/tools/dateTools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import supplierVoucherService from 'common/api/service/supplierVoucherService'
import supplierApi from 'common/api/voucher/supplier'
import accessControl from 'common/javascript/tools/accessControl.js'

export default merge({
  name: 'app',
  components: {
  },
  props: ['totalNum'],
  data () {
    return {
      title: '凭证签收',
      statusOptions: status.toSignVoucher,
      searchData: {
        cashTime: null,
        cashTimeBegin: null,
        cashTimeEnd: null,
        companyQstr: null,
        createdCompanyQStr: null,
        no: null,
        origin: null,
        pageNum: 1,
        pageSize: config.pageSize
      },
      tableData: [],
      signAccess: false,
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.signAccess = accessControl.checkAccess('/voucher/sign/sign')
    this.detailAccess = accessControl.checkAccess('/voucher/sign/detail')
  },
  methods: {
    cashTimeChange (value) { // 时间变化
      const array = value.split(' 到 ')
      this.searchData.cashTimeBegin = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.cashTimeEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    getGrid () { // 获得表数据
      let params = this.searchData
      params = this.handleParams(params)
      supplierApi.getSigningVoucher.remote(params, (result) => {
        this.totalNum.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
      })
    },
    sign (id) {
      this.selectId = id
      location.href = '/#/voucher/sign/sign?id=' + id
    }
  }
}, table)
</script>
