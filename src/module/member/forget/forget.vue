<template>
  <div class="content-m">
      <div v-title='title'>{{title}}</div>
      <vnav></vnav>
      <div class="group b-reg">
          <div class="wrap">
            <div class="setp-box">
                <div class="stepInfo">
                    <el-row>
                      <el-col>
                        <el-steps :space="230" :active="active.step" :align-center="true">
                          <el-step title="账号及证书验证"></el-step>
                          <el-step title="重置密码"></el-step>
                          <el-step title="完成"></el-step>
                        </el-steps>
                      </el-col>
                    </el-row>
                </div>
            </div>
            <validate v-if="active.step === 1" :active='active'></validate>
            <reset v-if="active.step === 2" :active='active'></reset>
            <done v-if="active.step === 3" :active='active'></done>
          </div>
      </div>
      <vfooter></vfooter>
  </div>
</template>

<script>

// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/module/index.scss'
import 'common/sass/module/account.scss'
import 'common/sass/module/steps.scss'
import 'common/sass/module/member.scss'
import vnav from 'components/include/real-nav'
import left from 'components/include/left'
import vfooter from 'components/include/footer'
import validate from 'module/member/forget/validate'
import reset from 'module/member/forget/reset'
import done from 'module/member/forget/done'

export default {
  name: 'app',
  components: {
    vnav,
    left,
    vfooter,
    validate,
    reset,
    done
  },
  data () {
    return {
      title: '忘记密码',
      active: {
        step: 1,
        nonce: null,
        pubKey: null
      }
    }
  },
  mounted () {

  },
  methods: {
  }
}

</script>
