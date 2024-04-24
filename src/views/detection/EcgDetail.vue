<template>
  <a-modal
    :width="1100"
    :title="title"
    :visible="visible"
    @cancel="handleCancel"
    :footer="false"
  >
    <a-collapse>
      <a-collapse-panel key="1" :header="'原始数据：'+ (reportPro.reportType==='ecg' ? reportPro.data?.ecgList.length : originData.length) +'个'">
        <div>{{ reportPro.reportType==='ecg' ? reportPro.data?.ecgList : originData }}</div>
      </a-collapse-panel>
    </a-collapse>
    <!-- 心电 -->
    <div v-if="reportPro.reportType==='ecg'">
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
      <a-button type="primary">
        <a :href="pdfUrl" target="_blank">打开PDF</a>
      </a-button>
    </div>
    <!-- 尿检 -->
    <div v-else style="margin: 0 10px;">
      <a-row :gutter="30">
        <a-col :span="14">
          <a-table :columns="rgbColumns" :data-source="newArray" :pagination="false" size="small" :rowKey="(record, index) => index">
            <div slot="color" slot-scope="text, record">
              <div class="color-block" :style="{ backgroundColor: `rgb(${record.R},${record.G},${record.B})` }">
              </div>
            </div>
          </a-table>
        </a-col>
        <a-col :span="10">
          <a-table :columns="columns" :data-source="urineArr" :pagination="false" size="small" :rowKey="(record, index) => index"></a-table>
        </a-col>
      </a-row>
      <a-row :gutter="100" style="margin-top: 20px;">
        <a-col :span="24">
          <a-table :columns="columns2" :data-source="addArr" :pagination="false" size="small" :rowKey="(record, index) => index"></a-table>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :span="24">
          <div id="urineEcharts" style="width: 100%; height: 300px;"></div>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :span="24">
          <div id="gEcharts" style="width: 100%; height: 300px;"></div>
        </a-col>
      </a-row>
      <a-row :gutter="100">
        <a-col :span="24">
          <div id="bEcharts" style="width: 100%; height: 300px;"></div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { reportDetail } from '@/api/device'
