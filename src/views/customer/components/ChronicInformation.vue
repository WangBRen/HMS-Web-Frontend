<template>
  <div>
    <a-modal
      forceRender
      v-model="chronicInfoVisible"
      title="慢病管理"
      @cancel="closeChronicInfo"
      :width="1150"
    >
      <div class="card">
        <div class="card-body" v-for="item in tableData" :key="item.id">
          <a-row>
            <a-col :span="24">
              <a-row class="card-title">
                <a-col :span="22">
                  <span style="font-size: 20px;color: white;">慢病名称: </span>
                  <span style="font-size: 20px;color: white;">{{ item.chronicDisease.name }}</span>
                  <span>
                    <a-tag style="margin-left: 10px;" :color="item.status === 'diagnosed' ? 'rgba(217, 0, 27, 0.768627450980392)' : (item.status === 'exception' ? 'blue' : 'rgba(245, 154, 35, 1)')">
                      {{ item.status | filterChronicStatus }}
                    </a-tag>
                  </span>
                  <span>
                    <a-tag :color="item.level <= 5 ? '' : 'rgba(217, 0, 27, 0.768627450980392)'">{{ item.level }}</a-tag>
                  </span>
                </a-col>
                <a-col :span="2">
                  <a :id="'str'+item.id" class="haha" style="font-size: 20px;color: white;" @click="showCard(item.id)">展开</a>
                </a-col>
              </a-row>
              <a-row :id="item.id" class="card-detail" style="display: none">
                <a-col>
                  <a-row class="card-index">
                    <a-col class="card-index-title" :span="3">指标项</a-col>
                    <a-col class="card-index-data" :span="21">
                      <span v-for="items in item.chronicDisease.items" :key="items.indexItem.id">
                        <a-tooltip>
                          <template slot="title">
                            <span v-for="tip in items.indexItem.result" :key="tip.id">
                              {{ tip | filterTip }}
                            </span>
                          </template>
                          <a-tag>{{ items.indexItem.name }}</a-tag>
                        </a-tooltip>
                      </span>
                    </a-col>
                  </a-row>
                  <a-row class="card-indexData">
                    <a-col :span="12" class="card-indexData-chart">
                      <div :id="'main'+item.id" :ref="'main'+item.id" style="width: 500px; height: 300px;"></div>
                    </a-col>
                    <a-col :span="12" class="card-indexData-table">
                      <a-table :columns="indexColumns" :data-source="indexData">

                      </a-table>
                    </a-col>
                  </a-row>
                  <a-row class="card-record">
                    <a-col :span="3" class="card-record-title">
                      <span>慢病随访记录</span>
                    </a-col>
                    <a-col class="card-record-table" :span="21">
                      <a-table :columns="recordColumns" :data-source="recordData">
                        <span slot="action">
                          <a href="">操作</a>
                        </span>
                      </a-table>
                    </a-col>
                  </a-row>
                  <a-row class="card-manage">
                    <a-col :span="3" class="card-manage-title">
                      <span>管理目标</span>
                    </a-col>
                    <a-col :span="21" class="card-manage-body">
                      <span>根据慢病管理中显示慢病已设定的管理目标，当首次随访完成后显示</span>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
// import { getChronicManage as apiGetChronicManage } from '@/api/customer'
import moment from 'moment'
import { getChronicManage as apiGetChronicManage, getCustomerChronicIndex as apiGetCustomerChronicIndex } from '@/api/customer'
import echarts from 'echarts'

