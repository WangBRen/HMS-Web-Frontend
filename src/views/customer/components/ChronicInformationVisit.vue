<template>
  <div>
    <a-modal
      v-model="visitVisible"
      @ok="handleOk"
      @cancel="closeVisit"
      title="首次随访记录"
      :width="500">
      <a-row>
        <a-col class="visit_title">
          <span>该慢病已确诊，是否开始首次随访?</span>
        </a-col>
      </a-row>
      <a-row>
        <a-col class="visit_button">
          <a-button @click="setVisitReport" style="border-radius: 5px;" type="primary">创建随访单</a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
        visitVisible: false
    }
  },
  methods: {
    closeVisit () {
        this.visitVisible = false
    },
    openVisit () {
        this.visitVisible = true
    },
    setVisitReport () {
        console.log('创建随访报告')
    },
    handleOk () {
        console.log('点击确定')
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style>
.visit_title{
  text-align: center;
  font-size: 16px;
}
.visit_button{
  margin-top: 10px;
  text-align: center;
}
</style>
