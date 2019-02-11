<template>
    <div class="content-area" style="margin-top:20px">
      <div class="moreLi">
        <div style ="height:4px;margin-bottom:20px;"></div>
        <div class="item-group moreLipadding">
          <div class="item-tit" style="color: #333333;">
          <span class="item-tit-icon"></span>通知/公告<span>未读 <span>{{lengths}}</span> 条</span>
          <div style="float:right"><span style="color:#666;text-decoration:none;cursor:pointer;" @click = "readed">全部标为已读 > </span></div>
          </div>
          <div style="margin:0 auto;padding-top:30px;box-shadow: 0 0 24px 0 #EFEFEF;padding-bottom:30px">
            <div style="margin:0 auto;width:490px;">
              <el-form :inline="true" :model="searchData" label-width="100px" >
                <el-form-item label="凭证状态">
                    <el-select v-model="searchData.state" placeholder="请选择">
                    <el-option
                      v-for="item in statusOptions"
                      :label="item.label"
                      :value="item.value"
                      :key='item.index'>
                    </el-option>
                  </el-select>
                  <el-button class="button-bubi-theme searchBtn ml30" type="info" icon="null iconfont icon-search-bt" @click="searchVoucher">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <ul class="newList">
            <li v-for="(item, index1) in tableData" :class="{'bgcolor':item.state === 0}">
              <span class="red-circular1" v-if ="item.state !== 1"></span>
              <span class="red-circular2" v-if ="item.state === 1"></span>
                {{item.message}}
              <span class="time">{{item.time}}</span>
              <span  @click="singled(item.id)"  v-if='item.state === 0' class="read1">未读消息</span>
              <span  v-if='item.state === 1' class="read2">已读</span>
            </li>
            <div v-if="showImg" class="showImg">
              <img src = '../../common/image/showImg.png'/>
              <p>您还没有未读消息</p>
            </div>
          </ul>

          <div style="margin:0 auto" v-show="tableData.length != 0">
            <el-row>
              <el-col :span='24'>
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
      </div>
    </div>
</template>
<script type="text/javascript">
// import 'common/sass/module/table0.scss'
// import config from 'common/config/config'
import dateTools from 'common/javascript/tools/dateTools'
import table from 'components/entries/base/table'
import merge from 'webpack-merge'
import headerApi from 'common/api/components/header.js'
import statuss from 'common/config/status'
import config from 'common/config/config'
// import coreCompanyVoucherService from 'common/api/service/coreCompanyVoucherService'
// import cletter from 'components/entries/common/letter'
// // import companyService from 'common/api/service/companyService'
// import accessControl from 'common/javascript/tools/accessControl.js'
// import coreApi from 'common/api/voucher/core'

