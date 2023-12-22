<template>
  <a-modal
    :width="1100"
    :title="title"
    :visible="visible"
    @cancel="handleCancel"
    :footer="false"
  >
    <!-- 心电 -->
    <div v-if="reportPro.reportType==='ecg'">
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
    </div>
    <!-- 尿检 -->
    <div v-else style="margin: 0 10px;">
      <a-row :gutter="100">
        <a-col :span="12">
          <a-table :columns="rgbColumns" :data-source="reportPro.data?.originData" size="small" :rowKey="(record, index) => index">
            <div slot="color" slot-scope="text, record">
              <div class="color-block" :style="{ backgroundColor: `rgb(${record.r},${record.g},${record.b})` }">
              </div>
            </div>
          </a-table>
        </a-col>
        <a-col :span="12">
          <a-table :columns="columns" :data-source="urineArr" :pagination="false" size="small" :rowKey="(record, index) => index"></a-table>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :span="24">
          <!-- 尿检rgb趋势图 -->
          <!-- <v-chart :options="chartOptions" style="height: 400px;"></v-chart> -->
          <div id="urineEcharts" style="width: 100%; height: 300px;"></div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { reportDetail } from '@/api/device'
import * as echarts from 'echarts'
const errorArr = ['正常窦性心律', '停搏', '室颤或室速', 'R on T', '连续室性早搏', '二连发室早', '单个室早', '室早二联律', '室早三联律', '室速', '室缓', '起搏器未俘获', '起搏器未起搏', '漏搏', '正在学习', '', '过载信号', '信号幅度过小（信号弱）']
const indexes = ['白细胞', '尿胆原', '微量白蛋白', '蛋白质', '胆红素', '葡萄糖', '抗坏血酸', '比重', '酮体', '亚硝酸盐', '肌酐', 'PH值', '隐血', '尿钙']
const rgbColumns = [
  {
    title: 'r',
    dataIndex: 'r',
    key: 'r'
  },
  {
    title: 'g',
    dataIndex: 'g',
    key: 'g'
  },
  {
    title: 'b',
    dataIndex: 'b',
    key: 'b'
  },
  {
    title: '色块',
    scopedSlots: { customRender: 'color' }
  }
]
const columns = [
  {
    title: '指标名',
    dataIndex: 'class',
    key: 'class',
    customRender: (text) => text ? indexes[text - 1] : '-'
  },
  {
    title: '级别',
    dataIndex: 'level',
    key: 'level'
  },
  {
    title: '检测值',
    dataIndex: 'result',
    key: 'result'
  },
  {
    title: '结果',
    dataIndex: 'find',
    key: 'find'
  }
]
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
  components: {
    // 'v-chart': ECharts
    // Line
  },
  data () {
    return {
      urineArr: [],
      rgbColumns,
      columns,
      errorArr,
      title: '报告详情',
      reportPro: {},
      chartOptions: {
        xAxis: {
          type: 'category',
          data: [] // 用于存储横坐标值（x 值）
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [], // 用于存储纵坐标值（r 值）
            type: 'line',
            smooth: true
          }
        ],
        graphic: [] // 用于存储纵向虚线的数据
      },
      verticalLines: [] // 纵向虚线的数据
    }
  },
  mounted () {
    this.getDevice()
  },
  methods: {
    drawChart (dataArr, results) {
      // const verticalLinesArr = [23, 50, 80, 100, 140, 300]
      // 截取后42位
      const subArray = results?.slice(-42)

      // 提取每三个数字中的第一个数字组成新数组
      const verticalLinesArr = []
      for (let i = 0; i < subArray?.length; i += 3) {
        verticalLinesArr.push(subArray[i])
      }
      const lastIndex = dataArr.map(obj => obj.r).lastIndexOf(9999)
      const newArr = dataArr.slice(lastIndex + 1, dataArr.length - 1)
      // 提取 x 值和 r 值
      const xData = newArr.map(obj => obj.x)
      const rData = newArr.map(obj => obj.r)

      var chartDom = document.getElementById('urineEcharts')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        tooltip: { // 添加 tooltip 配置项
          trigger: 'axis'
        },
        series: [
          {
            data: rData,
            type: 'line',
            smooth: true,
            markLine: {
              symbol: 'none',
              lineStyle: {
                type: 'dashed',
                color: 'red'
              },
              data: verticalLinesArr.map(value => ({
                xAxis: value
              }))
            }
          }
        ]
      }

      option && myChart.setOption(option)
    },
    async getDevice () {
      const res = await reportDetail(this.reportId)
      this.reportPro = res.data
      if (res.data.reportType === 'ecg') {
        this.title = '心电报告详情'
      } else {
        const results = res.data.data.fullResults?.rgbResults
        this.drawChart(res.data.data.originData, results)
        this.title = '尿检报告详情'
        const data = this.reportPro.data.fullResults
        const urineArr = []
        data.classes.map((item, index) => {
          urineArr.push({
            class: data.classes[index],
            level: data.levels[index],
            result: data.results[index],
            find: data.findings[index]
          })
        })
        this.urineArr = urineArr
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
  .color-block{
    height: 36px;
    width: 36px;
  }
</style>
