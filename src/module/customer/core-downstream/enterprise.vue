<!-- 我的授信 cl -->
<template>
  <div class="content-area">
    <div class="content-body" style='background: #fff;'>
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
              width="80">
            </el-table-column> -->
            <!-- <el-table-column
              prop="cT"
              label="授信时间"
              :formatter = "dateFormaterPrecise"
              width = '180'>
            </el-table-column> -->
            <!-- <el-table-column
              prop="providerName"
              min-width = '180'
              :show-overflow-tooltip="true"
              label="授信机构">
            </el-table-column> -->
            <el-table-column
              prop="total"
              width = '180'
              :formatter = "moneyNarrow"
              label="授信额度（元）">
            </el-table-column>
            <el-table-column
              prop="used"
              min-width = '180'
              :formatter = "moneyNarrow"
              label="已使用额度（元）">
            </el-table-column>
            <el-table-column
              prop="value"
              min-width = '180'
              :formatter = "moneyNarrow"
              label="可使用额度（元）">
            </el-table-column>
           <el-table-column
              prop="timeDuring"
              width = '200'
              label="额度到期日">
            </el-table-column>
            <!-- <el-table-column
              prop="financingRatio"
              :formatter = "moneyNarrow"
              min-width = '180'
              label="融资比例">
            </el-table-column> -->
            <el-table-column
              prop=""
              v-if="detailAccess"
              fixed="right"
              label="操作"
              width="150">
              <template scope="scope" >
                <el-button type="text" size="small" @click='showAllot(scope.row.id)'>查看授信分配</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
import 'common/css/lib/motherplate.css'
import 'common/sass/main.scss'
import 'common/sass/module/table.scss'
import 'common/sass/module/account.scss'
import 'common/sass/module/credit.scss'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import config from 'common/config/config'
import credit from 'common/api/service/credit'
import dateTools from 'common/javascript/tools/dateTools'
import accessControl from 'common/javascript/tools/accessControl.js'

const base = {
  name: 'app',
  components: {
  },
  props: ['totalNum'],
  data () {
    return {
      title: '我的授信',
      tableData: [],
      createTime: '',
      hasData: 0,
      searchData: {
        createTimeEnd: null,
        createTimeStart: null,
        endTimeEnd: null,
        endTimeStart: null,
        // providerName: null,
        startTimeEnd: null,
        startTimeStart: null,
        pageSize: config.pageSize,
        pageNum: 1,
        type: null
      }
    }
  },
  beforeMount () {
    this.reloadAccess = accessControl.checkAccess('/credit/enterprise/reload')
    this.detailAccess = accessControl.checkAccess('/credit/enterprise/allot')
    this.getGrid()
  },
  mounted () {
  },
  methods: {
    getGrid () { // 获得表数据
      let params = this.searchData
      credit.myCredit.remote(params, (data) => {
        if (data.success) {
          this.totalNum.total = data.data.total
          this.hasData = 1
          this.total = data.data.total
          this.pageSize = data.data.pageSize
          this.pageNum = data.data.pageNum
          this.tableData = data.data.content || []
          Array.map(this.tableData, (item, i) => {
            // let start = dateTools.dateFormater(this.tableData[i].cT, 'YYYY.MM.DD')
            // let end = dateTools.dateFormater(this.tableData[i].endTime, 'YYYY.MM.DD')
            // if (this.tableData[i].fromTime === 0) {
            //   start = '不限'
            // }
            // if (this.tableData[i].endTime === 0) {
            //   end = '不限'
            // }
            let used = this.tableData[i].total - this.tableData[i].value
            // this.tableData[i].timeDuring = start + '-' + end
            this.tableData[i].used = used
          })
        } else {
          this.hasData = 2
        }
      })
    },
    createTimeChange (value) {
      const array = value.split('到')
      this.searchData.createTimeStart = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.createTimeEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    reload () {
      location.reload()
    },
    // 查看授信
    showAllot (id) {
      location.href = '#/credit/enterprise/allot?id=' + id
    },
    // 查询 （刷新列表）
    refreshList () {
      this.searchData.createTimeStart = null
      this.searchData.createTimeEnd = null
      // this.searchData.providerName = null
      let params = this.searchData
      credit.myCredit.remote(params, (data) => {
        if (data.success) {
          this.hasData = 1
          this.pageSize = data.data.pageSize
          this.pageNum = data.data.pageNum
          this.tableData = data.data.content || []
          Array.map(this.tableData, (item, i) => {
            let used = this.tableData[i].total - this.tableData[i].value
            this.tableData[i].used = used
          })
          this.$message.success('刷新成功')
        } else {
          this.hasData = 2
        }
      })
    }
  }
}

export default merge(base, table)
</script>
