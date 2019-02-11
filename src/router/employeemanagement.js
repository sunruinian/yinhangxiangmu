// 员工管理
var employeemanagement = [
  // 员工管理-添加员工/员工管理-员工列表/员工管理-权限配置
  {
    path: '/employeemanagement/addemployee',  // 员工管理-添加员工
    name: '添加员工',
    component: resolve => require(['../module/App.vue'], resolve),
    children: [{
      path: '', // 添加员工
      component: resolve => require(['../module/employeemanagement/addemployee/index.vue'], resolve)
    }]
  }]
  // {
  //   path: '/employeemanagement/employeelist',  // 员工管理-员工列表
  //   name: '员工列表',
  //   component: resolve => require(['../module/App.vue'], resolve),
  //   children: [{
  //     path: '', // 员工列表
  //     component: resolve => require(['../module/employeemanagement/employeelist/index.vue'], resolve)
  //   },
  //   {
  //     path: 'edit', // 员工列表/编辑
  //     name: '编辑',
  //     component: resolve => require(['../module/employeemanagement/employeelist/edit/index.vue'], resolve)
  //   }
  //   ]
  // },
  // {
  //   path: '/employeemanagement/permissionconfig',  // 员工管理-权限配置
  //   name: '权限配置',
  //   component: resolve => require(['../module/App.vue'], resolve),
  //   children: [{
  //     path: '', // 权限配置
  //     component: resolve => require(['../module/employeemanagement/permissionconfig/index.vue'], resolve)
  //   },
  //   {
  //     path: 'setAccess', // 员工列表/编辑
  //     name: '权限',
  //     component: resolve => require(['../module/employeemanagement/permissionconfig/setAccess/index.vue'], resolve)
  //   }
  //   ]
  // },
  // {
  //   path: '/employeemanagement/organ',  // 员工管理-组织结构
  //   name: '组织结构',
  //   component: resolve => require(['../module/App.vue'], resolve),
  //   children: [{
  //     path: '', // 组织结构
  //     component: resolve => require(['../module/employeemanagement/organ/index.vue'], resolve)
  //   }]
  // }
export default employeemanagement
