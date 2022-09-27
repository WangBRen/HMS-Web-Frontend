<template>
  <div>
    <a-modal
      v-model="visitVisible"
      @ok="handleOk"
      @cancel="closeVisit"
      title="首次随访记录"
      :width="500">
      <div style="font-size: 20px;margin-bottom: 20px;">
        <span>随访内容: </span>
        <span>
          <a @click="seeVisit" style="text-decoration:underline;">点击查看</a>
        </span>
      </div>
      <div style="margin-bottom: 10px;">
        <a-button @click="sendMessage" style="font-size: 14px;border-radius: 8px;" type="primary" ><a-icon type="message" />发送到短信</a-button>
        <a @click="seeMessage" style="margin-left: 10px;text-decoration:underline;">查看短信模板</a>
      </div>
      <div>
        <a-button @click="sendWechat" style="font-size: 14px;border-radius: 8px;color: white;background-color: rgba(2, 189, 110, 1);"><a-icon type="wechat" />发送到小程序</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
        visitVisible: false
    }
  },
  methods: {
    closeVisit () {
        this.visitVisible = false
    },
    openVisit () {
        this.visitVisible = true
    },
    seeVisit () {
        console.log('点击查看')
    },
    seeMessage () {
        console.log('查看短信模板')
    },
    sendMessage () {
        console.log('发送短信')
    },
    sendWechat () {
        console.log('发送小程序')
    },
    handleOk () {
        console.log('点击确定')
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
