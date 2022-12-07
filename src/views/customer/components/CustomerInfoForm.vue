<template>
  <div>
    <!-- 新建群组&用户 -->
    <a-modal
      v-model="visible"
      v-if="visible"
      :title="groupShow === false ? '新增家庭' : '新增成员'"
      @ok="handleOk"
      @cancel="handleOff"
      destroyOnClose
      :width="1000">
      <a-form-model ref="ruleForm" :model="form" :rules="info_rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row v-if="groupShow">
          <a-col :span="12">
            <a-form-model-item label="群组" ref="groupId" prop="groupId">
              <a-select :disabled="groupShow" v-model="form.groupId" show-search allowClear>
                <a-select-option v-for="(item) in groupIdArr" :key="item.id" :value="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="姓名" ref="name" prop="name">
              <a-input placeholder="请输入姓名" v-model="form.name"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="民族" ref="ethnicGroups" prop="ethnicGroups">
              <a-select v-model="form.ethnicGroups" placeholder="请选择民族" show-search>
                <a-select-option v-for="(item,index) in nationData" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="证件类型" prop="idType">
              <a-select v-model="form.idType" placeholder="请选择证件类型">
                <a-select-option v-for="(item,index) in idTypeEnum" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="证件号" ref="idNo" prop="idNo">
              <a-input placeholder="请输入证件号" v-model="form.idNo"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="性别" prop="gender">
              <a-select v-model="form.gender" placeholder="请选择性别">
                <a-select-option v-for="(item,index) in genderEnum" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="出生日期" required prop="birthDate">
              <a-date-picker
                v-model="form.birthDate"
                type="date"
                placeholder="请选择你的出生日期"
                style="width: 100%;"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="年龄" ref="age" prop="age">
              <a-input placeholder="请输入年龄" v-model="form.age"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="血型" ref="aboBloodType" prop="aboBloodType">
              <a-select v-model="form.aboBloodType" placeholder="请选择血型">
                <a-select-option v-for="(item,index) in aboBloodTypeArr" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="Rh血型" ref="rhBloodType" prop="rhBloodType">
              <a-select v-model="form.rhBloodType" placeholder="请选择Rh血型">
                <a-select-option v-for="(item,index) in rhBloodTypeArr" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="手机号码" ref="phoneNumber" prop="phoneNumber">
              <a-input placeholder="请输入手机号" v-model="form.phoneNumber"><a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-row >
              <a-col :span="10" :pull="1">
                <!-- 输入验证码 -->
                <a-form-model-item ref="code" prop="code">
                  <a-input v-model="form.code" placeholder="请输入验证码">
                    <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                  </a-input>
                </a-form-model-item>
              </a-col>
              <!-- 验证码按钮 -->
              <a-col class="gutter-row" :span="5" :pull="4">
                <a-form-model-item>
                  <a-button v-if="codeShow" @click="getUserCode(form.phoneNumber)">{{ codebtnWord }}</a-button>
                  <a-button :disabled="!codeShow" v-if="!codeShow">{{ count }}秒后重试</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="教育背景" prop="eduBG">
              <a-select v-model="form.eduBG" placeholder="请选择教育背景">
                <a-select-option v-for="(item,index) in eduBgEnum" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="紧急联系人" ref="contactName" prop="contactName">
              <a-input placeholder="请输入紧急联系人姓名" v-model="form.contactName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人手机号码" ref="contactNumber" prop="contactNumber">
              <a-input placeholder="请输入紧急联系人电话" v-model="form.contactNumber"><a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20" :pull="2" >
            <a-form-model-item label="住址:">
              <Address @changes="getAddress($event)" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="详细地址:">
              <a-input v-model="form.homeAddress" placeholder="请输入详细地址"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { nation } from './nation'
