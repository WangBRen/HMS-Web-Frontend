<template>
  <div>
    <a-modal
      :visible="coachingVisible"
      :title="`健康指导${chronicName}${level?level+'级':''}`"
      :ok-button-props="{ props: { disabled: disabled } }"
      @cancel="closeCoachingModel"
      :width="1200"
      centered
      @ok="handleOk"
    >
      <div style="padding: 10px 50px;">
        <a-card title="基础信息" :loading="loading" class="card">
          <a-row :gutter="24">
            <a-col :span="8">
              <span class="basic-info-label">姓名：</span>
              <span class="basic-info-value">{{ baseInfo.name }}</span>
            </a-col>
            <a-col :span="8">
              <span class="basic-info-label">性别：</span>
              <span class="basic-info-value">{{ baseInfo.gender }}</span>
            </a-col>
            <a-col :span="8">
              <span class="basic-info-label">年龄：</span>
              <span class="basic-info-value">{{ userAge }}</span>
            </a-col>
            <a-col :span="8">
              <span class="basic-info-label">血型：</span>
              <span class="basic-info-value">{{ baseInfo.aboBloodType }}</span>
            </a-col>
            <a-col :span="8">
              <span class="basic-info-label">本人电话：</span>
              <span class="basic-info-value">{{ baseInfo.phoneNumber }}</span>
            </a-col>
            <a-col :span="8">
              <span class="basic-info-label">家人电话：</span>
              <span class="basic-info-value">{{ baseInfo.contactNumber }}</span>
            </a-col>
          </a-row>
        </a-card>
        <div style="margin: 24px 0"></div>
        <!-- <div v-if="diseaseId < 0">
          <span>选择需要指导的慢病：</span>
          <a-select
            show-search
            placeholder="请选择"
            :value="selectedData"
            option-filter-prop="children"
            style="width: 200px"
            :filter-option="filterOption"
            @select="handleChange"
          >
            <a-select-option v-for="item in chronicSelectData" :key="item">{{ item }}</a-select-option>
          </a-select>
        </div> -->
        <div style="margin: 24px 0"></div>
        <div class="title">生活指导</div>
        <a-textarea
          v-model="lifeTemplate"
          :loading="loading"
          placeholder="请输入生活指导..."
          :auto-size="{ minRows: 6, maxRows: 20 }"
        />
        <div class="title">运动指导</div>
        <a-textarea
          v-model="sportTemplate"
          :loading="loading"
          placeholder="请输入运动指导..."
          :auto-size="{ minRows: 6, maxRows: 20 }"
        />
        <div class="title">饮食指导</div>
        <a-textarea
          v-model="dietTemplate"
          :loading="loading"
          placeholder="请输入饮食指导..."
          :auto-size="{ minRows: 6, maxRows: 20 }"
        />
      </div>
    </a-modal>
    <HealthCoachingSend
      v-if="sendVisible"
      :customerId="customerId"
      :guidanceId="guidanceId"
      :coachingSendVisible="sendVisible"
      @onclose="closeSendModel"
      @onMessageSendSuccess="onMessageSendSuccess"
    />
  </div>
</template>

