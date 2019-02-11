<template>
  <div class="content-area">
    <div class="showMore" style="position:relative;bottom:100px;right:-20px"><a href='#/voucher/draft' style="color:#666;text-decoration:none;">查看更多></a></div>
    <!-- <div v-title='title'>{{title}}</div> -->
    <div class="content-body" style='background: #fff;'>
      <el-row>
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align='center'
              width="80">
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
              prop="company.name"
              :show-overflow-tooltip="true"
              align='center'
              label="指定供应商"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="total"
              label="凭证金额（元）"
              :formatter = "moneyShow"
              align='center'
              width="180">
            </el-table-column>

            <el-table-column
              prop="cashTime"
              label="付款日期"
              :formatter = "dateFormater"
              align='center'
              width="180">
            </el-table-column>
            <el-table-column
              v-if="commitAccess || editAccess"
              prop="id"
              align='center'
              fixed="right"
              label="操作"
              width="120">
              <template scope="scope">
                <!-- 判断是否审批完毕 -->
                <el-button v-if='expire[scope.row.id] == 0 && commitAccess' @click='applyApproval(scope.row.id)' type="text" size="small">审批</el-button>
                <span v-if='expire[scope.row.id] == 1 && commitAccess' type="text" size="small" style="color:#999; cursor:default; margin-right: 10px;">审批</span>
                <el-button v-if='editAccess' @click='toEdit(scope.row.id)' type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
import merge from 'webpack-merge'
// import config from 'common/config/config'
import table from 'components/entries/base/table'
import dateTools from 'common/javascript/tools/dateTools'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import coreApi from 'common/api/voucher/core'
import accessControl from 'common/javascript/tools/accessControl.js'

const base = {
  name: 'app',
  components: {
  },
  props: ['totalNum'],
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
        pageSize: 5,
        pageNum: 1,
        orderType: 'CT_ASC'
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      commitAccess: false,
      editAccess: false,
      detailAccess: false
    }
  },
  beforeMount () {
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
          this.totalNum.total = result.data.total
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
<style media="screen">
.showMore {
    text-align: right;
  }
  .showMore a {
    color: #1ba185;
    text-decoration: underline;
  }
</style>
