<template><!-- 溯源信息 -->
    <div class="upstream">
      <p><span class="require">*</span><span>溯源信息：显示该凭证历史来源信息</span></p>
      <div v-if="tableFlag > 0">
        <div class="item-group">
          <div class="item-tit"><span class="item-tit-icon"></span>
            <span><span class="c666">凭证登记时间：</span>{{createTime | timestampToDate}}</span>
            <span style="margin-left: 40px;"><span class="c666">区块链合约标识码：</span>{{blockchainAddress}}</span>
          </div>
          <div class="item-cnt">
            <div class="cnt">
              <div v-for="(item, index) in tableData.data" :key="item.index" :index="index" :class="{'info-group-wrap': true, 'activeClassLeft': 0 === index}">
                <div class="tag">签发方</div>
                <ul class='info-group'>
                  <li class="list-item">
                      <label class="item-name">接受时间：</label>
                      <span class="item-info">{{item.createTime | timestampToDate}}</span>
                  </li>
                  <li class="list-item" v-if="0 === index">
                    <label class="item-name">签发方：</label>
                    <span class="item-info">{{item.createCompany.name}}</span>
                  </li>
                  <li class="list-item">
                      <label class="item-name">接受方：</label>
                      <span class="item-info">{{item.company.name}}</span>
                  </li>
                  <li class="list-item" v-if="0 !== index">
                      <label class="item-name">付款方：</label>
                      <span class="item-info">{{item.createCompany.name}}</span>
                  </li>

                  <!-- <li class="list-item">
                      <label class="item-name">凭证111金额（元）：</label>
                      <span class="item-info">{{item.total | moneyShow}}</span>
                  </li> -->
                </ul>
              </div>
              <div class="timeline">
                <div class="timeline-item" v-for="(item, index) in tableData.data" :key="item.index" :index="index"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tableFlag === 0" style="text-align:center; margin-top:15px; padding: 15px; color: #999; border: 1px solid #DFDFDF;">{{tableData.msg}}</div>

        <!-- <p class="pb15"><span class="require">*</span>溯源信息：显示该笔凭证历史来源信息。</p>
        <table class="table-r table-th-block table-data">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>业务时间</th>
                    <th>业务内容</th>
                    <th>凭证编号</th>
                    <th>付款方</th>
                    <th>收款方</th>
                    <th>凭证金额（元）</th>
                    <th>承诺付款日期</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableData.data" :key="item.index" :index="index">
                    <td>{{index + 1}}</td>
                    <td>{{item.createTime | timestampToDate}}</td>
                    <td>转让</td>
                    <td>{{item.no}}</td>
                    <td>{{item.createCompany.name}}</td>
                    <td>{{item.company.name}}</td>
                    <td>{{item.total | moneyShow}}</td>
                    <td>{{item.cashTime | timestampToDay}}</td>
                </tr>
                <tr v-if="tableData.data.length === 0">
                    <td align="center" colspan="8">{{tableData.msg}}</td>
                </tr>
            </tbody>
        </table> -->
    </div>
</template>

