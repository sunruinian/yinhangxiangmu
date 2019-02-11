<template>
  <div class="yn-message" :style="{display: message.show ? 'block' : 'none'}">
    <i :class="['iconfont', message.icon]"></i>
    <p class="msg">{{message.msg}}</p>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'yn-message',
  props: {
    message: {
      type: Object,
      default: {
        type: 'success',
        icon: '',
        msg: '出错了',
        show: true,
        time: 5000
      }
    }
  },
  data () {
    return {
    }
  },
  beforeMount () {
    this.message.type = this.message.type || 'success'
    this.message.icon = this.message.icon || 'icon-flash-success'
    this.message.msg = this.message.msg || '成功！'
    this.message.show = this.message.show || true
    this.message.time = this.message.time || 5000
    this.close()
  },
  updated () {
    this.message.type = this.message.type || 'success'
    this.message.icon = this.message.icon || 'icon-flash-success'
    this.message.msg = this.message.msg || '成功！'
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
