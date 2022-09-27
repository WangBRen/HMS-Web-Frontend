<template>
  <div>
    <a-modal
      v-model="changeStatusVisible"
      @ok="handleOk"
      @cancel="closeChangeStatus"
      title="修改慢病状态"
      :width="600">
      <span style="font-size: 16px;">请上传医院或医疗机构的确诊记录：</span>
      <div style="width: 300px;margin: 0 auto;">
        <a-upload-dragger
          name="file"
          :multiple="true"
          :action="'http://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-' + userInfo.name + '-' + userInfo.customerId"
          @change="handleChange"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            点击或拖动文件上传
          </p>
        </a-upload-dragger>
      </div>
      <span style="color: rgb(170, 170, 170);">*支持PDF、照片图片及常见文件类型</span>
    </a-modal>
    <ChronicInformationVisit ref="Visit"/>
  </div>
</template>
<script>
import ChronicInformationVisit from './ChronicInformationVisit.vue'
import { upload } from '@/api/upload'
export default {
  components: {
    ChronicInformationVisit
  },
  data () {
    return {
        changeStatusVisible: false,
        fileList: [],
        uploading: false,
        userInfo: []
    }
  },
  methods: {
    closeChangeStatus () {
      this.changeStatusVisible = false
    },
    openChangeStatus (userInfo) {
      this.changeStatusVisible = true
      this.userInfo = userInfo
      this.fileList = []
      // console.log('修改状态')
    },
    handleOk () {
      this.changeStatusVisible = false
      this.$refs.Visit.openVisit()
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} 文件上传成功`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败`)
      }
    },
    handleUpload () {
      const fileList = this.fileList
      // console.log(this.userInfo)
      const type = 'file'
      const watermark = 'yootane-' + this.userInfo.name + '-' + this.userInfo.customerId
      console.log(fileList)
      upload(type, watermark, fileList).then(res => {
        if (res.statsu === 200) {
          console.log('上传成功')
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
