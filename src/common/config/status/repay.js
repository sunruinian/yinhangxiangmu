let repayStatus = {
  status: [
    {
      value: null,
      label: '全部'
    },
    {
      value: 1,
      label: '已结清'
    },
    {
      value: 2,
      label: '未结清'
    },
    {
      value: 3,
      label: '已逾欠'
    }
  ],
  unclearedStatus: [
    {
      value: null,
      label: '全部'
    },
    {
      value: 2,
      label: '未结清'
    },
    {
      value: 3,
      label: '已逾欠'
    }
  ],
  repaymentAccountFormatter: [
    {
      value: null,
      label: ''
    },
    {
      value: 0,
      label: ''
    },
    {
      value: 1,
      label: '子账户'
    }
  ],
  repaymentType: [
    {
      value: 0,
      label: '利随本清'
    },
    {
      value: 1,
      label: '一次还本付息'
    },
    {
      value: 2,
      label: '等额还款'
    },
    {
      value: 3,
      label: '等本还款'
    },
    {
      value: 4,
      label: '等比累进'
    },
    {
      value: 5,
      label: '等额累进'
    }
  ]
}

export default repayStatus
