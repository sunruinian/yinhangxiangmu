<!-- 我的授信 cl -->
<template>
  <div>
    <div>
      <div class="item-group" style="padding:0px 0px">
        <div class="item-tit" style="color: #333333;">
        <span class="item-tit-icon"></span>我的额度</span>
        <div style="float:right" >
          <a href='#/credit/enterprise' style="color:#666;text-decoration:none;padding-right:8px;" v-if="companyTyp !== 'SUPPLY'">查看更多></a>
          <a href='#/credit/supplier' style="color:#666;text-decoration:none;padding-right:8px;" v-if="companyTyp === 'SUPPLY'">查看更多></a>
        </div>
        </div>
      </div>
      <div style="box-shadow: 0 0 24px 0 #EBEDEF;margin:0px 10px 0px 10px">
        <div class="content-body" style='background: #fff;'>
          <el-row style="padding-top:10px">
            <el-col :span='24' >
              <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                  prop="total"
                  width = '180'
                  align='center'
                  :formatter = "moneyNarrow"
                  label="授信额度（元）">
                </el-table-column>
                <el-table-column
                  prop="used"
                  min-width = '180'
                  align='center'
                  :formatter = "moneyNarrow"
                  label="已使用额度（元）">
                </el-table-column>
                <el-table-column
                  prop="value"
                  min-width = '180'
                  align='center'
                  :formatter = "moneyNarrow"
                  label="可使用额度（元）">
                </el-table-column>
                <!-- <el-table-column
                  prop="timeDuring"
                  width = '200'
                  label="额度到期日">
                </el-table-column> -->
                <!-- <el-table-column
                  prop=""
                  align='center'
                  fixed="right"
                  label="操作"
                  width="150">
                  <template scope="scope" >
                    <el-button type="text" size="small" @click='showAllot(scope.row.id)'>查看授信分配</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
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
// import config from 'common/config/config'
// import credit from 'common/api/service/credit'
import credit from 'common/api/workbench/common'
// import dateTools from 'common/javascript/tools/dateTools'
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
      companyTyp: null
      // searchData: {
      //   createTimeEnd: null,
      //   createTimeStart: null,
      //   startTimeEnd: null,
      //   startTimeStart: null,
      //   pageSize: config.pageSize,
      //   pageNum: 1,
      //   type: null
      // }
    }
  },
  beforeMount () {
    this.getGrid()
  },
  mounted () {
    this.reloadAccess = accessControl.checkAccess('/credit/enterprise/reload')
    this.detailAccess = accessControl.checkAccess('/credit/enterprise/allot')
  },
  methods: {
    getGrid () { // 获得表数据
      credit.myCredit.remote((data) => {
        if (data.success) {
          // this.totalNum.total = data.data.total
          // this.total = data.data.total
          // this.pageSize = data.data.pageSize
          // this.pageNum = data.data.pageNum
          this.companyTyp = data.companyTypeEnum
          this.tableData = data.data.creditVOS || []
          Array.map(this.tableData, (item, i) => {
            // debugger
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
        }
      })
    }
    // 查看授信
    // showAllot (id) {
    //   location.href = '#/credit/enterprise/allot?id=' + id
    // }
  }
}

export default merge(base, table)
</script>
