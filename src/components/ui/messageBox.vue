<template>
  <div class="mask">
    <div :class="['messageBox', messageBox.msg === '' ? 'min' : '']">
      <div class="messageBox-body">
        <i :class="['iconfont', icon]"></i>
        <h3 class="title">{{messageBox.title}}</h3>
        <p class="msg">{{messageBox.msg}}</p>
      </div>
      <div :class="{'messageBox-footer': true, 'single': messageBox.leftBtn === ''}">
        <el-button v-if="messageBox.leftBtn !== ''" class="button-left" @click="leftBtnEvent">{{messageBox.leftBtn}}</el-button>
        <el-button class="button-right" @click="rightBtnEvent" type="primary">{{messageBox.rightBtn}}</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'messageBox',
  props: {
    messageBox: {
      type: Object,
      default: {
        type: '',
        icon: '',
        title: '',
        msg: '',
        leftBtn: '',
        rightBtn: '',
        show: false
      }
    }
  },
  data () {
    return {
      icon: null
    }
  },
  beforeMount () {
    if (this.messageBox.icon) {
      this.icon = this.messageBox.icon
    } else if (this.messageBox.type === 'success') {
      this.icon = 'icon-msg-success'
    } else if (this.messageBox.type === 'error') {
      this.icon = 'icon-msg-error'
    } else if (this.messageBox.type === 'warn') {
      this.icon = 'icon-msg-warn'
    }
  },
  mounted () {
  },
  methods: {
    leftBtnEvent () {
      this.$emit('leftBtnEvent')
    },
    rightBtnEvent () {
      this.$emit('rightBtnEvent')
    }
  }
}

</script>
<style scoped>
</style>