import Address from '@/components/CheckAddress/CheckAddress.vue'
import { customerRepeat as apiCustomerRepeat, searchCustomerUnderGroup as apiSearchCustomerUnderGroup, customerAdd as apiCustomerAdd } from '@/api/customer'
// import { customerRepeat as apiCustomerRepeat, searchCustomerUnderGroup as apiSearchCustomerUnderGroup } from '@/api/customer'
import { getCode } from '@/api/login'
export default {
  components: {
    // AddressInfo
    Address
  },
  props: {
    dataTypes: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    // 身份证校验
    var checkIdno = (rule, value, callback) => {
    if (value) {
        // 加权因子
        var weightfactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验码
        var checkcode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
        var code = value + ''
        var last = value[17] // 最后一个
        var seventeen = code.substring(0, 17)
        // 判断最后一位校验码是否正确
        var arr = seventeen.split('')
        var len = arr.length
        var num = 0
        for (var i = 0; i < len; i++) {
          num = num + arr[i] * weightfactor[i]
        }
        // 获取余数
        var resisue = num % 11
        var lastno = checkcode[resisue]
        // 正则判断
        var idcardpatter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
        // 判断格式是否正确
        var format = idcardpatter.test(value)
        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        var idCode = last === lastno && format ? 1 : false
        // 根据结果判断
        if (!idCode) {
          // console.log('>>>>>>>', idCode)
          callback(new Error('输入证件号有误'))
        } else {
          // console.log('>>>>>>>', value)
          apiCustomerRepeat('id_number', value).then(res => {
            // console.log('res', res)
            if (res.status === 200) {
              // 根据接口返回data判断,true为已被注册
              if (res.data) {
                callback(new Error('证件号已被注册'))
              } else {
                // console.log('可注册证件号', res)
                var gender = value[16]
                var year = value.slice(6, 10)
                var month = value.slice(10, 12)
                var day = value.slice(12, 14)
                // 自动填写性别
                if (this.form.gender === undefined) {
                  if (gender % 2 === 0) {
                    this.form.gender = '女'
                  } else {
                    this.form.gender = '男'
                  }
                }
                // 自动填写出生日期
                if (this.form.birthDate === '') {
                  this.form.birthDate = moment(year + month + day, 'YYYY-MM-DD')
                }
                // 自动填写年龄
                if (this.form.age === '') {
                  var nowDate = new Date()
                  var nowMonth = nowDate.getMonth() + 1
                  var nowDay = nowDate.getDate
                  var age = nowDate.getFullYear() - year
                  if (nowMonth < month || (month === nowMonth && nowDay < day)) {
                    age--
                    this.form.age = age
                  } else {
                    // console.log(age)
                    this.form.age = age
                  }
                }
                callback()
              }
            } else {
              callback(new Error('!!'))
            }
          })
        }
      } else if (!value) {
        callback(new Error('请输入证件号码'))
      }
    }
    // 验证码校验
    var checkCode = (rule, value, callback) => {
      if (value) {
        callback()
      } else if (!value) {
        if (this.form.phoneNumber === '') {
          // console.log('1', this.form.phoneNumber)
          callback()
        } else {
          // console.log('2', this.form.phoneNumber)
          callback(new Error('请输入验证码'))
        }
      }
    }
    // 手机号校验
    var checkPhone = (rule, value, callback) => {
      if (value) {
        // 根据groupShow判断从新建群组还是新建用户入口进入
        if (this.groupShow) {
          // 如果输入的号码和群主一样，则不用判断
          if (this.dataTypes.data.manager.telephone === this.form.phoneNumber) {
            callback()
          } else {
            apiCustomerRepeat('telephone', value).then(res => {
              if (res.status === 200) {
                // 根据接口返回data判断,true为已被注册
                if (res.data) {
                  callback(new Error('手机号已被注册'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('异常'))
              }
            })
          }
        } else {
          apiCustomerRepeat('telephone', value).then(res => {
            if (res.status === 200) {
              // 根据接口返回data判断,true为已被注册
              if (res.data) {
                callback(new Error('手机号已被注册'))
              } else {
                callback()
              }
            } else {
              callback(new Error('异常'))
            }
          })
        }
      } else {
        callback()
      }
    }
    return {
      dataTypesTemp: this.dataTypes,
      pages: {
        page: 1,
        size: 10
      },
      codebtnWord: '获取验证码', // 获取验证码按钮文字
      codeShow: true,
      groupShow: false,
      count: '', // 刷新秒数提示
      timer: null,
      nationData: nation(),
      visible: false,
      state: {
        smsSendBtn: false,
        time: 60,
        name: '获取验证码',
        timer: null,
        ruleShow: true
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      idTypeEnum: [
         '居民身份证',
         '居民户口簿',
         '护照',
         '军官证',
         '驾驶证',
         '港涣居民来往内地通行证',
         '台湾居民来往内地通行证',
         '其他法定有效证件'
      ],
      genderEnum: [
        '男',
        '女',
        '未知的性别',
        '未说明的性别'
      ],
      eduBgEnum: [
          '研究生及以上',
          '本科',
          '高中',
          '初中',
          '小学',
          '其他'
      ],
      aboBloodTypeArr: [
        'A型', 'B型', 'O型', 'AB型', '不详'
      ],
      rhBloodTypeArr: [
        'Rh阴型', 'Rh阳型', '不详'
      ],
      groupIdArr: [],
      form: {
        groupId: '',
        token: '',
        code: '',
        name: '',
        gender: undefined,
        birthDate: '',
        idType: undefined,
        eduBG: undefined,
        idNo: '',
        phoneNumber: '',
        contactName: '',
        contactNumber: '',
        ethnicGroups: undefined,
        province: '',
        city: '',
        area: '',
        street: '',
        age: '',
        homeAddress: '',
        address: '',
        aboBloodType: undefined, // 血型
        rhBloodType: undefined
      },
      apiForm: {
        nickname: '',
        groupId: '',
        telephone: '',
        token: '',
        code: '',
        baseInfo: {
          name: '',
          gender: null,
          birthDate: '',
          idType: null,
          eduBG: null,
          aboBloodType: null,
          rhBloodType: null,
          idNo: '',
          phoneNumber: '',
          contactName: '',
          contactNumber: '',
          ethnicGroups: null,
          province: '',
          city: '',
          area: '',
          street: '',
          homeAddress: ''
        }
      },
      // 用户信息规则
      info_rules: {
        idType: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        idNo: [
          { required: true, message: '请输入证件号码', trigger: 'blur' },
          //  { max: 18, message: '请输入正确的证件号码', trigger: 'blur' },
          //  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的证件号码' },
          { validator: checkIdno, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        code: [
          //  { required: true, message: '请输入验证码', trigger: 'blur' }
          { validator: checkCode, trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入紧急联系人', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入紧急联系人电话号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        birthDate: [
          { required: true, message: '请选择出生日期', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    resetData () {
      const resetData = {
        groupId: '',
        token: '',
        code: '',
        name: '',
        gender: undefined,
        birthDate: '',
        idType: undefined,
        eduBG: undefined,
        idNo: '',
        phoneNumber: '',
        contactName: '',
        contactNumber: '',
        ethnicGroups: undefined,
        province: '',
        city: '',
        area: '',
        street: '',
        age: '',
        homeAddress: '',
        address: '',
        aboBloodType: undefined,
        rhBloodType: undefined
      }
      this.form = resetData
    },
    addComponent () {
      apiSearchCustomerUnderGroup('', this.pages).then(res => {
        if (res.status === 200) {
          this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
        } else {
          this.$message.error(res.status)
        }
        this.groupIdArr = res.data.content
      })
      this.resetData()
      this.groupShow = false
      this.form.groupId = ''
    },
    initComponent () {
      apiSearchCustomerUnderGroup('', this.pages).then(res => {
        if (res.status === 200) {
          this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
        } else {
          this.$message.error(res.status)
        }
        this.groupIdArr = res.data.content
      })
      this.resetData()
      this.groupShow = true
      this.form.groupId = this.dataTypesTemp.data.name
    },
    openModel () {
      this.visible = true
    },
    // 过滤数据
    fitSelect (value) {
      if (value) {
        return value
      } else {
        return null
      }
    },
    handleOk (e) {
      console.log('form', this.form)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const that = this
          const baseInfo = this.apiForm.baseInfo
          const form = JSON.parse(JSON.stringify(this.form))
          baseInfo.eduBG = this.fitSelect(form.eduBG)
          baseInfo.aboBloodType = this.fitSelect(form.aboBloodType)
          baseInfo.rhBloodType = this.fitSelect(form.rhBloodType)
          baseInfo.ethnicGroups = this.fitSelect(form.ethnicGroups)
          this.apiForm.telephone = this.fitSelect(form.phoneNumber)
          this.apiForm.nickname = form.name
          this.apiForm.code = form.code
          this.apiForm.token = form.token
          baseInfo.name = form.name
          baseInfo.gender = form.gender
          baseInfo.idType = form.idType
          baseInfo.idNo = form.idNo
          baseInfo.phoneNumber = form.phoneNumber
          baseInfo.contactName = form.contactName
          baseInfo.contactNumber = form.contactNumber
          baseInfo.province = this.fitSelect(form.province)
          baseInfo.city = this.fitSelect(form.city)
          baseInfo.area = this.fitSelect(form.area)
          baseInfo.street = this.fitSelect(form.street)
          baseInfo.homeAddress = this.fitSelect(form.homeAddress)
          baseInfo.birthDate = form.birthDate
          if (form.groupId) {
            this.groupIdArr.forEach(function (val) {
              if (val.name === form.groupId) {
                that.apiForm.groupId = val.id
              }
            })
          } else {
            this.apiForm.groupId = -1
          }
          // console.log('点击了确定,我是传回后端的数据', this.apiForm)
          const groupId = this.apiForm.groupId
          const apiForm = this.apiForm
          // console.log('apiForm', this.apiForm)
          apiCustomerAdd(groupId, apiForm).then(res => {
            if (res.status === 201) {
              this.$message.info(res.message)
              // console.log('添加成功', apiForm)
            } else {
              this.$message.error(res.status)
            }
          })
          this.visible = false
        } else {
          // console.log('信息确定', this.form)
        }
      })
      // console.log('点击了确定,且信息确定', this.form)
    },
    // 取消
    handleOff () {
      this.resetData()
    },
    // 获取子组件地址
    getAddress (value) {
      this.form.province = value.pro
      this.form.city = value.city
      this.form.area = value.area
      this.form.street = value.street
      // console.log('address', value)
    },
    getUserCode (i) {
      var Reg = /^[1][34578][0-9]{9}$/
      if (Reg.test(this.form.phoneNumber)) {
        getCode(i).then(res => {
          // this.$message.info('验证码发送成功')
          if (res.status === 200) {
            // console.log('验证码', res)
            this.form.token = res.data.token
            this.$message.info('验证码发送成功')
            // console.log(res.data.token)
            this.form.token = res.data.token // 保存token到data中
            // 60秒刷新
            const TIME_COUNT = 60
            if (!this.timer) {
              this.count = TIME_COUNT
              this.codeShow = false
              this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.codeShow = true
                clearInterval(this.timer)
                this.timer = null
                }
              }, 1000)
            }
          } else if (res.status === 400) {
            this.$message.error(res.message || '获取验证码失败')
            const TIME_COUNT = 60
            if (!this.timer) {
              this.count = TIME_COUNT
              this.codeShow = false
              this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.codeShow = true
                clearInterval(this.timer)
                this.timer = null
                }
              }, 1000)
            }
          } else {
            const TIME_COUNT = 60
            if (!this.timer) {
              this.count = TIME_COUNT
              this.codeShow = false
              this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.codeShow = true
                clearInterval(this.timer)
                this.timer = null
                }
              }, 1000)
            }
            this.$message.error(res.message)
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.getCaptcha {
  display: block;
  width: 100%;
  height: 40px;
}
</style>
