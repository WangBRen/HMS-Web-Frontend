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
        <a-upload-dragger :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            点击或拖动文件上传
          </p>
        </a-upload-dragger>
      </div>
      <a-button
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploading"
        style="margin-top: 16px"
        @click="handleUpload"
      >
        {{ uploading ? 'Uploading' : 'Start Upload' }}
      </a-button>
      <span style="color: rgb(170, 170, 170);">*支持PDF、照片图片及常见文件类型</span>
    </a-modal>
    <ChronicInformationVisit ref="Visit"/>
  </div>
</template>
<script>
import ChronicInformationVisit from './ChronicInformationVisit.vue'
export default {
  components: {
    ChronicInformationVisit
  },
  data () {
    return {
        changeStatusVisible: false,
        fileList: [],
        uploading: false
    }
  },
  methods: {
    closeChangeStatus () {
      this.changeStatusVisible = false
    },
    openChangeStatus () {
      this.changeStatusVisible = true
      this.fileList = []
      // console.log('修改状态')
    },
    handleOk () {
      console.log('上传的文件', this.fileList)
      this.changeStatusVisible = false
      this.$refs.Visit.openVisit()
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleUpload () {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      this.uploading = true
      console.log(formData)
      // You can use any AJAX library you like
      // reqwest({
      //   url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      //   method: 'post',
      //   processData: false,
      //   data: formData,
      //   success: () => {
      //     this.fileList = []
      //     this.uploading = false
      //     this.$message.success('upload successfully.')
      //   },
      //   error: () => {
      //     this.uploading = false
      //     this.$message.error('upload failed.')
      //   }
      // })
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
