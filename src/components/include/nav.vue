<template>
	<div class="header">
		<div>
			<span class="title"> <img src = '../../common/image/logon.png'></span>
			<el-badge is-dot hidden class='item headerFloat'>
				<span class="iconfont icon-tuichu icon-header" @click='logout'></span>
			</el-badge>
			<a v-if="detailAccess" @click="toRealInfo" class="headerHello">您好：{{currentCompany.name}}</a>
			<span v-if="!detailAccess" class="headerHello">您好：{{currentCompany.name}}</span>
			<el-popover
				id="el-popover"
				ref="popover"
				placement="bottom"
				width="400"
				trigger="click">
				<div id="readNew">
					<span class="un-read" v-if= "tableData.length === 0">
						未读消息<b class="un-read-news">{{tableData.length}}</b>
					</span>
					<span class="readed" @click="readed">全部已读</span>
				</div>
					<!-- tableData -->
						<el-table
						 :data="tableData"
						 height="200"
						 border
						 class="new-table"
						 style="width:100%">
						 <el-table-column
							 prop="message"
							 :show-overflow-tooltip="true"
							 width="260">
						 </el-table-column>
						 <el-table-column
							 prop="read"
							 label=""
							 width="100"
							 >
							 <template scope="scope">
								 <span :class="{'bgcolor':scope.row.status}"  @click="singled(scope.row.id, scope.row.type, scope.row.fileName, scope.row.index)" class="titles">{{scope.row.read}}</span>
							 </template>
						 </el-table-column>
					 </el-table>
			</el-popover>
			<el-button v-popover:popover style="background:#ffffff" @click="newsList" class="ling">
				<i class="icon iconfont table-icon news" style="color:#FB642A;marginRight:50px;">&#xea14;<span class="new-num">{{tableData.length}}</span></i>
			</el-button>
		</div>
	</div>
</template>
<script type="text/javascript">
import Vue from 'vue'
// import 'common/sass/module/workbench.scss'
import model from 'common/api/voucherTemplate'
import authorityService from 'common/api/service/authorityService'
import dispatch from 'module/member/service/dispatch'
// import list from 'module/workbench/list'
import accessControl from 'common/javascript/tools/accessControl.js'
import headerApi from 'common/api/components/header.js'
import dateTools from 'common/javascript/tools/dateTools'
import config from 'common/config/config'
// import accountService from ''
import {
  Badge
} from 'element-ui'
Vue.use(Badge)

