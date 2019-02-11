<template>
  <div class="yn-message" :style="{display: message.show ? 'block' : 'none'}">
    <el-dialog
      :visible.sync="message.show"
      size="tiny"
      >
      <h1 style="text-align: center;display: block">已关联完毕</h1>
      <span style="text-align: center;display: block">客户信息可在下游列表查看</span>
      <span slot="footer" class="dialog-footer" style="text-align: center;display: block">
         <el-button type="primary" @click="close">好</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script type="text/javascript">
export default {
  // name: 'yn-message',
  // props: {
  //   message: {
  //     type: Object,
  //     default: {
  //       type: 'success',
  //       icon: '',
  //       // msg: '出错了',
  //       show: true,
  //       time: 5000
  //     }
  //   }
  // },
  props: ['msg'],
  data () {
    return {
      message: {
        show: false,
        time: 5000
      }
    }
  },
  beforeMount () {
    // this.message.type = this.message.type || 'success'
    // this.message.icon = this.message.icon || 'icon-flash-success'
    // this.message.msg = this.message.msg || '成功！'
    this.message.show = this.message.show || false
    this.message.time = this.message.time || 3000
    this.close()
  },
  updated () {
    // this.message.type = this.message.type || 'success'
    // this.message.icon = this.message.icon || 'icon-flash-success'
    // this.message.msg = this.message.msg || '成功！'
  },
  methods: {
    close () {
      let self = this
      setTimeout(function () {
        self.message.show = false
      }, self.message.time)
    }
  },
  watch: {
  }
}
</script>
