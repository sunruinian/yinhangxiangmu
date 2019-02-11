<template>
  <div class="content-area access-index">

    <div class="panel fl access-tree" style="width: 300px; float: left;">
      <div class="panel-heading">
        <h3 class="panel-title">权限资源树</h3>
        <span class="panel-oparator" v-if="!deleteDisabled">删除</span>
        <span class="panel-oparator active" v-if="deleteDisabled" @click="deletePrivilege">删除</span>
        <span class="panel-oparator" v-if="!updateDisabled">修改</span>
        <span class="panel-oparator active" v-if="updateDisabled" @click="handleUpdata">修改</span>
        <span class="panel-oparator" v-if="!addDisabled">新增</span>
        <span class="panel-oparator active" v-if="addDisabled" @click="addResourceEvent">新增</span>
      </div>
      <div class="panel-body">
        <el-tree :data="privilegeTree" node-key="code" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node='false'></el-tree>
      </div>
    </div>

    <div class="panel fl" style="margin-left:20px;">
      <div class="panel-heading">
        <h3 class="panel-title">接口资源</h3>
        <p class="panel-tip">已选择节点：<span class="highlight">{{curNode.name}}</span></p>
        <el-button class="save-btn" type="primary" size="small" :disabled="bindDisabled" @click="saveBindRelation">提交</el-button>
      </div>
      <div class="panel-body">
        <el-transfer style="margin-bottom:20px;"
          filterable
          :titles="['所有接口资源', '拥有的接口资源']"
          :filter-method="filterMethod"
          filter-placeholder="请输入相关内容搜索"
          v-model="usedApiResource"
          :data="apiResource">
        </el-transfer>
      </div>
    </div>

    <messageBox title="权限资源树-新建" v-if="show" :visible.sync="show">
      <el-form :model="formField" ref='formField' :rules="formRules" label-width="100px" style="margin:10px auto 0px;">
        <el-form-item label="编号:" prop="code" >
          <el-input v-model="formField.code" placeholder="请输入编号" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="父节点编号:" prop='parentCode'>
          <el-input v-model="formField.parentCode" placeholder="请输入父节点编号" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="formField.name" placeholder="请输入名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL:" prop="url">
          <el-input v-model="formField.url" placeholder="请输入URL" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <el-input v-model="formField.icon" placeholder="请输入图标" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="子节点选中:" prop="childrenSelect">
          <el-input v-model="formField.childrenSelect" placeholder="请输入子节点选中个数" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="formField.sort" placeholder="请输入排序" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="formField.remark" placeholder="请输入备注" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addResource">确 定</el-button>
      </div>
    </messageBox>
  </div>
</template>
<script type="text/javascript">

import 'common/sass/module/access.scss'
import messageBox from 'components/entries/common/dialog'
import accessService from 'common/api/service/accessService'