export default {
  filters: {
    filterTip: function (value) {
      // 范围或数值
      if (value.type === 'range') {
      // 范围
      return `${value.name}:\t ${value.start || 'INF'} ≤ 指标值 < ${value.end || 'INF'} `
      } else if (value.type === 'simple') {
      // 数值
      return value.value
      }
    },
    filterChronicStatus: function (value) {
        if (value === 'suspect') {
            return '疑似'
        } else if (value === 'diagnosed') {
            return '已确诊'
        } else if (value === 'exception') {
            return '系统误判'
        }
    },
    getMoment: function (value) {
        if (value === null) {
          return ''
        } else {
          return moment(value).format('YYYY-MM-DD HH:mm')
        }
      }
  },
  data () {
    return {
      chronicInfoVisible: false,
      custId: null,
      tableData: [],
      indexData: [],
      recordData: [],
      indexDataColumns: [
        {
          title: '时间',
          dataIndex: 'a',
          key: 'a'
        },
        {
          title: '数值',
          dataIndex: 'b',
          key: 'b'
        },
        {
          title: '参考结果',
          dataIndex: 'c',
          key: 'c'
        }
      ],
      indexColumns: [
        {
          title: '时间',
          dataIndex: 'a',
          key: 'a'
        },
        {
          title: '数值',
          dataIndex: 'b',
          key: 'b'
        },
        {
          title: '参考结果',
          dataIndex: 'c',
          key: 'c'
        }
      ],
      recordColumns: [
        {
          title: '发送日期',
          dataIndex: 'a',
          key: 'a'
        },
        {
          title: '随访健康师',
          dataIndex: 'b',
          key: 'b'
        },
        {
          title: '判定级别',
          dataIndex: 'c',
          key: 'c'
        },
        {
          title: '回收结果',
          dataIndex: 'd',
          key: 'd'
        },
        {
          title: '回收日期',
          dataIndex: 'e',
          key: 'e'
        },
        {
          title: '操作',
          dataIndex: 'f',
          key: 'f',
          scopedSlots: { customRender: 'action' }
        }
      ],
      charts: '',
      opinionData1: ['143', '70', '60', '110', '130'],
      opinionData2: ['100', '200', '300', '50', '70'],
      opinionData3: ['1', '2', '', '3', '1', '1.5'],
      // echart数据
      echartData: [
      ]
    }
  },
  mounted () {
  },
  methods: {
    // 打开慢病管理弹窗
    openChronicInfo (custId) {
      this.chronicInfoVisible = true
      this.custId = custId
      apiGetChronicManage(custId).then(res => {
          if (res.status === 200) {
              this.tableData = res.data
              // console.log('tableData', this.tableData)
          }
      })
      // echarts
      setTimeout(() => {
        // 解决重新打开modal框，文字为收起问题
        const dom = document.getElementsByClassName('haha')
        for (var j = 0; j < dom.length; j++) {
          dom[j].innerHTML = '展开'
        }
        // 解决重新打开modal框，文字为收起问题
        // 循环大标题，渲染折线图
        for (var i = 0; i < this.tableData.length; i++) {
          // console.log('main' + this.tableData[i].id)
          // console.log('custId', this.custId, 'diseaseId ', this.tableData[i].id)
          const custId = this.custId
          const diseaseId = this.tableData[i].id
          // const diseaseName = this.tableData[i].chronicDisease.name
          apiGetCustomerChronicIndex(custId, diseaseId).then(res => {
            if (res.status === 200) {
              // console.log('图的数据', res.data)
              const diseaseData = res.data
              this.drawLine('main' + diseaseId, diseaseData)
            }
          })
        }
      }, 500)
    },
    closeChronicInfo () {
      this.chronicInfoVisible = false
    },
    showCard (id) {
      if (document.getElementById('str' + id).innerHTML === '展开') {
        document.getElementById('str' + id).innerHTML = '收起'
        document.getElementById(id).style.display = 'block'
      } else {
        document.getElementById('str' + id).innerHTML = '展开'
        document.getElementById(id).style.display = 'none'
      }
    },
    // 渲染折线图
    drawLine (mainId, diseaseData) {
      console.log('数据', diseaseData)
      const seriesArr = []
      const legendArr = [] // 提示
      for (var i = 0; i < diseaseData.length; i++) {
          // console.log(diseaseData[i].data)
          legendArr.push(diseaseData[i].info.name)
          const diseaseArr = [] // 数据
          for (var j = 0; j < diseaseData[i].data.length; j++) {
            // 数值
            diseaseArr.push(diseaseData[i].data[j].value)
            // console.log(moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD HH:mm'))
          }
          var diseaseArrIndex = {
              name: diseaseData[i].info.name,
              type: 'line',
              data: diseaseArr
          }
          seriesArr.push(diseaseArrIndex)
      }
      // console.log('legendArr', legendArr)
      console.log('seriesArr', seriesArr)
      this.charts = echarts.init(document.getElementById(mainId))
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
          right: '4%',
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
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
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
    }
  }
}
</script>
<style>
.card-body{
  margin: 5px 0;
}
.card-title{
  background-color: rgba(64, 158, 255, 1);
  border-style: solid;
  border-width: 1px;
  /* margin: 3px 0; */
  /* height: 50px; */
  padding: 10px;
}
/* .card-detail{
  background-color: blueviolet;
  border-style: solid;
  border-width: 1px;
} */
.card-index{
  line-height: 60px;
}
.card-index-title{
  line-height: 60px;
  border-style: solid;
  border-width: 1px;
  text-align: center;
  font-size: 20px;
}
.card-index-data{
  padding-left: 5px;
  border-style: solid;
  border-width: 1px;
  text-align: left;
  font-size: 14px
}
.card-chart{
  border-style: solid;
  border-width: 1px;
}
.card-table1{
  border-style: solid;
  border-width: 1px;
}
.card-indexData-chart{
  height: 350px;
  border-style: solid;
  border-width: 1px;
}
.card-indexData-table{
  height: 350px;
  border-style: solid;
  border-width: 1px;
}
/* .card-record{
  height: 500px;
} */
.card-record-title{
  height: 450px;
  border-style: solid;
  border-width: 1px;
}
.card-record-table{
  height: 450px;
  border-style: solid;
  border-width: 1px;
}
.card-manage-title{
  border-style: solid;
  border-width: 1px;
}
.card-manage-body{
  border-style: solid;
  border-width: 1px;
}
</style>
