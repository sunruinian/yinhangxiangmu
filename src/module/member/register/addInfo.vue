<template>
  <div class="step4-cca">
    <div class="inner-wrap" id='addDialog'>

      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="200px" class="form-register">
        <h2 class="tit2">1. 企业信息</h2>

        <el-form-item label="机构全称">
          <el-input v-model="formData.name" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用证代码">
          <el-input v-text="" v-model="formData.code" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="机构类型" prop='type' clearable>
          <el-select v-model="form.type"  placeholder="请选择">
            <el-option
              v-for="item in mechanisms"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-if="item.canSelect">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="税务登记号" prop='taxCode'>
          <el-input v-model="form.taxCode" ></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop='corpName'>
          <el-input v-model="form.corpName"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人证件类型" prop="corpCardType">
          <el-select v-model="form.corpCardType"  placeholder="请选择">
            <el-option
              v-for="item in documentType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="法定代表人证件号码" prop='corpCardId'>
          <el-input v-model="form.corpCardId"></el-input>
        </el-form-item>
        <el-form-item label="证件到期日" prop='corpCardDate'>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model = "form.corpCardDate"
            :picker-options="pickerOptions"
            style="width:250px"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所在城市" prop='city'>
          <el-select v-model="form.city" filterable placeholder="请选择">
            <el-option
              v-for="item in citys"
              :key="item.CityID"
              :label="item.name"
              :value="item.CityID.toString()">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册地址" prop='address'>
          <el-input v-model="form.address"></el-input>
        </el-form-item>

        <h2 class="tit2">2. 其他信息材料</h2>

        <el-form-item label="联系人姓名" prop='contactName'>
          <el-input v-model="form.contactName"></el-input>
        </el-form-item>
        <el-form-item  label="联系人手机号" prop='contactPhone'>
          <el-input v-model="form.contactPhone"></el-input>
        </el-form-item>

        <div class="stuff-wrap">
          <div class="stuff-group">
            <el-upload
              class="avatar-uploader"
              name="multipartFile"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="companyInfoSuccess"
              :before-upload="beforeImageUpload">
              <div class="stuff-item" v-if='companyInfoImg===""'>
                <p class="title">企业营业执照</p>
                <p class="add">+</p>
              </div>
              <div class='imgContainer' v-if='companyInfoImg!==""'>
                <img :src='companyInfoImg'/>
                <div class="imgPreview">
                  <span  @click.stop='imgPreview(companyInfoImg)'>预览</span><b></b>
                  <span>编辑</span>
                </div>
              </div>
            </el-upload>

            <el-upload
              class="avatar-uploader"
              name="multipartFile"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="userIdSuccess"
              :before-upload="beforeImageUpload">
              <div class="stuff-item" v-if='companyIDImg===""'><p class="title">法定代表人身份证</p> <p class="add">+</p></div>
              <div class='imgContainer' v-if='companyIDImg!==""'>
                <img :src='companyIDImg'/>
                <div class="imgPreview">
                  <span  @click.stop='imgPreview(companyIDImg)'>预览</span><b></b>
                  <span>编辑</span>
                </div>
              </div>
            </el-upload>

            <!-- <el-upload
              class="avatar-uploader"
              name="multipartFile"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="contactFileSuccess"
              :before-upload="beforeImageUpload">
              <div class="stuff-item" v-if='userIDImg===""'><p class="title">委托人身份证</p> <p class="add">+</p></div>
              <div class='imgContainer' v-if='userIDImg!==""'>
                <img :src='userIDImg'/>
                <div class="imgPreview">
                  <span  @click.stop='imgPreview(userIDImg)'>预览</span><b></b>
                  <span>编辑</span>
                </div>
              </div>
            </el-upload>
            <el-upload
              v-if = 'role===1 || role===3'
              class="avatar-uploader"
              name="multipartFile"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="reportSuccess"
              :before-upload="beforeImageUpload">
              <div class="stuff-item" v-if='reportImg===""'>
                <p class="title">评级报告</p>
                <p class="add">+</p>
              </div>
              <div class='imgContainer' v-if='reportImg!==""'>
                <img :src='reportImg'/>
                <div class="imgPreview">
                  <span  @click.stop='imgPreview(reportImg)'>预览</span><b></b>
                  <span>编辑</span>
                </div>
              </div>
            </el-upload> -->

            <el-upload
              class="avatar-uploader"
              name="multipartFile"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="otherFileSuccess"
              :before-upload="beforeImageUpload">
              <div class="stuff-item" v-if='otherFileImg===""'>
                <p class="title">其他材料</p>
                <p class="add">+</p>
              </div>
              <div class='imgContainer' v-if='otherFileImg!==""'>
                <img :src='otherFileImg'/>
                <div class="imgPreview">
                  <span  @click.stop='imgPreview(otherFileImg)'>预览</span><b></b>
                  <span>编辑</span>
                </div>
              </div>
            </el-upload>

            <!-- 图片预览编辑 cl -->
            <component :is="enLargeImg" :data="files" v-if='imgShow' @imgClose='imgShow=false'></component>
          </div>
          <p class="tip"><span class="require">*</span>企业营业执照、法人身份证为必传项，其他材料选传；文件支持：jpg、png、jpeg格式，且文件大小≤30M。</p>
        </div>

        <el-form-item style="margin-top:20px;margin-bottom:20px;">
          <el-button class="okbtn" type="primary" @click="onSubmit" :loading="btnLoading">下一步</el-button>
        </el-form-item>
        <div style="border: 1px solid transparent"></div>
      </el-form>

    </div>
  </div>
