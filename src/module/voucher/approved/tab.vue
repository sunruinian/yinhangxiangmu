<template>
  <div class="content-area" >

    <div v-title='title'>{{title}}</div>
    <el-tabs v-model="tab.activeName" @tab-click="tabHandleClick">
      <el-tab-pane label="审批通过" name="first" v-if="approvedPassAccess"></el-tab-pane>
      <el-tab-pane label="审批退回" name="second" v-if="approvedBouncedAccess"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script type="text/javascript">
// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/main.scss'
import 'common/sass/module/account.scss'
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
import accessControl from 'common/javascript/tools/accessControl.js'

export default {
  name: 'app',
  components: {
    modal: modal,
    layout
  },
  data () {
    return {
      title: '已审批列表',
      tab: {
        activeName: 'first'
      },
      dialogFormVisible: false,
      approvedPassAccess: false,
      approvedBouncedAccess: false
    }
  },
  mounted () {
    // 页面刷新tab激活状态改变
    let url = location.href.toString().split('/')
    if (url[url.length - 1] === 'bounced') {
      this.tab.activeName = 'second'
    } else {
      this.tab.activeName = 'first'
    }
    this.approvedPassAccess = accessControl.checkAccess('/voucher/approved/pass')
    this.approvedBouncedAccess = accessControl.checkAccess('/voucher/approved/bounced')
  },
  methods: {
    tabHandleClick (item) {
      let url = ''
      if (item.name === 'first') {
        url = '#/voucher/approved/pass'
      } else if (item.name === 'second') {
        url = '#/voucher/approved/bounced'
      }
      this.activeName = item.name
      this.title = item.label
      document.title = item.label
      location.href = url
    }
  },
  watch: {
    '$route' (to, from) {
      // 页面刷新tab激活状态改变 cl*/
      let url = location.href.toString().split('/')
      if (url[url.length - 1] === 'bounced') {
        this.tab.activeName = 'second'
      } else {
        this.tab.activeName = 'first'
      }
    }
  }
}
</script>
