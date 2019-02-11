<template>
  <div class="content-area voucher-revoke">
      <el-row>
        <el-col :span='24' >
          <el-form :inline="true" :model="searchData" class="stand-form">
              <fieldset>
                <el-form-item label="凭证编号：" label-width="100px">
                  <el-input v-model="searchData.no"  placeholder="请输入凭证编号"></el-input>
                </el-form-item>
                <el-form-item label="接受方:" label-index="85px;">
                  <el-input v-model="searchData.companyQstr"  placeholder="请输入接受方名称"></el-input>
                </el-form-item>
                <el-button class="button-bubi-theme searchBtn top0" icon="null iconfont icon-search-bt" @click = "search">搜索</el-button>
              </fieldset>
          </el-form>
        </el-col>
      </el-row>

      <el-row style="padding-top:10px">
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="no"
              label="凭证编号"
              width = '200'>
              <template scope="scope">
                <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">{{scope.row.no}}</el-button>
                <span v-if="!detailAccess">{{scope.row.no}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              label="凭证金额（元）"
              :formatter = "moneyShow"
              width="120">
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
              width="120">
            </el-table-column>
            <el-table-column
              prop="company.name"
              :show-overflow-tooltip=true
              label="接受方"
              min-width="120">
            </el-table-column>
            <el-table-column
              v-if="detailAccess"
              prop="id"
              label="操作"
              width="100">
              <template scope="scope" >
                <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small" style="color:#666;"><i class="icon iconfont table-icon">&#xe63b;</i>详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row v-show="tableData.length != 0">
        <el-col :span='24' class="pagination-base">
          <el-pagination
            small
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
</template>
<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import config from 'common/config/config'
import dateTools from 'common/javascript/tools/dateTools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import cletter from 'components/entries/common/letter'
import accessControl from 'common/javascript/tools/accessControl.js'
import coreApi from 'common/api/voucher/core'

export default merge(table, {
  name: 'app',
  components: {
    cletter
  },
  data () {
    return {
      title: '待审批凭证',
      buttonActive: true,
      selection: [],
      approveId: null,
      approveDialogForm: false,
      form: {
        operator: '',
        reason: '',
        rules: {
          operator: [
            { required: true, message: '审批结果为必选项！', trigger: 'change' }
          ],
          reason: [
            {
              validator: (rule, value, callback) => {
                if (value.length > 20) {
                  callback(new Error('审批意见为20个字'))
                }
                callback()
              },
              trigger: 'change'
            }
          ]
        }
      },
      searchData: {
        no: null,
        companyQstr: null,
        updateTime: null,
        updateTimeBegin: null,
        updateTimeEnd: null,
        createdCompanyId: null,
        pageSize: config.pageSize,
        pageNum: 1
      },
      expire: [],
      approveIdExpire: false,
      currentPage: 1,
      total: 0,
      tableData: [],
      // 付款函相关数据
      no: null,
      companyId: null,
      paymentId: null,
      paymentFileId: null,
      companyName: null,
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/revoke/detail')
  },
  methods: {
    getGrid () { // 获得表数据
      let params = merge({}, this.searchData)
      coreApi.getRevokeVoucher.remote(params, (result) => {
        this.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
      })
    },
    cashTimeChange (value) { // 时间变化
      const array = value.split(' 到 ')
      this.searchData.updateTimeBegin = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.updateTimeEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    toInfo (id) {
      location.href = '#/voucher/revoke/detail?id=' + id
    }
  }
})
</script>
