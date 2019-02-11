<template>
  <div class="content-body" id="assignApproveRecord" >
    <div v-title='title'>{{title}}</div>
    <div class="content-body">
      <div v-title="title">{{title}}</div>
        <div class="long">
      <el-row>
        <el-col :span='24'>
            <el-form :inline="true" :model="searchData" class="stand-form " label-width="100px">
                <fieldset>
                  <el-form-item label="凭证编号"  label-width="100px">
                    <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
                  </el-form-item>
                  <el-form-item label="接受方"  label-width="75px">
                    <el-input v-model="searchData.companyQstr" placeholder="请输入接受方"></el-input>
                  </el-form-item>
                  <el-form-item label="审批日期" label-width="75px" class="last-item">
                    <el-date-picker
                      v-model="payDate"
                      type="daterange"
                      :editable=false
                      @change = 'changePayDate'
                      range-separator = " 到 "
                      placeholder="选择日期范围">
                    </el-date-picker>
                    <el-button class="searchBtn" icon="null iconfont icon-search-bt" type="info" @click = "searchVoucher" style="vertical-align:bottom; margin-left:20px;">搜索</el-button>
                  </el-form-item>
                  <el-form-item label="审批状态" class="amount-range">
                      <el-select v-model="searchData.status" placeholder="全部">
                        <el-option
                          v-for="item in statusOptions"
                          :label="item.label"
                          :value="item.value"
                          :key='item.index'>
                        </el-option>
                      </el-select>
                  </el-form-item>
                </fieldset>
            </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24' class="mt30 box-shadow radius-4 pl15 pr15 table-wrap">
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
              prop="updateTime"
              align='center'
              :show-overflow-tooltip="true"
              :formatter = "dateFormaterPrecise"
              label="审批时间"
              min-width="140">
            </el-table-column>

            <el-table-column
              prop="total"
              align='center'
              label="申请转让金额（元）"
              :formatter = "moneyShow"
              width="180">
            </el-table-column>

            <el-table-column
              prop="no"
              align='center'
              label="凭证编号"
              width='215'>
              <template scope="scope">
                <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">{{scope.row.no}}</el-button>
                <span v-if="!detailAccess">{{scope.row.no}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="cashTime"
              label="承诺付款日期"
              align='center'
              :formatter = "dateFormater"
              width="140">
            </el-table-column>

            <el-table-column
              prop="company.name"
              label="接受方"
              align='center'
              :show-overflow-tooltip="true"
              width="150">
            </el-table-column>

            <!-- <el-table-column
              prop="originCreateCompany.name"
              :show-overflow-tooltip="true"
              label="凭证签发方"
              width="200">
            </el-table-column> -->

            <!-- <el-table-column
              prop="paymentType"
              :formatter = "paymentType"
              label="付款方式"
              width="180">
            </el-table-column> -->

            <!-- <el-table-column
              prop="cashTime"
              :formatter = "dateFormater"
              label="承诺付款日期"
              width="180">
            </el-table-column> -->

            <!-- <el-table-column
              prop="needFile"
              label="贸易信息"
              :formatter = "dealOperate"
              width="120">
            </el-table-column> -->

            <el-table-column
              prop="reason"
              :show-overflow-tooltip="true"
              :formatter = "dealNull"
              align='center'
              label="审批意见"
              min-width="120">
            </el-table-column>

            <el-table-column
              prop="approvestatus"
              fixed="right"
              label="审批结果"
              align='center'
              min-width="120">
              <template scope="scope">
                <el-tag type="gray" v-for='item in statusOptions' :key="item.index" v-if='scope.row.status===item.value' >
                  {{item.label}}
                </el-tag>
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
  </div>
</template>
<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import merge from 'webpack-merge'
import modal from 'components/entries/modal'
import config from 'common/config/config'
import status from 'common/config/status'
import table from 'components/entries/base/table'
import dateTools from 'common/javascript/tools/dateTools'
// import supplierVoucherService from 'common/api/service/supplierVoucherService'
import accessControl from 'common/javascript/tools/accessControl.js'
import supplierApi from 'common/api/voucher/supplier'

export default merge({
  name: 'app',
  components: {
    modal: modal
  },
  data () {
    return {
      title: '审批记录',
      expire: [],
      statusOptions: status.transferApproveStatus,
      searchData: {
        no: null,
        companyQstr: null,
        cashTimeBegin: null,
        cashTimeEnd: null,
        status: null,
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
    this.detailAccess = accessControl.checkAccess('/voucher/assign-approve/record/detail')
  },
  methods: {
    // 查询凭证
    getGrid () {
      const self = this
      var params = this.searchData
      supplierApi.getTransferApprovalRecord.remote(params, (result) => {
        self.tableData = result.data.content || []
        self.searchData.pageSize = result.data.pageSize
        self.total = result.data.total
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].expire = (this.tableData[i].cashTime > (new Date()).valueOf()) ? 0 : 1
          this.tableData[i].expire = (this.tableData[i].value === 0 || this.tableData[i].value === '0') ? 1 : this.tableData[i].expire
          this.tableData[i].expire = (this.tableData[i].paystatus === 1) ? 1 : this.tableData[i].expire
          this.expire[this.tableData[i].id] = this.tableData[i].expire
        }
      })
    },

    // 搜索凭证
    searchVoucher () {
      this.getGrid()
    },

    // 修改付款时间
    changePayDate (value) {
      var arr = value.split(' 到 ')
      this.searchData.updateTimeBegin = dateTools.dateTotimestamp(arr[0] + ' 00:00:00')
      this.searchData.updateTimeEnd = dateTools.dateTotimestamp(arr[1] + ' 23:59:59')
    },
    toInfo (id) {
      location.href = '/#/voucher/assign-approve/record/detail?id=' + id
    },
    expireFun () {
      // this.$message.error('无可转让余额')
    }
  }
}, table)
</script>
 <style scoped>
.searchPostion{
  position: absolute;
  right: 80px;
  top: 60px;
}
</style>
