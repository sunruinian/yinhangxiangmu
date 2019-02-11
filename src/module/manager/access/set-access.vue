<template>
  <div class="content-area access-set">
    <el-button class="button-bubi-theme center-ie9 save-btn" size="small" type="primary" @click="saveAccess">保存</el-button>
    <div class="info-manage">
      <!-- 选中时：父、子均选
      取消选中：父不管，子全取消 -->
      <el-form id="formId" :model="formField" :rules="rules" ref="formField"  :inline="false"  class="unite-form"  action="" label-width="150px" >
        <el-form-item label="业务类型" prop='role'>
          <el-select v-model="formField.role" placeholder="请选择业务类型" @change="selectRole">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设置权限" prop='access'>
          <el-tree
          :data="accessTree"
          show-checkbox
          ref="tree"
          node-key="code"
          :default-checked-keys="defaultChecked"
          :props="defaultProps"
          v-model="formField.access"
          @check-change="selectAccess">
          </el-tree>
        </el-form-item>


      </el-form>
    </div>
  </div>
</template>
<script type="text/javascript">
import 'common/sass/module/access.scss'
import modal from 'components/entries/modal'
import layout from 'components/include/layout-l-r'
import arrayTools from 'common/javascript/tools/arrayTools.js'
import accessService from 'common/api/service/accessService'

export default {
  name: 'app',
  components: {
    modal: modal,
    layout
  },
  data () {
    return {
      title: '设置权限',
      formField: {
        role: null,
        access: null
      },
      accessTree: [],
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      flag: true,
      options: [],
      code: '',
      rules: {
        role: [
          {required: true, message: '必须选择', trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.getRoleList()
    this.getAccessTree()
  },
  methods: {
    // 获取权限树
    getAccessTree () {
      accessService.getPrivilegeTree.remote({}, result => {
        if (result.success) {
          this.accessArr = result.data
          this.accessTree = result.data.children
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },
    // 选择角色
    selectRole (value) {
      let obj = this.options.find((item) => {
        return item.value === value
      })
      this.code = obj.key
      this.getAccessByRoleCode()
    },

    // 获取角色列表
    getRoleList () {
      accessService.roleList.remote({}, result => {
        if (result.success) {
          for (var i = 0; i < result.data.length; i++) {
            this.options.push({value: result.data[i].name, lable: result.data[i].name, key: result.data[i].code})
          }
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },

    // 获取角色已有的权限
    getAccessByRoleCode () {
      accessService.getAccessByRoleCode.remote({code: this.code}, (res) => {
        if (res.success) {
          var arr = []
          let data = res.data
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data.length; j++) {
              if (i !== j && data[i].indexOf(data[j]) === 0) {
                arr.push(data[j])
              }
            }
          }
          for (i = 0; i < data.length; i++) {
            for (j = 0; j < arr.length; j++) {
              if (data[i] === arr[j]) {
                data.splice(i, 1)
                i--
              }
            }
          }
          this.$refs.tree.setCheckedKeys(data)
        }
      })
    },

    // 保存
    saveAccess () {
      var keys = this.$refs.tree.getCheckedKeys()
      var data = {
        'roleCode': this.code,
        'privilegeCodes': keys
      }
      accessService.updateRoleAccess.remote(data, (res) => {
        if (res.success) {
          this.$message.success('保存成功')
        } else if (res.error.errorCode) {
          this.$message.error('请设置权限')
        } else {
          this.$message.error(res.error.errorMessage)
        }
      })
    },

    // 设置选择项
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

    // 选择权限
    selectAccess (data, checked, indeterminate) {
      if (this.flag) {
        this.flag = false
        var pId = []
        var childId = []
        var addId = []
        var detId = []
        if (checked === true) {
          // 添加权限：父权限+子权限
          pId = this.getParentId(data.code)
          childId = this.getChildrenId(data.code)
          addId = pId.concat(childId)
        } else {
          // 删除权限：本身+子权限
          detId = this.getChildrenId(data.code)
        }
        for (var i = 0; i < addId.length; i++) {
          addId[i] = addId[i]
        }
        for (i = 0; i < detId.length; i++) {
          detId[i] = detId[i]
        }
        this.setCheckedKeys(addId, detId)
      }
    },

    /**
     * 获得权限树
     * @param{int}parentCode 父Id
     */
    accessTree (parentCode) {
      var tree = []
      var data = this.accessArr
      for (var i = 0; i < data.length; i++) {
        var json = data[i]
        if (json.parentCode === parentCode) {
          var tmp = {code: json.code, label: json.name, url: json.url, children: []}
          tmp.children = this.accessTree(json.code, data)
          tree.push(tmp)
        }
      }
      return tree
    },

    /**
     * 获得父级code
     */
    getParentId (code) {
      var pidArr = []
      var data = this.accessArr
      for (var i = 0; i < data.length; i++) {
        var json = data[i]
        if (json.code === code && json.parentCode !== '0') {
          pidArr.push(json.parentCode)
          var tmpId = this.getParentId(json.parentCode)
          if (tmpId !== []) {
            pidArr = pidArr.concat(tmpId)
          }
        }
      }
      return pidArr
    },

    /**
     * 获得子id
     */
    getChildrenId (code) {
      var cidArr = []
      var data = this.accessArr
      for (var i = 0; i < data.length; i++) {
        var json = data[i]
        if (json.parentCode === code) {
          cidArr.push(json.code)
          var tmpId = this.getChildrenId(json.code)
          if (tmpId !== []) {
            cidArr = cidArr.concat(tmpId)
          }
        }
      }
      return cidArr
    }
  }
}
</script>
<style media="screen">
  .access-set .save-btn:hover{
    background-color: #fb642a;
    border: 1px solid #fb642a;
  }
</style>
