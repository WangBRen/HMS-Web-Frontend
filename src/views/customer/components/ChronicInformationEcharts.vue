<template>
  <div>
    <a-row>
      <a-col style="display: flex;">
        <div style="margin: 0 auto; margin-bottom: 24px;">
          选择时间段：
          <a-range-picker
            style="width: 200px;"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            @change="selectTime"
            @ok="onOkTime"
          />
          <a-button @click="resetTime" style="margin-left: 8px;">重置</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :id="'ac-' + this.dataArr.id" :span="12" class="leftEcharts">
        <div :id="'echarts' + this.dataArr.id" style="width: 500px; height: 300px;"></div>
      </a-col>
      <a-col :span="12" class="rightTable" style="padding: 0 24px;">
        <a-table
          :columns="indexColumns"
          rowKey="id"
          :data-source="tableArr"
          :pagination="{ pageSize: 4 }"
          :scroll="{ }">
          <span slot="testAt" slot-scope="text, record">
            {{ record.testAt | getMoment }}
          </span>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { getCustomerChronicIndex as apiGetCustomerChronicIndex } from '@/api/customer'
import moment from 'moment'
import echarts from 'echarts'

export default {
  name: 'APP',
  filters: {
    getMoment: function (value) {
        if (value === null) {
            return ''
        } else {
            return moment(value).format('YYYY-MM-DD HH:mm')
        }
    }
  },
  components: {
  },
  props: {
    dataArr: {
      type: Object,
      default: null
    },
    custId: {
        type: Number,
        default: null
    }
  },
  data () {
    return {
      customerId: this.custId, // custid
      diseaseId: this.dataArr.id,
      startTime: null,
      endTime: null,
      tableArr: [], // 表格数据
      indexColumns: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '时间',
          dataIndex: 'testAt',
          key: 'testAt',
          scopedSlots: { customRender: 'testAt' }
        },
        {
          title: '数值',
          dataIndex: 'value',
          key: 'value'
        },
        {
          title: '参考结果',
          dataIndex: 'result',
          key: 'result'
        }
      ]
    }
  },
  methods: {
    resetTime () {
      this.startTime = null
      this.endTime = null
      this.initial()
    },
    initial () {
      // console.log('echartsData', this.echartsData, 'custid', this.customerId, 'diseaseId', this.diseaseId)
      const custId = this.customerId
      const diseaseId = this.diseaseId
      apiGetCustomerChronicIndex(custId, diseaseId).then(res => {
        if (res.status === 200) {
          // console.log('图和表的数据', res.data)
          // 过滤图文报告和主观文本，保留整数和小数
          const filterData = res.data.filter((item, i, arr) => {
            return item.info.type === 'Integer' || item.info.type === 'Float'
          })
          // console.log('过滤后图和表的数据', filterData)
          // 渲染Echarts图
          const testData = JSON.parse(JSON.stringify(filterData))
          this.drawLine(testData)
          // 渲染表格
          const indexArr = [] // 表格的数据
          const indexTable = filterData
          for (var i = 0; i < indexTable.length; i++) {
              // console.log('indexTable', indexTable[i].data)
              // console.log('name', indexTable[i].info.name)
              for (var j = 0; j < indexTable[i].data.length; j++) {
                  if (this.startTime !== null && this.endTime !== null) {
                    if (moment(indexTable[i].data[j].testAt).format('YYYY-MM-DD HH:mm') > this.startTime && moment(indexTable[i].data[j].testAt).format('YYYY-MM-DD HH:mm') < this.endTime) {
                      indexTable[i].data[j].name = indexTable[i].info.name
                      indexArr.push(indexTable[i].data[j])
                    }
                  } else {
                    indexTable[i].data[j].name = indexTable[i].info.name
                    indexArr.push(indexTable[i].data[j])
                  }
              }
          }
          this.tableArr = indexArr
          // this.tableArr = indexArr.reverse()
          // console.log('tableArr', this.tableArr)
        }
      })
    },
    // 绘制eharts图
    drawLine (diseaseData) {
      const seriesArr = []
      const legendArr = [] // 提示
      const timeArr = [] // X轴
      for (var i = 0; i < diseaseData.length; i++) {
          // console.log(diseaseData[i].data)
          legendArr.push(diseaseData[i].info.name)
          const diseaseArr = [] // 数据
          for (var j = 0; j < diseaseData[i].data.length; j++) {
            // 数值
            // 用于过滤错误数据
            if (typeof (diseaseData[i].data[j].testAt) === 'string') {
              if (this.startTime !== null && this.endTime !== null) {
                if (moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD HH:mm') > this.startTime && moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD HH:mm') < this.endTime) {
                    // 采用二维数组实现XY轴对应
                    diseaseArr.push([moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD HH:mm'), diseaseData[i].data[j].value])
                    // timeArr.push(moment(diseaseData[i].data[j].testAt).format('MM-DD HH:mm'))
                    timeArr.push(diseaseData[i].data[j].testAt)
                }
              } else {
                // 采用二维数组实现XY轴对应
                diseaseArr.push([moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD HH:mm'), diseaseData[i].data[j].value])
                // timeArr.push(moment(diseaseData[i].data[j].testAt).format('MM-DD HH:mm'))
                timeArr.push(diseaseData[i].data[j].testAt)
              }
            }
           }
          var diseaseArrIndex = {
              name: diseaseData[i].info.name,
              type: 'line',
              data: diseaseArr
          }
          seriesArr.push(diseaseArrIndex)
          // console.log('时间转换后的数组', timeArr.reverse())
      }
      // console.log('legendArr', legendArr)
      // console.log('seriesArr', seriesArr)
      // console.log('timeArr', timeArr)
      this.charts = echarts.init(document.getElementById('echarts' + this.dataArr.id))
      let width = document.getElementById('ac-' + this.dataArr.id).offsetWidth - 36
      if (width < 500) {
        width = 500
      }
      // console.log({ width })
      timeArr.sort((a, b) => {
          return b < a ? 1 : -1
      })
      for (var k = 0; k < timeArr.length; k++) {
        timeArr[k] = moment(timeArr[k]).format('YYYY-MM-DD HH:mm')
      }
      this.charts.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: ['收缩压', '舒张压', '体重指数']
          data: legendArr,
          left: 10,
          width
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: ['1月', '2月', '3月', '4月', '5月', '6月']
          // X轴时间去重
          data: [...new Set(timeArr)]
          // data: [...new Set(timeArr.reverse())]
        },
        yAxis: {
          type: 'value'
        },
        series: seriesArr
        // series: [
        //   {
        //     name: '收缩压',
        //     type: 'line',
        //     // stack: '总量',
        //     data: this.opinionData1
        //   }
        // ]
      })
    },
    selectTime (value, dateString) {
      // console.log('Selected Time: ', value)
      // console.log('Formatted Selected Time: ', dateString)
    },
    onOkTime (value) {
      this.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm')
      this.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm')
      // console.log('1', this.startTime, '2', this.endTime)
      setTimeout(() => {
        this.initial()
      }, 500)
    }
  },
  created () {
  },
  mounted () {
    setTimeout(() => {
      this.initial()
    }, 500)
  }
}
</script>
<style scoped>
.leftEcharts{
  height: 350px;
  border-right: 1px solid #ddd;
  padding-right: 12px;
}
</style>
