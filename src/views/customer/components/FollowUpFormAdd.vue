<template>
  <div>
    <a-modal
      :visible="visible"
      title="慢病随访单记录"
      :width="1100"
      @cancel="handleOnModalCancel"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">
          上一步
        </a-button>
        <a-button v-if="current === 0" type="primary" @click="handlePreview">
          预览
        </a-button>
        <a-button v-if="current === 1" type="primary" @click="handlePreviewOK">
          确认创建
        </a-button>
        <a-button id="sendForm" v-show="current === 2" type="primary" @click="handleOnSendMessageClick" :disabled="sendBtnDisable">
          发送随访单
        </a-button>
        <a-button
          v-if="current == 3"
          type="primary"
          @click="handleOnSendSuccess"
        >
          完成
        </a-button>
      </template>
      <div class="step-progress">
        <a-steps progress-dot :current="current">
          <a-step title="填写随访单" :description="lastUpdateAt" />
          <a-step title="预览并创建" :description="creatStatus" />
          <a-step title="发送随访单"/>
          <a-step title="发送成功" description="" />
        </a-steps>
      </div>
      <!-- 操作流程内容 -->
      <div class="steps-content">
        <div v-show="current === 0">
          <FollowUpFormEdit
            :customerId="customerId"
            :diseaseId="diseaseId"
            :baseInfo="baseInfo"
            :myToken="myToken"
            ref="FollowUpForm"
            @checkSuccess="checkSuccess"
          />
        </div>
        <div v-show="current === 1">
          <div style="width:100%;height:800px;overflow-y:auto">
            <div style="height:1000px;pointer-events: none;">
              <object type="text/html" :data="previewUrl" width="100%" height="100%" scroll="none"></object>
            </div>
          </div>
        </div>
        <div v-show="current === 2">
          <div style="margin: 40px auto; width: 400px; padding-top: 20px;">
            <div style="font-size: 16px;margin-bottom: 30px;">
              <span>随访内容：</span>
              <span>
                <a :href="url" style="text-decoration:underline;" target="_blank">{{ url }}</a>
              </span>
            </div>
            <div style="margin-bottom: 10px;">
              <span style="display: flex;width: 300px;justify-content: center;">
                <span style="width: 80px;line-height: 32px;">手机号：</span>
                <a-input placeholder="请输入用户手机号" v-model="phone" prefix="📞" @change="phoneChange" v-decorator="['phone',{ rules: [{ required: true, message: '必须输入手机号' }] },]"/>
                <!-- <a-input
                  prefix="📞"
                  v-model="phone"
                  :placeholder="请输入用户手机号"
                  v-decorator="['mobile', {rules: [{ required: true, message: $t('user.phone-number.required'), pattern: /^1[3456789]\d{9}$/ },{ validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }]"/> -->
              </span>
              <div v-show="showError" style="margin: 5px 0 0 70px;font-size: 10px;color: red;">*请输入正确的手机号</div>
              <!-- <a-button @click="handleOnSendMessageClick" style="font-size: 14px;" type="primary" :disabled="disableClickButton">发送到短信</a-button> -->
            </div>
          </div>
        </div>
        <div v-if="current === 3">
          <a-result
            status="success"
            title="随访单发送成功"
            sub-title="若需重发可点击上一步，点击完成返回慢病管理页"
          >
          </a-result>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import FollowUpFormEdit from './FollowUpFormEdit.vue'
