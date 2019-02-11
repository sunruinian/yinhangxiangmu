<template>
  <el-row class="content-m" style="height:100%;">
    <el-col :span="24" style="height:100%;">
      <el-row  class='register' style="">
        <el-row>
          <el-col>
            <slot name="header"></slot>
          </el-col>
        </el-row>
        <!-- left end-->
        <!-- right start-->
        <div>
          <el-col :span="4" class = 'left-content'  ref="left" v-bind:style="{  height: height + 'px' }">
            <slot name="left" ></slot>
          </el-col>
        </div>
        <el-col :span="20" ref="right">
          <el-row>
            <el-col :span="24">
              <div style="background:#fff; margin:20px 19px 0px;height:52px;color:#999999; border-bottom:1px solid #DFDFDF">
                <span style="line-height:52px;margin-left:19px; width: 85px; display: inline-block; float: left;">当前位置：</span>
                <el-breadcrumb class="app-levelbar" separator="/" >
                  <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" style="margin-top: 20px;">
                    <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.name}}</span>
                    <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              <slot name="body">
              </slot>
            </el-col>
          </el-row>
          <!-- <slot name="body">
          </slot> -->
        </el-col>
        <!-- right end-->
      </el-row>
      <!--top end -->

      <!-- footer start-->
      <el-row  style="bottom:2px;height:36px;width:100%;">
        <el-col :span="24">
          <slot name="footer"></slot>
        </el-col>
      </el-row>
      <!-- footer start-->
    </el-col>
  </el-row>
</template>

<script type="text/javascript">
import Vue from 'vue'
import {
  Row,
  Col
} from 'element-ui'
Vue.use(Row)
Vue.use(Col)
import accessControl from 'common/javascript/tools/accessControl.js'
import routerOption from 'router/index.js'

const footHeight = 36
export default {
  name: 'app',
  props: {
    title: {
      type: String,
      'default': '布盟科技'
    }
  },
  data () {
    return {
      toupdate: true,
      height: document.body.scrollHeight - footHeight
    }
  },
  mounted () {
    this.router = this.getRouterByRouterJs(routerOption.options.routes, '')
    this.topMenu = this.getTopMenu()
    this.getBreadcrumb()
   // this.initUrl()
    // 关于页面缩放的触发时间
    const that = this
    let right = this.$refs.right.$el
    let left = this.$refs.left.$children[0].$el
    this.$bus.$on('left-resize', () => {
      let rightHeight = right.getBoundingClientRect().height
      let leftHeight = left.getBoundingClientRect().height
      let height = rightHeight > leftHeight ? rightHeight : leftHeight
      let scrollHeight = document.body.clientHeight - footHeight
      height = scrollHeight >= height ? scrollHeight : height
      if (height !== that.height) {
        that.height = height
      }
    })
    this.$bus.$on('isscroll', (isScrollHeight) => {
      // console.log(isScrollHeight)
      this.height = isScrollHeight
    })

    window.onresize = function () {
      let right = that.$refs.right.$el
      let left = that.$refs.left.$children[0].$el
      let rightHeight = right.getBoundingClientRect().height
      let leftHeight = left.getBoundingClientRect().height
      let height = rightHeight > leftHeight ? rightHeight : leftHeight
      let scrollHeight = document.body.clientHeight - footHeight
      height = scrollHeight >= height ? scrollHeight : height
      if (height !== that.height) {
        that.height = height
      }
    }
  },

  updated () {
    const that = this
    let right = that.$refs.right.$el
    let left = that.$refs.left.$children[0].$el
    let rightHeight = right.getBoundingClientRect().height
    let leftHeight = left.getBoundingClientRect().height
    let height = rightHeight > leftHeight ? rightHeight : leftHeight
    let scrollHeight = document.body.clientHeight - footHeight
    height = scrollHeight >= height ? scrollHeight : height
    if (height !== that.height) {
      that.height = height
    }
  },
  methods: {
    // 根据 router.js 拿到路由信息（不含顶级菜单的路由信息）
    getRouterByRouterJs (routes, prefix) {
      var arr = []
      for (var i = 0; i < routes.length; i++) {
        if (routes[i].path === '') {
          if (routes[i].children) {
            arr = arr.concat(this.getRouterByRouterJs(routes[i].children, prefix))
          }
          continue
        }
        var obj = {name: routes[i].name, path: null, redirect: routes[i].redirect}
        obj.path = prefix + (routes[i].path.indexOf('/') === 0 ? routes[i].path : '/' + routes[i].path)
        arr.push(obj)
        if (routes[i].children) {
          arr = arr.concat(this.getRouterByRouterJs(routes[i].children, obj.path))
        }
      }
      return arr
    },
     // 获取顶级菜单
    getTopMenu () {
      var i = 0
      var j = 0
      var access = accessControl.getAllAccess()
      var topMenu = []
      for (i = 0; i < access.length; i++) {
        if (access[i].parentCode === '0') {
          topMenu.push(access[i])
        }
      }

      var url = ''
      for (i = 0; i < topMenu.length; i++) {
        for (j = 0; j < access.length; j++) {
          if (topMenu[i].code === access[j].parentCode) {
            url = access[j].url
            topMenu[i].url = url
            topMenu[i].path = '/' + url.split('/')[1]
            break
          }
        }
      }
      return topMenu
    },
    // 面包屑
    getBreadcrumb () {
      // 根据 url 拆分出面包屑元素
      var i = 0
      var j = 0
      var tmpStr = ''
      var tmpArr = this.$route.path.split('/')
      var breadCrumbArr = []

      for (i = 0; i < tmpArr.length; i++) {
        if (tmpArr[i] !== '') {
          tmpStr += '/' + tmpArr[i]
          breadCrumbArr.push(tmpStr)
        }
      }
      // 组装面包屑
      this.levelList = []
      var router = this.router.concat(this.topMenu)

      for (i = 0; i < breadCrumbArr.length; i++) {
        for (j = 0; j < router.length; j++) {
          if (breadCrumbArr[i] === router[j].path) {
            var obj = {name: router[j].name, path: router[j].path, url: router[j].url, redirect: router[j].redirect}
            this.levelList.push(obj)
            break
          }
        }
      }
      if (this.levelList.length > 0 && this.levelList[0].url) {
        this.levelList[0].path = this.levelList[0].url
      }

      /** 临时性解决：
      * 供应商有流转管理、凭证管理时，凭证查询的面包屑为 [流转管理/凭证查询] 的 bug
      * TODO
      **/
      // if (this.$route.path === '/voucher/search') {
      //   this.levelList[0].name = '凭证管理'
      //   this.levelList[0].path = '/voucher/search'
      // }
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    //  this.initUrl()
    },
    height (val) {
      if (!this.timer) {
        this.height = val
        this.timer = true
        let that = this
        setTimeout(function () {
          that.timer = false
        }, 400)
      }
    }
  }
}
</script>
