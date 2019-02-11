<template>
  <div class="content-area" >
    <div v-title='title'>
      {{title}}
    </div>
    <div class="content-body">
      <div class="long">
        <el-row>
          <el-col :span='24' >
            <el-form :inline="true" :model="searchData" class="stand-form " label-width="100px" >
                <fieldset>

                  <el-form-item label="企业名称" label-width="260px" >
                    <el-input v-model="searchData.name" placeholder="请输入企业名称"></el-input>
                  </el-form-item>

                  <el-form-item label="关联日期" class="last-item">
                    <el-date-picker
                      v-model="createTime"
                      type="daterange"
                      :editable=false
                      placeholder="选择日期范围"
                      range-separator='到'
                      @change='createTimeChange'
                      >
                    </el-date-picker>
                    <el-button class="searchBtn" type="info" icon="null iconfont icon-search-bt" @click = "search" style="vertical-align:top; margin-left:20px;">搜索</el-button>
                  </el-form-item>
                </fieldset>
            </el-form>
          </el-col>
        </el-row>
        <el-row class="ml18" style="margin-top:10px">
          <el-col>
            <el-button-group>
              <!-- <el-button type="primary" @click="createNum"> + 关联用户1111</el-button> -->
              <el-button type="primary" @click="relevantEnterprise"> + 关联企业</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24' class="mt10 box-shadow radius-4 pl15 pr15 table-wrap">
            <el-table
              :data="tableData"
              stripe
              >
              <!-- <el-table-column
                type="index"
                label="序号"
                align="center"
                width="80">
              </el-table-column> -->
              <el-table-column
                prop="updateTime"
                label="关联时间"
                align="center"
                width="200px"
                :formatter = "dateFormaterPrecise">
              </el-table-column>
              <el-table-column
                prop="downstreamName"
                :show-overflow-tooltip=true
                align="center"
                label="企业名称">
              </el-table-column>
              <el-table-column
                prop="downstreamId"
                label="企业编号"
                align="center"
                :formatter = "sixEnterpriseCode"
                >
              </el-table-column>
              <el-table-column
                prop="downstreamRemark"
                label="企业ERP编号"
                align="center">
              </el-table-column>
              <el-table-column
                prop="inviteCode"
                label="邀请码"
                align="center">
              </el-table-column>
              <el-table-column
                prop="status"
                align="center"
                label="状态"
                >
                <template scope="scope">
                  <span type="gray" v-for='item in relationList' :key="item.index" v-if='scope.row.status===item.value' >
                    {{item.label}}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="state"
                label="操作"
                width="110"
                align="center">
                <template scope="scope">
                  <!-- status: 1-待确认 2-已确认 3-已拒绝; originator: 是否是发起方 -->
                  <!-- 待确认：发起方：- - ;      接收方：确认关联; -->
                  <!-- 已拒绝：发起方：重新关联;  接收方：- -;  -->
                  <span v-if='scope.row.status === 1'>
                    <el-button v-if='scope.row.originator' type="text" size="small" style="color:#666;">- -</el-button>
                    <span class='twoBtn ml0' v-else>
                      <el-button @click='relation(scope.row.id, 2, "acceptShow")' type="text" size="small" style="color:#FB642A;">接受</el-button>
                      <span>|</span>
                      <el-button @click='relation(scope.row.id, 3, "refuseShow")' type="text" size="small" style="color:#FB642A;">拒绝</el-button>
                    </span>
                  </span>
                  <el-button v-if='scope.row.status === 2' @click='toInfo(scope.row.downstreamId)' type="text" size="small" style="color:#FB642A; cursor:default;">基础信息</el-button>
                  <span v-if='scope.row.status === 3'>
                    <el-button v-if='scope.row.originator' @click='reRelevent(scope.row.downstreamId, scope.row.downstreamName)' type="text" size="small" style="color:#FB642A">重新关联</el-button>
                    <el-button v-else type="text" size="small" style="color:#666;">- -</el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
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
    <relevant :dialogShow='dialogShow'  @updateTable='getGrid'></relevant>
    <messageBox v-if="acceptShow" :messageBox="acceptData" @leftBtnEvent="acceptShow = false" @rightBtnEvent="sure(2, 'acceptShow')"></messageBox>
    <!-- 拒绝弹窗 -->
    <messageBox v-if="refuseShow" :messageBox="refuseData" @leftBtnEvent="refuseShow = false" @rightBtnEvent="sure(3, 'refuseShow')"></messageBox>
    <!-- 重新关联弹窗 -->
    <div class="mask enterprise" v-if="reReleventShow">
      <div class="dialog-box">
        <div class="dialog">
          <div class="dialog-heading">
             <h3 class="dialog-title">申请关联上游企业</h3>
             <span class="icon-delete" @click="reReleventClose">×</span>
          </div>
          <div class="dialog-body">
            <div class="prompt">
              <!-- <i class="icon iconfont table-icon">&#xe66f;</i> -->
              <span>将向对方发起关联申请，对方通过后方可进行各项业务</span>
            </div>
            <div class="relevent-form">
              <el-form :model="formField" :rules="rules" ref="ruleForm" :inline="true">
                <el-form-item label="关联企业名称："> {{reReleventName}} </el-form-item>
                <el-form-item label="企业ERP编号：" prop='remark'>
                  <el-input v-model="formField.remark" placeholder="请输入该企业的ERP编号"></el-input>
                </el-form-item>
                <!-- 隐藏元素占位，解决点击回车页面刷新问题 -->
                <el-form-item label="" v-show='false'>
                  <el-input v-model="formField.remark"></el-input>
                </el-form-item>
              </el-form>
              <div class="">
                <el-button class="button-left" @click='reReleventClose'>取消</el-button>
                <el-button class="button-right" @click='reReleventSure' type="primary">确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
