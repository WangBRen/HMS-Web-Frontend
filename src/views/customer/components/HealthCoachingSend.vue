<template>
  <div>
    <a-modal
      :visible="coachingSendVisible"
      title="发送健康指导"
      :footer="null"
      @cancel="closeCoachingSend"
      centered
      :width="500">
      <div style="margin: 10px auto; width: 290px; padding-bottom: 20px;">
        <!-- <div style="font-size: 16px;margin-bottom: 30px;">
          <span>随访内容：</span>
          <span>
            <a :href="url" style="text-decoration:underline;" target="_blank">{{ url }}</a>
          </span>
        </div> -->
        <div>健康指导已创建成功，是否发送给用户？</div>
        <div style="margin: 20px auto;display: flex;align-items: center;">
          <span style="width:150px">
            <a-input placeholder="请输入用户手机号" v-model="phone" prefix="📞" @change="onChange"/>
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
        <div style="margin: 20px auto;display: flex;align-items: center;">
          <a-button @click="sendApp" style="font-size: 14px;" type="primary">发送到小程序</a-button>
        </div>
      </div>
      <!-- <div>
        <a-button @click="sendWechat" style="font-size: 14px;border-radius: 8px;color: white;background-color: rgba(2, 189, 110, 1);"><a-icon type="wechat" />发送到小程序</a-button>
      </div> -->
    </a-modal>
  </div>
</template>
<script>
import { guidanceSendingInfo, ApiSendGuidance } from '@/api/guidance'
import { notification } from 'ant-design-vue'
export default {
  props: {
    coachingSendVisible: {
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
      phone: '',
      url: '',
      disableClickButton: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      if (!this.guidanceId) { return }
      const resp = await guidanceSendingInfo(this.customerId, this.guidanceId)
      if (resp.status === 200) {
        if (resp.data.targetTelephone) {
          this.phone = resp.data.targetTelephone
          this.disableClickButton = false
        }
        // this.url = resp.data.url
      } else {
        notification.warning({ message: '获取失败', description: resp.message })
        throw Error(resp.message)
      }
    },
    async handleOnSendMessageClick () {
      this.disableClickButton = true
      const apiPhone = this.phone
      const res = await ApiSendGuidance(this.customerId, this.guidanceId, { telephone: apiPhone })
      if (res.status === 200) {
        this.$emit('onMessageSendSuccess', res.data)
        // console.log('发送到短信了', res)
      } else if (res.status === 400) {
        this.$message.error(res.message)
      }
      this.disableClickButton = false
    },
    closeCoachingSend () {
      this.$emit('onclose')
    },
    onChange () {
      var RegCellPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (this.phone.search(RegCellPhone)) {
        this.disableClickButton = true
      } else {
        this.disableClickButton = false
      }
    },
    sendApp () {
      console.log('发送到小程序', this.customerId, this.guidanceId)
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
</style>
