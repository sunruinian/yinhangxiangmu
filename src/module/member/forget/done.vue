<template>
  <div class="step5-ccbc">
    <div class="inner-wrap" id='bindDialog' style="text-align:center">
      <div style="display:inline-block"><span class="iconfont icon-success" style="font-size:80px;color:#fb642a;"></span></div>
      <div style="display:inline-block;width:217px">
         <p style="font-size:18px;font-weight:500;color:#333333;">密码设置完成，请重新登录</p>
         <p style="font-size:14px;color:#999999;text-align: left">{{count}}秒后，将跳转至登录页面</p>
      </div>
    </div>
    <div style="text-align:center">
      <el-button type="primary" @click="goLogin">立即去登录</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import dispatch from 'module/member/service/dispatch'
export default {
  name: 'done',
  components: {
  },
  props: ['active'],
  data () {
    return {
      count: null
    }
  },
  mounted () {
    this.showTime()
    console.log('active', this.active)
  },
  methods: {
    goLogin () {
      dispatch.logout()
    },
    showTime () {
      const TIME_COUNT = 3
      this.count = TIME_COUNT
      this.timer = setInterval(() => {
        if (this.count >= 1) {
          this.count--
        }
        if (this.count === 0) {
          clearInterval(this.timer)
          this.goLogin()
        }
      }, 1000)
    }
  }
}

</script>

<style>
#bindDialog .el-form-item__error {
  width: 225px;
  top: 38px;
}
</style>