import * as echarts from 'echarts'
const errorArr = ['正常窦性心律', '停搏', '室颤或室速', 'R on T', '连续室性早搏', '二连发室早', '单个室早', '室早二联律', '室早三联律', '室速', '室缓', '起搏器未俘获', '起搏器未起搏', '漏搏', '正在学习', '', '过载信号', '信号幅度过小（信号弱）']
const indexes = ['葡萄糖', '肌酐', '酮体', 'VC', '白细胞', 'PH', '亚硝酸盐', '尿钙', '微量白蛋白', '尿胆原', '蛋白质', '胆红素', '隐血', '比重']
const indexes11 = ['VC', '葡萄糖', '酮体', '隐血', 'PH', '亚硝酸盐', '尿胆原', '蛋白质', '胆红素', '比重', '白细胞']
const rgbColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: 'r位置',
    dataIndex: 'rPosition',
    key: 'rPosition'
  },
  {
    title: 'r值',
    dataIndex: 'r',
    key: 'r'
  },
  {
    title: '原始r',
    dataIndex: 'rOriginal',
    key: 'rOriginal'
  },
  {
    title: 'g位置',
    dataIndex: 'gPosition',
    key: 'gPosition'
  },
  {
    title: 'g值',
    dataIndex: 'g',
    key: 'g'
  },
  {
    title: '原始g',
    dataIndex: 'gOriginal',
    key: 'gOriginal'
  },
  {
    title: 'b位置',
    dataIndex: 'bPosition',
    key: 'bPosition'
  },
  {
    title: 'b值',
    dataIndex: 'b',
    key: 'b'
  },
  {
    title: '原始b',
    dataIndex: 'bOriginal',
    key: 'bOriginal'
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
    key: 'class'
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
      columns2: [
      {
        title: 'R（Sr=850）',
        dataIndex: 'R',
        key: 'R',
        customRender: (text, record) => record.Vr + '/Sr = ' + record.R
      },
      {
        title: 'G（Sg=1020）',
        dataIndex: 'G',
        key: 'G',
        customRender: (text, record) => record.Vg + '/Sg = ' + record.G
      },
      {
        title: 'B（Sb=989.4）',
        dataIndex: 'B',
        key: 'B',
        customRender: (text, record) => record.Vb + '/Sb = ' + record.B
      }
      ],
      errorArr,
      title: '报告详情',
      reportPro: {},
      originData: [],
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
      verticalLines: [], // 纵向虚线的数据
      newArray: [],
      addArr: [],
      pdfUrl: ''
    }
  },
  mounted () {
    this.getDevice()
  },
  methods: {
    drawChart (dataArr, results) {
      // const verticalLinesArr = [23, 50, 80, 100, 140, 300]
      // 截取后42位
      const subArray = results?.slice(42, 84)
      // 提取每三个数字中的第一个数字组成新数组
      const rLinesArr = []
      const gLinesArr = []
      const bLinesArr = []
      for (let i = 0; i < subArray?.length; i += 3) {
        rLinesArr.push(subArray[i])
        gLinesArr.push(subArray[i + 1])
        bLinesArr.push(subArray[i + 2])
      }
      this.draw(rLinesArr, dataArr, 'r')
      this.draw(gLinesArr, dataArr, 'g')
      this.draw(bLinesArr, dataArr, 'b')
    },
    draw (linesArr, dataArr, type) {
      var lastIndex, rData, xData, chartDom
      if (type === 'r') {
        lastIndex = dataArr.map(obj => obj.r).lastIndexOf(9999) + 1
        const newArr = dataArr.slice(lastIndex, dataArr?.length - 1 - 4)
        xData = newArr.map(obj => obj.x - lastIndex)
        rData = newArr.map(obj => obj.r)
        chartDom = document.getElementById('urineEcharts')
      }
      if (type === 'g') {
        lastIndex = dataArr.map(obj => obj.g).lastIndexOf(9999) + 1
        const newArr = dataArr.slice(lastIndex, dataArr?.length - 5)
        xData = newArr.map(obj => obj.x - lastIndex)
        rData = newArr.map(obj => obj.g)
        chartDom = document.getElementById('gEcharts')
      }
      if (type === 'b') {
        lastIndex = dataArr.map(obj => obj.b).lastIndexOf(9999) + 1
        const newArr = dataArr.slice(lastIndex, dataArr?.length - 5)
        xData = newArr.map(obj => obj.x - lastIndex)
        rData = newArr.map(obj => obj.b)
        chartDom = document.getElementById('bEcharts')
      }
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
                color: 'blue'
              },
              data: linesArr.map(value => ({
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
        const domain = window.location.hostname
        console.log(domain)
        this.pdfUrl = `https://${domain}/api/wechat/home/%7BgroupId%7D/device-reports/ecg/${res.data.id}/ecg.pdf`
      } else {
        const originData = res.data.data.originData
        this.originData = originData
        const { maxR, maxG, maxB } = originData.reduce((acc, data) => {
          if (data.hasOwnProperty('r') && data.r > acc.maxR) {
            acc.maxR = data.r
          }
          if (data.hasOwnProperty('g') && data.g > acc.maxG) {
            acc.maxG = data.g
          }
          if (data.hasOwnProperty('b') && data.b > acc.maxB) {
            acc.maxB = data.b
          }
          return acc
        }, { maxR: Number.NEGATIVE_INFINITY, maxG: Number.NEGATIVE_INFINITY, maxB: Number.NEGATIVE_INFINITY })
        const results = res.data.data.fullResults?.rgbResults || []
        this.drawChart(originData, results)
        this.title = '尿检报告详情'
        const newArray = []
        if (results.length > 0) {
          for (let i = 0; i < 14; i++) {
            const index = i * 3
            const R = results[index] * 255 / maxR
            const G = results[index + 1] * 255 / maxG
            const B = results[index + 2] * 255 / maxB
            newArray.push({
              index: i + 1,
              r: results[index],
              rPosition: results[index + 42],
              rOriginal: results[index + 84],
              g: results[index + 1],
              gPosition: results[index + 43],
              gOriginal: results[index + 85],
              b: results[index + 2],
              bPosition: results[index + 44],
              bOriginal: results[index + 86],
              R,
              G,
              B
            })
          }
        }
        this.newArray = newArray
        this.addArr = []
        const constant = [850, 1020, 989.4]
        const lastThree = results.slice(-3)
        console.log('最后三个', lastThree, results)
        this.addArr.push({
          R: parseFloat(lastThree[0] / constant[0].toFixed(3)),
          Vr: lastThree[0],
          G: parseFloat(lastThree[1] / constant[1].toFixed(3)),
          Vg: lastThree[1],
          B: parseFloat(lastThree[2] / constant[2].toFixed(3)),
          Vb: lastThree[2]
        })
        console.log('this.addArr', this.addArr)
        const data = this.reportPro.data.fullResults
        const urineArr = []
        data.classes.map((item, index) => {
          urineArr.push({
            class: data.classes.length === 11 ? indexes11[index] : indexes[index],
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
    height: 20px;
    width: 20px;
  }
</style>
