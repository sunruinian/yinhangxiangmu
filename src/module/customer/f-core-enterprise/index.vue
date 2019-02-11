<template>
  <div class="content-area">
    <div v-title='title'>
      {{title}}
    </div>
    <div class="group">
        <div class="span12 path-nav offset0">
            <ol>
                <li>客户管理</li>>
                <li>{{title}}</li>
            </ol>
        </div>
    </div>
    <div class="content-body" style='background: #fff;'>
      <el-row>
        <el-col :span='24' >
          <el-form :inline="true" :model="searchData" class="stand-form" style="margin-top:10px;padding-left: 10px" label-width="100px" >
              <fieldset>
                <el-form-item label="核心企业名称">
                  <el-input v-model="searchData.name" placeholder="请输入核心企业名称"></el-input>
                </el-form-item>
                <el-form-item label="创建日期" class="last-item">
                  <el-date-picker
                    v-model="createTime"
                    type="daterange"
                    :editable=false
                    placeholder="选择日期范围"
                    style="width:200px;"
                    range-separator='到'
                    @change='createTimeChange'
                    >
                  </el-date-picker>
                  <el-button class="button-bubi-theme searchBtn" type="info" @click = "search">搜索</el-button>
                </el-form-item>
                <el-button type="primary" v-if='createAccess' class="createCore" @click="createCore"> + 创建核心企业</el-button>
              </fieldset>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="padding-top:10px">
        <el-col :span='24' >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="180"
              :formatter = "dateFormaterPrecise"
              align="center">
            </el-table-column>
            <el-table-column
              prop="upstreamName"
              :show-overflow-tooltip="true"
              align="center"
              label="核心企业名称">
            </el-table-column>
            <el-table-column
              prop="upstreamId"
              label="核心企业编号"
              align="center"
              :formatter = "completeNo">
            </el-table-column>
            <el-table-column
              prop="upstreamRemark"
              :show-overflow-tooltip="true"
              label="核心企业商户号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="inviteCode"
              label="邀请码"
              align="center">
            </el-table-column>
            <el-table-column
              prop="upstreamAuthStatus"
              label="状态"
              align="center">
              <template scope="scope">
                <el-tag type="gray" v-for='item in option' :key="item.index" v-if='scope.row.upstreamAuthStatus===item.value' >
                  {{item.label}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-if="detailAccess"
              prop="state"
              label="操作"
              align="center">
              <template scope="scope">
                <el-button @click='toInfo(scope.row.id, scope.row.supplierId)' type="text" size="small">基础信息</el-button>
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
import type from 'common/config/type'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import accessControl from 'common/javascript/tools/accessControl.js'
import supplierService from 'common/api/service/supplierService'
import objectTools from 'common/javascript/tools/objectTools'
import dateTools from 'common/javascript/tools/dateTools'

const base = {
  name: 'app',
  components: {
  },
  data () {
    return {
      title: '客户管理-核心企业',
      createTime: null,
      option: type.companyAuthStatus,
      createAccess: false,
      searchData: {
        dateEnd: null,
        dateStart: null,
        name: null,
        pageSize: config.pageSize,
        pageNum: 1
      },
      tableData: [],
      currentPage: 1,
      total: 1,
      detailAccess: false
    }
  },
  mounted () {
    this.detailAccess = accessControl.checkAccess('/customer/f-core-enterprise/detail')
    this.createAccess = accessControl.checkAccess('/customer/f-core-enterprise/create')
  },
  beforeMount () {
    this.getGrid()
  },
  methods: {
    getGrid () { // 获得表数据
      let params = objectTools.emptyStrToNull(this.searchData)
      supplierService.downstreamList.remote(params, (list) => {
        this.total = list.data.total
        this.pageSize = list.data.pageSize
        this.pageNum = list.data.pageNum
        this.tableData = list.data.content || []
      })
    },
    createTimeChange (value) { // 创建时间变化
      if (value === '' || value === null) {
        this.searchData.dateStart = ''
        this.searchData.dateEnd = ''
        return
      }
      const array = value.split('到')
      this.searchData.dateStart = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.dateEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    handleSizeChange (page, a, b) {
    },
    toInfo (id, supplierId) {
      location.href = '#/customer/f-core-enterprise/detail?id=' + id + '&supplierId=' + supplierId
    },
    // 创建核心企业
    createCore () {
      location.href = '#/customer/f-core-enterprise/create'
    }
  }
}

export default merge(base, table)
</script>
