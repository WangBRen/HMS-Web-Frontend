<template>
  <div>
    <a-modal
      :visible="addVisible"
      v-if="addVisible"
      :title="'新建'"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1000"
      :maskClosable="false"
    >
      <div>

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