</template>


<script type="text/javascript">
import region from 'common/config/region'
import CFCATools from 'common/javascript/features/cfca'
import formExtends from 'components/entries/base/form'
// import certService from 'common/api/service/certService'
import cookieTools from 'common/javascript/tools/cookieTools'
import merge from 'webpack-merge'
import type from 'common/config/type'
import 'common/sass/module/member.scss'
// import infoManageService from 'common/api/service/infoManageService'
import commonMember from 'common/api/member/common'
import commonDetail from 'common/api/common'

let instance = null
export default formExtends({
  name: 'step4-cca',
  components: {},
  data () {
    return {
      btnLoading: false,
      enLargeImg: null,
      userIDImg: '',
      companyIDImg: '',
      companyInfoImg: '',
      reportImg: '',
      otherFileImg: '',
      form: {
        address: '',
        businessFileId: 0,
        city: '',
        contactFileId: null,
        contactName: '',
        contactPhone: '',
        corpCardDate: '',
        corpCardId: '',
        corpCardType: '',
        corpFileId: 0,
        corpName: '',
        reportFileId: null,
        otherFileId: 0,
        taxCode: '',
        type: ''
      },

      formData: {
        issuerDn: '',
        serialNo: '',
        signStr: '',
        name: '',
        code: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        name: [{ required: true, message: '请填写机构全称！', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择机构类型！', trigger: 'change', type: 'number' },
          {
            validator: (rule, value, callback) => {
              commonMember.cacheSubjoin.remote(instance.form, data => {})
              callback()
            },
            trigger: 'change'
          }
        ],
        taxCode: [
          { required: true, message: '请填写税务登记号！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              // let code = this.methods.isTaxCode(value, callback)
              if (!(value.length === 15 || value.length === 18)) {
                callback(new Error('税务登记号应为15或18位'))
              } else if (
                value.length === 18 &&
                value !== this.data().formData.code &&
                this.data().formData.code !== ''
              ) {
                callback(new Error('税务登记号应与社会信用证代码一致'))
              } else {
                commonMember.cacheSubjoin.remote(instance.form, data => {})
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        corpName: [
          { required: true, message: '请填写法定代表人！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let reg = this.data().regular.chinese.test(value)
              if (!reg) {
                callback(new Error('法定代表人仅支持中文'))
              } else {
                commonMember.cacheSubjoin.remote(instance.form, data => {})
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        corpCardType: [
          { required: true, message: '请选择法定代表人证件类型！', trigger: 'change', type: 'number' },
          {
            validator: (rule, value, callback) => {
              commonMember.cacheSubjoin.remote(instance.form, data => {})
              callback()
            },
            trigger: 'change'
          }
        ],
        corpCardId: [
          { required: true, message: '请填写法定代表人证件号码！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let reg = this.data().regular.idCard.test(value)
              if (!(value.length === 15 || value.length === 18)) {
                callback('请输入15位或18位的身份证号')
              } else if (!reg) {
                callback(new Error('身份证号码格式错误'))
              } else {
                commonMember.cacheSubjoin.remote(instance.form, data => {})
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        corpCardDate: [
          { type: 'date', required: true, message: '请选择证件到期日！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              commonMember.cacheSubjoin.remote(instance.form, data => {})
              callback()
            },
            trigger: 'change'
          }
        ],
        city: [
          { required: true, message: '请选择所在城市！', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              commonMember.cacheSubjoin.remote(instance.form, data => {})
              callback()
            },
            trigger: 'change'
          }
        ],
        address: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 100) {
                callback(new Error('注册地址不可多于100个字'))
              }
              callback()
            },
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 100) {
                callback(new Error('注册地址不可多于100个字'))
              } else {
                commonMember.cacheSubjoin.remote(instance.form, data => {})
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        contactName: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback(new Error('联系人姓名不可多于20个字'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback(new Error('联系人姓名不可多于20个字'))
              } else {
                commonMember.cacheSubjoin.remote(instance.form, data => {})
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        contactPhone: [
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback(new Error('联系人手机号不可多于20个字'))
              }
              callback()
            },
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 20) {
                callback(new Error('联系人手机号不可多于20个字'))
              } else {
                commonMember.cacheSubjoin.remote(instance.form, data => {})
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      citys: region.city,
      mechanisms: type.institutionType,
      documentType: type.corpIDType,
      role: 1,
      // 图片预览数据
      imgShow: false,
      files: {}
    }
  },
  mounted () {
    instance = this
    // 监听页面请求错误
    this.$bus.$on('message-error', info => {
      this.btnLoading = false
    })
    // 获取企业保存草稿的信息
    commonMember.getSubjoin.remote({}, info => {
      let data = info.data
      this.form.taxCode = data.taxCode
      if (data.type !== -1) {
        this.form.type = data.type
      }
      this.form.corpName = data.corpName
      if (data.corpCardType !== -1) {
        this.form.corpCardType = data.corpCardType
      }
      this.form.corpCardId = data.corpCardId
      if (data.corpCardDate !== 0) {
        this.form.corpCardDate = data.corpCardDate
      }
      this.form.city = data.city
      this.form.address = data.address
      this.form.contactName = data.contactName
      this.form.contactPhone = data.contactPhone
      this.form.corpCardDate = data.corpCardDate === 0 ? '' : new Date(data.corpCardDate)
      this.form.businessFileId = data.businessFileId
      this.companyInfoImg = data.businessFileId === 0 ? '' : this.getImagePath(data.businessFileId)
      this.form.corpFileId = data.corpFileId
      this.companyIDImg = data.corpFileId === 0 ? '' : this.getImagePath(data.corpFileId)
      this.form.contactFileId = data.contactFileId
      this.userIDImg = data.contactFileId === 0 ? '' : this.getImagePath(data.contactFileId)
      this.form.reportFileId = data.reportFileId
      this.reportImg = data.reportFileId === 0 ? '' : this.getImagePath(data.reportFileId)
      this.form.otherFileId = data.otherFileId
      this.otherFileImg = data.otherFileId === 0 ? '' : this.getImagePath(data.otherFileId)
    })
    commonDetail.getCurrentCompany.remote({}, info => {
      this.formData.name = info.data.name
      let codes = info.data.certificateList
      for (let i = 0; i < codes.length; i++) {
        if (parseInt(codes[i].type) === 0) {
          this.formData.code = codes[i].code
          break
        }
      }
    })
    this.role = parseInt(cookieTools.getCookie('role'))
  },
  methods: {
    onSubmit () {
      if (this.form.businessFileId === 0) {
        this.$bus.$emit('message-error', { message: '请上传企业营业执照！' })
        return
      }
      if (this.form.corpFileId === 0) {
        this.$bus.$emit('message-error', { message: '请上传法定代表人身份证！' })
        return
      }
      // if (this.form.contactFileId === 0) {
      //   this.$bus.$emit('message-error', { message: '上传委托人身份证！' })
      //   return
      // }

      // if (this.form.reportFileId === 0 && this.role === 1) {
      //   this.$bus.$emit('message-error', { message: '上传评级报告！' })
      //   return
      // }

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // CFCATools.selectCert()
          CFCATools.selectCert('', '', '', false)
          const info = CFCATools.getInfo()

          this.formData.issuerDn = info.issuerDN
          this.formData.serialNo = info.serialNumber
          let param = merge({}, this.formData)

          param.subjoinInfo = merge({}, this.form)
          param.subjoinInfo.corpCardDate = param.subjoinInfo.corpCardDate.getTime()
          param.subjoinInfo.type = parseInt(param.subjoinInfo.type)
          param.subjoinInfo.corpCardType = parseInt(param.subjoinInfo.corpCardType)
          if (!param.subjoinInfo.contactFileId) {
            delete param.subjoinInfo.contactFileId
          }
          if (!param.subjoinInfo.reportFileId) {
            delete param.subjoinInfo.reportFileId
          }
          param.signStr = this.sign(JSON.stringify(param.subjoinInfo), true)
          this.btnLoading = true
          commonMember.addCompanyInfo.remote(param, data => {
            this.btnLoading = false
            this.$bus.$emit('on-step', 3)
          })
        }
      })
    },
    companyInfoSuccess (info) {
      this.form.businessFileId = info.data
      this.companyInfoImg = this.getImagePath(info.data)
      commonMember.cacheSubjoin.remote(instance.form, data => {})
    },
    userIdSuccess (info) {
      this.form.corpFileId = info.data
      this.companyIDImg = this.getImagePath(info.data)
      commonMember.cacheSubjoin.remote(instance.form, data => {})
    },
    contactFileSuccess (info) {
      this.form.contactFileId = info.data
      this.userIDImg = this.getImagePath(info.data)
    },
    reportSuccess (info) {
      this.form.reportFileId = info.data
      this.reportImg = this.getImagePath(info.data)
      commonMember.cacheSubjoin.remote(instance.form, data => {})
    },
    otherFileSuccess (info) {
      this.form.otherFileId = info.data
      this.otherFileImg = this.getImagePath(info.data)
      commonMember.cacheSubjoin.remote(instance.form, data => {})
    },
    // 图片预览
    imgPreview (url) {
      require.ensure(
        ['components/plugin/enLargeImg'],
        () => {
          const enLargeImg = require('components/plugin/enLargeImg')
          this.enLargeImg = this.$vue.component('imgPreview', enLargeImg)
          this.imgShow = true
          this.files = url
        },
        'enLargeImg'
      )
    }
  }
})
</script>
<style scoped>
.avatar-uploader{
  float:left;
}
.b-reg .step4-cca .stuff-item {
  position: relative;
  margin-right:22px;
}
.avatar-uploader img{
  width:130px;
  height:120px;
  margin-right:22px
}
</style>

<style>
#addDialog .el-form-item__error {
  width: 225px;
  top: 38px;
}
</style>
