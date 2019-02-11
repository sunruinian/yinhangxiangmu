let status = {
  corpIDType: [
    {
      value: 0,
      label: '身份证'
    }],
  institutionType: [
    {
      value: 0,
      label: '自然人独资',
      canSelect: false // 为了兼容旧数据，只做展示，不能选择
    },
    {
      value: 1,
      label: '法人独资',
      canSelect: false // 为了兼容旧数据，只做展示，不能选择
    },
    {
      value: 2,
      label: '自然人投资/控股',
      canSelect: false // 为了兼容旧数据，只做展示，不能选择
    },
    {
      value: 3,
      label: '国有独资',
      canSelect: false // 为了兼容旧数据，只做展示，不能选择
    },
    {
      value: 4,
      label: '外商投资',
      canSelect: false // 为了兼容旧数据，只做展示，不能选择
    },
    {
      value: 5,
      label: '外商独资',
      canSelect: false // 为了兼容旧数据，只做展示，不能选择
    },
    {
      value: 6,
      label: '股份有限公司',
      canSelect: false // 为了兼容旧数据，只做展示，不能选择
    },
    {
      value: 7,
      label: '有限责任',
      canSelect: true
    },
    {
      value: 8,
      label: '一人有限责任',
      canSelect: true
    },
    {
      value: 9,
      label: '其它有限责任',
      canSelect: true
    },
    {
      value: 10,
      label: '股份有限公司(上市)',
      canSelect: true
    },
    {
      value: 11,
      label: '股份有限公司(上市)分公司',
      canSelect: true
    },
    {
      value: 12,
      label: '股份有限公司(非上市)',
      canSelect: true
    },
    {
      value: 13,
      label: '股份有限公司(非上市)分公司',
      canSelect: true
    },
    {
      value: 14,
      label: '全民所有制',
      canSelect: true
    },
    {
      value: 15,
      label: '集体所有制',
      canSelect: true
    },
    {
      value: 16,
      label: '股份制',
      canSelect: true
    },
    {
      value: 17,
      label: '股份合作制',
      canSelect: true
    },
    {
      value: 18,
      label: '联营、台、港、澳投资企业',
      canSelect: true
    },
    {
      value: 19,
      label: '外国（地区）企业',
      canSelect: true
    },
    {
      value: 20,
      label: '集团',
      canSelect: true
    },
    {
      value: 21,
      label: '外商投资企业',
      canSelect: true
    },
    {
      value: 22,
      label: '内资非法人企业',
      canSelect: true
    },
    {
      value: 23,
      label: '非公司私营企业',
      canSelect: true
    },
    {
      value: 24,
      label: '内资非公司企业分支机构',
      canSelect: true
    },
    {
      value: 25,
      label: '其他',
      canSelect: true
    }
  ],
  repayType: [
    {
      value: 0,
      label: '等额本息'
    },
    {
      value: 1,
      label: '等额本金'
    }
  ],
  repayTypeSelect: [
    {
      value: 0,
      label: '等额本息还款'
    },
    {
      value: 1,
      label: '等额本金还款'
    }
  ],
  transferType: [
    {
      value: null,
      label: '全部'
    },
    {
      value: 0,
      label: '收款'
    },
    {
      value: 1,
      label: '付款'
    },
    {
      value: 2,
      label: '充值'
    },
    {
      value: 3,
      label: '提现'
    }
  ],
  companyAuthStatus: [
    {
      value: 'AUTH_WAIT',
      label: '未实名'
    },
    {
      value: 'AUTH_PASS',
      label: '已实名'
    }
  ]
}

let content = {

}

export { status as default, content }
