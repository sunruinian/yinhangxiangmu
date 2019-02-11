<template>
    <div  class="content-area" style="background:#FFFFFF">
        <div v-title='title'>{{title}}</div>
      <!-- 步骤条 -->
      <div class="content-body">
        <div class="boxStep" v-if='userStatus !== "INIT"'>
          <el-row :gutter="16">
            <el-col :span="14" :offset="6">
              <el-steps class="steps-admin" :active="active" align-center style="width:476px">
                <el-step title="基本信息录入" style="width:455px"></el-step>
                <!-- <el-step title="关联证书" style="width:455px"></el-step> -->
                <el-step title="权限配置"></el-step>
              </el-steps>
            </el-col>
          </el-row>
          <div class="realname-body">
            <adduser></adduser>
            <certificate :username='username' :certId='certId' v-if="active === 2"></certificate>
            <permissionconfig :certId='certId' v-if="active === 3"></permissionconfig>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
// import 'common/sass/reset.scss'
// import 'common/css/lib/iconfont.css'
// import 'common/sass/layout.scss'
// import 'common/sass/component/component.scss'
import 'common/sass/module/steps.scss'
// import 'common/sass/module/member0.scss'
// import 'common/sass/module/employee.scss'
// import 'common/css/lib/iconfont.js'
import adduser from 'module/employeemanagement/addemployee/adduser' // 添加用户
// import certificate from 'module/employeemanagement/addemployee/certificate' // 关联证书
// import permissionconfig from 'module/employeemanagement/addemployee/permissionconfig' // 权限配置
export default {
  name: 'app',
  components: {
    adduser // 添加员工
    // certificate, // 关联证书
    // permissionconfig // 权限配置
  },
  data () {
    return {
      title: '添加员工',
      step: 10,
      role: 0,
      username: {
        name: 3333
      },
      certId: {
        id: 0
      },
      msg: {
      },
      active: 1
    }
  },
  created () {
    if (this.$route.query.step) { // 获取地址栏参数step 得到添加员工的步骤
      this.active = Number(this.$route.query.step)
    }
  },
  mounted () {
    // this.$bus.$on('add-user', info => { // 添加用户
    //   this.active = info
    // })
    // this.$bus.$on('prev-btn', info => { // 关联证书的上一步
    //   this.active = info
    // })
    // this.$bus.$on('next-btn', info => { // 关联证书的下一步
    //   this.active = info
    // })
    // this.$bus.$on('prev-btn', info => { // 权限配置的上一步
    //   this.active = info
    // })
  },
  methods: {
  }
  // watch: {
  //   '$route' (to, from) {
  //     if (to.fullPath === '/employeemanagement/addemployee') {
  //       this.active = 1
  //     }
  //   }
  // }
}
</script>
<style scoped="scoped">
  .boxStep{
    background: #fff;
    width: 80%;
    margin: 0 auto;
  }
  .el-col{
    padding-top: 30px;
  }
</style>