import { addNewFollowUpForm as apiCreateFollowUpForm, getPreviewForm, postFormCreated as apiPostFormCreated, getFormSendingInfo as apigetFormSendingInfo, ApiSendForm, getToken } from '@/api/followUpForm'
import { notification } from 'ant-design-vue'
import moment from 'moment'
export default {
  components: {
    FollowUpFormEdit
  },
  props: {
    customerId: {
      type: Number,
      default: null
    },
    diseaseId: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    onMessageSent: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  data () {
    return {
      steps: [
        {
          title: '创建随访单'
        },
        {
          title: '预览'
        },
        {
          title: '发送随访单'
        },
        {
          title: '发送成功'
        }
      ],
      current: 0,
      url: '',
      check: false,
      phone: '',
      previewUrl: '',
      showError: false,
      sendBtnDisable: false,
      myToken: '',
      lastUpdateAt: '',
      creatStatus: ''
    }
  },
  mounted () {
    getToken().then(res => {
        if (res.status === 200) {
            this.myToken = res.data
        }
    })
  },
  methods: {
    handleOnModalCancel () {
      this.$emit('close')
    },
    prev () {
      this.current--
    },
    checkSuccess (data) {
      this.apiPayload = data
    },
    async handlePreview () {
      this.$refs.FollowUpForm.doRequest()
      if (this.apiPayload) {
        const resp = await apiCreateFollowUpForm(this.customerId, this.apiPayload)
        this.current = 1
        if (resp.status === 201) {
          this.formId = resp.data.id
          getPreviewForm(this.customerId, this.formId).then(res => {
            if (res.status === 200) {
                this.lastUpdateAt = moment(res.data.lastUpdateAt).format('YYYY-MM-DD HH:mm:ss')
                this.previewUrl = res.data.url
                // document.getElementById('container').innerHTML = `<object type="text/html" data="${previewUrl}" width="100%" height="100%"></object>`
            } else {
                notification.warning({ message: '预览失败', description: resp.message })
            }
          })
        } else {
          notification.warning({ message: '预览失败', description: resp.message })
        }
      }
    },
    handlePreviewOK () {
      apiPostFormCreated(this.customerId, this.formId).then(res => {
        if (res.status === 201) {
          this.$message.success('随访单创建成功')
          this.creatStatus = '创建成功'
          this.current = 2
          this.getFormSendingInfo()
        }
      }).catch(res => {
        this.creatStatus = '创建失败'
        notification.warning({ description: res.message || '随访单创建失败' })
      })
    },
    handleOnSendSuccess () {
      this.$emit('close')
    },
    async getFormSendingInfo () {
      if (!this.formId) { return }
      const resp = await apigetFormSendingInfo(this.customerId, this.formId)
      if (resp.status === 200) {
        this.phone = resp.data.targetTelephone
        this.url = resp.data.url
      } else {
        notification.warning({ message: '获取发送链接失败', description: resp.message })
        throw Error(resp.message)
      }
    },
    async handleOnSendMessageClick () {
      const apiPhone = this.phone
      const res = await ApiSendForm(this.customerId, this.formId, { telephone: apiPhone })
      if (res.status === 200) {
        console.log('111111', res)
        // this.sendTime =
        this.current = 3
        const sendBtn = document.getElementById('sendForm')
        let time = 60
        this.sendBtnDisable = true
        const timer = setInterval(() => {
          if (time > 0) {
            sendBtn.innerHTML = time + 's 后重发'
            time--
          } else if (time === 0) {
            clearInterval(timer)
            sendBtn.innerHTML = '重新发送'
            this.sendBtnDisable = false
          }
        }, 1000)
      } else if (res.status === 400) {
        notification.open({ message: '发送失败：', description: '手机号码格式错误' })
      }
    },
    phoneChange () {
      const reg = /^1[3456789]\d{9}$/
      const apiPhone = this.phone
      if (!reg.test(apiPhone)) {
        this.showError = true
        this.sendBtnDisable = true
        // return
      } else {
        this.showError = false
        this.sendBtnDisable = false
      }
    }
  }
}
</script>

<style>
.steps-content{
  /* background-color: #666; */
  padding: 10px 36px;
}
.step-progress{
  margin: 0 auto;
  width: 980px;
  padding: 30px 30px;
  box-shadow: 5px 5px 10px #bebebe40,
             -2px -2px 10px #a7a7a740;
  /* background-color: #eee; */
}
</style>
