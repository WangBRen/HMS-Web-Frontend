<template>
  <div>
    <a-modal
      :visible="coachingVisible"
      :title="`健康指导${chronicName}`"
      :ok-button-props="{ props: { disabled: disabled } }"
      @cancel="closeCoachingModel"
      :width="900"
      centered
      @ok="handleOk"
    >
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
            <span class="basic-info-value">{{ userAge }}岁</span>
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
      <div v-if="diseaseId < 0">
        <span>选择需要指导的慢病：</span>
        <a-select
          show-search
          placeholder="请选择"
          option-filter-prop="children"
          style="width: 200px"
          :filter-option="filterOption"
          @select="handleChange"
        >
          <a-select-option v-for="item in chronicSelectData" :key="item">{{ item }}</a-select-option>
        </a-select>
      </div>
      <div style="margin: 24px 0"></div>
      <a-textarea
        v-model="templateData"
        :loading="loading"
        placeholder="请输入健康指导..."
        :auto-size="{ minRows: 10, maxRows: 20 }"
      />
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
import { getGuidanceTemplates as apiGuidanceTemplates, addNewGuidance, creatGuidance } from '@/api/guidance'
import { getChronicDetail as apiChronicDetail } from '@/api/customer'
import { getToken } from '@/api/followUpForm'
import { message } from 'ant-design-vue'
import HealthCoachingSend from './HealthCoachingSend.vue'
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
      userAge: 17,
      disabled: false,
      templateData: '',
      chronicName: '',
      chronicSelectData: [],
      payload: {
        myToken: '',
        sendText: ''
      },
      guidanceId: null,
      sendVisible: false
    }
  },
  watch: {
    coachingVisible () {
      this.loadData()
    }
  },
  mounted () {
    getToken().then(res => {
        if (res.status === 200) {
            this.payload.myToken = res.data
        }
    })
    this.loadData()
  },
  methods: {
    async loadData () {
      this.chronicName = ''
      this.chronicSelectData = []
      if (this.diseaseId > 0) {
        // 请求话术模板
        const resp = await apiGuidanceTemplates(this.customerId, this.diseaseId)
        if (resp.status === 200) {
          this.templateData = resp.data
        } else {
          this.disabled = true
          this.$notification.info({
            message: '温馨提示',
            description: resp.message
          })
        }
        // 获取慢病名称
        const res = await apiChronicDetail(this.customerId, this.diseaseId)
        if (res.status === 200) {
          this.chronicName = '【' + res.data.chronicDisease.name + '】'
        } else {
          this.$message.error('慢病名称获取失败')
        }
        // 创建新的指导
        const apiPayload = { token: '', diseaseIds: [], sendText: '' }
        apiPayload.token = this.payload.myToken
        apiPayload.diseaseIds.push(this.diseaseId)
        apiPayload.sendText = this.templateData

        addNewGuidance(this.customerId, this.diseaseId, apiPayload).then(res => {
          if (res.status === 201) {
          this.guidanceId = res.data.id
          } else {
            this.notification.open({
            message: '健康指导新建失败',
            description: res.message
          })
          }
        })
      }
      // 获取已分级的慢病列表
      const chronicData = this.tableData.filter(chronic => {
        if (chronic.level !== null) {
            return chronic
        }
      })
      this.chronicSelectData = chronicData.map(item => {
        return item.chronicDisease.name
      })
    },
    closeCoachingModel () {
      this.$emit('close')
    },
    handleChange (value) {
      this.chronicName = '【' + value + '】'
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleOk () {
      if (this.templateData !== '') {
        creatGuidance(this.customerId, this.guidanceId).then(res => {
          if (res.status === 201) {
            // message.success(res.message)
            this.sendVisible = true
            this.$emit('successCreat')
          } else {
            message.error(res.message)
          }
        })
      } else {
        message.warning('指导内容为空，请先填写')
      }
    },
    closeSendModel () {
      this.sendVisible = false
    },
    onMessageSendSuccess () {
      this.sendVisible = false
      this.message.success('健康指导发送成功')
    }
  }
}
</script>

<style>

</style>
