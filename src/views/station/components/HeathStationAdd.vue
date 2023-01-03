<template>
  <a-modal
    title="新增小站"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>111111111111</p>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    successAddStation: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleOk () {
      this.$emit('successAddStation')
    },
    handleCancel () {
      this.$emit('successAddStation')
    }
  }
}
</script>

<style>

</style>
