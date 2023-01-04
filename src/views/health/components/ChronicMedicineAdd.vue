<template>
  <div>
    <a-modal
      :visible="addVisible"
      v-if="addVisible"
      :title="mode === 'edit' ? '编辑药物' : '新建药物'"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1000"
      :maskClosable="false"
    >
      <div>
        <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="药物名" prop="name">
                <a-input v-model="medicineData.name"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药物类别" prop="type">
                <a-input v-model="medicineData.type"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="使用剂量">
                <a-row>
                  <a-col :span="8">
                    <a-input addonAfter="次" v-model="medicineData.frequency"></a-input>
                  </a-col>
                  <a-col :span="1">
                    <span style="width: 5%; text-align: center; line-height: 2">/</span>
                  </a-col>
                  <a-col :span="4">
                    <a-select style="padding-top: 5px;" v-model="medicineData.unit">
                      <a-select-option value="年">年</a-select-option>
                      <a-select-option value="月">月</a-select-option>
                      <a-select-option value="周">周</a-select-option>
                      <a-select-option value="日">日</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="10">
                    <a-input addonBefore="每次" v-model="medicineData.dosage"></a-input>
                  </a-col>
                </a-row>
                <!-- <span style="width: 5%; text-align: center; line-height: 2">/</span> -->
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="不良反应">
                <a-textarea v-model="medicineData.sideEffect" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="禁忌">
                <a-textarea v-model="medicineData.taboo" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="注意事项">
                <a-textarea v-model="medicineData.attention" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    addVisible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: ' '
    },
    medicineData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  name: 'APP',
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      rules: {
        name: [
          { required: true, message: '请输入药物名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入药物名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleOk () {
      console.log('mode', this.mode)
      console.log('确定', this.medicineData)
      if (this.mode === 'add') {

      } else if (this.mode === 'edit') {

      }
    },
    handleCancel () {
      console.log('取消')
      this.$emit('closeAddModal')
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
