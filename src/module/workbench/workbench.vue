<template>
  <div class="content-area workbench scroll">
      <div v-title='title'>{{title}}</div>
      <div v-if = 'vouTabShow'>
        <div class="workbench-inner">
         <div class="itemGroup" style="font-size:16px">
          <el-row>
           <el-col :span="8" class="item" v-show='vouTabsData[0].access'>
             <div class="box-shadow">
               <div class="img"><img src = '../../common/image/vou1.png'/></div>
               <div class="voucher"><span class="word">待提交审批</span><br/><span class="num">{{draf.total}}</span></div>
             </div>
           </el-col>
           <el-col :span="8" class="item" v-show='vouTabsData[1].access'>
               <div class="box-shadow">
                 <div class="img"><img src = '../../common/image/vou2.png'/></div>
                 <div class="voucher"><span class="word">待审批</span><br/><span class="num">{{approving.total}}</span></div>
               </div>
             </el-col>
             <el-col :span="8" class="item" v-show='vouTabsData[2].access'>
               <div class="box-shadow">
                 <div class="img"><img src = '../../common/image/vou3.png'/></div>
                 <div class="voucher"><span class="word">待申请付款</span><br/><span class="num">{{apply.total}}</span></div>
               </div>
             </el-col>
             <el-col :span="8" class="item" v-show='vouTabsData[3].access'>
               <div class="box-shadow">
                 <div class="img"><img src = '../../common/image/vou4.png'/></div>
                 <div class="voucher"><span class="word">待审批付款</span><br/><span class="num">{{approve.total}}</span></div>
               </div>
             </el-col>
             <el-col :span="8" class="item" v-show='vouTabsData[4].access'>
               <div class="box-shadow">
                 <div class="img"><img src = '../../common/image/vou5.png'/></div>
                 <div class="voucher"><span class="word">待签收</span><br/><span class="num">{{signh.total}}</span></div>
               </div>
             </el-col>
             <el-col :span="8" class="item" v-show='vouTabsData[5].access'>
               <div class="box-shadow">
                 <div class="img"><img src = '../../common/image/vou6.png'/></div>
                 <div class="voucher"><span class="word">待审批转让</span><br/><span class="num">{{assignApprove.total}}</span></div>
               </div>
             </el-col>
           </el-row>
         </div>
       </div>
      </div>
       <div id="div1">
        <div style="margin-bottom:20px;">
            <enterprise :totalNum='enterprise'></enterprise>
        </div>
        <div class="item-group">
          <div class="item-tit" style="color: #333333;">
          <span class="item-tit-icon"></span>通知/公告<span>（未读:<span> {{newsData.length}} </span>）</span>
          <div style="float:right"><a href='#/workbench/newListMore' style="color:#666;text-decoration:none;">查看更多></a></div>
          </div>
          <ul class="newList">
            <li v-for="(item, index1) in newsData" :class="{'bgcolor':item.status === true}">
              <span :class="{'red-circular':item.status !== true}"></span>{{item.message}}
              <span class="time">{{item.time}}</span>
              <span class="read" @click="singled(item.id, item.type, item.fileName, item.index)">{{item.read}}</span>
            </li>
            <div v-if="showImg" class="showImg">
              <img src = '../../common/image/showImg.png'/>
              <p>您还没有未读消息</p>
            </div>
          </ul>
        </div>
      </div>
    <div class="workbench-todo" v-if = 'vouTabShow'>
      <div class="item-group">
        <div class="item-tit" style='padding-left:20px'>
          <span class="item-tit-icon"></span>我的待办
        </div>
        <div class="item-cnt">
          <div class="body">
            <div class="tab-bar1" style="margin: 0">
              <span class="tab-group voucher-border">
                <span
                  class="tab-item"
                  v-for="(item, index) in vouTabsData"
                  :index = "index"
                  :key = "index"
                  v-show="item.access"
                  v-bind:class="item.selected ? 'active':''"
                  @click="tabChange(vouTabsData, index)">
                  {{item.name}}
                </span>
              </span>
            </div>
            <div class="boxShadow">
              <!-- voucher-approving -->
              <voucherDrf :totalNum='draf' v-show='vouTabsData[0].selected' v-if='vouTabsData[0].access'></voucherDrf>
              <voucherApproving :totalNum='approving' v-show='vouTabsData[1].selected' v-if='vouTabsData[1].access'></voucherApproving>
              <paymentApply :totalNum='approving' v-show='vouTabsData[2].selected' v-if='vouTabsData[2].access'></paymentApply>
              <paymentApprove :totalNum='apply' v-show='vouTabsData[3].selected' v-if='vouTabsData[3].access'></paymentApprove>
              <vouchersign :totalNum='approve' v-show='vouTabsData[4].selected' v-if='vouTabsData[4].access'></vouchersign>
              <assignApprove :totalNum='assignApprove' v-show='vouTabsData[5].selected' v-if='vouTabsData[5].access'></assignApprove>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import 'common/sass/module/workbench.scss'
