<template>
  <a-modal
    title="新增产品编号"
    :visible="productAddVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1000"
  ></a-modal>
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
      this.$emit('closeOutModal')
    }
  }
}
</script>

<style>

</style>
