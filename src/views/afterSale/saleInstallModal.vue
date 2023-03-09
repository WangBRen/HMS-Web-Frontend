<template>
  <div>
    <a-modal
      :width="1000"
      :visible="installVisible"
      @cancel="closeInstallModal"
      :maskClosable="false"
      :footer="null"
    >
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <div v-if="current===0">
        待评估
      </div>
      <div v-if="current===1">
        已评估
      </div>
      <div v-if="current===2">
        待上门
      </div>
      <div v-if="current===3">
        已解决
      </div>
      <a-button @click="previou">上一步</a-button>
      <a-button @click="next">下一步</a-button>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    installVisible: {
      type: Boolean,
      default: false
    },
    checkData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    current: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      steps: [
        {
          title: '待评估',
          content: 'First-content'
        },
        {
          title: '已评估',
          content: 'Second-content'
        },
        {
          title: '待上门',
          content: 'Last-content'
        },
        {
          title: '已解决',
          content: 'Last-content'
        }
      ]
    }
  },
  methods: {
    closeInstallModal () {
      this.$emit('clostActionModal')
    },
    previou () {
      this.current--
    },
    next () {
      this.current++
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
