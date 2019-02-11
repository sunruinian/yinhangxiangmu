<template>
  <div class="content-body" id="query">
    <div v-title='title'>{{title}}</div>
      <div class="long">
        <el-row>
          <el-col :span='24'>
            <el-form :inline="true" :model="searchData" class="stand-form" label-width="100px" >
                <fieldset>
                  <el-form-item label="凭证编号" label-width="110px">
                    <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
                  </el-form-item>
                  <el-form-item label="凭证状态" label-width="74px">
                    <el-select v-model="searchData.status" placeholder="请选择">
                    <el-option
                      v-for="item in statusOptions"
                      :label="item.label"
                      :value="item.value"
                      :key='item.index'>
                    </el-option>
                  </el-select>
                  </el-form-item>

                  <el-form-item label="付款状态" label-width="74px" class="last-item">
                    <el-select v-model="searchData.payStatus" placeholder="请选择">
                    <el-option
                      v-for="item in payStatus"
                      :label="item.label"
                      :value="item.value"
                      :key='item.index'>
                    </el-option>
                  </el-select>
                  <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click="searchVoucher" style="vertical-align:bottom; margin-left:18px;">搜索</el-button>
                  </el-form-item>
                  <!-- 改为付款方 -->
                  <!-- <el-form-item label="付款方">
                    <el-input v-model="searchData.createdCompanyQStr" placeholder="请输入付款方名称"></el-input>
                  </el-form-item> -->
                  <!-- <el-form-item label="操作日期">
                    <el-date-picker
                      v-model="txDate"
                      type="daterange"
                      :editable='false'
                      placeholder="选择日期范围"
                      @change = 'changeTxDate'
                      range-separator = " 到 "
                      style="width:200px;">
                    </el-date-picker>
                  </el-form-item> -->
                  <el-form-item label="承诺付款日期" label-width="110px">
                    <el-date-picker
                      v-model="payDate"
                      type="daterange"
                      :editable='false'
                      placeholder="选择日期范围"
                      @change = 'changePayDate'
                      range-separator = " 到 "
                      style="width:200px;">
                    </el-date-picker>
                  </el-form-item>
                </fieldset>
            </el-form>
          </el-col>
        </el-row>
          <el-button class="mt10" v-if="exportExcelAccess" type="primary"  @click="output">凭证信息导出</el-button>
        <el-row>
          <el-col :span='24' class="mt10 box-shadow radius-4 pl15 pr15 table-wrap">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%">
              <!-- <el-table-column
                type="index"
                label="序号"
                align='center'
                width="80">
              </el-table-column> -->
              <el-table-column
                prop="no"
                label="凭证编号"
                align='center'
                width = '213'>
                <template scope="scope">
                  <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">{{scope.row.no}}</el-button>
                  <span v-if="!detailAccess">{{scope.row.no}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="total"
                align='center'
                :formatter = "moneyShow"
                label="凭证金额（元）"
                width="150">
              </el-table-column>
              <el-table-column
                prop="createCompany.name"
                align='center'
                :show-overflow-tooltip="true"
                label="付款方"
                min-width="150">
              </el-table-column>
              <el-table-column
                prop="paymentType"
                align='center'
                :formatter = "paymentType"
                label="付款方式"
                width="120">
              </el-table-column>
              <el-table-column
                prop="cashTime"
                align='center'
                :formatter = "dateFormater"
                label="承诺付款日期"
                width="150">
              </el-table-column>
              <el-table-column
                align='center'
                prop="originCreateCompany.name"
                :show-overflow-tooltip="true"
                label="凭证签发方"
                min-width="150">
              </el-table-column>
              <el-table-column
                align='center'
                prop="restValue"
                :formatter = "moneyShow"
                label="待付款金额"
                width="150">
              </el-table-column>



              <!-- <el-table-column
                prop="needFile"
                label="贸易信息"
                :formatter = "dealOperate"
                width="120">
              </el-table-column> -->
              <el-table-column
                align='center'
                prop="status"
                label="凭证状态"
                width="150">
                <template scope="scope">
                  <el-tag type="gray" v-for='item in statusOptions' :key="item.index" v-if='scope.row.status===item.value'>{{item.label}}</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                align='center'
                prop="payStatus"
                label="付款状态"
                width="150">
                <template scope="scope">
                  <el-tag type="gray" v-for='item in payStatus' :key="item.index" v-if='scope.row.payStatus===item.value'>{{item.label}}</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                align='center'
                prop="updateTime"
                :formatter = "dateFormaterPrecise"
                label="操作时间"
                width = '190'>
              </el-table-column>
              <el-table-column
                align='center'
                v-if="detailAccess || exportAccess"
                prop="state"
                fixed="right"
                label="操作"
                width="200">
                <template scope="scope" >
                  <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text">详情</el-button>
                  <el-button v-if="exportAccess" @click='exportFile(scope.row.id, scope.row.pdfFileId)' type="text" size="small">基本信息导出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
    </div>
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
</template>
<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import status from 'common/config/status'
import config from 'common/config/config'
import dateTools from 'common/javascript/tools/dateTools'
import tools from 'common/javascript/tools/tools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import supplierApi from 'common/api/voucher/supplier'
// import supplierVoucherService from 'common/api/service/supplierVoucherService'
import accessControl from 'common/javascript/tools/accessControl.js'
const base = {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '应收凭证',
      searchData: {
        no: null,
        cashTime: null,
        // companyQstr: null,
        createdCompanyQStr: null,
        cashTimeBegin: null,
        cashTimeEnd: null,
        updateTimeBegin: null,
        updateTimeEnd: null,
        pageNum: 1,
        status: null,
        payStatus: null,
        pageSize: config.pageSize,
        type: 'RECEIVE_VOUCHER'
      },
      txDate: null,
      payDate: null,
      currentPage: 1,
      total: 0,
      dialogFormVisible: false,
      statusOptions: status.vsVoucherSearch, // 0：待签收、1：已签收、2：拒收、3：已付款
      payStatus: status.supplierPayStatus,
      tableData: [],
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/query/detail')
    this.exportAccess = accessControl.checkAccess('/voucher/query/export')
    this.exportExcelAccess = accessControl.checkAccess('/voucher/query/exportExcel')
  },
  methods: {
    // 查询凭证
    getGrid () {
      let params = merge({}, this.searchData)
      supplierApi.getVouchers.remote(params, (result) => {
        this.tableData = result.data.content || []
        this.searchData.pageSize = result.data.pageSize
        this.total = result.data.total
      })
    },

    // 搜索凭证
    searchVoucher () {
      this.getGrid()
    },

    // 修改付款时间
    changePayDate (value) {
      if (value === '') {
        this.searchData.cashTimeBegin = this.searchData.cashTimeEnd = null
      } else {
        var arr = value.split(' 到 ')
        this.searchData.cashTimeBegin = dateTools.dateTotimestamp(arr[0] + ' 00:00:00')
        this.searchData.cashTimeEnd = dateTools.dateTotimestamp(arr[1] + ' 23:59:59')
      }
    },

    // 修改接收、转让时间
    changeTxDate (value) {
      if (value === '') {
        this.searchData.updateTimeBegin = this.searchData.updateTimeEnd = null
      } else {
        var arr = value.split(' 到 ')
        this.searchData.updateTimeBegin = dateTools.dateTotimestamp(arr[0] + ' 00:00:00')
        this.searchData.updateTimeEnd = dateTools.dateTotimestamp(arr[1] + ' 23:59:59')
      }
    },
    toInfo (id) {
      location.href = '/#/voucher/query/detail?id=' + id
    },
    exportFile (id, fileId) {
      location.href = tools.getUrl() + '/service/voucher/file/voufile/download?fileId=' + 0 + '&type=VOUCHER_DETAIL&voucherId=' + id
    },
    output () {
      location.href = tools.getUrl() + '/service/voucher/file/exportExcel?params=' + encodeURIComponent(JSON.stringify(this.searchData))
    }
  }
}
export default merge(base, table)
</script>