let timer = null
export default {
  name: 'nav',
  data () {
    return {
      currentCompany: {
      },
      tableData: [],
      lengths: 0
    }
  },
  beforeMount () {
    this.$http.get('/service/company/current', response => {
      // 数据模型处理
      let result = model[response.config.url](response, self)
      if (result.success === false) {
        throw new Error('获取当前企业失败！')
      }
      this.currentCompany = result.data
      this.currentCompany.name = result.data.name
      this.currentCompany.bankCard = this.currentCompany.subAccount
      sessionStorage.setItem('currentCompany', result.data.name)
      // 初始化当前企业信息
      this.$bus.currentCompany = result.data
      const me = this
      setTimeout(function () {
        me.$bus.$emit('info-init', result.data)
      }, 2000)
    })
  },
  mounted () {
    this.$bus.$on('newUpdata', info => {
      this.newsList()
    })
    this.$bus.$on('newAdd', info => {
      this.newsList()
    })
    this.detailAccess = accessControl.checkAccess('/user/real-name')
    this.newsNotice()
  },
  beforeDestroy () {
    timer && clearInterval(timer)
  },
  methods: {
    logout () {
      authorityService.logout.remote({}, () => {
        dispatch.logout()
      })
    },
    toRealInfo () {
      dispatch.toRealInfo()
    },
    // 30秒请求一次
    newsNotice () {
      this.newsList()
      if (config.messageOn) {
        timer = setInterval(() => {
          headerApi.longhold.remote((result) => {
            if (result.data.length !== 0) {
              this.newsList()
            }
          })
        }, 30000)
      }
    },
    newsList () {
      headerApi.querylist.remote((result) => {
        this.tableData = result.data || []
        result.data.map((item, i) => { // 组合
          // 判断
          if (item.type === 700103) {
            let newJson = JSON.parse(item.extend)
            this.tableData[i].message = newJson.fundingName + '审批的' + newJson.creditNo + '授信内容变更，请确认'
            this.tableData[i].id = item.id
            this.tableData[i].type = item.type
          } else if (item.type === 700102) {
            let newJson = JSON.parse(item.extend)
            newJson.createTime = dateTools.dateFormater(newJson.createTime, 'YYYY.MM.DD HH:mm:ss')
            this.tableData[i].message = newJson.supplyerName + '使用' + newJson.voucherNo + '凭证申请转让' + newJson.transferAmount + '元'
            this.tableData[i].id = item.id
            this.tableData[i].type = item.type
            this.tableData[i].time = newJson.createTime
          } else if (item.type === 700101) {
            let newJson = JSON.parse(item.extend)
            newJson.createTime = dateTools.dateFormater(newJson.createTime, 'YYYY.MM.DD HH:mm:ss')
            newJson.financeAmount = newJson.financeAmount / 100
            this.tableData[i].message = newJson.supplyerName + '使用' + newJson.voucherNo + '凭证申请融资' + newJson.financeAmount + '元'
            this.tableData[i].id = item.id
            this.tableData[i].type = item.type
            this.tableData[i].time = newJson.createTime
          }
          this.tableData[i].read = '标为已读'
        })
        localStorage.setItem('newsData', JSON.stringify(this.tableData))
        this.$bus.$emit('new-updata', this.tableData)
      })
    },
      // 点击全部已读
    readed () {
      // this.tableData = []
      headerApi.readall.remote((result) => {
        if (result.data) {
          this.tableData = []
          this.$bus.$emit('new-updata', this.tableData)
          this.$bus.$emit('uplist', '1111')
          localStorage.setItem('newsData', JSON.stringify(''))
        }
      })
    },
    singled (id, type, fileName, index) {
      let param = {
        id: id
      }
      headerApi.read.remote(param, (result) => {
        if (result.data) {
          this.newsList()
          this.$bus.$emit('new-updata', this.tableData)
          this.$bus.$emit('uplist', '1111')
          localStorage.setItem('newsData', JSON.stringify(''))
        }
      })
    }
  }
}
</script>
<style scoped="scoped">
/* .ling {
  border: none;
  padding-top: 5px;
  padding-bottom: 10px;
  position: absolute;
  right: 65px;
  top: 10px;
} */
/* .ling .news {
  font-size: 25px;
  position: relative;
  border:none;
} */
/* .new-num {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #FB642A;
  border-radius: 100%;
  color: #FFFFFF;
  position: absolute;
  font-size: 10px;
  line-height: 13px;
  top: 2px;
  right: -2px;
} */
/* // 消息通知-列表 */
.un-read {
  display: inline-block;
  width: 160px;
  height: 50px;
  float: left;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}
.un-read-news {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #fc5a1f;
  color: #fff;
  border-radius: 100%;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
}
.readed {
  display:inline-block;
  width:160px;
  height:50px;
  float:right;
  text-align:center;
  line-height:50px;
  font-size: 12px;
  color: #FC5A1F;
  cursor:pointer;
}
/* .new-table {
  font-size: 14px;
  color: #222222;
}
.new-table thead {
  display: none;
} */
.titles {
  cursor:pointer;
  color: #FB642A;
}
.time {
  color: #999;
  font-size: 14px;
  margin-left: 20px;
}
/* #readNew {
  cursor: default;
} */
.bgcolor{
  font-size: 14px;
  color: #666666;
  /* background: red; */
}
</style>
