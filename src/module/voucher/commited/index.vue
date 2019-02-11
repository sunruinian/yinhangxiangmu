<template>
  <div class="content-area" id="voucherCommited">
    <div v-title='title'>{{title}}</div>
    <div class="content-body">
      <div class="long">
        <el-row>
          <el-col :span='24'>
            <el-form :inline="true" :model="searchData" class="stand-form " label-width="100px" >
                <fieldset>
                  <el-form-item label="凭证编号" label-width="90px">
                    <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
                  </el-form-item>

                  <el-form-item label="接受方" label-width="100px">
                    <el-input v-model="searchData.companyQstr" placeholder="请输入接受方名称"></el-input>
                  </el-form-item>

                  <el-form-item label="凭证状态" label-width="75px" class="last-item">
                    <el-select v-model="searchData.status" placeholder="全部">
                      <el-option
                        v-for="item in statusOptions"
                        :label="item.label"
                        :value="item.value"
                        :key='item.index'>
                      </el-option>
                    </el-select>
                    <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click="search" style="vertical-align:bottom; margin-left:18px;">搜索</el-button>
                  </el-form-item>

                  <el-form-item label="登记日期" label-width="90px">
                    <el-date-picker
                      v-model="searchData.createTime"
                      type="daterange"
                      placeholder="选择日期范围"
                      style="width:200px;"
                      range-separator=' 到 '
                      @change='createTimeChange'>
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item label="承诺付款日期" label-width="100px">
                    <el-date-picker
                      v-model="searchData.cashTime"
                      type="daterange"
                      placeholder="选择日期范围"
                      style="width:200px;"
                      range-separator=' 到 '
                      @change='cashTimeChange'>
                    </el-date-picker>
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
                align="center"
                width="80">
              </el-table-column> -->
              <el-table-column
                prop="no"
                :show-overflow-tooltip="true"
                align="center"
                label="凭证编号"
                width = '215'>
                <template scope="scope">
                  <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">{{scope.row.no}}</el-button>
                  <span v-if="!detailAccess">{{scope.row.no}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="total"
                label="凭证金额（元）"
                :formatter = "moneyShow"
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                prop="paymentType"
                label="付款方式"
                :formatter = "paymentType"
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                prop="cashTime"
                label="承诺付款日期"
                :formatter = "dateFormater"
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                prop="company.name"
                align="center"
                :show-overflow-tooltip="true"
                label="接受方"
                min-width="160">
              </el-table-column>
              <!-- <el-table-column
                prop="files"
                :formatter = "dealOperate"
                label="贸易信息"
                width="105">
              </el-table-column> -->
              <el-table-column
                prop="status"
                align="center"
                label="状态"
                width="200">
                <template scope="scope">
                  <el-tag type="gray" v-for='item in statusOptions' :key="item.index" v-if='scope.row.status===item.value' >
                    {{item.label}}
                  </el-tag>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="createTime"
                label="登记时间"
                :formatter = "dateFormaterPrecise"
                width="180">
              </el-table-column> -->
              <el-table-column
                align="center"
                v-if="detailAccess"
                prop="state"
                fixed="right"
                label="操作"
                width="80">
                <template scope="scope" >
                  <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row v-show="tableData.length != 0">
          <el-col :span='24'>
            <el-pagination
              small
              align="center"
              class="page-position-base"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, total"
              :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import status, {results} from 'common/config/status'
import config from 'common/config/config'
import source from 'common/config/source'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import coreApi from 'common/api/voucher/core'
import accessControl from 'common/javascript/tools/accessControl.js'

const base = {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '已提交凭证',
      currentPage: 1,
      total: 1,
      pageSize: config.pageSize,
      approvalStage: null, // 待审批（登记待审批）、审批通过（审批待签收、已签收、拒收、已付款）、审批未通过
      statusOptions: status.submitedVoucher, // 登记待审批、审批待签收、已签收、拒收、已付款
      approvalStageOptions: source.approvalStage,
      dialogFormVisible: false,
      results: results.vCertificateVerifyCertificated,
      searchData: {
        no: null,
        status: null,
        companyQstr: '',
        createTime: null,
        cashTime: null,
        createTimeBegin: null,
        createTimeEnd: null,
        cashTimeBegin: null,
        cashTimeEnd: null,
        pageSize: config.pageSize,
        pageNum: 1
      },
      tableData: [],
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/commited/detail')
  },
  methods: {
    getGrid () {
      let params = merge({}, this.searchData)
      coreApi.getSubmittedVoucher.remote(params, (result) => {
        this.tableData = result.data.content || []
        this.searchData.pageSize = result.data.pageSize
        this.total = result.data.total
      })
    },

    createTimeChange (value) { // 创建时间变化
      const array = value.split(' 到 ')
      this.searchData.createTimeBegin = this.stringToTimestamp(array[0] + ' 00:00:00')
      this.searchData.createTimeEnd = this.stringToTimestamp(array[1] + ' 24:00:00')
    },
    cashTimeChange (value) { // 时间变化
      const array = value.split(' 到 ')
      this.searchData.cashTimeBegin = this.stringToTimestamp(array[0] + ' 00:00:00')
      this.searchData.cashTimeEnd = this.stringToTimestamp(array[1] + ' 24:00:00')
    },
    toInfo (id) {
      location.href = '#/voucher/commited/detail?id=' + id
    }
  }
}
export default merge(base, table)
</script>
