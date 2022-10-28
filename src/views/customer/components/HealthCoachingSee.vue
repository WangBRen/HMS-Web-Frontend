<template>
  <div>
    <a-modal
      :visible="coachingVisible"
      title="健康指导"
      :footer="null"
      @cancel="closeCoaching"
      :width="800">
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
      <a-textarea
        :loading="loading"
        v-model="templateData"
        disabled
        :auto-size="{ minRows: 10, maxRows: 20 }"
      />
    </a-modal>
  </div>
</template>
<script>
import { guidanceSee } from '@/api/guidance'
export default {
  props: {
    coachingVisible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: 0
    },
    guidanceId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      templateData: '',
      baseInfo: {},
      userAge: 17,
      loading: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      if (!this.guidanceId) { return }
      this.loading = true
      const resp = await guidanceSee(this.customerId, this.guidanceId)
      this.loading = false
      if (resp.status === 200) {
        this.baseInfo = resp.data.customer.baseInfo
        this.templateData = resp.data.sendText
      } else {
      }
    },
    closeCoaching () {
      this.$emit('onclose')
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
</style>
