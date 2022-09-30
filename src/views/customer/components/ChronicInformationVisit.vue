<template>
  <div>
    <a-modal
      v-model="visitVisible"
      title="发送随访单"
      :footer="null"
      :width="550">
      <div style="margin: 20px auto; width: 400px; padding-bottom: 20px;">
        <div style="font-size: 16px;margin-bottom: 30px;">
          <span>随访内容：</span>
          <span>
            <a :href="url" style="text-decoration:underline;" target="_blank">{{ url }}</a>
          </span>
        </div>
        <div style="margin-bottom: 10px;display: flex;align-items: center;">
          <span style="width:150px">
            <a-input placeholder="请输入用户手机号" v-model="phone" prefix="📞" />
          </span>
          <!-- <span style="width:280px">
            <a-input-search
              prefix="📞"
              v-model="phone"
              placeholder="请输入用户手机号"
              enter-button="发送到短信"
              @click="onSendMessage"
            />
          </span> -->
          <a-button @click="onSendMessage" style="font-size: 14px;" type="primary" >发送到短信</a-button>
        </div>
      </div>
      <!-- <div>
        <a-button @click="sendWechat" style="font-size: 14px;border-radius: 8px;color: white;background-color: rgba(2, 189, 110, 1);"><a-icon type="wechat" />发送到小程序</a-button>
      </div> -->
    </a-modal>
  </div>
</template>
<script>
import { getFormSendingInfo as apigetFormSendingInfo, ApiSendForm } from '@/api/followUpForm'
import { notification } from 'ant-design-vue'
export default {
  data () {
    return {
      visitVisible: false,
      phone: '',
      url: '',
      formDataId: '',
      customerId: ''
    }
  },
  methods: {
    openVisit (formData) {
      this.visitVisible = true
      this.formDataId = formData.id
      this.customerId = formData.customer.id
      apigetFormSendingInfo(this.customerId, this.formDataId).then(res => {
        if (res.status === 200) {
            this.phone = res.data.targetTelephone
            this.url = res.data.url
        } else {
            notification.warning('获取失败：' + res.message)
            throw Error(res.message)
          }
    })
    },
    onSendMessage () {
      // console.log('准备发送短信')
      const apiPhone = this.phone

      ApiSendForm(this.customerId, this.formDataId, { telephone: apiPhone }).then(res => {
        if (res.status === 200) {
          this.visitVisible = false
          // console.log('发送到短信了', res)
        } else if (res.status === 400) {
          notification.open({ message: '发送失败：', description: '手机号码格式错误' })
          }
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>

</style>
