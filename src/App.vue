<template>
  <div id="app" style="overflow: auto;">
    <router-view></router-view>
    <!-- 支付密码弹窗 -->
    <component :is='psw' v-if='show' :payInfo="payInfo" @dialog="logClose"></component>
    <!-- 错误提示弹窗 -->
    <component :is='errorDialog' v-if='errorShow' :errorShow.sync='errorShow' :errorInfo='errorInfo'></component>

    <component :is='messageBox' v-if='ynMessageBoxShow' :messageBox.sync='ynMessageBox' @rightBtnEvent="closeYnMessageBox"></component>

  <ynmessage v-if="ynMessage.show" :message.sync="ynMessage"></ynmessage>

  </div>
</template>

<script>
import 'common/css/lib/iconfont.css'
import 'common/sass/component/component.scss'
import {addResizeListener} from 'common/javascript/tools/resizeEvent'
import {Message} from 'element-ui'
import ynmessage from 'components/ui/message'
import CFCATools from 'common/javascript/features/cfca.js'
import config from 'common/config/config'
// import authorityService from 'common/api/service/authorityService'

export default {
  name: 'app',
  components: {
    ynmessage
  },
  data () {
    return {
      show: false,
      payInfo: [],
      psw: null,
      errorDialog: null,
      errorShow: false,
      errorInfo: {},
      ynMessage: {},
      messageBox: null,
      ynMessageBox: {},
      ynMessageBoxShow: false
    }
  },
  mounted () {
    this.$bus.$on('yn-messageBox', info => {
      require.ensure(['components/ui/messageBox'], () => {
        const messageBox = require('components/ui/messageBox')
        this.messageBox = this.$vue.component('messageBox', messageBox)
        this.ynMessageBox = info
        this.ynMessageBoxShow = true
      }, 'messageBox')
    })
    CFCATools.initCryptoAgent()
    if (localStorage.type === config.project[1]) { // 创建加密控件容器
      var UtilCtrlClsid = 'clsid:69E4A833-B450-41DB-BAF5-4BE0153B9D22'
      this.writeUtilObject('versionObj', UtilCtrlClsid, {'width': 1, 'height': 1})
    }
    // 页面请求错误消息提示
    this.$bus.$on('message-error', info => {
      setTimeout(function () {
        Message({
          showClose: true,
          message: info.message,
          type: 'error'
        })
      }, 10)
    })
    // 有交互错误提示信息弹窗
    this.$bus.$on('dialog-error', info => {
      require.ensure(['components/include/errorDialog'], () => {
        const errorDialog = require('components/include/errorDialog')
        this.errorDialog = this.$vue.component('errorDialog', errorDialog)
        this.errorShow = true
        this.errorInfo.message = info.message
        this.errorInfo.dialogType = 'interaction' // 有交互弹窗
      }, 'errorDialog')
    })
    // 无交互错误提示信息弹窗
    this.$bus.$on('dialog-error-nointeraction', info => {
      require.ensure(['components/include/errorDialog'], () => {
        const errorDialog = require('components/include/errorDialog')
        this.errorDialog = this.$vue.component('errorDialog', errorDialog)
        this.errorShow = true
        this.errorInfo.code = info.message
        this.errorInfo.dialogType = 'no-interaction' // 无交互弹窗
      }, 'errorDialog')
    })
    // 支付密码弹窗
    this.$bus.$on('pay-popup', info => {
      require.ensure(['components/include/psw'], () => {
        const psw = require('components/include/psw')
        this.psw = this.$vue.component('psw', psw)
        this.show = true
        this.payInfo[0] = info.url
        this.payInfo[1] = info.method
        this.payInfo[2] = info.params
        this.payInfo[3] = info.href
      }, 'psw')
    })
  },
  methods: {
    logClose (msg) {
      this.show = msg
    },
    /*eslint-disable */
    writeUtilObject (oid, clsid, cfg) { // 创建加密控件容器
      document.write('<object id="' + oid + '" classid="' + clsid
			+ '" width="' + cfg.width + '" height="' + cfg.height  + '">');
	   for (var name in cfg)
		 document.write('<param name="' + name + '" value="' + cfg[name] + '">');
	    document.write('</object>')
    },
    closeYnMessageBox () {
      this.ynMessageBoxShow = false
    }
  }
}
addResizeListener(document.getElementById('app'), function () {})
</script>
