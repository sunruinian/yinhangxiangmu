<template>
  <div class="content-area">
    <el-row>
      <el-col :span='24' >
        <el-form :inline="true" :model="searchData" class="stand-form " style="margin-top:10px" label-width="100px" >
            <fieldset>
              <el-form-item label="凭证编号">
                <el-input v-model="searchData.no"  placeholder="请输入凭证编号"></el-input>
              </el-form-item>

              <el-form-item label="接受方">
                <el-input v-model="searchData.companyQstr"  placeholder="请输入接受方名称"></el-input>
              </el-form-item>

              <el-form-item label="凭证状态">
                <el-select v-model="searchData.status" placeholder="全部">
                  <el-option
                    v-for="item in statusOptions"
                    :label="item.label"
                    :value="item.value"
                    :key='item.index'>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="付款状态" class="last-item">
                <el-select v-model="searchData.payStatus" placeholder="请选择">
                  <el-option
                    v-for="item in payStatus"
                    :label="item.label"
                    :value="item.value"
                    :key='item.index'>
                  </el-option>
                </el-select>
                <el-button class="button-bubi-theme searchBtn" type="info" icon="null iconfont icon-search-bt" @click="search">搜索</el-button>
              </el-form-item>
            </fieldset>
        </el-form>
      </el-col>
    </el-row>
    <el-button class=" ml30" v-if="exportExcelAccess" type="primary"  @click="output">凭证信息导出</el-button>

    <el-row style="padding-top:10px">
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
            width="180">
          </el-table-column>
          <el-table-column
            prop="paymentType"
            label="付款方式"
            :formatter = "paymentType"
            width="120">
          </el-table-column>
          <el-table-column
            prop="cashTime"
            label="承诺付款日期"
            :formatter = "dateFormater"
            width="180">
          </el-table-column>
          <el-table-column
            prop="company.name"
            :show-overflow-tooltip=true
            label="接受方"
            min-width="180">
          </el-table-column>
          <!-- // 贸易信息 -->
          <!-- <el-table-column
            prop="files"
            label="贸易信息"
            :formatter = "dealOperate"
            width="180">
          </el-table-column> -->
          <el-table-column
            prop="status"
            label="凭证状态"
            width="120">
            <template scope="scope">
              <el-tag type="gray" v-for='item in statusOptions' :key="item.index" v-if='scope.row.status===item.value' >
                {{item.label}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="payStatus"
            label="付款状态"
            width="120">
            <template scope="scope">
              <el-tag type="gray" v-for='item in payStatus' :key="item.index" v-if='scope.row.payStatus===item.value' >
                {{item.label}}
              </el-tag>
            </template>
          </el-table-column>
          <!-- // 操作时间 -->
          <!-- <el-table-column
            prop="updateTime"
            label="操作时间"
            :formatter = "dateFormaterPrecise"
            width="180">
          </el-table-column> -->
          <el-table-column
            v-if="detailAccess || exportAccess"
            prop="id"
            fixed="right"
            label="操作"
            width="180">
            <template scope="scope">
              <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">详情</el-button>
              <el-button v-if="exportAccess" @click='exportFile(scope.row.id, scope.row.pdfFileId)' type="text" size="small">基本信息导出</el-button>
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
import status from 'common/config/status'
import config from 'common/config/config'
import dateTools from 'common/javascript/tools/dateTools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import accessControl from 'common/javascript/tools/accessControl.js'
import tools from 'common/javascript/tools/tools'
import coreApi from 'common/api/voucher/core'

export default merge(table, {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '凭证查询',
      buttonActive: true,
      selection: [],
      tab: {
        activeName: 'first'
      },
      statusOptions: status.coreQueryVoucher,
      payStatus: status.corePayStatus,
      searchData: {
        no: null,
        companyQstr: null,
        status: null,
        pageSize: config.pageSize,
        payStatus: null,
        pageNum: 1,
        type: 'CORE_COMPANY'
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      detailAccess: false,
      exportAccess: false,
      exportExcelAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/coreQuery/detail')
    this.exportAccess = accessControl.checkAccess('/voucher/coreQuery/export')
    this.exportExcelAccess = accessControl.checkAccess('/voucher/coreQuery/exportExcel')
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
      coreApi.getApprovedVoucher.remote(params, (result) => {
        this.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
      })
    },
    cashTimeChange (value) { // 时间变化
      const array = value.split('到')
      this.searchData.updateTimeBegin = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.updateTimeEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    toInfo (id) {
      location.href = '#/voucher/coreQuery/detail?id=' + id
    },
    exportFile (id, fileId) {
      location.href = tools.getUrl() + '/service/voucher/file/voufile/download?fileId=' + 0 + '&type=VOUCHER_DETAIL&voucherId=' + id
    },
    output () {
      location.href = tools.getUrl() + '/service/voucher/file/exportExcel?params=' + encodeURIComponent(JSON.stringify(this.searchData))
    }
  }
})
</script>
