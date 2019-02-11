<template>
    <div class="content-area" >
        <div v-title='title'>{{title}}</div>
        <div class="content-body">
            <div class="long">
                <el-row>
                  <el-col>
                    <el-form :inline="true"  class="stand-form " style="margin-bottom:0">
                        <fieldset>
                          <!-- 隐藏元素占位，解决input中点击回车页面刷新问题 -->
                          <el-form-item label="" v-show='false'>
                            <el-input v-model="searchData.no"></el-input>
                          </el-form-item>

                          <el-form-item label="银行账户号" label-width="360px"  class="last-item">
                            <el-input v-model="searchData.no" placeholder="请输入银行账户号"></el-input>
                              <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click = "search" style="vertical-align:top;float:right">搜索</el-button>
                          </el-form-item>

                        </fieldset>
                    </el-form>
                    <div style="height:300px;margin-top:10px;">
                      <!-- <el-button type="primary" v-if="addAccess" style="float:right;margin-left:10px" @click="addBankAccount()">添加银行账户</el-button> -->
                      <el-button type="primary" @click="onload()" style="float:right" v-if="loadAccess" title="点击刷新列表">刷 新</el-button><br>

                      <!-- <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click = "search" style="vertical-align:top; margin-left:20px;">搜索</el-button> -->

                      <!-- <p style="margin-top:15px;text-align:right;color:#666" v-if="loadAccess">刷新可获取最新银行卡账户信息</p> -->
                        <div style='background: #fff'>
                          <el-row>
                            <el-col :span='24' class="mt10 box-shadow radius-4 pl15 pr15 table-wrap" >
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
                                  prop="ownerName"
                                  :show-overflow-tooltip="true"
                                  label="账户名称"
                                  align="center"
                                  min-width='180'>
                                </el-table-column>
                                <el-table-column
                                  prop="bankName"
                                  :show-overflow-tooltip="true"
                                  label="开户银行"
                                  min-width='180'
                                  align="center">
                                </el-table-column>
                                <el-table-column
                                  prop="no"
                                  :show-overflow-tooltip="true"
                                  label="银行账户号"
                                  align="center"
                                  min-width='210'>
                                </el-table-column>
                                <el-table-column
                                  prop="businessScope"
                                  :show-overflow-tooltip="true"
                                  label="账户号类型"
                                  align="center"
                                  min-width='120'>
                                  <template scope="scope">
                                      <span>{{businessScope[scope.row.businessScope]}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  prop="remark"
                                  :show-overflow-tooltip="true"
                                  label="备注名"
                                  align="center"
                                  min-width='150'>
                                </el-table-column>
                                <el-table-column
                                  prop="cT"
                                  label="添加时间"
                                  align="center"
                                  min-width='180'
                                  :formatter = "dateFormaterPrecise">
                                </el-table-column>
                                <el-table-column
                                  v-if="detailAccess || activeAccess"
                                  fixed="right"
                                  prop="disabled"
                                  label="操作"
                                  width='200'
                                  align="center">
                                  <template scope="scope">
                                    <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">查看</el-button>
                                    <el-button v-if="activeAccess" @click='active(scope.row.id)' type="text" size="small" :disabled="scope.row.disabled || loda===scope.row.id">激活</el-button>
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
                  </el-col>
                </el-row>
            </div>
      </div>
  </div>

</template>

<script type="text/javascript">

// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/module/regular.scss'
import 'common/sass/module/table.scss'
import 'common/sass/module/supplier.scss'
import vnav from 'components/include/nav'
import left from 'components/include/member-left'
import vfooter from 'components/include/footer'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import bankAccountService from 'common/api/service/bankAccountService'
import coreAccount from 'common/api/account/core'
import config from 'common/config/config'
import bank from 'common/config/bank'
import accessControl from 'common/javascript/tools/accessControl.js'

export default merge(table, {
  name: 'app',
  components: {
    vnav: vnav,
    left: left,
    vfooter: vfooter
  },
  data () {
    return {
      title: '银行账户',
      tableData: [],
      businessScope: bank.businessScope,
      total: 0,
      searchData: {
        no: null,
        pageNum: 1,
        pageSize: config.pageSize
      },
      addAccess: false,
      detailAccess: false,
      disabled: false,
      loadAccess: false,
      loda: null
    }
  },
  mounted () {
    this.getGrid()
    this.addAccess = accessControl.checkAccess('/account/bank-account/add')
    this.detailAccess = accessControl.checkAccess('/account/bank-account/detail')
    this.activeAccess = accessControl.checkAccess('/account/bank-account/active')
    this.loadAccess = accessControl.checkAccess('/account/bank-account/active')
  },
  methods: {
    // 列表数据
    getGrid () {
      if (this.searchData.no === '') this.searchData.no = null
      coreAccount.queryBank.remote(this.searchData, (list) => {
        this.tableData = list.data.content || []
        this.total = list.data.total
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].bankName = this.tableData[i].issuer.name ? this.tableData[i].issuer.name : this.tableData[i].issuer.bankName
          // this.tableData[i].no = this.tableData[i].no.replace(/(\d{4})\d{5}(\d{4})/, '$1*****$2')
          if (!this.tableData[i].blockchainAddress) {
            this.tableData[i].disabled = false
          } else {
            this.tableData[i].disabled = true
          }
        }
      })
    },
    // 绑定银行账户
    addBankAccount () {
      location.href = '#/account/bank-account/add'
    },
    // 银行账户详情
    toInfo (id) {
      location.href = '#/account/bank-account/detail?id=' + id
    },
    onload () {
      this.tableData = []
      if (this.searchData.no === '') this.searchData.no = null
      coreAccount.loadBank.remote(this.searchData, (list) => {
        if (list.success) {
          this.tableData = list.data.content || []
          // console.log(this.tableData')
          this.total = list.data.total
          this.pageSize = list.data.pageSize
          this.pageNum = list.data.pageNum
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].bankName = this.tableData[i].issuer.name ? this.tableData[i].issuer.name : this.tableData[i].issuer.bankName
            // this.tableData[i].no = this.tableData[i].no.replace(/(\d{4})\d{5}(\d{4})/, '$1*****$2')
            if (!this.tableData[i].blockchainAddress) {
              this.tableData[i].disabled = false
            } else {
              this.tableData[i].disabled = true
            }
          }
        }
      })
    },
    active (id) {
      // this.tableData[scope.$index].cT = 0
      // this.$set(this.tableData, [scope.$index], scope.row)
      // this.disabled = false
      this.loda = id
      coreAccount.queryActive.remote(id, (res) => {
        if (res.data) {
          // this.disabled = true
          this.getGrid()
          this.$message.success('账号激活成功！')
          // this.loda = false
        } else {
          this.loda = null
        }
      })
    }
  }
})
</script>
<style scoped>
  .searchPostion{
    position: absolute;
    right: 306px;
    top: 15px;
  }
</style>
