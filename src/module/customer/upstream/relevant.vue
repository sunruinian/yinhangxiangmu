<template>
  <div class="mask enterprise" v-if="dialogShow.show">
    <div class="dialog-box">
      <div class="dialog">
        <div class="dialog-heading" v-if='!selectShow'>
          <h3 class="dialog-title">关联上游企业</h3>
          <span class="iconfont icon-delete" @click="closeDialog">×</span>
        </div>
        <div class="dialog-heading" v-if='selectShow'>
           <h3 class="dialog-title">申请关联上游企业</h3>
           <span class="iconfont icon-delete" @click="closeDialog">×</span>
        </div>
        <div class="dialog-body associated" v-if='!selectShow'>
          <div class="">
            <el-form :inline="true" :model="searchData">
              <el-form-item label="企业名称" label-width="100px">
                <el-input v-model="searchData.name" placeholder="请输入企业名称，支持精确搜索" style="width:250px"></el-input>
              </el-form-item>
              <!-- <el-form-item label="企业编号" label-width="100px">
                <el-input v-model="searchData.id" placeholder="请输入企业编号，仅支持精确搜索" style="width:250px"></el-input>
              </el-form-item> -->
              <el-button class="button-bubi-theme searchBtn" icon="null iconfont icon-search-bt" @click = "getGrid">搜索</el-button>
            </el-form>
          </div>
          <el-row>
            <el-col :span='24' class="table-wrap">
              <el-table
                :data="tableData"
                stripe
                >
                <el-table-column
                  prop="name"
                  :show-overflow-tooltip=true
                  align="center"
                  label="企业名称">
                </el-table-column>
                <el-table-column
                  prop="certificateCode4Society"
                  label="统一社会信用代码"
                  align="center"
                  :formatter = "completeNo" width="200px">
                </el-table-column>
                <el-table-column
                  prop="state"
                  label="操作"
                  align="center">
                  <template scope="scope">
                    <el-button  @click='select(scope.row.id, scope.row.name)' type="text" size="small" style="color:FB642A">选择</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row v-show="total > 5">
            <el-col :span='24' class="pagination-base">
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
        <div v-if='selectShow'>
          <div class="dialog-body">
            <div class="prompt">
              <i class="icon iconfont table-icon">&#xe66f;</i>
              <span>将向对方发起关联申请，对方通过后方可进行各项业务</span>
            </div>
            <div class="relevent-form">
              <el-form :model="formField" :rules="rules" ref="ruleForm" :inline="true">
                <el-form-item label="关联企业名称："> {{selectName}} </el-form-item>
                <el-form-item label="企业ERP编号：" prop='remark'>
                  <el-input v-model="formField.remark" placeholder="请输入该企业的ERP编号"></el-input>
                </el-form-item>
                <!-- 隐藏元素占位，解决点击回车页面刷新问题 -->
                <el-form-item label="" v-show='false'>
                  <el-input v-model="formField.remark"></el-input>
                </el-form-item>
              </el-form>
              <div class="">
                <el-button class="button-left" @click='cancel'>取消</el-button>
                <el-button class="button-right" @click='relevant' type="primary">确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import table from 'components/entries/base/table'
import streamApi from 'common/api/enterprise/stream'
import merge from 'webpack-merge'

export default merge(table, {
  components: {
  },
  props: ['dialogShow'],
  data () {
    return {
      pageSize: 1,
      total: 0,
      searchData: {
        name: null,
        pageSize: 5,
        pageNum: 1
      },
      tableData: [],
      selectShow: false,
      selectName: null,
      selectId: null,
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
  methods: {
    getGrid () { // 获得表数据
      let params = this.searchData
      if (this.searchData.name || this.searchData.id) {
        streamApi.baseinfo.remote(params, (data) => {
          this.total = data.data.total
          this.pageSize = data.data.pageSize
          this.pageNum = data.data.pageNum
          this.tableData = data.data.content || []
        })
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    select (id, name) { // 选择企业
      this.selectName = name
      this.selectId = id
      this.selectShow = true
    },
    relevant () { // 关联企业
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let param = {
            comId: this.selectId,
            remark: this.formField.remark
          }
          streamApi.downstream.remote(param, (data) => {
            if (data.data) {
              this.$emit('updateTable')
              this.closeDialog()
              if (data.data === 1) {
                this.$yn.messageBox({
                  type: 'success',
                  title: '已经向该企业发起申请了，请耐心等待',
                  msg: '',
                  leftBtn: '',
                  rightBtn: '好'
                })
              }
            }
          })
        }
      })
    },
    cancel () { // 取消关联企业操作
      this.selectId = null
      this.selectName = null
      this.formField.remark = null
      this.selectShow = false
    },
    closeDialog () { // 关闭弹窗
      // 企业列表框数据清除
      this.searchData.name = null
      this.searchData.id = null
      this.tableData = []
      // 申请框数据清除
      this.selectShow = false
      this.selectId = null
      this.selectName = null
      this.formField.remark = null
      this.dialogShow.show = false
    }
  }
})
</script>
