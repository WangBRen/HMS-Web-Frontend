<template>
  <a-modal
    :width="1100"
    :title="title"
    :visible="visible"
    @cancel="handleCancel"
    :footer="false"
  >
    <a-collapse>
      <a-collapse-panel key="1" :header="'原始数据：'+reportPro.data?.ecgList.length+'个'">
        <div>{{ reportPro.data?.ecgList }}</div>
      </a-collapse-panel>
    </a-collapse>
    <a-descriptions title="检测结果" style="margin:30px 10px;">
      <a-descriptions-item label="心率（深麦）">
        {{ reportPro.data?.realHr }} 次/分钟
      </a-descriptions-item>
      <a-descriptions-item label="结果（深麦）">
        <span v-for="(item,index) in reportPro.data?.arr" :key="index">
          <a v-if="reportPro.data?.arr.length==1">{{ errorArr[item] }}</a>
          <a v-if="item!==0">{{ errorArr[item] }}；</a>
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="心电质量">
        {{ reportPro.data?.fullResult?.quality }}
      </a-descriptions-item>
      <a-descriptions-item label="心率（攸太）">
        {{ reportPro.data?.heartRate }} 次/分钟
      </a-descriptions-item>
      <a-descriptions-item label="结果（攸太）">
        <span v-for="item in reportPro.data?.fullResult?.classifications" :key="item.index">
          {{ item }}；
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="准确率">
        {{ reportPro.data?.fullResult?.classificationProbabilities[0] }}
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>
import { reportDetail } from '@/api/device'
const errorArr = ['正常窦性心律', '停搏', '室颤或室速', 'R on T', '连续室性早搏', '二连发室早', '单个室早', '室早二联律', '室早三联律', '室速', '室缓', '起搏器未俘获', '起搏器未起搏', '漏搏', '正在学习', '', '过载信号', '信号幅度过小（信号弱）']

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    reportId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      errorArr,
      title: '报告详情',
      reportPro: {},
      ModalText: 'Content of the modal'
    }
  },
  mounted () {
    this.getDevice()
  },
  methods: {
    async getDevice () {
      const res = await reportDetail(this.reportId)
      this.reportPro = res.data
      if (res.data.reportType === 'ecg') {
        this.title = '心电报告详情'
      }
      console.log('11', res.data)
    },
    handleCancel (e) {
      this.$emit('cancel')
    }
  }
}
</script>

<style>

</style>
