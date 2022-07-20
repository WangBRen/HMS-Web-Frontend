<template>
  <div>
    <!-- 新建群组&用户 -->
    <a-modal
      v-model="visible"
      title="新建用户"
      @ok="handleOk"
      @cancel="handleOff"
      destroyOnClose
      :width="1000">
      <a-form-model ref="ruleForm" :model="form" :rules="info_rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="姓名" ref="name" prop="name">
              <a-input v-model="form.baseInfo.name"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="民族" ref="ethnicGroups" prop="ethnicGroups">
              <a-input v-model="form.baseInfo.ethnicGroups"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="证件类型" prop="idType">
              <a-select v-model="form.baseInfo.idType" placeholder="请选择证件类型">
                <a-select-option v-for="(item) in idTypeEnum" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="证件号" ref="idNo" prop="idNo">
              <a-input v-model="form.baseInfo.idNo"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="性别" prop="gender">
              <a-select v-model="form.baseInfo.gender" placeholder="请选择性别">
                <a-select-option v-for="(item,index) in idTypeEnum" :key="index" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="出生年月日" required prop="birthDate">
              <a-date-picker
                v-model="form.baseInfo.birthDate"
                type="date"
                placeholder="请选择你的出生年月份"
                style="width: 100%;"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="手机号码" ref="phoneNumber" prop="phoneNumber">
              <a-input v-model="form.baseInfo.phoneNumber"><a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-row >
              <a-col :span="11" :offset="6">
                <!-- 输入验证码 -->
                <a-form-model-item ref="code" prop="code">
                  <a-input v-model="form.code" placeholder="请输入验证码">
                    <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                  </a-input>
                </a-form-model-item>
              </a-col>
              <!-- 验证码按钮 -->
              <a-col class="gutter-row" :span="5">
                <a-button
                  :disabled="state.smsSendBtn"
                  @click="getUserCode(form.telephone)"
                  class="getCaptcha"
                  v-text="!state.smsSendBtn && ( state.name ) || (state.time+' s')"
                ></a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="教育背景" prop="eduBG">
                <a-select v-model="form.baseInfo.eduBG" placeholder="请选择教育背景">
                  <a-select-option v-for="(item,index) in eduBgEnum" :key="index" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-col :span="12">
            <a-form-model-item label="联系人" ref="contactName" prop="contactName">
              <a-input v-model="form.baseInfo.contactName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人手机号码" ref="contactNumber" prop="contactNumber">
              <a-input v-model="form.baseInfo.contactNumber"><a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/></a-input>
            </a-form-model-item>
          </a-col>
          <a-row>
            <a-col :span="12">
              <a-row type="flex" justify="space-between">
                <a-col :span="8">
                  <a-form-model-item label="住址:">
                    <a-select
                      placeholder="全部省份"
                      v-model="form.provinceId"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item v-model="form.city">
                    <a-select
                      placeholder="全部城市"
                      notFoundContent="暂无数据"
                      v-model="form.municipalityId"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item v-model="form.area">
                    <a-select
                      allowClear
                      placeholder="全部地区"
                      notFoundContent="暂无数据"
                      v-model="form.districtId"
                    >
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-form-model-item v-model="form.area" label="详细地址:"><a-input placeholder="详细地址"></a-input></a-form-model-item>
            </a-col>
          </a-row>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
export default {
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
          callback()
        }
      } else if (!value) {
        callback(new Error('请输入证件号'))
      }
    }
    return {
      visible: false,
       /**
       * 验证码转化
       */
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
      eduBgEnum: [
          '研究生及以上',
          '本科',
          '高中',
          '初中',
          '小学',
          '其他'
          ],
      form: {
        nickname: '',
        avatar: '',
        account: '',
        telephone: '',
        code: '',
        baseInfo: {
          name: '',
          gender: '',
          birthDate: '',
          idType: '',
          eduBG: '',
          aboBloodType: '',
          rhBloodType: '',
          idNo: '',
          phoneNumber: '',
          contactName: '',
          contactNumber: '',
          ethnicGroups: '',
          province: '',
          city: '',
          area: '',
          street: '',
          village: '',
          homeAddress: ''
        },
        provinceList: [],
        municipalityList: [],
        districtList: []
      },
      // 用户信息规则
      info_rules: {
        idType: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        idNo: [
          //  { required: true, message: '请输入证件号码', trigger: 'blur' },
          //  { min: 15, max: 18, message: '请输入正确的证件号码', trigger: 'blur' },
          //  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的证件号码' },
           { validator: checkIdno, trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        code: [
           { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        oldPassword: [
           { required: true, message: '请输入密码', trigger: 'blur' },
           { min: 8, message: '密码长度至少8位', trigger: 'blur' },
           { max: 16, message: '密码长度最高16位', trigger: 'blur' },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ],
        newPassword: [
           { required: true, message: '请再次输入密码', trigger: 'blur' },
           { min: 8, message: '密码长度至少8位', trigger: 'blur' },
           { max: 16, message: '密码长度最高16位', trigger: 'blur' },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    // 重置表单
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    openModel () {
      this.visible = true
    },
    handleOk (e) {
      console.log('点击了确定')
    },
    // 取消
    handleOff () {
      this.resetForm()
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
