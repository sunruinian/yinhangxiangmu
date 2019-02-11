let bank = {
  bank: [
    {
      value: 0,
      label: '平安银行'
    },
    {
      value: 1,
      label: '中信银行'
    },
    {
      value: 2,
      label: '华夏银行'
    }
  ],
  // 账户号类型
  businessScope: {
    'BASIC_DEPOSIT_ACCOUNT': '基本存款户',
    'GENERAL_DEPOSIT_ACCOUNT': '一般存款账户',
    'TEMPORARY_DEPOSIT_ACCOUNT': '临时存款账户',
    'SPECIAL_DEPOSIT_ACCOUNT': '专用存款账户'
  },
  accountType: [
    {
      label: '保证金账户',
      value: 'MARGIN'
    },
    {
      label: '结算户',
      value: 'SETTLEMENT'
    },
    {
      label: '回款专户',
      value: 'RECEIVING'
    }
  ]
}

export { bank as default }
