<template>
  <div class="content-area" >
    <div v-title='title'>{{title}}</div>
    <div class="content-body">
      <div class="long">
        <el-row>
          <el-col :span='24' >
            <el-form :inline="true" :model="searchData" class="stand-form " label-width="100px" >
                <fieldset>
                  <!-- 隐藏元素占位，解决点击回车页面刷新问题 -->
                  <el-form-item label="" v-show='false'>
                    <el-input v-model="searchData.userName"></el-input>
                  </el-form-item>

                  <el-form-item label="用户名" label-width="300px" class="last-item">
                    <el-input v-model="searchData.userName"  placeholder="请输入用户名称"></el-input>
                      <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click = "search" style="float:right">搜索</el-button>
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
              style="width: 100%">
              <el-table-column
                prop="createTime"
                label="创建时间"
                :formatter = "dateFormaterPrecise"
                >
              </el-table-column>
              <el-table-column
                prop="userName"
                :show-overflow-tooltip=true
                label="用户名"
                >
              </el-table-column>
              <el-table-column
                prop=""
                label="绑定情况"
                >
                <template scope="scope">
                  <span>{{scope.row.bindCert ? '已绑定' : '未绑定'}}</span>
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
import 'common/sass/module/table.scss'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import customerUserService from 'common/api/service/customerUserService'
import coreManager from 'common/api/manager/core'
// import customerUserService from 'common/api/service/customerUserService'

export default merge(table, {
  name: 'app',
  components: {

  },
  data () {
    return {
      title: '用户列表',
      tableData: [],
      total: null,
      searchData: {
        userName: '',
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
      coreManager.userQuery.remote(this.searchData, (list) => {
        this.tableData = list.content || []
        this.total = list.total
      })
    }
  }
})
</script>
<style scoped>
  .searchPostion{
    position: absolute;
    right: 380px;
    top: 14px;
  }
</style>