export default merge(table, {
  name: 'app',
  data () {
    return {
      showImg: true,
      searchData: {
        state: null,
        pageSize: config.pageSize,
        pageNum: 1
      },
      lengths: 0,
      currentPage: 1,
      total: 0,
      tableData: [],
      statusOptions: statuss.readSttus
    }
  },
  mounted () {
    this.newsList()
    this.$bus.$on('uplist', info => {
      this.newsList()
    })
  },
  methods: {
    // 搜索凭证
    searchVoucher () {
      this.newsList()
    },
    newsList () {
      let params = merge({}, this.searchData)
      headerApi.allNews.remote(params, (result) => {
        if (result.success) {
          this.lengths = 0
          this.tableData = result.data.content || []
          this.searchData.pageSize = result.data.pageSize
          this.total = result.data.total
          result.data.content.map((item, i) => { // 组合
            // 判断
            let count = 0
            if (item.type === 700103) {
              let newJson = JSON.parse(item.extend)
              this.tableData[i].message = newJson.fundingName + '审批的' + newJson.creditNo + '授信内容变更，请确认'
              this.tableData[i].id = item.id
              this.tableData[i].type = item.type
              this.tableData[i].state = item.state
              if (this.tableData[i].state === 0) {
                count = 1 + count
                this.lengths += count
              }
            } else if (item.type === 700102) {
              let newJson = JSON.parse(item.extend)
              newJson.createTime = dateTools.dateFormater(newJson.createTime, 'YYYY.MM.DD HH:mm:ss')
              this.tableData[i].message = newJson.supplyerName + '使用' + newJson.voucherNo + '凭证申请转让' + newJson.transferAmount + '元'
              this.tableData[i].id = item.id
              this.tableData[i].type = item.type
              this.tableData[i].state = item.state
              this.tableData[i].time = newJson.createTime
              if (this.tableData[i].state === 0) {
                count = 1 + count
                this.lengths += count
              }
            } else if (item.type === 700101) {
              let newJson = JSON.parse(item.extend)
              newJson.createTime = dateTools.dateFormater(newJson.createTime, 'YYYY.MM.DD HH:mm:ss')
              newJson.financeAmount = newJson.financeAmount / 100
              this.tableData[i].message = newJson.supplyerName + '使用' + newJson.voucherNo + '凭证申请融资' + newJson.financeAmount + '元'
              console.log(111, this.tableData[i].message)
              this.tableData[i].id = item.id
              this.tableData[i].type = item.type
              this.tableData[i].state = item.state
              this.tableData[i].time = newJson.createTime
              if (this.tableData[i].state === 0) {
                count = 1 + count
                this.lengths += count
              }
            }
          })
          if (this.tableData !== 0) {
            this.showImg = false
          } else {
            this.tableData = true
          }
        }
      })
    },
    singled (id) {
      let param = {
        id: id
      }
      headerApi.read.remote(param, (result) => {
        if (result.data) {
          this.newsList()
          this.$bus.$emit('newAdd', '11111')
          localStorage.setItem('newsData', JSON.stringify(''))
        }
      })
    },
    readed () {
      headerApi.allRead.remote((result) => {
        if (result.data) {
          this.tableData = []
          this.newsList()
          this.$bus.$emit('newAdd', '11111')
          localStorage.setItem('newsData', JSON.stringify(''))
        }
      })
    }
  }
})
</script>
<style scoped>
  .moreLi {
      width: 98%;
      /* height: 60px; */
      overflow: hidden;
      background: #fff;
      margin: 0 auto;
      color: #0C77CF;
      padding: 0 35px 0 25px;
  }
  .moreLi .moreLipadding{
    padding: 0 20px 0 20px;
  }
  .notice {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
  }
  .notice_left{
    float: left;
    width: 149px;
    height: 100%;
    font-family: "SourceHanSansCN-Regular";
  }
  .notice_left>p{
    width: 100%;
    height: 100%;
    font-size: 16px;
    color: #333333;
    line-height: 30px;
    font-family: "SourceHanSansCN-Regular";
  }
  .notice_left>p>span {
    height: 100%;
    line-height: 30px;
    font-size: 14px;
    color: #2A2A2A;
    font-family: "SourceHanSansCN-Regular";
  }
  .notice_left>p>span>span{
    font-size: 14px;
    color: #FB642A;
    height: 100%;
  }
  .notice_right {
    float: right;
    width: 200px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #666666;
  }
  .notice_right p:first-child {
    font-family: "SourceHanSansCN-Regular";
    font-size: 16px;
    color: #666666;
    text-align: left;
    width: 100px;
    float: left;
    line-height: 30px;
  }
  .notice_right p:last-child  {
    font-family: "SourceHanSansCN-Regular";
    font-size: 16px;
    color: #666666;
    text-align: right;
    width: 85px;
    line-height: 30px;
    /* border-left: 1px solid #DFDFDF; */
    float: left;
  }
  .moreLi .newList{
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 24px 0 #EBEDEF;
    padding: 0 20px;
  }
  .moreLi .newList li {
    list-style:initial;
    height: 50px;
    font-family: "SourceHanSansCN-Regular";
    font-size: 14px;
    color: #888888;
    line-height: 50px;
    border-bottom: 1px solid #EDEDED;
  }
  .moreLi .newList .bgcolor {
    list-style:initial;
    height: 50px;
    font-family: "SourceHanSansCN-Regular";
    font-size: 14px;
    color: #333333;
    line-height: 50px;
    /* text-align: center; */
    border-bottom: 1px solid #EDEDED;
  }
  .moreLi .newList li:last-child{
    border-bottom: none;
  }
  .moreLi .newList li .read1{
    float: right;
    font-family: "SourceHanSansCN-Regular";
    font-size: 14px;
    line-height: 50px;
    color: #FB642A;
    cursor:pointer;
  }
  .moreLi .newList li .read2{
    float: right;
    font-family: "SourceHanSansCN-Regular";
    font-size: 14px;
    line-height: 50px;
    color: #666666;
    cursor:pointer;
  }

  .moreLi .newList .showImg{
    width: 200px;
    height: 150px;
    margin: 10px auto;
    /* background-color: red; */
  }
  .moreLi .newList .showImg img{
    height: 80px;
    margin-top: 21px;
    margin-left: 27px;
    /* width: 100%; */
  }
  .moreLi .newList .showImg p{
    width: 100%;
    height: 43px;
    text-align: center;
    font-size: 14px;
    color: #999999;
    font-family: "SourceHanSansCN-Regular";
    line-height: 43px;
  }

  .moreLi .newList li .time {
    color: #999999;
    font-size: 14px;
    margin-left: 20px;
  }
  .moreLi .newList li .red-circular1 {
    width: 5px;
    height: 5px;
    background: red;
    border-radius: 100%;
    display: inline-block;
    margin: 10px 5px 2px;
  }
  .moreLi .newList li .red-circular2 {
    width: 5px;
    height: 5px;
    background: #ffff;
    border-radius: 100%;
    display: inline-block;
    margin: 10px 5px 2px;
  }
  .notice_right>div {
    font-family: "SourceHanSansCN-Regular";
    font-size: 16px;
    color: #666666;
    text-align: right;
    width: 100px;
    float: right;
    line-height: 30px;
  }
</style>
