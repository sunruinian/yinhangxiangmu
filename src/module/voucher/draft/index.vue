<template>
  <div class="content-area" id="voucherDref">
    <div v-title='title'>{{title}}</div>
    <div class="content-body" style='background: #fff;'>
    <div class="long">
      <el-row>
        <el-col :span='24'>
          <el-form :inline="true" :model="searchData" class="stand-form mb20" label-width="100px" >
              <fieldset>
                <el-form-item label="凭证编号" label-width="93px">
                  <el-input v-model="searchData.no" placeholder="请输入凭证编号"></el-input>
                </el-form-item>
                <el-form-item label="接受方" label-width="56px">
                  <el-input v-model="searchData.companyQstr" placeholder="请输入接受方名称"></el-input>
                </el-form-item>
                <el-form-item label="承诺付款日期" class="last-item" label-width="100px">
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
        <el-col :span='24'>
          <div>
            <span style="float:left;color: #999999;">已选择{{this.selected.length}}条信息，本页共{{tableData.length}}条信息</span>
            <el-button-group class="ml18 gexi" style="float:right">
              <el-button class="someBtn"  icon="null iconfont icon-shanchu" :disabled="selected.length==0" v-if="deleteAccess" @click="deleteVoucher()" style="margin-right:20px;padding:0px">删除</el-button>
              <el-button class="someBtn"  icon="null iconfont icon-shenpi" :disabled="selected.length==0" v-if="commitAccess" @click="applyApprovalSome()" style="padding:0px">提交审批</el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>


<!--
      <div class="del-wrapper">
      已选择{{this.selected.length}}条信息，本页共{{tableData.length}}条信息
        <el-button type="primary" size="samll" icon="null iconfont icon-shenpi" :disabled="selected.length==0" v-if="commitAccess" @click="applyApprovalSome()" style="margin-left:10px">提交审批</el-button>
      <el-button type="primary" size="samll" icon="null iconfont icon-shanchu" :disabled="selected.length==0" v-if="deleteAccess" @click="deleteVoucher()">删除</el-button>
   </div>
 -->
      <el-row>
        <el-col :span='24' class="mt10 box-shadow radius-4 pl15 pr15 table-wrap">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            @selection-change="selectItem">
            <el-table-column
              v-if="deleteAccess || commitAccess"
              type="selection"
              align='center'
              width="80">
            </el-table-column>
            <!-- <el-table-column
              type="index"
              label="序号"
              align='center'
              width="80">
            </el-table-column> -->
            <el-table-column
              prop="no"
              align='center'
              :show-overflow-tooltip="true"
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
              width="150">
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
              width="150">
            </el-table-column>
            <el-table-column
              align='center'
              prop="company.name"
              :show-overflow-tooltip="true"
              label="接受方"
              min-width="180">
            </el-table-column>
            <el-table-column
              align='center'
              prop="createTime"
              label="登记时间"
              :formatter = "dateFormaterPrecise"
              width="190">
            </el-table-column>
            <el-table-column
              v-if="commitAccess || editAccess"
              align='center'
              prop="id"
              fixed="right"
              label="操作"
              width="150">
              <template scope="scope">
                <!-- 判断是否审批完毕 -->
                <el-button v-if='expire[scope.row.id] == 0 && commitAccess' @click='applyApproval(scope.row.id)' type="text" size="small">提交审批</el-button>
                <span v-if='expire[scope.row.id] == 1 && commitAccess' type="text" size="small" style="color:#999; cursor:default; margin-right: 10px;">提交审批</span>
                <el-button v-if='editAccess' @click='toEdit(scope.row.id)' type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-show="tableData.length != 0">
        <el-col :spa='24'>
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
import config from 'common/config/config'
import table from 'components/entries/base/table'
import dateTools from 'common/javascript/tools/dateTools'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import coreApi from 'common/api/voucher/core'
import accessControl from 'common/javascript/tools/accessControl.js'

const base = {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '待提交凭证',
      // 付款日期
      payDate: '',
      expire: [],
      selected: [],
      // 总查询词
      searchData: {
        // 编号
        no: null,
        // 接受方名称
        companyQstr: null,
        createdCompanyId: null,
        cashTimeBegin: null,
        cashTimeEnd: null,
        origin: 0,
        pageNum: 1,
        orderType: 'CT_ASC',
        // 页数？
        pageSize: config.pageSize
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      deleteAccess: false,
      commitAccess: false,
      editAccess: false,
      detailAccess: false
    }
  },
  beforeMount () {
    this.deleteAccess = accessControl.checkAccess('/voucher/draft/delete')
    this.commitAccess = accessControl.checkAccess('/voucher/draft/commit')
    this.editAccess = accessControl.checkAccess('/voucher/draft/edit')
    this.detailAccess = accessControl.checkAccess('/voucher/draft/detail')
  },
  mounted () {
    this.getGrid()
  },
  methods: {
      // 单个审批
    applyApproval (id) {
      coreApi.applyApproval.remote([id], (result) => {
        if (result.success) {
          this.getGrid()
        } else {
          this.$message.error('提交审批失败!')
        }
      })
    },
    // 批量审批
    applyApprovalSome () {
      const ids = []
      this.selected.forEach(function (v) {
        ids.push(v.id)
      })
      coreApi.applyApproval.remote(ids, (result) => {
        if (result.success) {
          this.getGrid()
        } else {
          this.$message.error('提交审批失败!')
        }
      })
    },
    // 删除凭证
    deleteVoucher () {
      const ids = []
      // 调弹框
      if (window.confirm('确定要删除凭证吗？')) {
        // 选中的遍历
        this.selected.forEach(function (v) {
          ids.push(v.id)
        })
        coreApi.delete.remote(ids, (result) => {
          if (result.success) {
            this.getGrid()
          } else {
            this.$message.error('删除失败!')
          }
        })
      }
    },

    // 查询凭证
    getGrid () {
      // 上送数据
      let params = this.searchData
      // 数据接口
      coreApi.getScratchedVoucher.remote(params, (result) => {
        if (result.success) {
          this.tableData = result.data.content || []
          this.searchData.pageSize = result.data.pageSize
          this.total = result.data.total
          for (var i = 0; i < this.tableData.length; i++) {
            this.expire[this.tableData[i].id] = (this.tableData[i].cashTime > (new Date()).valueOf()) ? 0 : 1
          }
        } else {
          this.$message.error('获取暂存凭证数据失败!')
        }
      })
    },

    // 选择凭证
    selectItem (val) {
      this.selected = val
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
    toEdit (id) {
      location.href = '#/voucher/draft/edit?id=' + id
    },
    toInfo (id) {
      location.href = '#/voucher/draft/detail?id=' + id
    }
  }
}
export default merge(base, table)
</script>
