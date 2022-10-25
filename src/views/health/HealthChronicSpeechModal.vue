<template>
  <div>
    <a-modal
      :visible="speechVisible"
      v-if="speechVisible"
      :title="'编辑话术【'+speechInfo.name+'】'"
      @ok="speechHandleOk"
      @cancel="speechHandleCancel"
      :width="700"
    >
      <div v-for="item in speechData" :key="item.id">
        等级{{ item.level }}
        话术模板:
        <a-input v-model="item.template"></a-input>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    speechVisible: {
        type: Boolean,
        default: false
    },
    speechData: {
        type: Array,
        default: function () {
            return []
        }
    },
    speechInfo: {
        type: Object,
        default: function () {
            return {}
        }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    speechHandleOk () {
        // console.log('传进来的', this.speechData)
        // console.log('传进来info', this.speechInfo)
    },
    speechHandleCancel () {
        this.$emit('closeSpeechModal')
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
