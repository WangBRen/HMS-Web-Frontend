<template>
  <div>
    <a-modal
      :width="1000"
      :visible="installVisible"
      @cancel="closeInstallModal"
      :maskClosable="false"
      :footer="null"
    >
      <div></div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    installVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    closeInstallModal () {
      this.$emit('closeInstallModal')
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