export default {
  name: 'app',
  components: {
    messageBox
  },

  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formField: {
        code: null,
        parentCode: null,
        name: null,
        icon: null,
        url: null,
        sort: null,
        remark: null,
        level: null,
        childrenSelect: null
      },
      formRules: {
        name: { required: true, message: '必填', trigger: 'blur' },
        url: { required: true, message: '必填', trigger: 'blur' },
        sort: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value)) {
                callback(new Error('请输入数字值'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        childrenSelect: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value)) {
                callback(new Error('请输入数字值'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      bindDisabled: true,
      addDisabled: false,
      deleteDisabled: false,
      updateDisabled: false,
      businessType: null, // 0：新增静态资源，1：修改静态资源
      show: false,
      privilegeTree: [],
      curNode: {
        name: '无'
      },
      currentPrivilegeCode: '',
      tree: [],
      apiResource: [],
      usedApiResource: [],
      filterMethod (query, item) {
        return item.label.indexOf(query) > -1
      }
    }
  },
  mounted () {
    this.getPrivilegeTree()
    this.getAllApiResource()
  },
  methods: {

    // 添加静态资源
    addResourceEvent () {
      this.businessType = 0
      accessService.getPrivilegeCode.remote({parentCode: this.formField.parentCode}, result => {
        if (result.success) {
          this.show = true
          this.formField.code = result.data.code
          this.formField.level = result.data.code.length / 3
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },

    handleUpdata () {
      this.businessType = 1
      accessService.getPrivilege.remote({code: this.curNode.code}, result => {
        if (result.success) {
          this.formField.code = result.data.code
          this.formField.level = result.data.level
          this.formField.name = result.data.name
          this.formField.parentCode = result.data.parentCode
          this.formField.icon = result.data.icon
          this.formField.remark = result.data.remark
          this.formField.sort = result.data.sort
          this.formField.url = result.data.url
          this.formField.childrenSelect = result.data.childrenSelect
          this.show = true
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },

    // 取消
    cancel () {
      this.show = false
    },

    deletePrivilege () {
      if (this.hasChild(this.privilegeTree, this.curNode.code)) {
        this.$message.error('不能删除有子权限的权限')
        return false
      }
      if (confirm('确定删除 ' + this.curNode.name + ' 权限')) {
        accessService.deletePrivilege.remote({code: this.curNode.code}, result => {
          if (result.success) {
            this.getPrivilegeTree()
            this.$message('删除成功')
            this.curNode.name = '无'
          } else {
            this.$message.error(result.error.errorMessage)
          }
        })
      }
    },

    // 查看是否有子节点
    hasChild (data, code) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].code === code) {
          return data[i].children.length !== 0
        }
        if (data[i].children.length) {
          if (this.hasChild(data[i].children, code)) {
            return true
          }
        }
      }
      return false
    },

    // 添加静态资源
    addResource () {
      if (this.businessType === 0) {
        this.$refs.formField.validate((valid) => {
          if (valid) {
            accessService.createPrivilege.remote(this.formField, result => {
              if (result.success) {
                this.getPrivilegeTree()
                this.show = false
                this.$refs.formField.resetFields()
                this.$message('保存成功')
              } else {
                this.$message.error(result.error.errorMessage)
              }
            })
          }
        })
      } else {
        accessService.updataPrivilege.remote(this.formField, result => {
          if (result.success) {
            this.show = false
            this.getPrivilegeTree()
            this.$message('修改成功')
          } else {
            this.$message.error(result.error.errorMessage)
          }
        })
      }
    },

    // 修改静态资源
    updataResource () {
      accessService.updataPrivilege.remote(this.formField, result => {
        if (result.success) {
          this.getPrivilegeTree()
          this.$message('保存成功')
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },

    // 权限节点使用的接口资源
    handleNodeClick (data) {
      this.curNode = data
      this.addDisabled = true
      this.usedApiResource = []
      this.formField.parentCode = data.code

      // 提交按钮
      if (data.parentCode === '' || data.parentCode === '0') {
        this.bindDisabled = true
      } else {
        this.bindDisabled = false
      }

      // 删除、更新按钮
      if (data.code === '0') {
        this.deleteDisabled = false
        this.updateDisabled = false
        return
      } else {
        this.deleteDisabled = true
        this.updateDisabled = true
      }

      accessService.getBindRelation.remote({privilegeCode: this.curNode.code}, result => {
        for (var i = 0; i < result.data.length; i++) {
          this.usedApiResource.push(result.data[i].code)
          if (this.usedApiResource.length === 0) {
            this.bindDisabled = true
          }
        }
      })
    },

    // 保存权限节点使用的接口资源
    saveBindRelation () {
      var data = {
        code: this.curNode.code,
        parentCode: this.curNode.parentCode,
        resourceCodeList: this.usedApiResource
      }
      accessService.saveBindRelation.remote(data, result => {
        if (result.success) {
          this.$message('保存成功')
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    },

    // 获取权限树
    getPrivilegeTree () {
      accessService.getPrivilegeTree.remote({}, result => {
        this.privilegeTree = []
        this.privilegeTree.push(result.data)
      })
    },

    // 获取所有的接口资源
    getAllApiResource () {
      accessService.getAllApiResource.remote({}, result => {
        if (result.success) {
          var arr = []
          for (var i = 0; i < result.data.length; i++) {
            var tmp = JSON.parse(result.data[i].value)
            arr.push({
              label: result.data[i].name + '__' + tmp.url + '__' + tmp.method,
              key: result.data[i].code,
              disabled: false
            })
          }
          this.apiResource = arr
        } else {
          this.$message.error(result.error.errorMessage)
        }
      })
    }
  }
}
</script>
