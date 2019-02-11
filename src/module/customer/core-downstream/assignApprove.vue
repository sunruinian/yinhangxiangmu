<template>
  <div class="content-area" >
    <div class="showMore" style="position:relative;bottom:100px;right:-20px"><a href='#/voucher/assign-approve/index' style="color:#666;text-decoration:none;">查看更多></a></div>
    <div class="content-body">
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
              prop="createTime"
              :show-overflow-tooltip="true"
              :formatter = "dateFormaterPrecise"
              label="申请时间"
              width='215'
              >
            </el-table-column> -->
<!--
            <el-table-column
              prop="value"
              label="申请转让金额（元）"
              width="175"
              :formatter = "moneyShow"
              >
            </el-table-column> -->
            <el-table-column
              prop="no"
              label="凭证编号"
              align="center"
              width='215'>
            </el-table-column>

            <el-table-column
              prop="company.name"
              label="指定供应商"
              :show-overflow-tooltip="true"
              align="center"
              min-width="180">
            </el-table-column>

            <el-table-column
              prop="value"
              label="申请转让金额（元）"
              align="center"
              width="180"
              :formatter = "moneyShow"
              >
            </el-table-column>

            <el-table-column
              prop="cashTime"
              :formatter = "dateFormater"
              label="付款日期"
              align="center"
              width="180"
              >
            </el-table-column>

            <el-table-column
              v-if="assignAccess"
              prop="id"
              fixed="right"
              label="操作"
              align="center"
              width="120"
            >
              <template scope="scope">
                <el-button @click='apply(scope.row.id)' type="text">审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='24' v-if = 'tableData.length > 0'>
          <el-pagination
            small
            class="page-position-base"
            align ="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="searchData.pageSize"
            :total="total"
            layout="prev, pager, next, total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
import merge from 'webpack-merge'
import modal from 'components/entries/modal'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import dateTools from 'common/javascript/tools/dateTools'
// import supplierVoucherService from 'common/api/service/supplierVoucherService'
import supplierApi from 'common/api/voucher/supplier'
import accessControl from 'common/javascript/tools/accessControl.js'

export default merge({
  name: 'app',
  components: {
    modal: modal
  },
  props: ['totalNum'],
  data () {
    return {
      title: '待审批转让',
      expire: [],
      searchData: {
        no: null,
        companyQstr: null,
        createdCompanyQstr: null,
        cashTimeBegin: null,
        pageNum: 1,
        pageSize: config.pageSize
      },
      payDate: null,
      currentPage: 1,
      total: 0,
      tableData: [],
      assignAccess: false,
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/assign-approve/index/detail')
    this.assignAccess = accessControl.checkAccess('/voucher/assign-approve/approve')
  },
  methods: {
    // 查询凭证
    getGrid () {
      const self = this
      var params = this.searchData
      supplierApi.getTransferToapproval.remote(params, (result) => {
        self.tableData = result.data.content || []
        self.searchData.pageSize = result.data.pageSize
        self.totalNum.total = result.data.total
        // for (var i = 0; i < this.tableData.length; i++) {
          // this.tableData[i].expire = (this.tableData[i].cashTime > (new Date()).valueOf()) ? 0 : 1
          // this.tableData[i].expire = (this.tableData[i].value === 0 || this.tableData[i].value === '0') ? 1 : this.tableData[i].expire
          // this.tableData[i].expire = (this.tableData[i].paystatus === 1) ? 1 : this.tableData[i].expire
          // this.expire[this.tableData[i].id] = this.tableData[i].expire
        // }
      })
    },

    // 搜索凭证
    searchVoucher () {
      this.getGrid()
    },

    // 修改付款时间
    changePayDate (value) {
      var arr = value.split(' 到 ')
      this.searchData.createTimeBegin = dateTools.dateTotimestamp(arr[0] + ' 00:00:00')
      this.searchData.createTimeEnd = dateTools.dateTotimestamp(arr[1] + ' 23:59:59')
    },

    apply (id) {
      location.href = '/#/voucher/assign-approve/approve?id=' + id
    },
    toInfo (id) {
      location.href = '/#/voucher/assign-approve/index/detail?id=' + id
    },
    expireFun () {
      // this.$message.error('无可转让余额')
    }
  }
}, table)
</script>