// import 'common/sass/module/component.scss'
import accessControl from 'common/javascript/tools/accessControl.js'
import voucherApproving from 'module/workbench/approving'
import voucherDrf from 'module/workbench/draf'
import paymentApply from 'module/workbench/apply'
import paymentApprove from 'module/workbench/approve'
import vouchersign from 'module/workbench/signh'
import assignApprove from 'module/workbench/assignApprove'
import enterprise from 'module/workbench/enterprise'
import headerApi from 'common/api/components/header.js'
export default ({
  name: 'app',
  components: {
    voucherApproving,
    voucherDrf,
    paymentApply,
    paymentApprove,
    vouchersign,
    assignApprove,
    enterprise
  },
  data () {
    return {
      title: '工作台',
      newsData: [],
      read: '标为已读',
      showImg: true,
      vouTabsData: [
        {name: '待提交审批', selected: true, access: false},
        {name: '待审批', selected: false, access: false},
        {name: '待申请付款', selected: false, access: false},
        {name: '待审批付款', selected: false, access: false},
        {name: '待签收', selected: false, access: false},
        {name: '待审批转让', selected: false, access: false}
      ],
      vouTabShow: false,
      approving: { total: 0 },
      draf: { total: 0 },
      apply: { total: 0 },
      approve: { total: 0 },
      signh: { total: 0 },
      assignApprove: { total: 0 },
      enterprise: { total: 0 }
    }
  },
  mounted () {
    this.vouTabsData[0].access = accessControl.checkAccess('/voucher/draft')
    this.vouTabsData[0].selected = this.vouTabsData[0].access // 激活还是不激活与权限一致，无权限：不激活；有权限：激活
    this.vouTabsData[1].access = accessControl.checkAccess('/voucher/approving')
    this.vouTabsData[1].selected = this.vouTabsData[1].access ? !this.vouTabsData[0].selected : this.vouTabsData[1].access // 无权限：不激活；有权限：第1个tab未激活才激活
    this.vouTabsData[2].access = accessControl.checkAccess('/payment/apply/apply')
    this.vouTabsData[2].selected = this.vouTabsData[2].access ? !this.vouTabsData[0].selected && !this.vouTabsData[1].selected : this.vouTabsData[2].access // 无权限：不激活；有权限：第1个和第2个tab未激活才激活
    this.vouTabsData[3].access = accessControl.checkAccess('/payment/approve/approve')
    this.vouTabsData[3].selected = this.vouTabsData[3].access ? !this.vouTabsData[0].selected && !this.vouTabsData[1].selected && !this.vouTabsData[2].selected : this.vouTabsData[3].access // 无权限：不激活；有权限：第1个和第2个tab未激活才激活
    this.vouTabsData[4].access = accessControl.checkAccess('/payment/approve/approve')
    this.vouTabsData[4].selected = this.vouTabsData[4].access ? !this.vouTabsData[0].selected && !this.vouTabsData[1].selected && !this.vouTabsData[2].selected && !this.vouTabsData[3].selected : this.vouTabsData[4].access // 无权限：不激活；有权限：第1个和第2个tab未激活才激活
    this.vouTabsData[5].access = accessControl.checkAccess('/payment/approve/approve')
    this.vouTabsData[5].selected = this.vouTabsData[5].access ? !this.vouTabsData[0].selected && !this.vouTabsData[1].selected && !this.vouTabsData[2].selected && !this.vouTabsData[3].selected && !this.vouTabsData[4].selected : this.vouTabsData[5].access // 无权限：不激活；有权限：第1个和第2个tab未激活才激活
    this.vouTabsData.forEach(item => { if (item.access) this.vouTabShow = true; return })
    this.newsData = JSON.parse(localStorage.getItem('newsData'))
    if (JSON.parse(localStorage.getItem('newsData')).length !== 0) {
      this.showImg = false
    } else {
      this.showImg = true
    }

    this.$bus.$on('new-updata', info => {
      this.newsData = info
      if (info.length !== 0) {
        this.showImg = false
      } else {
        this.showImg = true
      }
    })
  },
  beforeDestroy () {
    // 数据清除
    this.vouTabShow = false
  },
  methods: {
    tabChange: function (vouTabsData, index) {
      this.scrollheight()
      vouTabsData.forEach(function (item) {
        item.selected = false
      })
      vouTabsData[index].selected = true
    },
    singled (id, type, fileName, index) {
      let param = {
        id: id
      }
      headerApi.read.remote(param, (result) => {
        if (result.data) {
          this.$bus.$emit('newUpdata', this.newsData)
        }
      })
    },
    scrollheight () {
      let isscroll = document.querySelector('.scroll').clientHeight
      this.$bus.$emit('isscroll', isscroll)
    }
  }
})
</script>

