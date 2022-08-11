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
          <a-form-model :model="userData" :label-col="labelCol" :wrapper-col="wrapperCol">
            <!-- <a-row>
              <a-col :span="24">
                <div class="editTitle">
                  姓名：{{ userData.nickname }}
                </div>
              </a-col>
            </a-row> -->
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
                <a-form-model-item label="紧急联系人">
                  <a-input v-model="userData.baseInfo.contactName" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="联系人电话">
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
import { editGroupCustomer, getCode as apiGetCode, updatePhone as apiUpdatePhone } from '@/api/customer'
import { nation } from '../nation'

export default {
    components: {
      Address
    },
    data () {
      return {
        name: null,
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
        userData: {
            nickname: null,
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
                street: null
            }
        },
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
        }
      }
    },
    methods: {
      openModel () {
        this.visible = true
      },
      getUserData (groupId, data) {
        this.groupId = groupId
        const arrData = data.member
        this.customerId = arrData.id
        this.name = arrData.baseInfo.name
        this.userData.nickname = arrData.nickname
        this.userData.baseInfo.eduBG = arrData.baseInfo.eduBG
        this.userData.baseInfo.ethnicGroups = arrData.baseInfo.ethnicGroups
        this.userData.baseInfo.aboBloodType = arrData.baseInfo.aboBloodType
        this.userData.baseInfo.rhBloodType = arrData.baseInfo.rhBloodType
        this.userData.baseInfo.contactName = arrData.baseInfo.contactName
        this.userData.baseInfo.contactNumber = arrData.baseInfo.contactNumber
        this.userData.baseInfo.homeAddress = arrData.baseInfo.homeAddress
        this.userData.baseInfo.province = arrData.baseInfo.province
        this.userData.baseInfo.city = arrData.baseInfo.city
        this.userData.baseInfo.area = arrData.baseInfo.area
        this.userData.baseInfo.street = arrData.baseInfo.street
        const arrAddress = { province: arrData.baseInfo.province, city: arrData.baseInfo.city, area: arrData.baseInfo.area, street: arrData.baseInfo.street }
        // 不用nextTick会报初始化错误
        this.$nextTick(() => {
            this.$refs.address.setAddress(arrAddress)
        })
        // this.$refs.address.setAddress(arrAddress)
        console.log(groupId, '子组件', data)
      },
      callback (val) {
        console.log(val)
      },
      handleOk () {
        const groupId = this.groupId
        const customerId = this.customerId
        const data = this.userData
        editGroupCustomer(groupId, customerId, data).then(res => {
            if (res.status === 200) {
            //   this.$message.info(res.message)
              this.$message.info('修改成功')
            //   console.log('修改成功', res)
              this.visible = false
            }
        })
        console.log(groupId, customerId, '点击确定', data)
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
        console.log('地址', value)
      },
      // 获取验证码
      getUserCode (p) {
        var Reg = /^[1][34578][0-9]{9}$/
        if (this.phoneForm.telephone === '') {
          this.$message.error('请输入手机密码')
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
</style>
