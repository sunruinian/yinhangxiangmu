var payment = [
  {
    path: '/payment/apply', // 付款申请
    component: resolve => require(['../module/App.vue'], resolve),
    name: '付款申请',
    children: [{
      path: '', // 标签
      component: resolve => require(['../module/payment/apply/tab.vue'], resolve),
      name: '标签',
      children: [{
        path: 'index', // 付款申请列表
        name: '付款申请列表',
        component: resolve => require(['../module/payment/apply/index.vue'], resolve)
      },
      {
        path: 'record', // 申请记录
        name: '申请记录',
        component: resolve => require(['../module/payment/apply/record.vue'], resolve)
      }]
    },
    {
      path: 'apply', // 申请
      component: resolve => require(['../module/payment/apply/apply.vue'], resolve),
      name: '申请'
    },
    {
      path: 'index/detail', // 详情
      name: '详情',
      component: resolve => require(['../module/voucher/detail.vue'], resolve)
    },
    {
      path: 'record/detail', // 详情
      name: '详情',
      component: resolve => require(['../module/voucher/detail.vue'], resolve)
    }]
  },
  {
    path: '/payment/approve', // 付款审批
    component: resolve => require(['../module/App.vue'], resolve),
    name: '付款审批',
    children: [{
      path: '', // 标签
      name: '标签',
      component: resolve => require(['../module/payment/approve/tab.vue'], resolve),
      children: [{
        path: 'index', // 付款申请审批
        name: '付款申请审批',
        component: resolve => require(['../module/payment/approve/index.vue'], resolve)
      },
      {
        path: 'record', // 审批记录
        name: '审批记录',
        component: resolve => require(['../module/payment/approve/record.vue'], resolve)
      }]
    },
    {
      path: 'approve', // 审批记录
      name: '审批记录',
      component: resolve => require(['../module/payment/approve/approve.vue'], resolve)
    },
    {
      path: 'index/detail', // 付款记录
      name: '付款记录',
      component: resolve => require(['../module/voucher/detail.vue'], resolve)
    },
    {
      path: 'record/detail', // 付款记录
      name: '付款记录',
      component: resolve => require(['../module/voucher/detail.vue'], resolve)
    }]
  }
]

export default payment
