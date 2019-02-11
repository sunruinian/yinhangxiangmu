<template>
  <div class="content-area" >
    <div v-title='title'>
      {{title}}
    </div>
    <div class="pl30 pr30" style="padding-top:0.1px">
      <div class="item-group" style="margin-top:10px;margin-bottom:10px;">
        <div class="item-tit"><span class="item-tit-icon"></span>付款承诺函</div>
      </div>
      <div class="boxShadow">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="绑定时间"
            :formatter = "dateFormaterPrecise"
            >
          </el-table-column>
          <el-table-column
            prop="serialNo"
            label="数字证书（DN码）"
            >
          </el-table-column>
          <el-table-column
            prop="remark"
            align="center"
            :show-overflow-tooltip=true
            label="证书备注"
            >
          </el-table-column>
        </el-table>
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
  </div>
</div>
</template>
<script type="text/javascript">
// import 'common/sass/module/table.scss'
// import 'common/sass/main.scss'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import certService from 'common/api/service/certService'
import coreUser from 'common/api/user/core'

export default merge(table, {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '证书信息',
      tableData: [],
      searchData: {
        pageNum: 1,
        pageSize: config.pageSize
      }
    }
  },
  mounted () {
    this.getGrid()
  },
  methods: {
    getGrid () { // 获得表数据
      coreUser.certCurrent.remote(this.searchData, list => {
        this.tableData = list.content
        this.total = list.total
      })
    }
  }
})
</script>
