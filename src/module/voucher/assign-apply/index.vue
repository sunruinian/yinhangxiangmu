<template>
  <div class="content-body" >
    <div v-title='title'>{{title}}</div>
    <div class="content-body" id="assignApply">
      <div class="long">
        <el-row>
          <el-col :span='24'>
            <el-form :inline="true" :model="searchData" class="stand-form " label-width="100px">
                <fieldset>
                  <el-form-item label="凭证编号" width = '180'>
                    <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
                  </el-form-item>
                  <el-form-item label="付款方" label-width="65px">
                    <el-input v-model="searchData.createdCompanyQstr" placeholder="请输入付款方名称"></el-input>
                  </el-form-item>
                  <el-form-item label="承诺付款日期" class="last-item">
                    <el-date-picker
                      v-model="payDate"
                      type="daterange"
                      :editable=false
                      @change = 'changePayDate'
                      range-separator = " 到 "
                      placeholder="选择日期范围">
                    </el-date-picker>
                    <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click = "searchVoucher" style="vertical-align:bottom; margin-left:18px;">搜索</el-button>
                  </el-form-item>
                  <el-form-item label="凭证金额">
                    <el-select v-model="searchData.status" @change="cashChange(searchData.status)">
                     <el-option
                      v-for="item in transferOptions"
                      :key="item.index"
                      :label="item.label"
                      :value="item.value">
                     </el-option>
                   </el-select>
                   <!-- <el-col :span="10" style="position:absolute;top:30px;color:red" v-if='msgShow'>
                      请输入数字
                   </el-col> -->
                  </el-form-item>
                  <!-- <el-form-item label="可转让金额" class="amount-range last-item">
                      <el-col :span="10">
                        <el-input placeholder="请输入金额" v-model="searchData.valueMin" style="width:150px;">
                          <template slot="append">元</template>
                        </el-input>
                      </el-col>
                      <el-col :span="2" style="text-align:center;width:25px">-</el-col>
                      <el-col :span="10">
                        <el-input placeholder="请输入金额" v-model="searchData.valueMax" style="width:150px;">
                          <template slot="append">元</template>
                        </el-input>
                      </el-col>
                      <el-col :span="2" style="text-align:center;width:25px">
                        <el-button class="button-bubi-theme searchBtn ml30" icon="null iconfont icon-search-bt" type="info" @click = "searchVoucher">搜索</el-button>
                      </el-col>
                  </el-form-item> -->
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
                min-width='215'>
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
                min-width="160">
              </el-table-column>

              <el-table-column
                prop="value"
                label="可转让金额（元）"
                align='center'
                :formatter = "moneyShow"
                min-width="160">
              </el-table-column>

              <el-table-column
                prop="paymentType"
                :formatter = "paymentType"
                align='center'
                label="付款方式"
                min-width="120">
              </el-table-column>

              <el-table-column
                prop="originCreateCompany.name"
                align='center'
                :show-overflow-tooltip="true"
                label="凭证签发方"
                min-width="200">
              </el-table-column>

              <el-table-column
                prop="cashTime"
                label="承诺付款日期"
                :formatter = "dateFormater"
                align='center'
                width="140">
              </el-table-column>

              <el-table-column
                prop="createCompany.name"
                :show-overflow-tooltip="true"
                align='center'
                label="付款方"
                width="200">
              </el-table-column>

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
                v-if="applyAccess"
                align='center'
                prop="id"
                fixed="right"
                label="操作"
                width="80">
                <template scope="scope">
                  <el-button @click='apply(scope.row.id)' type="text">申请</el-button>
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
  </div>
</template>
<script type="text/javascript">
import 'common/sass/module/voucher.scss'
import merge from 'webpack-merge'
import modal from 'components/entries/modal'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import dateTools from 'common/javascript/tools/dateTools'
// import supplierVoucherService from 'common/api/service/supplierVoucherService'
import supplierApi from 'common/api/voucher/supplier'
import accessControl from 'common/javascript/tools/accessControl.js'
import status from 'common/config/status'

export default merge({
  name: 'app',
  components: {
    modal: modal
  },
  data () {
    return {
      title: '转让申请',
      expire: [],
      searchData: {
        no: null,
        createdCompanyQstr: null,
        cashTime: null,
        cashTimeBegin: null,
        cashTimeEnd: null,
        pageNum: 1,
        pageSize: config.pageSize,
        status: null,
        valueMax: '',
        valueMin: ''
      },
      transferOptions: status.transferOptions,
      payDate: null,
      currentPage: 1,
      total: 0,
      tableData: [],
      applyAccess: false,
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/assign-apply/index/detail')
    this.applyAccess = accessControl.checkAccess('/voucher/assign-apply/apply')
  },
  methods: {
    // 查询凭证
    getGrid () {
      const self = this
      var params = this.searchData
      supplierApi.getAssignVoucher.remote(params, (result) => {
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
      this.searchData.cashTimeBegin = dateTools.dateTotimestamp(arr[0] + ' 00:00:00')
      this.searchData.cashTimeEnd = dateTools.dateTotimestamp(arr[1] + ' 23:59:59')
    },

    apply (id) {
      location.href = '/#/voucher/assign-apply/apply?id=' + id
    },
    toInfo (id) {
      location.href = '/#/voucher/assign-apply/index/detail?id=' + id
    },
    expireFun () {
      // this.$message.error('无可转让余额')
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
    }
  }
}, table)
</script>
