<template>
  <a-modal
    title="出库登记"
    :visible="outModelvisible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="name" label="客户名称" prop="name">
        <a-input
          v-model="form.name"
        />
      </a-form-model-item>
      <a-form-model-item ref="name" label="客户联系方式" prop="name">
        <a-input
          v-model="form.name"
        />
      </a-form-model-item>
      <a-form-model-item ref="name" label="物流方" prop="name">
        <a-select v-model="form.region" placeholder="请选择物流">
          <a-select-option value="shanghai">
            中通
          </a-select-option>
          <a-select-option value="beijing">
            申通
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  props: {
    outModelvisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
  },
  methods: {
    handleOk (e) {
      this.$emit('closeOutModal')
    },
    handleCancel (e) {
      this.$emit('closeOutModal')
    }
  }
}
</script>

<style>

</style>
