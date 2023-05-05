<template>
  <a-modal
    :title="mode === 'edit' ? '编辑设备' : '新建设备'"
    :visible="editVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="600"
  >
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
      <a-form-model-item label="设备编号" prop="number">
        <a-input v-model="form.number" />
      </a-form-model-item>
      <a-form-model-item label="设备名称" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="设备型号" prop="model">
        <a-input v-model="form.model" />
      </a-form-model-item>
      <a-form-model-item label="设备状态" prop="status">
        <a-radio-group v-model="form.status" class="status">
          <a-radio value="OPEN">启用</a-radio>
          <a-radio value="DISABLED">检修</a-radio>
          <a-radio value="CLOSE">退休</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="厂商">
        <a-input v-model="form.manufacturer" />
      </a-form-model-item>
      <a-form-model-item label="设备日期">
        <a-row>
          <!-- <a-col :span="6"></a-col> -->
          <a-col :span="12">
            <a-date-picker
              v-model="form.enableTime"
              type="date"
              placeholder="设备启用日期"
              style="width: 100%;"
            />
          </a-col>
          <a-col :span="12">
            <a-date-picker
              v-model="form.productionTime"
              type="date"
              placeholder="设备生产日期"
              style="width: 100%;"
            />
          </a-col>
        </a-row>
      </a-form-model-item>
      <!-- <a-form-model-item label="设备生产日期"> -->
      <!-- </a-form-model-item> -->
      <a-form-model-item label="备注">
        <a-input v-model="form.remarks" type="textarea" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { addDevice as apiAddDevice, editDevice as apiEditDevice } from '@/api/station'
export default {
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    equipmentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    stationId: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // if (this.equipmentData) {
    //   this.form = this.equipmentData
    // }
    if (this.mode === 'edit') {
      this.form = this.equipmentData
    }
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        number: null,
        status: null,
        name: null,
        model: null,
        enableTime: null,
        productionTime: null,
        manufacturer: null,
        remarks: null
      },
      rules: {
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        model: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        status: [{ required: true, message: '请选择设备状态', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleOk () {
      // console.log('form', this.form)
      // console.log('id', this.stationId)
      // console.log('mode', this.mode)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // console.log('成功')
          if (this.mode === 'add') {
            apiAddDevice(this.stationId, this.form).then(res => {
              if (res.status === 200) {
                this.$message.success('新建设备成功')
                this.$parent.getDevice(this.stationId)
                this.$emit('closeEditModel')
              } else {
                this.$message.error(res.message)
              }
            })
          } else if (this.mode === 'edit') {
            apiEditDevice(this.stationId, this.form.id, this.form).then(res => {
              if (res.status === 200) {
                this.$message.success('编辑设备成功')
                this.$parent.getDevice(this.stationId)
                this.$emit('closeEditModel')
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
      // this.$emit('closeEditModel')
    },
    handleCancel () {
      this.$emit('closeEditModel')
    }
  }
}
</script>

<style>

</style>