import 'common/css/lib/motherplate.css'
import 'common/sass/module/table.scss'
import 'common/sass/main.scss'
import 'common/sass/module/supplier.scss'
import 'common/sass/customer/enterprise.scss'
import config from 'common/config/config'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import dateTools from 'common/javascript/tools/dateTools'
import messageBox from 'components/ui/messageBox'
// import supplierService from 'common/api/service/supplierService'
import accessControl from 'common/javascript/tools/accessControl.js'
import relevant from 'module/customer/core-downstream/relevant'
import enterpriseStatus from 'common/config/status/enterprise'
import streamApi from 'common/api/enterprise/stream'

const base = {
  name: 'app',
  components: {
    messageBox,
    relevant
  },
  data () {
    return {
      title: '下游',
      currentPage: 1,
      total: 1,
      pageSize: config.pageSize,
      options: status.vMyCertificate,
      dialogFormVisible: false,
      createTime: '',
      relationList: enterpriseStatus.relation,
      dialogShow: {
        show: false
      },
      searchData: {
        dateEnd: null,
        dateStart: null,
        name: null,
        pageSize: config.pageSize,
        pageNum: 1
      },
      acceptShow: false,
      acceptData: {
        type: 'notice',
        icon: 'icon-msg-warn',
        title: '通过后，可与对方进行各项业务',
        msg: '',
        leftBtn: '取消',
        rightBtn: '确定'
      },
      refuseShow: false,
      refuseData: {
        type: 'notice',
        icon: 'icon-msg-warn',
        title: '拒绝后，无法与对方进行各项业务',
        msg: '',
        leftBtn: '取消',
        rightBtn: '确定'
      },
      tableData: [],
      id: null,
      detailAccess: false,
      relevantAccess: false,
      relevant: null,
      reReleventShow: false,
      reReleventId: null,
      reReleventName: null,
      formField: {
        remark: null
      },
      rules: {
        remark: [
          { min: 0, max: 50, message: 'ERP编号应在50个字以内', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let reg = /\s+/
              if (reg.test(value)) {
                callback('ERP编号不可输入空格')
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  beforeMount () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/customer/core-downstream/detail')
    this.relevantAccess = accessControl.checkAccess('/enterprise/upstream/relevant')
    // this.inviteAccess = accessControl.checkAccess('/enterprise/upstream/invite')
  },
  methods: {
    getGrid () { // 获得表数据
      let params = this.searchData
      streamApi.downstreamList.remote(params, (data) => {
        this.total = data.data.total
        this.pageSize = data.data.pageSize
        this.pageNum = data.data.pageNum
        this.tableData = data.data.content || []
      })
    },
    createTimeChange (value) { // 创建时间变化
      const array = value.split('到')
      this.searchData.dateStart = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.dateEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    handleSizeChange (page, a, b) {
    },
    toInfo (id) {
      location.href = '#/customer/core-downstream/detail?id=' + id
    },
    createNum () {
      location.href = '#/customer/core-downstream/create'
    },
    relevantEnterprise () {  // 关联上游企业
      this.dialogShow.show = true
    },
    relation (id, status, show) { // 接受与发起人建立上游关系
      this.id = id
      this[show] = true
    },
    reReleventSure () { // 确认关联
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let param = {
            comId: this.reReleventId,
            remark: this.formField.remark
          }
          streamApi.downstream.remote(param, (data) => {
            if (data.data) {
              this.reReleventClose()
              this.getGrid()
            }
          })
        }
      })
    },
    reRelevent (id, name) { // 重新关联
      this.reReleventId = id
      this.reReleventName = name
      this.reReleventShow = true
    },
    reReleventClose () { // 重新关联弹窗关闭
      this.reReleventId = null
      this.reReleventName = null
      this.formField.remark = null
      this.reReleventShow = false
    },
    sure (status, show) { // 接受/拒绝的确认操作
      let param = {
        id: this.id,
        status: status
      }
      streamApi.downstreamRelation.remote(param, (data) => {
        if (data.data) {
          this[show] = false
          this.getGrid()
        }
      })
    }
  }
}
export default merge(base, table)
</script>
<style scoped>
  .searchPostion{
    position: absolute;
    right: -55px;
    top: 0px;
  }
</style>
