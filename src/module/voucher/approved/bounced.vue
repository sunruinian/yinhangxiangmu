<template>

  <div class="content-body" id="approvedBounced">
    <div class="long">
    <el-row>
      <el-col :span='24'>
        <el-form :inline="true"  class="stand-form ">
            <fieldset>
              <el-form-item label="凭证编号" label-width="113px">
                <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
              </el-form-item>
              <el-form-item label="接受方" class="last-item" label-width="87px">
                <el-input v-model="searchData.companyQstr" placeholder="请输入接受方名称"></el-input>
              </el-form-item>
              <el-button class="button-bubi-theme searchBtn searchPostion" type="info" icon="null iconfont icon-search-bt" @click="search">搜索</el-button>
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
            prop="value"
            align='center'
            label="凭证金额（元）"
            :formatter = "moneyShow"
            width="180">
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
            align='center'
            label="承诺付款日期"
            :formatter = "dateFormater"
            width="180">
          </el-table-column>
          <el-table-column
            prop="company.name"
            align='center'
            :show-overflow-tooltip="true"
            label="接受方"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="reason"
            align='center'
            :show-overflow-tooltip="true"
            label="原因"
            min-width="180">
          </el-table-column>
          <!-- // 贸易信息 -->
          <!-- <el-table-column
            prop="files"
            label="贸易信息"
            :formatter = "dealOperate"
            width="180">
          </el-table-column> -->
          <!-- // 操作时间 -->
          <!-- <el-table-column
            prop="updateTime"
            :formatter = "dateFormaterPrecise"
            label="操作时间"
            width="180">
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
  </div>
    <el-row v-show="tableData.length != 0">
      <el-col :span='24' >
        <el-pagination
          small
          class="page-position-base"
          align ="center"
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
</template>
<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import coreApi from 'common/api/voucher/core'
import accessControl from 'common/javascript/tools/accessControl.js'

export default merge({
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '审批退回',
      tab: {
        activeName: 'second'
      },
      state: null,
      searchData: {
        companyQstr: null,
        no: null,
        pageNum: 1,
        pageSize: config.pageSize
      },
      tableData: [],
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/approved/bounced/detail')
  },
  methods: {
    tabHandleClick (item) {
      let url = ''
      if (item.name === 'first') {
        url = '#/voucher/approved/'
      } else if (item.name === 'second') {
        url = '#/voucher/approved/bounced'
      }
      location.href = url
    },
    getGrid () { // 获得表数据
      let params = merge({}, this.searchData)
      // if (this.state === null) {
      //   params.origin = null
      //   params.status = null
      // } else if (this.state === 1) { // 通过
      //   params.origin = [0, 2]
      //   params.status = [3, 4, 5, 6]
      // } else { // 未通过
      //   params.origin = [2]
      //   params.status = [1, 2]
      // }
      // params = this.handleParams(params)
      coreApi.getReturnedVoucher.remote(params, (result) => {
        this.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
        // for (var i = 0; i < this.tableData.length; i++) {
        //   if (this.tableData[i].origin === 0) {
        //     this.tableData[i].state = 1 // 通过
        //   } else if (this.tableData[i].origin === 2 && this.tableData[i].status >= 3) {
        //     this.tableData[i].state = 1 // 通过
        //   } else if (this.tableData[i].origin === 2 && this.tableData[i].status < 3) {
        //     this.tableData[i].state = 0 // 未通过
        //   }
        // }
      })
    },
    toInfo (id) {
      location.href = '#/voucher/approved/bounced/detail?id=' + id
    }
  }
}, table)
</script>
