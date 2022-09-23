<template>
  <div>
    <a-row>
      <a-col :span="12" class="leftEcharts">
        <a-button style="margin-left: 150px;margin-top: 5px;" class="resetButton" @click="resetTime">刷新</a-button>
        <a-range-picker
          style="width: 200px;"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['开始时间', '结束时间']"
          @change="selectTime"
          @ok="onOkTime"
        />
        <div :id="'echarts'+this.dataArr.id" style="width: 550px;height: 300px;"></div>
      </a-col>
      <a-col :span="12" class="rightTable">
        <a-table
          class="rightTable_body"
          :columns="indexColumns"
          rowKey="id"
          :data-source="tableArr"
          :pagination="{ pageSize: 5 }"
          :scroll="{ }">
          <span slot="testAt" slot-scope="text, record">
            {{ record.testAt | getMoment }}
          </span>
        </a-table>
      </a-col>
    </a-row>
    <!-- <a-button @click="initial">点击</a-button> -->
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
      echartsData: this.dataArr, // 原始数据
      customerId: this.custId, // custid
      diseaseId: this.dataArr.id,
      startTime: null,
      endTime: null,
      apiData: [],
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
          // 渲染图
          this.apiData = res.data
          this.drawLine(res.data)
          // 渲染表
          const indexArr = []
          const indexTable = res.data
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
                  // indexTable[i].data[j].name = indexTable[i].info.name
                  // indexArr.push(indexTable[i].data[j])
              }
          }
          this.tableArr = indexArr
          // console.log('tableArr', this.tableArr)
        }
      })
    },
    // 绘制eharts图
    drawLine (diseaseData) {
      // console.log('数据', diseaseData)
      const seriesArr = []
      const legendArr = [] // 提示
      const timeArr = []
      for (var i = 0; i < diseaseData.length; i++) {
          // console.log(diseaseData[i].data)
          legendArr.push(diseaseData[i].info.name)
          const diseaseArr = [] // 数据
          for (var j = 0; j < diseaseData[i].data.length; j++) {
            // 数值
            if (this.startTime !== null && this.endTime !== null) {
              if (moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD HH:mm') > this.startTime && moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD HH:mm') < this.endTime) {
                  diseaseArr.push(diseaseData[i].data[j].value)
                  timeArr.push(moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD'))
              }
            } else {
              diseaseArr.push(diseaseData[i].data[j].value)
              timeArr.push(moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD'))
            }
          }
          var diseaseArrIndex = {
              name: diseaseData[i].info.name,
              type: 'line',
              data: diseaseArr
          }
          seriesArr.push(diseaseArrIndex)
          // X轴时间去重
          // console.log([...new Set(timeArr)], '时间转换后的数组', timeArr)
      }
      // console.log('legendArr', legendArr)
      // console.log('seriesArr', seriesArr)
      this.charts = echarts.init(document.getElementById('echarts' + this.dataArr.id))
      this.charts.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: ['收缩压', '舒张压', '体重指数']
          data: legendArr
        },
        grid: {
          left: '3%',
          right: '8%',
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
  height: 380px;
  border-right-width: 1px;
  border-right-style: solid;
}
/* .resetButton{
  margin-left: 150px;
} */
/* .rightTable_body{
  margin: 10px;
} */
</style>
