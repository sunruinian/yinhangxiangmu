<template>
  <div>
    <div v-title='title'>
      {{title}}
    </div>
    <div class="content-body" style='background: #fff;'>
      <el-row style="padding-top:10px">
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="80">
            </el-table-column>
            <el-table-column
              prop="targetName"
              :show-overflow-tooltip="true"
              label="贷款方"
              align="center">
            </el-table-column>
            <el-table-column
              prop="value"
              :show-overflow-tooltip="true"
              label="期望融资额度（元）"
              :formatter = "moneyNarrow"
              min-width='160'
              align="center">
            </el-table-column>
            <el-table-column
              prop="enquiry.linkmanName"
              :show-overflow-tooltip="true"
              label="联系人"
              align="center">
            </el-table-column>
            <el-table-column
              prop="enquiry.linkmanPhone"
              :show-overflow-tooltip="true"
              label="手机号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="申请时间"
              align="center"
              min-width='150'
              :formatter = "dateFormaterPrecise">
            </el-table-column>
            <el-table-column
              v-if="rejectDetailAccess"
              prop="option"
              label="操作"
              width='100'
              align="center">
              <template scope="scope" >
                <el-button @click='toInfo(scope.row.id)' type="text" size="small">查看</el-button>
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
    </div>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/main.scss'
import 'common/sass/module/account.scss'
import 'common/sass/module/table.scss'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import supplierService from 'common/api/service/finance-management/supplierService'
import accessControl from 'common/javascript/tools/accessControl.js'
import config from 'common/config/config'

export default merge(table, {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '申请退回',
      form: {
        name: '',
        value: ''
      },
      searchData: {
        createTimeBegin: null,
        createTimeEnd: null,
        creditSideName: '',
        targetName: '',
        pageNum: 1,
        pageSize: config.pageSize
      },
      tableData: [],
      rejectDetailAccess: false
    }
  },
  mounted () {
    // 搜索框数据
    this.$bus.$on('search-data-third', (data) => {
      this.searchData.createTimeBegin = data.createTimeBegin
      this.searchData.createTimeEnd = data.createTimeEnd
      this.searchData.targetName = data.targetName
      this.getGrid()
    })
    this.getGrid()
    this.rejectDetailAccess = accessControl.checkAccess('/financing/intention-apply/reject-detail')
  },
  beforeDestroy () {
    // 销毁bus监听事件，避免多次触发
    this.$bus.$off('search-data-third')
  },
  methods: {
    getGrid () {
      supplierService.queryRejected.remote(this.searchData, (list) => {
        this.total = list.data.total
        this.tableData = list.data.content
        this.tableData.map((item, i) => {
          item.value = list.data.content[i].enquiry.value
          item.createTime = list.data.content[i].enquiry.createTime
        })
      })
    },
    toInfo (id) {
      location.href = '#/financing/intention-apply/reject-detail?id=' + id
    }
  }
})
</script>
