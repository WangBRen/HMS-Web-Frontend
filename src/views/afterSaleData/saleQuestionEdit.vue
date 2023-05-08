<template>
  <div>
    <a-modal
      :visible="editVisible"
      :title="mode === 'edit' ? '编辑问题' : '新建问题'"
      @cancel="closeEditModal"
      :width="1000"
      :maskClosable="false"
      :footer="null"
    >
      <!-- {{ editData }} -->
      <a-form-model
        ref="questionForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="questionForm"
        :rules="questionRules"
      >
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="问题详细描述" prop="name">
              <a-input v-model="questionForm.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="定位方法" prop="locationWay">
              <a-textarea v-model="questionForm.locationWay" :auto-size="{ minRows: 4 }"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="解决方案" prop="solution">
              <a-textarea v-model="questionForm.solution" :auto-size="{ minRows: 4 }"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述" prop="description">
              <a-textarea v-model="questionForm.description" :auto-size="{ minRows: 4 }"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" :key="uploadKey">
            <a-form-model-item label="上传" prop="files">
              <div v-for="(file, index) in questionForm.files" :key="index">
                <a :href="file.url" target="_blank">{{ file.fileName }}</a>
              </div>
              <!-- <div class="upload_tip"><a-icon type="info-circle" />上传资料将覆盖原有资料</div> -->
              <a-upload
                name="file"
                v-model="questionForm.files"
                multiple
                :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-'"
                @change="value => handleChangeUpload(value)"
              >
                <a-button><a-icon type="upload" />上传资料</a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="备注" prop="remark">
              <a-textarea v-model="questionForm.remark" :auto-size="{ minRows: 4 }"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="text-align: center;">
          <a-col :span="24">
            <a-popconfirm title="确定创建？" @confirm="onSubmit">
              <a-button style="margin: 0 20px;" type="primary">确定</a-button>
            </a-popconfirm>
            <a-button style="margin: 0 20px;" @click="closeEditModal">取消</a-button>
            <!-- <a-popconfirm title="确定重置信息？" @confirm="resetForm">
              <a-button style="margin: 0 20px;">重置</a-button>
            </a-popconfirm> -->
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { addGuide as apiAddGuide, editGuide as apiEditGuide } from '@/api/afterSale'
export default {
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    mode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      uploadKey: '',
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      questionForm: {
        id: '',
        name: '',
        locationWay: '',
        solution: '',
        remark: '',
        description: '',
        files: []
      },
      questionRules: {
        name: [
          { required: true, message: '请输入问题详情描述', trigger: 'blur' }
        ],
        solution: [
          { required: true, message: '请输入解决方法', trigger: 'blur' }
        ]
      },
      defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/xxx.png'
        }
      ]
    }
  },
  methods: {
    closeEditModal () {
      this.$emit('closeEditModal')
    },
    onSubmit () {
    //   console.log(this.questionForm)
    //   console.log(this.mode)
      this.$refs.questionForm.validate(valid => {
        if (valid) {
          if (this.mode === 'add') {
            const apiData = JSON.parse(JSON.stringify(this.questionForm))
            apiAddGuide(apiData).then(res => {
              if (res.status === 201) {
                this.$message.success('成功')
                this.closeEditModal()
                this.$parent.moveGetGuide()
              //   console.log('成功')
              } else {
                this.$message.error(res.message)
              }
            })
            // console.log('新建', apiData)
          } else if (this.mode === 'edit') {
            const apiData = JSON.parse(JSON.stringify(this.questionForm))
            const id = apiData.id
            delete apiData.id
            apiEditGuide(id, apiData).then(res => {
              if (res.status === 200) {
                this.$message.success('成功')
                this.closeEditModal()
                this.$parent.moveGetGuide()
              } else {
                this.$message.error(res.message)
              }
            })
            // console.log(id, '编辑', apiData)
          }
        }
      })
    },
    resetForm () {
      this.$refs.questionForm.resetFields()
    },
    handleChangeUpload (data) {
      if (data.file.status === 'done') {
        this.questionForm.files.push(data.file.response.data)
      } else if (data.file.status === 'error') {

      } else if (data.file.status === 'removed') {
        const testArr = data.fileList.map(item => {
          return item.response.data
        })
        this.questionForm.files = testArr
        // console.log(testArr)
      }
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    editData (newData, oldData) {
      this.questionForm = JSON.parse(JSON.stringify(this.editData))
    //   console.log(this.questionForm)
    },
    editVisible () {
      if (this.editVisible) {
        this.uploadKey = ''
      } else {
        this.uploadKey = Math.random()
      }
    }
  }
}
</script>
<style scoped>
.upload_tip{
  color: rgb(228, 152, 11);
  font-size: 17px;
}
</style>
