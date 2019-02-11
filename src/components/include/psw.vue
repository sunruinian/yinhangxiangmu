<!-- 所有页面支付密码弹窗 cl -->
<template>
  <div>
    <el-dialog title="支付密码" size="tiny" :visible.sync="show" :before-close="cancle" :close-on-click-modal="false" >
      <div style="padding-bottom: 10px" v-if='errorShow'>
        <span class="iconfont icon-iconset0144" style="color:#FFCC00"></span>支 付密码错误，请重新输入
      </div>
      <el-input v-if='!pswShow' v-model="password" type='password' auto-complete="off" placeholder="请输入支付密码"></el-input>
      <!-- 密码加密控件容器 -->
      <span v-if='pswShow' style="margin-left: 40px;">
        <span id="PPP">
           <input type='hidden' name='encryptedpassword'  value='' placeholder="请输入账号密码">
        </span>
        <span id="EEE"></span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button class="countVoucher" @click="cancle">取 消</el-button>
        <el-button id="addVoucher" class="addVoucher" @click="sure">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog title="系统提示" size="tiny" :visible.sync="show" v-if='index === 2' :before-close="cancle" :close-on-click-modal="false">
      <el-input v-if='!pswShow' v-model="password" type='password' placeholder="请输入支付密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import Axios from 'axios'
import CFCATools from 'common/javascript/features/cfca'
import config from 'common/config/config'
import PSWTools from 'common/javascript/features/psw.js'

export default {
  name: 'psw',
  props: {
    payInfo: null
  },
  data () {
    return {
      password: '',
      // index: 0,
      show: true,
      url: null,
      method: null,
      params: null,
      href: null,
      errorShow: false,
      pswShow: localStorage.type === config.project[1]
    }
  },
  mounted () {
    if (this.pswShow) {
      this.$nextTick(() => {
        // 生成密码加密控件容器
        var content = PSWTools.PEWritePassObject()
        var span = document.getElementById('PPP')
        span.innerHTML += content
      })
    }
    this.url = this.payInfo[0]
    this.method = this.payInfo[1]
    this.params = this.payInfo[2]
    this.href = this.payInfo[3]
    this.password = ''
  },
  methods: {
    sure () {
      // let loading = this.$loading.service({
      //   fullscreen: true
      // })
      let url = this.url
      let word = null
      if (this.pswShow) {
        // 密码用贵阳的加密控件加密
        var powerpass = document.getElementById('powerpass')
        word = PSWTools.getSM2IBSPassword(powerpass, localStorage.getItem('pubKey'))
      } else {
        word = '{"txPsw":"' + encodeURIComponent(this.$jsEncrypt.encrypt(this.password)) + '","pubKey":"' + encodeURIComponent(localStorage.getItem('pubKey')) + '"}'
      }

      Axios.defaults.headers.common['tx-psw'] = word
      Axios[this.method](url, this.params)
      .then(response => {
        // loading.close()
        this.$delete(Axios.defaults.headers.common, 'tx-psw')
        this.complete(response)
      })
    },
    complete (response) {
      if (response.data.error) {
        if (response.data.error.errorCode === 1992) { // 密码错误
          // this.index = 2
          this.errorShow = true
          this.password = ''
        } else {
          this.errorShow = false
          this.$message.error(response.data.error.errorMessage)
          this.cancle()
        }
      } else if (response.data.data.blob) {
        this.$emit('dialog', false)
        setTimeout(() => {
          // CFCATools.selectCert()
          CFCATools.selectCert('', '', '', false)
          let param = {}
          param.hash = response.data.data.hash
          param.sign = response.data.data.blob
          if (response.data.data.vouNo) {
            param.vouNo = response.data.data.vouNo
          }
          param.sign = CFCATools.defaultSign(param.sign)
          // if (typeof param.blob === 'string') {
          // } else {
          //   param.sign = CFCATools.defaultSign(JSON.stringify(param.sign))
          // }
          this.dealSign(response, param) // 其他接口签名
        }, 10)
      } else if (response.data.transactionNo) {
        this.$emit('dialog', false)
        setTimeout(() => {
          // CFCATools.selectCert()
          CFCATools.selectCert('', '', '', false)
          Axios.defaults.headers.common['tx_no'] = response.data.transactionNo
          this.dealSign(response, response.data.transactionNo) // 付款接口签名
        }, 10)
      } else {
        this.success()
      }
    },
    dealSign (response, param) { // 处理签名
      let loading = this.$loading.service({
        fullscreen: true
      })
      // Axios.defaults.headers.common['tx-psw'] = this.password
      let url = this.url + '/transaction/submit'

      Axios[this.method](url, param)
      .then(response => {
        loading.close()
        if (response.data.success) {
          this.success()
        } else {
          this.$message.error(response.data.error.errorMessage)
          this.cancle()
        }
      })
      this.$delete(Axios.defaults.headers.common, 'sign')
      // this.$delete(Axios.defaults.headers.common, 'tx-psw')
      Axios.defaults.headers.common.hash && this.$delete(Axios.defaults.headers.common, 'hash')
      Axios.defaults.headers.common.tx_no && this.$delete(Axios.defaults.headers.common, 'tx_no')
    },
    success () {
      this.$emit('dialog', false)
      this.$delete(Axios.defaults.headers.common, 'tx-psw')
      this.password = ''
      let ref = this.href.split('#')[1].split('/')[1]
      if (ref === 'supplier') {
        location.href = '#/assistant/supplier/success?content=操作完成！'
      } else if (ref === 'finance') {
        location.href = '#/assistant/finance/success?content=操作完成！'
      } else {
        location.href = '#/assistant/success?content=操作完成！'
      }
    },
    cancle () {
      this.$delete(Axios.defaults.headers.common, 'tx-psw')
      this.$emit('dialog', false)
    }
  }
}
</script>

<style>
#addVoucher:hover{
  color: #fff;
}
</style>
