<!-- 核心企业-基础信息 *cl -->
<template>
  <div class="content-area" >
    <div v-title='title'>
      {{title}}
    </div>
      <div class="group">
          <div class="span12 path-nav ">
              <ol>
                  <li><a href="#">客户管理</a></li>>
                  <li><a href="#"><strong>{{title}}</strong></a></li>
              </ol>
          </div>
      </div>
      <div class="content-body">
          <div class="tab-bar " style="padding:20px 5px;" >
            <span class="span-wrap">
              <span
              class="tab-button"
              v-for="(item, index) in tabsData"
              v-if='item.access'
              :index = "index"
              v-bind:class="item.selected ? 'active':''"
              @click="tabChange(index)"
              >
              {{item.name}}
              </span>
            </span>
          </div>
      </div>
      <div style="overflow:hidden;background:#fff;" v-if ="tabsData[0].access" v-show='tabsData[0].selected'>
         <baseInfo :tabShow='tabsData[0].selected'></baseInfo>
      </div>
      <div  v-if ="tabsData[1].access" v-show='tabsData[1].selected' style="background:#fff;overflow: hidden;padding:0px 10px 20px 10px;">
         <realName :tabShow='tabsData[1].selected'></realName>
      </div>
  </div>

</template>

<script type="text/javascript">

// import 'common/css/lib/iconfont.css'
// import 'common/css/lib/motherplate.css'
import 'common/sass/module/regular.scss'
import 'common/sass/module/account.scss'
import 'common/sass/module/table.scss'
import cvoucher from 'components/entries/common/voucher'
import baseInfo from 'module/customer/f-core-enterprise/detail-tab/baseInfo'
import realName from 'module/customer/f-core-enterprise/detail-tab/realName'
import accessControl from 'common/javascript/tools/accessControl.js'

export default {
  name: 'app',
  components: {
    cvoucher: cvoucher,
    baseInfo,
    realName
  },
  data () {
    return {
      title: '基础信息',
      form: {
        name: '',
        value: ''
      },
      tabsData: [
        {name: '账号信息', selected: true, access: false},
        {name: '实名信息', selected: false, access: false}
      ],
      id: null
    }
  },
  mounted () {
    this.tabsData[0].access = accessControl.checkAccess('/customer/f-core-enterprise/detail/account')
    this.tabsData[0].selected = this.tabsData[0].access // 激活还是不激活与权限一致，无权限：不激活；有权限：激活
    this.tabsData[1].access = accessControl.checkAccess('/customer/f-core-enterprise/detail/realname')
    this.tabsData[1].selected = this.tabsData[1].access ? !this.tabsData[0].selected : this.tabsData[1].access // 无权限：不激活；有权限：第1个tab未激活才激活
  },
  methods: {
    tabChange: function (index) {
      this.tabsData.forEach(function (item) {
        item.selected = false
      })
      this.$bus.$emit('voucher-refurbish', this.detail)
      this.tabsData[index].selected = true
    }
  }
}

</script>
