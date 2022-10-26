<template>
  <div>
    <a-modal
      :visible="changeStatusVisible"
      @cancel="closeChangeStatus"
      title="修改慢病状态"
      okText="确诊"
      :width="500"
      :bodyStyle="{height:'150px'}"
      okType="danger"
      @ok="enterDiagnosis"
    >
      <a-row style="height:100px;text-align:center;display: flex;flex-direction: column;justify-content: center;">
        <div style="fontSize:18px;">当前慢病状态为【疑似】，是否确诊？
          <!-- <a-tag color="orange">
            <a-icon type="question-circle" /> 疑似
          </a-tag>，是否确诊？ -->
        </div>
        <div style="fontSize:12px;margin:10px 75px;display:flex">其他选择：<a style="text-decoration:underline" @click="misjudgment">改为误判</a></div>
      </a-row>
    </a-modal>
    <a-modal
      v-model="diagnosisVisible"
      @cancel="closediagnosis"
      :footer="null"
      title="上传慢病文件"
      :width="600">
      <span style="font-size: 16px;">请上传医院或医疗机构的确诊记录：</span>
      <div style="width: 400px;margin: 15px auto;">
        <a-upload-dragger
          name="file"
          :multiple="true"
          :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-' + userInfo.name + '-' + customerId"
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
    <ChronicInformationFirstFollowUp
      :userInfo="userInfo"
      :diseaseId="diseaseId"
      :customerId="customerId"
      :firstFollowUpVisible="firstFollowUpVisible"
      @onClose="closeFirstFollowUp"/>
  </div>
</template>
<script>
import ChronicInformationFirstFollowUp from './ChronicInformationFirstFollowUp.vue'
import { makeDiagnosed as apiMakeDiagnosed, makeUnexpected as apiMakeUnexpected } from '@/api/customer'
export default {
  components: {
    ChronicInformationFirstFollowUp
  },
  props: {
    userInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    diseaseId: {
      type: Number,
      default: null
    },
    customerId: {
      type: Number,
      default: null
    },
    changeStatusVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
        // changeStatusVisible: false, // 用于控制modal框显示和销毁组件
        diagnosisVisible: false,
        uploading: false,
        uploadData: [],
        buttonDisabled: true, // 禁用按钮
        buttonLoad: false, // 用于load按钮
        firstFollowUpVisible: false
    }
  },
  mounted () {
    this.openChangeStatus()
  },
  methods: {
    closeChangeStatus () {
      // this.changeStatusVisible = false
      this.$emit('onClose')
    },
    closediagnosis () {
      this.diagnosisVisible = false
    },
    // 初始化
    openChangeStatus () {
      this.buttonDisabled = true
    },
    handleOk () {
      const files = this.uploadData.response.data
      apiMakeDiagnosed(this.customerId, this.diseaseId, files).then(res => {
        if (res.status === 200) {
          this.$message.success('修改慢病状态成功')
          // this.firstFollowUpVisible = true
          setTimeout(() => {
            this.firstFollowUpVisible = true
            this.diagnosisVisible = false
            this.$emit('successChangeState')
            // this.$parent.renovateData(this.customerId)
          }, 1000)
        } else {
          this.$message.error('修改慢病状态失败')
        }
      })
      // const apidata = this.uploadData[0].response
    },
    closeFirstFollowUp () {
      this.firstFollowUpVisible = false
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
    },
    enterDiagnosis () {
      // this.changeStatusVisible = false
      this.diagnosisVisible = true
    },
    misjudgment () {
      const that = this
      this.$confirm({
        title: '你确定修改该慢病状态为【误判】吗?',
        content: '系统预判准确率为 98.1%',
        okText: '确定误判',
        okType: 'primary',
        cancelText: '取消',
        centered: true,
        onOk () {
          apiMakeUnexpected(that.customerId, that.diseaseId).then(res => {
            if (res.status === 200) {
              that.$message.success('误判成功')
              that.$emit('successChangeState')
              // setTimeout(() => {
              //   // this.$parent.renovateData(this.customerId)
              //   // this.changeStatusVisible = false
              // }, 500)
            }
          })
        },
        onCancel () {
          that.$message.error('取消误判')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
