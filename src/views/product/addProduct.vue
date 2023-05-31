<template>
  <a-modal
    title="新增产品编号"
    :visible="productAddVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1000"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :label-col="{ span:4 }"
      :wrapper-col="{ span: 18 }"
      :rules="formRules"
    >
      <a-form-model-item ref="brand" label="品牌" prop="brand">
        <a-select v-model="form.brand" placeholder="请选择品牌">
          <a-select-option value="shanghai">
            杜马
          </a-select-option>
          <a-select-option value="beijing">
            攸太
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="productModel" label="型号" prop="productModel">
        <a-select v-model="form.productModel" placeholder="请选择型号">
          <a-select-option value="1">
            U32
          </a-select-option>
          <a-select-option value="2">
            A5+
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="color" label="颜色" prop="color">
        <a-select v-model="form.color" placeholder="请选择颜色">
          <a-select-option value="1">
            白色
          </a-select-option>
          <a-select-option value="2">
            黑色
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="definition" label="功能含义" prop="definition">
        <a-select v-model="form.definition" placeholder="请选择功能含义">
          <a-select-option value="1">
            功能1
          </a-select-option>
          <a-select-option value="2">
            功能2
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="controlMode" label="控制方式" prop="controlMode">
        <a-select v-model="form.controlMode" placeholder="请选择控制方式">
          <a-select-option value="1">
            1
          </a-select-option>
          <a-select-option value="2">
            2
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="ceramicPitSpacing" label="陶瓷坑距" prop="ceramicPitSpacing">
        <a-select v-model="form.ceramicPitSpacing" placeholder="请选择陶瓷坑距">
          <a-select-option value="3">
            3
          </a-select-option>
          <a-select-option value="4">
            4
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="num" label="台数" prop="num">
        <a-input-number v-model="form.num" :min="1" :formatter="formatNumber"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  props: {
    productAddVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        brand: undefined,
        productModel: undefined,
        color: undefined,
        definition: undefined,
        ceramicPitSpacing: undefined,
        num: 0
      },
      formRules: {
        brand: [
          { required: true, message: '请选择品牌', trigger: 'blur' }
        ],
        productModel: [
          { required: true, message: '请选择型号', trigger: 'blur' }
        ],
        color: [
          { required: true, message: '请选择颜色', trigger: 'blur' }
        ],
        definition: [
          { required: true, message: '请选择功能含义', trigger: 'blur' }
        ],
        controlMode: [
          { required: true, message: '请选择控制方式', trigger: 'blur' }
        ],
        ceramicPitSpacing: [
          { required: true, message: '请选择陶瓷坑距', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入台数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleOk (e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('closeOutModal')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel (e) {
      this.$emit('closeProductAdd')
    },
    formatNumber (value) {
      // 返回整数值
      return Math.round(value)
    }
  }
}
</script>

<style>

</style>