<script type="text/javascript">
// import voucherService from 'common/api/service/voucherService'
import commonDetail from 'common/api/common'
export default {
  name: 'voucher-upstream',
  props: {
    voucher: null
  },
  data () {
    return {
      voucherId: 0,
      tableData: {
        data: [],
        msg: ''
      },
      tableFlag: -1,
      createTime: null,
      blockchainAddress: null,
      suffix: 0
    }
  },
  mounted () {
    this.voucherId = this.voucher.voucherId
    this.upstream()
  },
  methods: {
    // 溯源信息
    upstream: function () {
      var param = {id: this.voucherId}
      this.tableData.data = [
        // {
        //   createTime: 1505555555000,
        //   company: {
        //     name: '哈哈'
        //   },
        //   createCompany: {
        //     name: '呵呵'
        //   },
        //   total: 5000000
        // },
        // {
        //   createTime: 1505555555000,
        //   company: {
        //     name: '哈哈'
        //   },
        //   createCompany: {
        //     name: '呵呵'
        //   },
        //   total: 5000000
        // },
        // {
        //   createTime: 1505555555000,
        //   company: {
        //     name: '哈哈'
        //   },
        //   createCompany: {
        //     name: '呵呵'
        //   },
        //   total: 5000000
        // },
        // {
        //   createTime: 1505555555000,
        //   company: {
        //     name: '哈哈'
        //   },
        //   createCompany: {
        //     name: '呵呵'
        //   },
        //   total: 5000000
        // }
      ]
      commonDetail.upstream.remote(param, (data) => {
        if (data.success) {
          this.tableData.data = data.data ? data.data : []
          this.tableFlag = this.tableData.data.length
          if (this.tableData.data.length) {
            this.createTime = this.tableData.data[this.tableData.data.length - 1].createTime
            this.blockchainAddress = this.tableData.data[this.tableData.data.length - 1].blockchainaddress
          } else {
            this.tableData.msg = '该凭证尚无溯源信息'
          }
        } else {
          this.tableData.data = []
          this.tableData.msg = '获取溯源信息失败'
        }
      })
    }
  }
}
</script>
<style media="screen">
  .upstream {
    padding: 0px 15px;
  }
  .upstream .cnt {
    position: relative;
  }
  .upstream .info-group-wrap {
    position: relative;
    float: left;
    height: 234px;
    width: 47.5%;
  }
  .upstream .info-group-wrap:nth-child(2n+2) {
    float: right;
  }
  .upstream .info-group-wrap:nth-child(2) {
    margin-top: 118px;
  }

  .upstream .info-group-wrap:nth-child(2n+1) .info-group:before {
    content: '';
    position: absolute;
    top: 7px;
    right: -12px;
    width: 12px;
    height: 18px;
    background: url('../../../common/image/upstream-right.png');
  }

  .upstream .info-group-wrap:nth-child(2n+2) .info-group:before {
    content: '';
    position: absolute;
    top: 7px;
    left: -12px;
    width: 12px;
    height: 18px;
    background: url('../../../common/image/upstream-left.png');
  }

  .upstream .info-group {
    position: relative;
    height: 154px;
    padding: 15px 5px;
    background: #fff;
    box-shadow: 0px 0px 24px #EBEDEF;
    border-radius: 4px;
    overflow: inherit;
  }

  .upstream .info-group .item-name {
    width: 140px;
  }

  .info-group-wrap .tag {
    display: none;
  }
  .info-group-wrap.activeClassLeft .tag {
    display: block;
    position: absolute;
    top: 10px;
    left: -8px;
    z-index: 1;
    width: 48px;
    height: 20px;
    background: #FC5A1F;
    font-size: 12px;
    text-align: center;
    color: #fff;
  }
  .info-group-wrap.activeClassLeft .tag:before {
    content: '';
    display: block;
    position: absolute;
    top: 20px;
    left: 0px;
    z-index: 1;
    width: 0px;
    height: 0px;
    border: 4px solid #D5420C;
    border-left-color: transparent;
    border-bottom-color: transparent;
  }
  .info-group-wrap.activeClassRight .tag {
    display: block;
    position: absolute;
    top: 10px;
    right: -8px;
    z-index: 1;
    width: 48px;
    height: 20px;
    background: #FC5A1F;
    font-size: 12px;
    text-align: center;
    color: #fff;
  }
  .info-group-wrap.activeClassRight .tag:before {
    content: '';
    display: block;
    position: absolute;
    top: 20px;
    right: 0px;
    z-index: 1;
    width: 0px;
    height: 0px;
    border: 4px solid #D5420C;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
  /* activeClassRight */
  .timeline {
    position: absolute;
    left: 50%;
    width: 30px;
    margin-left: -15px;
    padding-top: 15px;
  }
  .timeline .timeline-item {
    position: relative;
    height: 118px;
    width: 1px;
    margin-left: 14px;
    background: #FC5A1F;
  }
  .timeline .timeline-item:last-child {
    position: relative;
    height: 145px;
    width: 1px;
    margin-left: 14px;
    background: linear-gradient(#FC5A1F, #fff);
  }
  .timeline .timeline-item:before {
    content: '';
    position: absolute;
    top: -15px;
    left: -14px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(251,100,42,0.2);
  }
  .timeline .timeline-item:after {
    content: '';
    position: absolute;
    top: -8px;
    left: -7px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #FC5A1F;
  }
</style>
