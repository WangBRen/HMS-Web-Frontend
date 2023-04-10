<template>
  <div>
    <a-modal
      :width="1000"
      :visible="drawbackVisible"
      v-if="drawbackVisible"
      @cancel="handleCancel"
      :maskClosable="false"
      :footer="null"
    >
      <div style="padding: 20px;">
        <!-- {{ drawbackData.processes[0].afterSaleExpresses }} -->
        <div v-for="(item1,index1) in drawbackData.processes" :key="item1.id">
          <div >
            <div style="font-size: 24px;">第{{ index1+1 }}次评估：</div>
            <div v-for="(item2, index2) in item1.afterSaleExpresses" :key="index2">
              配件名称：{{ item2.pieceName }}
              退件数量：<a-input-number id="inputNumber" :min="1" :max="item2.pieceNum"/>
            </div>
          </div>
        </div>
        <div>
          <a-button>退款</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    drawbackVisible: {
      type: Boolean,
      default: false
    },
    drawbackData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleCancel () {
      this.$emit('closeDrawback')
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    // 总配件
    drawbackData (newData, oldData) {
    },
    // 添加的配件
    drawbackArr (newData, oldData) {
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
