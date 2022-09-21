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
                  <span @click="changeStatus(item.status)">
                    <a-tag style="margin-left: 10px;" :color="item.status === 'diagnosed' ? 'rgba(217, 0, 27, 0.768627450980392)' : (item.status === 'exception' ? 'blue' : 'rgba(245, 154, 35, 1)')">
                      {{ item.status | filterChronicStatus }}
                    </a-tag>
                  </span>
                  <span>
                    <a-tag :color="item.level <= 5 ? '' : 'rgba(217, 0, 27, 0.768627450980392)'">{{ item.level }}</a-tag>
                  </span>
                </a-col>
                <a-col :span="2">
                  <a :id="'str'+item.id" class="showData" style="font-size: 20px;color: white;" @click="showCard(item.id)">展开</a>
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
                      <div :id="'main'+item.id" :ref="'main'+item.id" style="width: 550px; height: 300px;"></div>
                    </a-col>
                    <a-col :span="12" class="card-indexData-table">
                      <ChronicInformationIndexTable
                        ref="tableRef"
                        :data="item"
                        :custId="custId"
                      />
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
    <a-modal
      v-model="changeStatusVisible"
      @ok="handleOk"
      @cancel="closeChangeStatus"
      title="修改慢病状态"
      :width="600">
      <span style="font-size: 16px;">请上传医院或医疗机构的确诊记录：</span>
      <div style="width: 300px;margin: 0 auto;">
        <a-upload-dragger action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="upload">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            点击或拖动文件上传
          </p>
        </a-upload-dragger>
      </div>
      <span style="color: rgb(170, 170, 170);">*支持PDF、照片图片及常见文件类型</span>
    </a-modal>
    <ChronicInformationChangeStatus ref="ChangeStatus"/>
  </div>
</template>
<script>
// import { getChronicManage as apiGetChronicManage } from '@/api/customer'
import moment from 'moment'
import { getChronicManage as apiGetChronicManage, getCustomerChronicIndex as apiGetCustomerChronicIndex } from '@/api/customer'
import echarts from 'echarts'
import ChronicInformationIndexTable from './ChronicInformationIndexTable.vue'
import ChronicInformationChangeStatus from './ChronicInformationChangeStatus.vue'

export default {
  components: {
    ChronicInformationIndexTable,
    ChronicInformationChangeStatus
  },
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
          console.log('时间', moment(value))
          return moment(value).format('YYYY-MM-DD HH:mm')
        }
      }
  },
  data () {
    return {
      chronicInfoVisible: false,
      changeStatusVisible: false,
      custId: null,
      tableData: [],
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
      // 解决重新打开modal框，文字为收起问题
      const dom = document.getElementsByClassName('showData')
      for (var j = 0; j < dom.length; j++) {
        dom[j].innerHTML = '展开'
      }
      // 解决重新打开modal框，文字为收起问题
      // echarts
      setTimeout(() => {
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
              // console.log('diseaseData', diseaseData)
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
            diseaseArr.push(diseaseData[i].data[j].value)
            timeArr.push(moment(diseaseData[i].data[j].testAt).format('YYYY-MM-DD'))
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
    changeStatus (status) {
      // this.changeStatusVisible = true
      console.log('修改状态', status)
      if (status === 'suspect') {
        this.$refs.ChangeStatus.openChangeStatus()
      }
    },
    closeChangeStatus () {
      this.changeStatusVisible = false
    },
    handleOk () {
      console.log('上传')
    },
    upload (info) {
      const status = info.file.status
      console.log('状态', status)
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
