<!-- 页面错误码弹窗 cl -->
<template>
  <div>
    <!-- 有交互弹窗提示 -->
    <el-dialog title="提示" :visible.sync="show" v-if='dialogType === "interaction"' size="tiny">
      <span>{{errorMessage}}</span>
      <span slot="footer" class="dialog-footer" style="text-align: center;display: block">
         <el-button type="primary" @click="handleClose">好</el-button>
      </span>
    </el-dialog>

    <!-- 无交互弹窗提示 -->
    <el-dialog title="提示" :visible.sync="show" v-if='dialogType === "no-interaction"' :before-close="handleClose" size="tiny">
      <span>{{errorMessage}}</span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'errorDialog',
  props: {
    errorInfo: null
  },
  data () {
    return {
      show: true,
      errorMessage: null,
      dialogType: null // 'interaction'有交互弹窗、'no-interaction'无交互弹窗
    }
  },
  mounted () {
    this.errorMessage = this.errorInfo.message
    this.dialogType = this.errorInfo.dialogType
  },
  methods: {
    handleClose (done) {
      this.$emit('update:errorShow', false)
    }
  }
}
</script>
