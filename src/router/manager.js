var manager = [
  // 企业管理 ***/
  {
    path: '/manager',
    component: resolve => require(['../module/App.vue'], resolve),
    name: '企业管理',
    children: [{
      path: 'index', // 用户列表
      name: '用户列表',
      component: resolve => require(['../module/manager/index.vue'], resolve)
    },
    {
      path: 'add', // 添加用户
      name: '添加用户',
      component: resolve => require(['../module/manager/add.vue'], resolve)
    }]
  },
  {
    path: '/manager/newenterprise',
    component: resolve => require(['../module/App.vue'], resolve),
    children: [{
      path: 'create', // 证书列表
      name: '新建企业',
      component: resolve => require(['../module/manager/newenterprise/create.vue'], resolve)
    },
    {
      path: 'detail', // 证书列表
      name: '企业信息',
      component: resolve => require(['../module/manager/newenterprise/index.vue'], resolve)
    }]
    // {
    //   path: 'add', // 添加证书
    //   name: '添加证书',
    //   component: resolve => require(['../module/manager/cert/add.vue'], resolve)
    // },
    // {
    //   path: 'set-access', // 添加用户
    //   name: '添加用户',
    //   component: resolve => require(['../module/manager/cert/set-access.vue'], resolve)
    // }
  },
  {
    path: '/manager/cert',
    component: resolve => require(['../module/App.vue'], resolve),
    children: [{
      path: 'index', // 证书列表
      name: '证书列表',
      component: resolve => require(['../module/manager/cert/index.vue'], resolve)
    },
    {
      path: 'add', // 添加证书
      name: '添加证书',
      component: resolve => require(['../module/manager/cert/add.vue'], resolve)
    },
    {
      path: 'set-access', // 添加用户
      name: '添加用户',
      component: resolve => require(['../module/manager/cert/set-access.vue'], resolve)
    }]
  },
  // 用户权限
  {
    path: '/access',
    component: resolve => require(['../module/App.vue'], resolve),
    children: [{
      path: 'index', // 用户列表
      name: '用户列表',
      component: resolve => require(['../module/manager/access/index.vue'], resolve)
    },
    {
      path: 'set', // 添加用户
      name: '添加用户',
      component: resolve => require(['../module/manager/access/set-access.vue'], resolve)
    },
    {
      path: 'add', // 添加用户
      name: '添加用户',
      component: resolve => require(['../module/manager/access/add.vue'], resolve)
    }]
  }
]

export default manager
