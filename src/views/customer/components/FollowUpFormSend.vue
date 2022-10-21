<template>
  <div>
    <a-modal
      :visible="sendVisible"
      title="发送随访单"
      :footer="null"
      @cancel="closeFollowSend"
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
          <a-button @click="handleOnSendMessageClick" style="font-size: 14px;" type="primary" :disabled="disableClickButton">发送到短信</a-button>
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
  props: {
    onMessageSendSuccess: {
      type: Function,
      default: function () {
        return null
      }
    },
    sendVisible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: 0
    },
    formId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      phone: '',
      url: '',
      disableClickButton: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      if (!this.formId) { return }
      const resp = await apigetFormSendingInfo(this.customerId, this.formId)
      if (resp.status === 200) {
        this.phone = resp.data.targetTelephone
        this.url = resp.data.url
      } else {
        notification.warning({ message: '获取失败11：', description: resp.message })
        throw Error(resp.message)
      }
    },
    async handleOnSendMessageClick () {
      // console.log('准备发送短信')
      this.disableClickButton = true
      const apiPhone = this.phone
      const res = await ApiSendForm(this.customerId, this.formId, { telephone: apiPhone })
      if (res.status === 200) {
        this.selfVisible = false
        this.$emit('onMessageSendSuccess', res.data)
        // console.log('发送到短信了', res)
      } else if (res.status === 400) {
        notification.open({ message: '发送失败：', description: '手机号码格式错误' })
      }
      this.disableClickButton = false
    },
    closeFollowSend () {
      this.$emit('onclose')
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
</style>
