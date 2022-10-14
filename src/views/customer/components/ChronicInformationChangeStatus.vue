<template>
  <div>
    <a-modal
      v-model="changeStatusVisible"
      v-if="changeStatusVisible"
      @ok="handleOk"
      @cancel="closeChangeStatus"
      :footer="null"
      title="修改慢病状态"
      :width="600">
      <span style="font-size: 16px;">请上传医院或医疗机构的确诊记录：</span>
      <div style="width: 400px;margin: 15px auto;">
        <a-upload-dragger
          name="file"
          :multiple="true"
          :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-' + userInfo.name + '-' + userInfo.customerId"
          @change="handleChange"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="cloud-upload" />
          </p>
          <p class="ant-upload-text">
            点击或拖动文件上传
          </p>
        </a-upload-dragger>
      </div>
      <span style="color: rgb(170, 170, 170);">*支持PDF、照片图片及常见文件类型</span>
      <div style="text-align: center">
        <a-button @click="handleOk" :disabled="buttonDisabled" :loading="buttonLoad" type="primary">确定</a-button>
      </div>
    </a-modal>
    <ChronicInformationFirstFollowUp ref="FirstFollowUp" :diseaseData="diseaseData" :tableData="tableData"/>

  </div>
</template>
<script>
import ChronicInformationFirstFollowUp from './ChronicInformationFirstFollowUp.vue'
import { makeDiagnosed as apiMakeDiagnosed } from '@/api/customer'
export default {
  components: {
    ChronicInformationFirstFollowUp
  },
  props: {
    tableData: {
      type: Array,
      default: function () {
        return []
        }
    }
  },
  data () {
    return {
        changeStatusVisible: false, // 用于控制modal框显示和销毁组件
        uploading: false,
        userInfo: [],
        uploadData: [],
        diseaseData: [],
        buttonDisabled: true, // 禁用按钮
        buttonLoad: false // 用于load按钮
    }
  },
  methods: {
    closeChangeStatus () {
      this.changeStatusVisible = false
    },
    // 初始化
    openChangeStatus (userInfo, diseaseData) {
      this.diseaseData = diseaseData
      this.changeStatusVisible = true
      this.buttonDisabled = true
      this.userInfo = userInfo
      // console.log('修改状态')
    },
    handleOk () {
      // console.log('uploadData', this.uploadData, 'user', this.userInfo)
      const custId = this.diseaseData.customer.id
      const diseaseId = this.diseaseData.id
      const files = this.uploadData.response.data
      // console.log('custId', custId, 'diseaseId', diseaseId, 'files', files)
      apiMakeDiagnosed(custId, diseaseId, files).then(res => {
        if (res.status === 200) {
          this.$message.success('修改慢病状态成功')
          setTimeout(() => {
            this.changeStatusVisible = false
            this.$refs.FirstFollowUp.openFirstFollowUp()
            this.$parent.renovateData(custId)
          }, 1000)
        } else {
          this.$message.error('修改慢病状态失败')
        }
      })
      // const apidata = this.uploadData[0].response
    },
    handleChange (info) {
      // 文件列表为空时
      if (info.fileList.length === 0) {
        this.buttonDisabled = true
        this.buttonLoad = false
      } else {
        const status = info.fileList[0].status
        // 上传中
        if (status === 'uploading') {
          this.buttonLoad = true
        }
        // 上传成功
        if (status === 'done') {
          this.buttonDisabled = false
          this.buttonLoad = false
          this.$message.success(`${info.file.name} 文件上传成功`)
          this.uploadData = info.fileList[0]
          // console.log(info.fileList[0], 'url', info.fileList[0].response.data.url)
        // 上传失败
        } else if (status === 'error') {
          this.buttonDisabled = true
          this.buttonLoad = false
          this.$message.error(`${info.file.name} 文件上传失败`)
        }
      }
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
