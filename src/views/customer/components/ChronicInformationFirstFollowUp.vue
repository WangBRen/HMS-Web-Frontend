<template>
  <div>
    <a-modal
      :visible="firstFollowUpVisible"
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
      <AddFollowUpSheet :customerId="customerId" :diseaseId="diseaseId" :userInfo="userInfo" :visible="AddFollowUpFormModel" @close="closeFollowUpFormModel"/>
    </a-modal>
  </div>
</template>
<script>
import AddFollowUpSheet from './AddFollowUpSheet.vue'
export default {
  components: {
    AddFollowUpSheet
  },
  props: {
    userInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    diseaseId: {
      type: Number,
      default: null
    },
    customerId: {
      type: Number,
      default: null
    },
    firstFollowUpVisible: {
      type: Boolean,
      default: false
    }
  },
  name: 'APP',
  data () {
    return {
      AddFollowUpFormModel: false
    }
  },
  methods: {
    // openFirstFollowUp () {
    //     this.firstFollowUpVisible = true
    // },
    closeFirstFollowUp () {
        // this.firstFollowUpVisible = false
        this.$emit('onClose')
    },
    setFollow () {
        // this.$refs.FollowUpSheetRef.openAddFollow(this.diseaseData, this.tableData)
        this.AddFollowUpFormModel = true
        this.$emit('onClose')
    },
    closeFollowUpFormModel () {
      this.AddFollowUpFormModel = false
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
