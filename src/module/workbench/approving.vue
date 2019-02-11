<template>
  <div class="content-area" >
    <div class="showMore" style="position:relative;bottom:100px;right:-20px"><a href='#/voucher/approving' style="color:#666;text-decoration:none;">查看更多></a></div>
    <div class="content-body">
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
              label="凭证编号"
              align="center"
              width = '215'>
              <template scope="scope">
                <el-button v-if="detailAccess" @click='toInfo(scope.row.id)' type="text" size="small">{{scope.row.no}}</el-button>
                <span v-if="!detailAccess">{{scope.row.no}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="company.name"
              :show-overflow-tooltip=true
              label="指定供应商"
              align="center"
              min-width="180">
            </el-table-column>

            <el-table-column
              prop="total"
              label="凭证金额（元）"
              align="center"
              :formatter = "moneyShow"
              width="180">
            </el-table-column>

            <el-table-column
              prop="cashTime"
              label="付款日期"
              align="center"
              :formatter = "dateFormater"
              width="180">
            </el-table-column>

            <el-table-column
              v-if="approveAccess"
              prop="id"
              fixed="right"
              label="操作"
              align="center"
              width="120">
              <template scope="scope" >
                <el-button v-if="approveAccess" @click='approve(scope.row.id, scope.row.no, scope.row.company.id)' type="text" size="small">审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="系统提示" v-model="approveDialogForm" >
        <div style="width:600px;margin:0px auto;">
            <el-form :model="form" :rules="form.rules" ref="formRef">
              <el-row>
                <el-col span=24>
                  <span class="require">＊</span>审批通过后接受方可操作签收，退回则该凭证将退回操作员重新提交。
                </el-col>

                <el-form-item class="mt40" label="审批结果" prop="operator">
                  <el-radio disabled class="radio" v-if="approveIdExpire" v-model="form.operator" label="1">审批通过</el-radio>
                  <el-radio class="radio" v-if="!approveIdExpire" v-model="form.operator" label="1">审批通过</el-radio>
                  <el-radio class="radio" v-model="form.operator" label="2">审批退回</el-radio>
                </el-form-item>

                <el-form-item class="mt10" label="审批意见" prop="reason">
                  <el-input style="resize:none;" v-if="approveIdExpire"
                    type="textarea"
                    disabled
                    placeholder="请填写审批意见"
                    v-model="form.reason">
                  </el-input>
                  <el-input style="resize:none;" v-if="!approveIdExpire"
                    type="textarea"
                    placeholder="请填写审批意见"
                    v-model="form.reason">
                  </el-input>
                </el-form-item>
              </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="approveDialogForm = false">取 消</el-button>
          <el-button type="primary" @click="approveSubmit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <cletter ref='letterDialog' @read-letter='agreeMentChange' title='付款承诺函'></cletter>
  </div>
</template>
<script type="text/javascript">
import 'common/sass/module/table0.scss'
// import config from 'common/config/config'
import dateTools from 'common/javascript/tools/dateTools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
import cletter from 'components/entries/common/letter'
// import companyService from 'common/api/service/companyService'
import accessControl from 'common/javascript/tools/accessControl.js'
import coreApi from 'common/api/voucher/core'

export default merge(table, {
  name: 'app',
  components: {
    cletter
  },
  props: ['totalNum'],
  data () {
    return {
      title: '待审批凭证',
      buttonActive: true,
      selection: [],
      approveId: null,
      approveDialogForm: false,
      form: {
        operator: '',
        reason: '',
        rules: {
          operator: [
            { required: true, message: '审批结果为必选项！', trigger: 'change' }
          ],
          reason: [
            {
              validator: (rule, value, callback) => {
                if (value.length > 20) {
                  callback(new Error('审批意见为20个字'))
                }
                callback()
              },
              trigger: 'change'
            }
          ]
        }
      },
      searchData: {
        no: null,
        companyQstr: null,
        updateTime: null,
        updateTimeBegin: null,
        updateTimeEnd: null,
        createdCompanyId: null,
        pageSize: 5,
        pageNum: 1,
        orderType: 'UT_ASC'

      },
      expire: [],
      approveIdExpire: false,
      currentPage: 1,
      total: 0,
      tableData: [],
      // 付款函相关数据
      no: null,
      companyId: null,
      paymentId: null,
      paymentFileId: null,
      companyName: null,
      approveAccess: false,
      detailAccess: false
    }
  },
  mounted () {
    this.getGrid()
    this.detailAccess = accessControl.checkAccess('/voucher/approving/detail')
    this.approveAccess = accessControl.checkAccess('/voucher/approving/approve')
  },
  methods: {
    approveSubmit () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let params = {
            'id': this.approveId,
            'reason': this.form.reason
          }
          if (this.form.operator === '1') {
            // 获取付款函
            const param = {
              no: this.no,
              partyBComId: this.companyId
            }
            coreApi.paymentLetter.remote(param, (info) => {
              this.paymentId = info.data.id
              this.paymentFileId = info.data.fileId
              const letterInfo = {
                show: true,
                companyName: this.companyName,
                fileId: this.paymentFileId,
                id: this.paymentId
              }
              this.$refs.letterDialog.$emit('toggle-dialog', letterInfo)
            })
          } else {
            coreApi.rejectVoucher.remote(params, (result) => {
              if (result.success === true) {
                this.$message.success('审批成功')
                this.form.operator = ''
                this.form.reason = ''
                this.approveDialogForm = false
                this.getGrid()
              } else {
                this.$message.error('审批失败')
              }
            })
          }
        }
      })
    },

    getGrid () { // 获得表数据
      let params = merge({}, this.searchData)
      coreApi.getToapproveVoucher.remote(params, (result) => {
        this.totalNum.total = result.data.total
        this.pageSize = result.data.pageSize
        this.pageNum = result.data.pageNum
        this.tableData = result.data.content || []
        for (var i = 0; i < this.tableData.length; i++) {
          this.expire[this.tableData[i].id] = (this.tableData[i].cashTime > (new Date()).valueOf()) ? 0 : 1
        }
      })
    },
    cashTimeChange (value) { // 时间变化
      const array = value.split(' 到 ')
      this.searchData.updateTimeBegin = dateTools.dateTotimestamp(array[0] + ' 00:00:00')
      this.searchData.updateTimeEnd = dateTools.dateTotimestamp(array[1] + ' 23:59:59')
    },
    approve (id, no, companyId) {
      // this.approveId = id
      // this.no = no
      // this.companyId = companyId
      // this.approveDialogForm = true
      // if (this.expire[id] === 1) {
      //   this.approveIdExpire = true
      //   this.form.reason = '超时未审批'
      // } else {
      //   this.approveIdExpire = false
      //   this.form.reason = ''
      // }
      location.href = '#/voucher/approving/approve?id=' + id
    },
    toInfo (id) {
      location.href = '#/voucher/approving/detail?id=' + id
    },
    agreeMentChange (info) {
      let updateInfo = {
        fileId: info.fileId,
        id: info.id
      }
      coreApi.paymentUpdate.remote(updateInfo, (info) => {
        if (info.data) {
          // 付款函上传并更新成功，进入业务
          let params = {
            'id': this.approveId,
            'reason': this.form.reason
          }
          coreApi.approveVoucher.remote(params, (result) => {
            if (result.success === true) {
              this.$message.success('审批成功')
              this.form.operator = ''
              this.form.reason = ''
              this.approveDialogForm = false
              this.getGrid()
            } else {
              this.$message.error('审批失败')
            }
          })
        } else {
          this.$message.error('付款函更新失败')
        }
      })
    }
  }
})
</script>
<style>
  .el-table__fixed-right{
    box-shadow: none !important;
  }
</style>