<style scoped>
  #div1 {
      width: 98%;
      /* height: 60px; */
      overflow: hidden;
      background: #fff;
      margin: 0 auto;
      color: #0C77CF;
      padding: 0 35px 0 25px;
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
  #div1 .newList{
    height: 199px;
    margin-top: 10px;
    overflow-y: auto;
    margin-bottom: 20px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 24px 0 #EBEDEF;
    padding: 0 20px;
  }
 /* #div1 .newList::-webkit-scrollbar {
    width:10px;
    height:10px;
  }
  #div1 .newList::-webkit-scrollbar-thumb{
    background: #C1C1C1;
    border-radius:4px;
  }
  #div1 .newList::-webkit-scrollbar {
    width:10px;
    height:10px;
  }
  #div1 .newList {
    scrollbar-highlight-color:#fff;
    scrollbar-base-color:#fff;
    scrollbar-face-color:#C1C1C1;
    scrollbar-arrow-color:#fff;
  } */

  #div1 .newList li {
    list-style:initial;
    height: 50px;
    font-family: "SourceHanSansCN-Regular";
    font-size: 14px;
    color: #333333;
    line-height: 50px;
    /* text-align: center; */
    border-bottom: 1px solid #EDEDED;
  }
  #div1 .newList li:last-child{
    border-bottom: none;
  }
  #div1 .newList li .read{
    float: right;
    font-family: "SourceHanSansCN-Regular";
    font-size: 14px;
    line-height: 50px;
    color: #FB642A;
    cursor:pointer;
  }

  #div1 .newList .showImg{
    width: 200px;
    height: 150px;
    margin: 10px auto;
    /* background-color: red; */
  }
  #div1 .newList .showImg img{
    height: 80px;
    margin-top: 21px;
    margin-left: 27px;
    /* width: 100%; */
  }
  #div1 .newList .showImg p{
    width: 100%;
    height: 43px;
    text-align: center;
    font-size: 14px;
    color: #999999;
    font-family: "SourceHanSansCN-Regular";
    line-height: 43px;
  }

  #div1 .newList li .time {
    color: #999999;
    font-size: 14px;
    margin-left: 20px;
  }
  #div1 .newList li .red-circular {
    width: 5px;
    height: 5px;
    background: red;
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
  .boxShadow{
    box-shadow: 0 0 24px 0 #EFEFEF;
    margin-top: 20px;
  }
  #div1 .newList .bgcolor{
    font-size: 14px;
    color: #888888;
    /* background: red; */
  }
</style>
