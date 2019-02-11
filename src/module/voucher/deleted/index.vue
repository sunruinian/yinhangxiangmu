<template>
  <div class="content-area voucherDeled" >
    <div v-title='title'>{{title}}</div>
    <div class="content-body" style='background: #fff;'>
      <div class="long">
      <el-row>
        <el-col :span='24'>
          <el-form :inline="true"  class="stand-form " label-width="80px" >
              <fieldset>
                <el-form-item label="凭证编号" label-width="90px">
                  <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
                </el-form-item>
                <el-form-item label="接受方" label-width="75px">
                  <el-input v-model="searchData.companyQstr" placeholder="请输入接受方名称"></el-input>
                </el-form-item>
                <el-form-item label="操作日期" class="last-item" label-width="88px">
                  <el-date-picker
                    v-model="payDate"
                    type="daterange"
                    :editable=false
                    placeholder="选择日期范围"
                    style="width:200px;"
                    @change = 'changePayDate'
                    range-separator = " 到 ">
                  </el-date-picker>
                  <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click = "searchVoucher" style="vertical-align:top; float:right">搜索</el-button>
                </el-form-item>
              </fieldset>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="mt30 box-shadow radius-4 pl15 pr15 table-wrap">
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <!-- <el-table-column
              type="index"
              label="序号"
              align='center'
              width="80"> -->
            </el-table-column>
            <el-table-column
              prop="no"
              label="凭证编号"
              align='center'
              width='215'>
              <template scope="scope">
                <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">{{scope.row.no}}</el-button>
                <span v-if="!detailAccess">{{scope.row.no}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              label="凭证金额（元）"
              align='center'
              :formatter = "moneyShow"
              width="150">
            </el-table-column>
            <el-table-column
              prop="paymentType"
              align='center'
              label="付款方式"
              :formatter = "paymentType"
              width="120">
            </el-table-column>
            <el-table-column
              prop="cashTime"
              label="承诺付款日期"
              align='center'
              :formatter = "dateFormater"
              width="190">
            </el-table-column>
            <el-table-column
              prop="company.name"
              align='center'
              :show-overflow-tooltip="true"
              label="接受方"
              min-width="200">
            </el-table-column>
            // 贸易信息
            <!-- <el-table-column
              prop="files"
              label="贸易信息"
              :formatter = "dealOperate"
              width="180">
            </el-table-column> -->
            // 操作时间
            <!-- <el-table-column
              prop="updateTime"
              label="操作时间"
              :formatter = "dateFormaterPrecise"
              width="190">
            </el-table-column> -->
            <el-table-column
              v-if="detailAccess"
              align='center'
              prop="state"
              fixed="right"
              label="操作"
              width="100">
              <template scope="scope">
                <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-show="tableData.length != 0">
        <el-col :span='24' >
          <el-pagination
            small
            class="page-position-base"
            align ="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchData.pageNum"
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
import config from 'common/config/config'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import coreApi from 'common/api/voucher/core'
import accessControl from 'common/javascript/tools/accessControl.js'

const base = {
  name: 'app',
  components: {},
  data () {
    return {
      title: '已删除凭证',
      payDate: null,
      searchData: {
        no: null,
        companyQstr: null,
        updateTimeBegin: null,
        updateTimeEnd: null,
        createdCompanyId: null,
        pageSize: config.pageSize,
        pageNum: 1
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/deleted/detail')
  },
  methods: {
    // 查询凭证
    getGrid () {
      let params = merge({}, this.searchData)
      coreApi.getDeletedVoucher.remote(params, (result) => {
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
      var arr = value.split(' 到 ')
      this.searchData.updateTimeBegin = this.stringToTimestamp(arr[0] + ' 00:00:00')
      this.searchData.updateTimeEnd = this.stringToTimestamp(arr[1] + ' 23:59:59')
    },

    toInfo (id) {
      location.href = '#/voucher/deleted/detail?id=' + id
    }
  }
}
export default merge(base, table)
</script>
<style scoped>
.searchPostion{
  position: absolute;
  right: -14px;
  top: 0px;
}
</style>
