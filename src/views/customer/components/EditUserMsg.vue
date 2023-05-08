<template>
  <div>
    <a-modal
      :title="'编辑['+name+']的信息'"
      :visible="visible"
      @cancel="handleCancel"
      :width="1200"
      :ok-button-props="{ style: {display: 'none'} }"
    >
      <a-tabs default-active-key="1" :tab-position="tabPosition">
        <a-tab-pane key="1" tab="基础信息更新">
          <a-form-model :model="userData.baseInfo" ref="customsrInfoForm" :rules="customsrInfoRules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="教育背景">
                  <a-select v-model="userData.baseInfo.eduBG">
                    <a-select-option v-for="(item,index) in eduBgEnum" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="民族">
                  <a-select v-model="userData.baseInfo.ethnicGroups" show-search>
                    <a-select-option v-for="(item,index) in nationData" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="血型">
                  <a-select v-model="userData.baseInfo.aboBloodType">
                    <a-select-option v-for="(item,index) in aboBloodTypeArr" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Rh血型">
                  <a-select v-model="userData.baseInfo.rhBloodType">
                    <a-select-option v-for="(item,index) in rhBloodTypeArr" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item prop="contactName" label="紧急联系人">
                  <a-input v-model="userData.baseInfo.contactName" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item prop="contactNumber" label="联系人电话">
                  <a-input v-model="userData.baseInfo.contactNumber" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="20" :pull="2">
                <a-form-model-item label="住址">
                  <Address ref="address" @changes="getAddress($event)"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="详细地址">
                  <a-input v-model="userData.baseInfo.homeAddress"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="单位">
                  <a-input v-model="userData.baseInfo.company" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="社区">
                  <a-input v-model="userData.baseInfo.community" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <div style="margin-top: 20px;text-align: center;">
              <a-button type="primary" size="large" @click="handleOk"> 确认修改 </a-button>
            </div>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="3" tab="健康史信息">
          <a-form-model :model="form" ref="healthRuleForm" :label-col="{span:2}" :wrapper-col="{span:22}">
            <a-form-model-item label="药物过敏史：">
              <div style="display:flex">
                <a-radio-group v-model="form.isAllergy">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isAllergy">
                  <a-select v-model="form.allergySelect" mode="multiple" placeholder="请选择过敏史" style="width: 220px">
                    <a-select-option value="青霉素">青霉素</a-select-option>
                    <a-select-option value="磺胺">磺胺</a-select-option>
                    <a-select-option value="链霉素">链霉素</a-select-option>
                    <a-select-option value="其他">其他</a-select-option>
                  </a-select>
                </div>
                <div class="flexBox" style="width:280px;" v-if="form.isAllergy && form.allergySelect.includes('其他')">
                  <a-input v-model="form.allergyHistory" placeholder="请输入其他过敏史，例如头孢" />
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="暴露史：" class="flexBox">
              <div style="display:flex">
                <a-radio-group v-model="form.isExposure" class="flexBox">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isExposure">
                  <a-select mode="multiple" placeholder="请选择暴露史" style="width: 220px" @select="changeSelectExposure" @deselect="deselectExposure">
                    <a-select-option value="化学品">化学品</a-select-option>
                    <a-select-option value="毒物">毒物</a-select-option>
                    <a-select-option value="射线">射线</a-select-option>
                  </a-select>
                </div>
                <div style="width:280px;" v-if="form.isExposure">
                  <a-row v-for="(item,index) in form.exposureSelect" :key="index">
                    <a-col :span="6"><a-tag>{{ item.species }}</a-tag></a-col>
                    <a-col :span="18"><a-input v-model="item.specificName" :placeholder="`列如：${item.species=='化学品'?'氨气':(item.species=='毒物'?'氨基乙酸':'α射线')}...`" /></a-col>
                  </a-row>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="疾病史：" class="flexBox">
              <div class="flexBox" style="width:100%">
                <a-radio-group v-model="form.isDisease" size="small">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isDisease">
                  <a-select mode="multiple" placeholder="请选择疾病史" style="width: 220px" @select="changeSelect($event, form.diseaseSelect)" @deselect="deselectDisease">
                    <a-select-option :value="item" v-for="(item,index) in diseaseSelectList" :key="index">{{ item }}</a-select-option>
                  </a-select>
                </div>
                <div v-if="form.isDisease">
                  <a-row v-for="(item,index) in form.diseaseSelect" :key="index">
                    <a-col :span="4"><a-tag>{{ item.name }}</a-tag></a-col>
                    <a-col :span="10"><a-month-picker v-model="item.time" placeholder="选择确诊日期" size="small"/></a-col>
                    <a-col :span="10" v-if="item.name==='其他法定传染病' || item.name==='职业病' || item.name==='其他'">
                      <a-input v-model="item.specificName" :placeholder="`请输入,例如${item.name==='其他法定传染病'?'艾滋病':(item.name==='职业病'?'尘肺':'梅毒')}...`"/>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="手术史：" class="flexBox">
              <div class="flexBox">
                <a-radio-group v-model="form.isOperation" class="flexBox" size="small">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isOperation">
                  <a-select mode="tags" placeholder="请输入手术史按回车" style="width: 220px" @select="changeSelect($event, form.operationList)" @deselect="deselectOpera">
                    <a-select-option :value="item.name" v-for="(item,index) in form.operationList" :key="index">{{ item.name }}</a-select-option>
                  </a-select>
                </div>
                <div v-if="form.isOperation">
                  <a-row v-for="(item,index) in form.operationList" :key="index">
                    <a-col :span="6"><a-tag>{{ item.name }}</a-tag></a-col>
                    <a-col :span="18"><a-month-picker v-model="item.time" placeholder="选择手术日期" size="small"/></a-col>
                  </a-row>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="外伤史：" class="flexBox">
              <div class="flexBox">
                <a-radio-group v-model="form.isTrauma" class="flexBox" size="small">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isTrauma">
                  <a-select mode="tags" placeholder="请输入外伤史按回车" style="width: 220px" @select="changeSelect($event, form.traumaList)" @deselect="deselectTrauma">
                    <a-select-option :value="item.name" v-for="(item,index) in form.traumaList" :key="index">{{ item.name }}</a-select-option>
                  </a-select>
                </div>
                <div v-if="form.isTrauma">
                  <a-row v-for="(item,index) in form.traumaList" :key="index">
                    <a-col :span="6"><a-tag>{{ item.name }}</a-tag></a-col>
                    <a-col :span="18"><a-month-picker v-model="item.time" placeholder="选择外伤日期" size="small"/></a-col>
                  </a-row>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="输血史：" class="flexBox">
              <div class="flexBox">
                <a-radio-group v-model="form.isBloodTrans" class="flexBox" size="small">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div v-if="form.isBloodTrans">
                  <div v-for="(item,index) in form.bloodHistory" :key="index" class="flexBox">
                    <a-select v-model="item.name" style="width:157px;" placeholder="请选择血型">
                      <a-select-option v-for="(bloodType,index2) in aboBloodTypeArr" :key="index2" :value="bloodType">
                        {{ bloodType }}
                      </a-select-option>
                    </a-select>
                    <a-select v-model="item.rh" style="width:157px;" placeholder="请选择RH">
                      <a-select-option v-for="(rhBlood,index3) in rhBloodTypeArr" :key="index3" :value="rhBlood">
                        {{ rhBlood }}
                      </a-select-option>
                    </a-select>
                    <a-month-picker v-model="item.time" placeholder="选择输血日期"/>
                    <a-icon
                      v-if="form.bloodHistory.length > 1"
                      class="dynamic-delete-button"
                      type="minus-circle-o"
                      @click="removeDomain(item)"
                    />
                  </div>
                  <a-button type="dashed" @click="addDomain">
                    <a-icon type="plus" />
                  </a-button>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="家族史：" class="flexBox">
              <div class="flexBox">
                <a-radio-group v-model="form.isFamilyHistory" class="flexBox" size="small">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isFamilyHistory">
                  <a-select mode="tags" style="width:220px;" placeholder="请选择亲属" @select="changeSelectFamily" @deselect="deselectFamily">
                    <a-select-option v-for="(item,index) in families" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                  <div>
                    <a-row v-for="(item, index) in form.familyPerson" :key="index">
                      <a-col :span="6"><a-tag>{{ item.relation }}</a-tag></a-col>
                      <a-col :span="18">
                        <a-select v-model="item.content" mode="tags" style="width:280px;" placeholder="请选择家族疾病">
                          <a-select-option v-for="(item2,index2) in diseaseSelectList" :key="index2" :value="item2">
                            {{ item2 }}
                          </a-select-option>
                        </a-select>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="遗传病史：" class="flexBox">
              <div class="flexBox">
                <a-radio-group v-model="form.isHereditary" class="flexBox" size="small">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isHereditary">
                  <a-select v-model="form.hereditaryDiseaseList" mode="tags" style="width:500px;" placeholder="请输入遗传病名称并按回车">
                    <a-select-option v-for="(item,index) in form.hereditaryDiseaseList" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="残疾情况：" class="flexBox">
              <div class="flexBox">
                <a-radio-group v-model="form.isDisability" class="flexBox" size="small">
                  <a-radio :value="false">
                    无
                  </a-radio>
                  <a-radio :value="true">
                    有
                  </a-radio>
                </a-radio-group>
                <div class="flexBox" v-if="form.isDisability">
                  <a-select v-model="form.disabilityList" mode="tags" style="width:220px;" placeholder="请选择残疾类型">
                    <a-select-option v-for="(item,index) in disability" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                  <div class="flexBox" style="width:280px;" v-if="form.isDisability && form.disabilityList.includes('其他残疾')">
                    <a-input v-model="form.otherDisability" placeholder="请输入其他残疾情况" />
                  </div>
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="医疗支付方式：" class="flexBox">
              <div class="flexBox" style="margin-left:20px;">
                <a-select v-model="form.payMethod" mode="tags" style="width:240px;" placeholder="请选择医疗费用支付方式">
                  <a-select-option v-for="(item,index) in payments" :key="index" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
                <div class="flexBox" style="width:280px;" v-if="form.payMethod.includes('其他')">
                  <a-input v-model="form.otherpayMethod" placeholder="请输入其他支付方式" />
                </div>
              </div>
            </a-form-model-item>
            <a-form-model-item style="text-align: center;">
              <a-button type="primary" @click="onSubmit">
                提交
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="手机号码更新">
          <div class="input">
            <a-form-model ref="ruleForm" :model="phoneForm" :rules="rules">
              <!-- 手机号 -->
              <a-form-model-item ref="telephone" prop="telephone">
                <a-input size="large" v-model="phoneForm.telephone" placeholder="请输入新的手机号"> <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/></a-input>
              </a-form-model-item>
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="16">
                  <!-- 输入验证码 -->
                  <a-form-model-item ref="code" prop="code">
                    <a-input size="large" v-model="phoneForm.code" placeholder="请输入验证码">
                      <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <!-- 验证码按钮 -->
                <a-col class="gutter-row" :span="8">
                  <a-button
                    :disabled="state.smsSendBtn"
                    @click="getUserCode(phoneForm.telephone)"
                    class="getCaptcha"
                    v-text="!state.smsSendBtn && ( state.name ) || (state.time+' s')"
                  ></a-button>
                </a-col>
              </a-row>
              <a-form-model-item style="text-align: center;">
                <a-button type="primary" @click="updatePhone"> 确认修改 </a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">
                  重置表单
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import Address from '@/components/CheckAddress/CheckAddress.vue'
import { editGroupCustomer as apiEditGroupCustomer, getCode as apiGetCode, updatePhone as apiUpdatePhone, submitHealthHistory, getHealthHistory } from '@/api/customer'
import { nation } from './nation'

