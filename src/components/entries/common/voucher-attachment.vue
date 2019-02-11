<template><!-- 贸易信息 -->
    <div class="tradeinfo">
        <div v-show="files.length !== 0" style="width:100%" class="pl30 pr30">
            <!-- <p><span class="require">*</span><span>凭证相关的贸易信息可点击下面的文件链接进行下载。</span></p> -->
            <div class="item-group">
              <div class="item-tit"><span class="item-tit-icon"></span>贸易信息 <span style="color: #3F3F3F;">(凭证相关的贸易信息可点击下面的文件链接进行下载。)</span></div>
            </div>
            <div class="contractInfo">
              <p class="mt10 mb20">1、合同信息</p>
              <div class="boxShadow" style="padding-left:15px;padding-right:15px;">
                <table class="table-r table-th-block table-data" >
                    <thead>
                        <tr>
                            <th width="20%">基础合同编号</th>
                            <th width="20%">交易商品信息</th>
                            <th width="20%">合同附件</th>
                            <th width="20%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in files" v-show='item.detail.fileType === 0'>
                            <td>{{item.detail.name}}</td>
                            <td>{{item.detail.content}}</td>
                            <td><a :href="item.downUrl">{{item.name}}</a></td>
                            <td><a :href="item.downUrl" v-if="item.name">下载附件</a></td>
                        </tr>
                        <tr v-if="showMsg">
                            <td align="center" colspan="3">{{message}}</td>
                        </tr>
                    </tbody>
                </table>
              </div>
            </div>
            <p class="mt10 mb20">2、附件上传</p>
            <div  class="boxShadow">
              <table class="table-r table-th-block table-data">
                <tbody>
                  <tr>
                      <td width="25%" class="c666">发票信息</td>
                      <td width="25%" class="">
                          <div  v-for="item in files" v-show='item.type === 1'><a :href="item.downUrl">{{item.name}}</a></div>
                          <div v-show='invoiceHidden'>未上传</div>
                      </td>
                      <td width="50%" class="c666">
                        <div  v-for="item in files" v-show='item.type === 1'><a :href="item.downUrl">下载</a></div>
                      </td>
                  </tr>
                  <tr>
                      <td width="25%" class="l c666">其他信息</td>
                      <td width="25%" class="r">
                          <div class="file-item" v-for="item in files" v-show='item.type === 2'><a :href="item.downUrl">{{item.name}}</a></div>
                          <div class="file-item" v-show='otherHidden'>未上传</div>
                      </td>
                      <td width="50%" class="c666">
                        <div class="file-item" v-for="item in files" v-show='item.type === 2'><a :href="item.downUrl">下载</a></div>
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <p v-show="files.length === 0" class="c999 mt30 ml30" style="width:100%; text-align:center">该凭证未上传合同信息</p>
    </div>
</template>

<script type="text/javascript">
export default {
  name: 'voucher-attachment',
  props: {
    voucher: null
  },
  data () {
    return {
      contract: {
        no: null,
        goodsInfo: null
      },
      showMsg: true,
      invoiceHidden: true,
      otherHidden: true,
      files: [],
      message: '暂无数据'
    }
  },
  mounted () {
    const self = this
    self.files = this.voucher.files
    for (var i = 0; i < self.files.length; i++) {
      if (self.files[i].detail.name) {
        self.contract.no = self.files[i].detail.name
        self.contract.goodsInfo = self.files[i].detail.content
        self.showMsg = false
      }
    }
    for (i = 0; i < self.files.length; i++) {
      if (self.files[i].type === 1) {
        self.invoiceHidden = false
        break
      }
    }
    for (i = 0; i < self.files.length; i++) {
      if (self.files[i].type === 2) {
        self.otherHidden = false
        break
      }
    }
  }
}

</script>
<style media="screen" scoped>
table{
  table-layout:fixed;
}
td{
  word-wrap: break-word;
}
.otherInfo {
  width: 100%;
  border: 1px solid #ddd;
}
</style>
