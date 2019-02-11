<template>
  <div class="content-area" id="voucherBounced">

    <div v-title='title'>{{title}}</div>
    <div class="content-body" style='background: #fff;'>
      <div class="long">
        <el-row>
          <el-col :span='24'>
            <el-form :inline="true" :model="searchData" class="stand-form " label-width="100px" >
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
        <el-row>
          <el-col :span='24' class="mt30 box-shadow radius-4 pl15 pr15 table-wrap">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <!-- @selection-change="selectItem" -->
              <!-- <el-table-column
                type="selection"
                :selectable = "tableSelectable"
                width="50">
              </el-table-column> -->
              <!-- // 序号 -->
              <!-- <el-table-column
                type="index"
                label="序号"
                align='center'
                width="80"> -->
              </el-table-column>
              <el-table-column
                prop="no"
                :show-overflow-tooltip="true"
                align='center'
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
                align='center'
                width="150">
              </el-table-column>
              <el-table-column
                prop="paymentType"
                label="付款方式"
                :formatter = "paymentType"
                align='center'
                width="120">
              </el-table-column>
              <el-table-column
                prop="cashTime"
                label="承诺付款日期"
                :formatter = "dateFormater"
                align='center'
                width="180">
              </el-table-column>
              <el-table-column
                prop="company.name"
                :show-overflow-tooltip="true"
                align='center'
                label="接受方"
                width="180">
              </el-table-column>
              <!-- // 贸易信息 -->
              <!-- <el-table-column
                prop="files"
                :formatter = "dealOperate"
                label="贸易信息"
                width="105"> -->
              </el-table-column>
              <el-table-column
                prop="reason"
                :show-overflow-tooltip="true"
                align='center'
                label="原因"
                min-width="180">
              </el-table-column>
              <!-- // 操作时间 -->
              <!-- <el-table-column
                prop="updateTime"
                label="操作时间"
                :formatter = "dateFormaterPrecise"
                width="180"> -->
              </el-table-column>
              <el-table-column
                v-if="modifyCommitAccess"
                align='center'
                prop="id"
                fixed="right"
                label="操作"
                width="120">
                <template scope="scope" >
                  <el-button v-if="modifyCommitAccess" @click='toEdit(scope.row.id)' type="text" size="small">修改提交</el-button>
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
import source from 'common/config/source'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import dateTools from 'common/javascript/tools/dateTools'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import coreApi from 'common/api/voucher/core'
import merge from 'webpack-merge'
import accessControl from 'common/javascript/tools/accessControl.js'

const base = {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '已退回凭证',
      payDate: '',
      tab: {
        activeName: 'first'
      },
      dialogFormVisible: false,
      sourceOptions: source.vCertificateCache,
      expire: [],
      selected: [],
      searchData: {
        no: null,
        companyQstr: null,
        createdCompanyId: null,
        updateTimeBegin: null,
        updateTimeEnd: null,
        origin: 1,
        pageNum: 1,
        pageSize: config.pageSize
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      modifyCommitAccess: false,
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/bounced/detail')
    this.modifyCommitAccess = accessControl.checkAccess('/voucher/bounced/commit')
  },
  methods: {
    // 申请审批
    applyApproval () {
      const ids = []
      this.selected.forEach(function (v) {
        ids.push(v.id)
      })
      coreApi.returnedVoucher.remote(ids, (result) => {
        if (result.success) {
          this.getGrid()
        } else {
          this.$message.error('提交审批失败!')
        }
      })
    },

    // 删除凭证
    // deleteVoucher () {
    //   const ids = []
    //   if (window.confirm('确定要删除凭证吗？')) {
    //     this.selected.forEach(function (v) {
    //       ids.push(v.id)
    //     })
    //     coreApi.delete.remote(ids, (result) => {
    //       if (result.success) {
    //         this.getGrid()
    //       } else {
    //         this.$message.error('删除失败!')
    //       }
    //     })
    //   }
    // },

    // 查询凭证
    getGrid () {
      let params = this.searchData
      coreApi.returnedVoucher.remote(params, (result) => {
        if (result.success) {
          this.tableData = result.data.content || []
          this.searchData.pageSize = result.data.pageSize
          this.total = result.data.total
          // for (var i = 0; i < this.tableData.length; i++) {
          //   this.tableData[i].expire = (this.tableData[i].cashTime > (new Date()).valueOf()) ? 0 : 1
          //   this.expire[this.tableData[i].id] = (this.tableData[i].cashTime > (new Date()).valueOf()) ? 0 : 1
          // }
        } else {
          this.$message.error('获取暂存凭证数据失败!')
        }
      })
    },

    // 添加class
    tableRowClassName (row, index) {
      if (this.tableData[index].expire === 1) {
        return 'expire'
      } else {
        return ''
      }
    },

    // tableSelectable (row, index) {
    //   if (this.tableData[index].expire === 1) {
    //     return false
    //   } else {
    //     return true
    //   }
    // },

    // // 选择凭证
    // selectItem (val) {
    //   this.selected = val
    // },

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
    addContract () {
      this.$refs.addContract.show = true
    },
    stateFormat () {
      return '1'
    },
    toEdit (id) {
      location.href = '#/voucher/bounced/commit?id=' + id
    },
    toInfo (id) {
      location.href = '#/voucher/bounced/detail?id=' + id
    }
  }
}
export default merge(base, table)
</script>
