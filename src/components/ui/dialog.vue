 <template>
  <div class="mask" :style="{display: visible ? 'block' : 'none'}">
    <div class="dialog">
      <div class="dialog-heading">
        <h3 class="dialog-title">{{title}}</h3>
        <i class="iconfont icon-delete" @click="close"></i>
      </div>
      <div class="dialog-body">
        <slot></slot>
      </div>
      <div class="dialog-footer">
        <slot name="footer"></slot>
        <!-- <el-button class="button-close">关闭</el-button> -->
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'messageBox',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.visible
    }
  },
  methods: {
    close () {
      this.visible = false
    }
  },
  watch: {
    visible (val) {
      this.$emit('update:visible', val)
    }
  }
}

</script>
