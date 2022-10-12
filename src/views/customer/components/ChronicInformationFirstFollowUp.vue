<template>
  <div>
    <a-modal
      v-model="firstFollowUpVisible"
      @cancel="closeFirstFollowUp"
      :width="400"
      :footer="null"
      title="首次随访记录"
    >
      <div style="text-align: center;height: 100px;">
        <span>该慢病已确诊，是否开始首次随访？</span>
        <br>
        <a-button type="primary" style="margin-top: 20px;" @click="setFollow()">创建随访单</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'APP',
  data () {
    return {
        firstFollowUpVisible: false
    }
  },
  methods: {
    openFirstFollowUp () {
        this.firstFollowUpVisible = true
    },
    closeFirstFollowUp () {
        this.firstFollowUpVisible = false
    },
    setFollow () {
        console.log('创建随访单')
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped>

</style>
