let config = {
  pageSize: 20,
  supplierIndex: '#/voucher/create',
  accountIndex: '#/voucher/create',
  imgDownUrl: '/service/file/image/download/',
  authStep: 5, // 实名完成值为5
  cfcaEnable: true,
  noAccessJump: true, // 无权限跳转配置（true：跳，false：不跳）
  noLoginJump: true, // 未登录的页面跳转配置（true：跳，false：不跳）
  accessWhiteList: ['/', '/login', '/workbench/newListMore', '/member/forget', '/assistant/success', '/noaccess', '/test'], // 权限白名单
  project: ['ORIGINAL', 'GYB'],
  messageOn: true // 消息通知开关
  // pswType: 'GUIYANG'// 密码加密控件开关;   'YINUO'使用后端提供公钥加密, 'GUIYANG'使用贵阳提供的密码加密控件加密
  // pswType: 'YINUO' // 密码加密控件开关;   'YINUO'使用后端提供公钥加密, 'GUIYANG'使用贵阳提供的密码加密控件加密
}

export default config
