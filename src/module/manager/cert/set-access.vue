<template>
  <div class="content-area">
    <div class="info-manage">
      <!-- 选中时：父、子均选
      取消选中：父不管，子全取消 -->
        <div class="item-group" v-if="accessFlag">
          <div class="item-tit"><span class="item-tit-icon"></span>设置权限</div>
          <div class="item-cnt">
            <el-tree
            :data="accessTree"
            show-checkbox
            ref="tree"
            node-key="code"
            :default-checked-keys="defaultChecked"
            :default-expand-all="true"
            :check-strictly="true"
            @check-change="change"
            :props="defaultProps"
            @node-click="handleNodeClick">
            </el-tree>
          </div>
        </div>
        <div class="tc" v-if="accessFlag">
          <el-button class="button-bubi-theme center-ie9" size="small" type="primary" @click="saveAccess">保存</el-button>
        </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
import arrayTools from 'common/javascript/tools/arrayTools.js'
import accessControl from 'common/javascript/tools/accessControl.js'
import accessControlService from 'common/api/service/accessControlService'
// import resourceSort from 'common/config/resource'

export default {
  name: 'app',
  components: {
    modal: modal,
    layout
  },
  data () {
    return {
      title: '设置权限',
      accessFlag: false,
      accessTree: [],
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      flag: true
    }
  },
  mounted () {
    this.certId = this.$route.query.id
    this.getAccessByCertId()
  },
  methods: {
    handleNodeClick (data) {
    },
    saveAccess () {
      var hashChild = false
      var keys = this.$refs.tree.getCheckedKeys()
      var resource = accessControl.getAllAccess()
      var children = []
      for (var i = 0; i < keys.length; i++) {
        for (var j = 0; j < resource.length; j++) {
          if (keys[i] === resource[j].code && resource[j].childrenSelect === 1) {
            children = accessControl.getChildrenId(keys[i])
            hashChild = false
            for (var k = 0; k < children.length; k++) {
              if (arrayTools.contains(keys, children[k])) {
                hashChild = true
              }
            }
            if (!hashChild) {
              this.$message.error('请为 ' + resource[j].name + ' 配置子权限')
              return false
            }
          }
        }
      }
      var data = {
        'certId': this.certId,
        'privilegeCodes': keys
      }
      accessControlService.save.remote(data, (res) => {
        if (res.success) {
          this.$message.success('成功')
        } else if (res.error.errorCode) {
          this.$message.error('请设置权限')
        } else {
          this.$message.error(res.error.errorMessage)
        }
      })
    },
    getAccessByCertId () {
      accessControlService.getAccessByCertId.remote({id: this.certId}, (res) => {
        if (res.success) {
          this.accessTree = res.data.privilegeTrees // this.privilegesSort(res.data.privilegeTrees)
          this.defaultChecked = res.data.codeChecked
          this.accessFlag = true
        }
      })
    },
    setCheckedKeys (addId, detId) {
      var keys = this.$refs.tree.getCheckedKeys()
      // 往keys添加权限
      for (var i = 0; i < addId.length; i++) {
        if (keys.indexOf(addId[i]) === -1) {
          keys.push(addId[i])
        }
      }
      // 从keys移除权限
      for (var j = 0; j < detId.length; j++) {
        if (arrayTools.contains(keys, detId[j] + '')) {
          arrayTools.remove(keys, detId[j] + '')
        }
      }
      var self = this
      this.$refs.tree.setCheckedKeys(keys)
      setTimeout(function () {
        self.flag = true
      }, 50)
    },
    change (data, checked, indeterminate) {
      if (this.flag) {
        this.flag = false
        var pId = []
        var childId = []
        var addId = []
        var detId = []
        if (checked === true) {
          // 添加权限：父权限+子权限
          pId = accessControl.getParentId(data.code)
          childId = accessControl.getChildrenId(data.code)
          addId = pId.concat(childId)
        } else {
          // 删除权限：本身+子权限
          detId = accessControl.getChildrenId(data.code)
        }
        for (var i = 0; i < addId.length; i++) {
          addId[i] = addId[i]
        }
        for (i = 0; i < detId.length; i++) {
          detId[i] = detId[i]
        }
        this.setCheckedKeys(addId, detId)
      }
    }
  }
}
</script>
<style media="screen" scoped>
  .button-bubi-theme.center-ie9:hover{
    background-color: #FB642A;
    border: 1px solid #FB642A;
  }
</style>