<script>
import { getGuidanceTemplates as apiGuidanceTemplates, creatGuidance, addNewGuidance } from '@/api/guidance'
import { getChronicDetail as apiChronicDetail } from '@/api/customer'
import { getToken } from '@/api/followUpForm'
import { message } from 'ant-design-vue'
import HealthCoachingSend from './HealthCoachingSend.vue'
import { age } from '@/utils/age'
// import { notification } from 'ant-design-vue'
export default {
  components: {
    HealthCoachingSend
  },
  props: {
    coachingVisible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: null
    },
    diseaseId: {
      type: Number,
      default: null
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      loading: false,
      userAge: null,
      disabled: false,
      lifeTemplate: '',
      sportTemplate: '',
      dietTemplate: '',
      chronicName: '',
      level: null,
      chronicSelectData: [],
      payload: {
        myToken: '',
        sendText: ''
      },
      guidanceId: null,
      sendVisible: false,
      // selectedData: '',
      chronicId: -1
    }
  },
  watch: {
    coachingVisible (newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        getToken().then(res => {
          if (res.status === 200) {
              this.payload.myToken = res.data
          }
        })
        this.loadData()
      }
    }
  },
  mounted () {
    // getToken().then(res => {
    //   if (res.status === 200) {
    //       this.payload.myToken = res.data
    //   }
    // })
    this.loadData()
  },
  methods: {
    async doRequest () {
      // 请求话术模板
      const resp = await apiGuidanceTemplates(this.customerId, this.chronicId)
      if (resp.status === 200) {
        // console.log('data1', resp.data)
        // console.log('data2', JSON.parse(resp.data))
        const filrerData = JSON.parse(resp.data)
        this.lifeTemplate = filrerData.lifeTemplate
        this.dietTemplate = filrerData.dietTemplate
        this.sportTemplate = filrerData.sportTemplate
        // this.templateData = resp.data
      } else {
        this.disabled = true
        this.$notification.info({
          message: '温馨提示',
          description: resp.message
        })
      }
      // 获取慢病名称
      const res = await apiChronicDetail(this.customerId, this.chronicId)
      if (res.status === 200) {
        console.log(res)
        this.chronicName = '【' + res.data.chronicDisease.name + '】'
        this.level = res.data.level.level
      } else {
        this.$message.error('慢病名称获取失败')
      }
    },
    loadData () {
      this.chronicName = ''
      this.level = ''
      this.lifeTemplate = ''
      this.dietTemplate = ''
      this.sportTemplate = ''
      if (this.diseaseId > 0) {
        this.chronicId = this.diseaseId
        this.doRequest()
      }
      // 获取已分级的慢病列表
      // const chronicData = this.tableData.filter(chronic => {
      //   if (chronic.level !== null) {
      //       return chronic
      //   }
      // })
      // this.chronicSelectData = chronicData.map(item => {
      //   return item.chronicDisease.name
      // })
      // 获取年龄
      const userAge = age(this.baseInfo.birthDate)
      if (userAge > 0) {
        this.userAge = userAge + '岁'
      } else {
        this.userAge = '/'
      }
    },
    closeCoachingModel () {
      this.$emit('close')
    },
    // handleChange (value) {
    //   this.selectedData = value
    //   // this.chronicName = '【' + value + '】'
    //   const chronicData = this.tableData.filter(chronic => {
    //     if (chronic.chronicDisease.name === value) {
    //         return chronic
    //     }
    //   })
    //   this.chronicId = chronicData[0].id
    //   this.doRequest()
    // },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
     async handleOk () {
      console.log(this.lifeTemplate, this.sportTemplate, this.dietTemplate)
      const templateData = '【生活指导】' + this.lifeTemplate + '\n【运动指导】' + this.sportTemplate + '\n【饮食指导】' + this.dietTemplate
      if (templateData === '') {
        message.warning('指导内容为空，请先填写')
        return
      }
      // 创建新的指导
      let apiPayload = {}
      if (this.diseaseId === null) {
        apiPayload = { token: '', sendText: '' }
      } else {
        apiPayload = { token: '', diseaseIds: [], sendText: '' }
        apiPayload.diseaseIds.push(this.chronicId)
      }
      apiPayload.token = this.payload.myToken
      apiPayload.sendText = templateData
      console.log('apiPayload', apiPayload)
      const res = await addNewGuidance(this.customerId, apiPayload)
        if (res.status === 201) {
        this.guidanceId = res.data.id
        } else {
          this.notification.open({
          message: '健康指导新建失败',
          description: res.message
        })
        }
      if (this.guidanceId) {
        const res = await creatGuidance(this.customerId, this.guidanceId)
        if (res.status === 201) {
          // message.success(res.message)
          this.sendVisible = true
          this.$emit('successCreat', this.chronicId)
        } else {
          message.error(res.message)
        }
      }
    },
    closeSendModel () {
      this.sendVisible = false
    },
    onMessageSendSuccess () {
      this.sendVisible = false
      this.$message.success('健康指导发送成功')
    }
  }
}
</script>

<style>
.basic-info-label {
  display: inline-block;
  width: 80px;
  font-weight: 500;
  margin-bottom: 12px;
}
.title {
  color: rgba(0,0,0,.85);
  font-weight: 700;
  font-size: 16px;
  line-height: 2;
  margin-top: 20px;
}
</style>
