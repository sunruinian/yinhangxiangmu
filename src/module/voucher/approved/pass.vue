<template>
  <div class="content-body" id="approvedPass">
      <div class="long">
        <el-row>
          <el-col :span='24'>
            <el-form :inline="true" :model="searchData" class="stand-form " label-width="100px" >
                <fieldset>
                  <el-form-item label="凭证编号" label-width="110px">
                    <el-input v-model="searchData.no"  placeholder="请输入凭证编号"></el-input>
                  </el-form-item>

                  <el-form-item label="接受方" label-width="70px">
                    <el-input v-model="searchData.companyQstr"  placeholder="请输入接受方名称"></el-input>
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
                    <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click="search" style="vertical-align:bottom; margin-left:20px">搜索</el-button>
                  </el-form-item>

                  <el-form-item label="付款状态" label-width="110px">
                    <el-select v-model="searchData.payStatus" placeholder="请选择">
                      <el-option
                        v-for="item in payStatus"
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
              align='center'
              stripe
              style="width: 100%">
              <!-- <el-table-column
                type="index"
                label="序号"
                align='center'
                width="80"> -->
              </el-table-column>
              <el-table-column
                align='center'
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
                align='center'
                label="凭证金额（元）"
                :formatter = "moneyShow"
                width="180">
              </el-table-column>
              <el-table-column
                align='center'
                prop="paymentType"
                label="付款方式"
                :formatter = "paymentType"
                width="120">
              </el-table-column>
              <el-table-column
                align='center'
                prop="cashTime"
                label="承诺付款日期"
                :formatter = "dateFormater"
                width="180">
              </el-table-column>
              <el-table-column
                align='center'
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
                align='center'
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
                align='center'
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
                v-if="detailAccess"
                align='center'
                prop="id"
                fixed="right"
                label="操作"
                width="120">
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
import status from 'common/config/status'
import config from 'common/config/config'
import dateTools from 'common/javascript/tools/dateTools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import accessControl from 'common/javascript/tools/accessControl.js'
import coreApi from 'common/api/voucher/core'

export default merge(table, {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '审批通过',
      buttonActive: true,
      selection: [],
      tab: {
        activeName: 'first'
      },
      statusOptions: status.approvedVoucher,
      payStatus: status.approvedPayStatus,
      searchData: {
        no: null,
        companyQstr: null,
        status: null,
        payStatus: null,
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
    this.detailAccess = accessControl.checkAccess('/voucher/approved/pass/detail')
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
      location.href = '#/voucher/approved/pass/detail?id=' + id
    }
  }
})
</script>
