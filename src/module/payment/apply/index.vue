<template>
  <div class="content-body">
    <div class="long">
      <el-row>
        <el-col :span='24' >

          <el-form :inline="true"  class="stand-form" label-width="100px" >
              <fieldset>
                <el-form-item label="凭证编号" label-width="100px">
                  <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
                </el-form-item>

                <el-form-item label="接受方" label-width="75px">
                  <el-input v-model="searchData.companyStr" placeholder="请输入接受方名称"></el-input>
                </el-form-item>

                <el-form-item label="承诺付款日期"  class="last-item">
                  <el-date-picker
                    v-model="cashTime"
                    type="daterange"
                    :editable=false
                    placeholder="选择日期范围"
                    range-separator='到'
                    @change='cashTimeChange'
                    >
                  </el-date-picker>
                  <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click = "search" style="vertical-align:bottom; margin-left:20px;">搜索</el-button>
                </el-form-item>

                <el-form-item label="凭证金额" class="last-item" label-width="100px">
                  <el-select v-model="searchData.status" @change="cashChange(searchData.status)">
                    <el-option
                    v-for="item in transferOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </fieldset>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-if="applyAccess" style="margin-top:20px;">
        <el-col :span='24'>
          <el-button-group>
            <!-- <el-button type="primary"  size='small' icon="null iconfont icon-shanchu" style="margin-right:20px">删除</el-button> -->
            <!-- <el-button type="primary"  size='small' icon="null iconfont icon-shenpi" @click="applyApprovalSome()" :disabled="selected.length==0">提交审批</el-button> -->
              <el-button class="someBtn" type="primary" size='small' icon="null iconfont icon-shenpi" :disabled="selected.length==0" @click="applyApprovalSome()" style="padding:0px">提交审批</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <!--表格-->
      <el-row>
        <el-col :span='24' class="mt20 box-shadow radius-4 pl15 pr15 table-wrap">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            align='center'
            @selection-change="selectItem" >
            <el-table-column
              type="selection"
              width="80"
              v-if="applyAccess">
            </el-table-column>
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
              width = '216'>
              <template scope="scope">
                <el-button v-if="detailAccess" @click='toInfo(scope.row.voucherId)' type="text" size="small">{{scope.row.no}}</el-button>
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
              prop="value"
              label="待付款金额（元）"
              align='center'
              :formatter = "moneyShow"
              width="180">
            </el-table-column>
            <el-table-column
              prop="paymentType"
              align='center'
              label="付款方式"
              width="150"
              :formatter = "paymentType"
              >
            </el-table-column>
              <!-- 承诺付款日期 -->
            <el-table-column
              prop="cashTime"
              label="承诺付款日期"
              align='center'
              :formatter = "dateFormater"
              width="150">
            </el-table-column>
            <el-table-column
              prop="company.name"
              align='center'
              :show-overflow-tooltip="true"
              min-width="180"
              label="接受方">
            </el-table-column>
            <!-- <el-table-column
              prop="remark"
              min-width="150"
              :show-overflow-tooltip="true"
              label="凭证备注">
            </el-table-column> -->
            <!-- <el-table-column
              prop="file"
              label="贸易信息"
              min-width='130'
              :formatter = "dealOperate"
            >
            </el-table-column> -->
            <el-table-column
              v-if="applyAccess"
              align='center'
              prop="state"
              fixed="right"
              label="操作"
              width="80">
              <template scope="scope" >
                <el-button type="text" size="small" @click='toApply(scope.row.voucherId)' >申请</el-button>
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
            layout="prev, pager, next, total"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>

      <applyPaySome :dialogShow.sync='dialogShow'></applyPaySome>
    </div>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/main.scss'
import 'common/sass/module/account.scss'
import 'common/sass/module/table.scss'
import modal from 'components/entries/modal'
// import layout from 'components/include/layout-l-r'
import config from 'common/config/config'
import model from 'common/api/voucherTemplate'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import applyPaySome from 'module/payment/apply/payment'
import accessControl from 'common/javascript/tools/accessControl.js'
import dateTools from 'common/javascript/tools/dateTools'
import objectTools from 'common/javascript/tools/objectTools'
import status from 'common/config/status'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
export default merge({
  name: 'app',
  components: {
    modal: modal,
    // layout,
    applyPaySome
  },
  data () {
    return {
      title: '凭证付款',
      tab: {
        activeName: 'first'
      },
      msgShow: false,
      pageSize: config.pageSize,
      cashTime: null,
      searchData: {
        cashTimeBegin: null,
        cashTimeEnd: null,
        companyStr: null,
        pageNum: 1,
        valueMax: '',
        valueMin: '',
        status: null,
        needLimit: false,
        orderType: 'CASHTIME_ASC'
      },
      transferOptions: status.transferOptions,
      currentPage: 1,
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      applyAccess: false,
      detailAccess: false,
      applyAccessSome: false,
      dialogShow: {
        show: false,
        totalMOney: 0,
        voucherId: []
      },
      selected: []
    }
  },
  beforeMount () {
    // this.searchData.status = 1
    this.searchData.hasParent = null
  },
  mounted () {
    this.detailAccess = accessControl.checkAccess('/payment/apply/index/detail')
    this.applyAccess = accessControl.checkAccess('/payment/apply/apply')
    this.getGrid()
  },
  methods: {
    addContract () {
      this.$refs.addContract.show = true
    },
    stateFormat () {
      return '1'
    },
    handleSizeChange (page, a, b) {
    },
    getGrid () { // 获得表数据
      let params = objectTools.emptyStrToNull(this.searchData)
      this.$http.post('/service/clearingrule/query', params, response => {
        // 数据模型处理
        let result = model[response.config.url](response, this)
        this.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
      })
    },
    // 选择凭证
    selectItem (val) {
      this.selected = val
    },
    toApply (id) {
      location.href = '#/payment/apply/apply?id=' + id
    },
    toInfo (id) {
      location.href = '#/payment/apply/index/detail?id=' + id
    },
    applyApprovalSome () {
      this.dialogShow.totalMOney = 0
      this.dialogShow.voucherId = []
      for (var i = 0; i < this.selected.length; i++) {
        this.dialogShow.voucherId.push(this.selected[i].voucherId)
        this.dialogShow.totalMOney += parseInt(this.selected[i].value)
      }
      this.dialogShow.show = true
      // if (this.selected) {
      //
      // }
      // const values = []
      // this.dialogShow.selected

      // console.log(this.dialogShow.totalMOney)
      // console.log(values)
      // const ids = []
      // this.selected.forEach(function (v) {
      //   ids.push(v.id)
      // })
      // coreCompanyVoucherService.applyPayment.remote(ids, (result) => {
      //   if (result.success) {
      //     this.getGrid()
      //   } else {
      //     this.$message.error('提交审批失败!')
      //   }
      // })
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
    },
    // 时间搜索框
    cashTimeChange (value) {
      if (value === '' || value === null) {
        this.searchData.cashTimeBegin = ''
        this.searchData.cashTimeEnd = ''
        return
      }
      const array = value.split('到')
      this.searchData.cashTimeBegin = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.cashTimeEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    }
  }
}, table)
</script>
<style scoped>
  .searchPostion{
    position: absolute;
    right: 30px;
    top: 42px;
  }
</style>