export default {
  components: {
    Address
  },
  data () {
    return {
      groupId: null,
      customerId: null,
      visible: false,
      phoneForm: {
        telephone: '',
        code: '',
        token: ''
      },
      state: {
        smsSendBtn: false,
        time: 60,
        name: '获取验证码',
        timer: null,
        ruleShow: true
      },
      name: null,
      userData: {
        baseInfo: {
          eduBG: null,
          ethnicGroups: null,
          aboBloodType: null,
          rhBloodType: null,
          contactName: null,
          contactNumber: null,
          homeAddress: null,
          province: null,
          city: null,
          area: null,
          street: null,
          company: null,
          community: null
        }
      },
      diseaseSelectList: ['高血压', '糖尿病', '冠心病', '慢性阻塞性肺疾病', '恶性肿瘤', '脑卒中', '精神障碍', '结核病', '肝炎', '冶游史', '疟疾', '破伤风', '其他法定传染病', '职业病', '其他'],
      families: ['父亲', '母亲', '兄弟姐妹', '子女'],
      disability: ['视力残疾', '听力残疾', '言语残疾', '肢体残疾', '智力残疾', '精神残疾', '其他残疾'],
      payments: ['城镇职工基本医疗保险', '城镇居民基本医疗保险', '新型农村合作医疗', '贫困救助', '商业医疗保险', '全公费', '全自费', '其他'],
      form: {},
      tabPosition: 'left',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
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
      nationData: nation(),
      rules: {
        telephone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      customsrInfoRules: {
        contactNumber: [
          { required: true, message: '请输入紧急联系人号码', trigger: 'blur' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        contactName: [
          { required: true, message: '请输入紧急联系人姓名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async init (customerId) {
      const res = await getHealthHistory(customerId)
      if (res.status === 200) {
        console.log(res)
        this.form = {
          isAllergy: res.data.drugAllergyHistory.length > 0, // 是否有药物过敏史
          allergySelect: res.data.drugAllergyHistory,
          allergyHistory: res.data.otherAllergy,
          isExposure: res.data.exposureHistory.length > 0, // 暴露史
          exposureSelect: res.data.exposureHistory,
          isDisease: res.data.pastHistory.diseaseHistory.length > 0, // 疾病史
          isOperation: res.data.pastHistory.operationHistory.length > 0,
          diseaseSelect: res.data.pastHistory.diseaseHistory,
          operationList: res.data.pastHistory.operationHistory,
          isTrauma: res.data.pastHistory.traumaHistory.length > 0,
          traumaList: res.data.pastHistory.traumaHistory,
          isBloodTrans: res.data.pastHistory.bloodTransfusionHistory.length > 0,
          bloodHistory: res.data.pastHistory.bloodTransfusionHistory,
          isFamilyHistory: res.data.familyHistory.length > 0,
          familyPerson: res.data.familyHistory,
          isHereditary: res.data.geneticHistory.length > 0,
          hereditaryDiseaseList: res.data.geneticHistory,
          isDisability: res.data.disability.length > 0,
          disabilityList: res.data.disability,
          otherDisability: res.data.otherDisability, // 其他残疾
          payMethod: res.data.paymentMethod, // 医疗支付方式
          otherpayMethod: res.data.otherPayMethod
        }
      } else {
        this.form = {
          isAllergy: null, // 是否有药物过敏史
          allergySelect: [],
          allergyHistory: '',
          isExposure: null, // 暴露史
          exposureSelect: [],
          isDisease: null, // 疾病史
          isOperation: null,
          diseaseSelect: [],
          operationList: [],
          isTrauma: null,
          traumaList: [],
          isBloodTrans: null,
          bloodHistory: [],
          isFamilyHistory: null,
          familyPerson: [],
          isHereditary: null,
          hereditaryDiseaseList: [],
          isDisability: null,
          disabilityList: [],
          otherDisability: '', // 其他残疾
          payMethod: [], // 医疗支付方式
          otherpayMethod: ''
        }
      }
    },
    openModel () {
      this.visible = true
    },
    getUserData (groupId, data) {
      this.groupId = groupId
      const arrData = data.member
      this.customerId = arrData.id
      this.init(arrData.id)
      this.name = arrData.baseInfo.name
      this.userData.baseInfo = {
        eduBG: arrData.baseInfo.eduBG,
        ethnicGroups: arrData.baseInfo.ethnicGroups,
        aboBloodType: arrData.baseInfo.aboBloodType,
        rhBloodType: arrData.baseInfo.rhBloodType,
        contactName: arrData.baseInfo.contactName,
        contactNumber: arrData.baseInfo.contactNumber,
        homeAddress: arrData.baseInfo.homeAddress,
        province: arrData.baseInfo.province,
        city: arrData.baseInfo.city,
        area: arrData.baseInfo.area,
        street: arrData.baseInfo.street,
        company: arrData.baseInfo.company,
        community: arrData.baseInfo.community
      }
      const arrAddress = { province: arrData.baseInfo.province, city: arrData.baseInfo.city, area: arrData.baseInfo.area, street: arrData.baseInfo.street }
      // 不用nextTick会报初始化错误
      this.$nextTick(() => {
        this.$refs.address.setAddress(arrAddress)
      })
      // this.$refs.address.setAddress(arrAddress)
      // console.log(groupId, '子组件', data)
    },
    callback (val) {
      // console.log(val)
    },
    handleOk (e) {
      const groupId = this.groupId
      const customerId = this.customerId
      const data = this.userData
      e.preventDefault()
      this.$refs.customsrInfoForm.validate(valid => {
        if (valid) {
          apiEditGroupCustomer(groupId, customerId, data).then(res => {
            if (res.status === 200) {
              this.$message.success('修改成功')
              this.visible = false
              this.$parent.onSearch()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    getAddress (value) {
      const arrData = this.userData.baseInfo
      arrData.province = value.pro
      arrData.city = value.city
      arrData.area = value.area
      arrData.street = value.street
      // console.log('地址', value)
    },
    // 获取验证码
    getUserCode (p) {
      var Reg = /^[1][34578][0-9]{9}$/
      if (this.phoneForm.telephone === '') {
        this.$message.error('请输入手机号码')
      } else if (Reg.test(this.phoneForm.telephone)) {
        apiGetCode(p).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message || '验证码发送成功')
            this.phoneForm.token = res.data.token
            this.state.smsSendBtn = true
            const interval = window.setInterval(() => {
              if (this.state.time-- <= 0) {
                this.state.time = 60
                this.state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)
          } else if (res.status === 400) {
            this.$message.error(res.message || '发送验证码失败')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.warning('手机号码格式不正确')
      }
    },
    /**
     * 确定修改手机号
     */
    updatePhone (e) {
      const groupId = this.groupId
      const customerId = this.customerId
      const phoneForm = this.phoneForm
      e.preventDefault()
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const res = await apiUpdatePhone(groupId, customerId, phoneForm)
          if (res.status === 200) {
            this.$message.success(res.message || '修改手机号码成功')
            this.$emit('onSearch')
            this.visible = false
          } else {
            this.$message.error(res.message || '修改手机号码失败')
          }
        } else {
          return false
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    onSubmit () {
      this.$refs.healthRuleForm.validate(valid => {
        if (valid) {
          console.log('111111111', this.form)
          this.healthHistoryForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async healthHistoryForm () {
      const pastHistory = {
        diseaseHistory: this.form.isDisease ? this.form.diseaseSelect : [], // 疾病史
        operationHistory: this.form.isOperation ? this.form.operationList : [], // 手术史
        traumaHistory: this.form.isTrauma ? this.form.traumaList : [], // 外伤史
        bloodTransfusionHistory: this.form.isBloodTrans ? this.form.bloodHistory : []
      }
      const payLoad = {
        drugAllergyHistory: this.form.isAllergy ? this.form.allergySelect : [], // 过敏史
        exposureHistory: this.form.isExposure ? this.form.exposureSelect : [], // 暴露史
        pastHistory: pastHistory,
        familyHistory: this.form.isFamilyHistory ? this.form.familyPerson : [],
        geneticHistory: this.form.isHereditary ? this.form.hereditaryDiseaseList : [],
        disability: this.form.isDisability ? this.form.disabilityList : [],
        paymentMethod: this.form.payMethod,
        otherDisability: this.form.otherDisability,
        otherPayMethod: this.form.otherpayMethod,
        otherAllergy: this.form.allergyHistory
      }
      const res = await submitHealthHistory(this.customerId, payLoad)
      if (res.status === 200) {
        this.$message.success('修改成功')
        this.visible = false
      }
      console.log('提交表单结果', res)
    },
    changeSelect (e, value) {
      value.push({ name: e, time: '' })
    },
    changeSelectExposure (e) {
      this.form.exposureSelect.push({ species: e, specificName: '' })
    },
    changeSelectFamily (e) {
      console.log(e)
      this.form.familyPerson.push({ relation: e, content: [] })
    },
    deselectTrauma (e) {
      this.form.traumaList = this.form.traumaList.filter(item => {
        return item.name !== e
      })
    },
    deselectOpera (e) {
      this.form.operationList = this.form.operationList.filter(item => {
        return item.name !== e
      })
    },
    deselectDisease (e) {
      this.form.diseaseSelect = this.form.diseaseSelect.filter(item => {
        return item.name !== e
      })
    },
    deselectExposure (e) {
      this.form.exposureSelect = this.form.exposureSelect.filter(item => {
        return item.species !== e
      })
    },
    deselectFamily (e) {
      this.form.familyPerson = this.form.familyPerson.filter(item => {
        return item.relation !== e
      })
    },
    addDomain () {
      this.form.bloodHistory.push({
        name: undefined,
        rh: undefined,
        time: ''
      })
    },
    removeDomain (item) {
      const index = this.form.bloodHistory.indexOf(item)
      if (index !== -1) {
        this.form.bloodHistory.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.title{
  text-align: center;
  margin-bottom: 4%;
  /* font-size: 2em; */
}
.forgetContent {
  margin: 5% 20%;
}
.input{
  margin: 0 auto;
  margin-top: 5%;
  width: 60%;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  /* text-align: center; */
  padding-top: 80px;
}
.steps-action {
  margin-top: 24px;
}
.getCaptcha {
  display: block;
  width: 100%;
  height: 40px;
}
.flexBox{
  display: flex;
  align-items: center;
}
</style>
