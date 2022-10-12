<template>
  <div>
    <a-modal
      forceRender
      v-model="chronicInfoVisible"
      v-if="chronicInfoVisible"
      :title="`慢病管理【${userInfo?.name || ''}】`"
      :footer="null"
      @cancel="closeChronicInfo"
      :width="1200"
    >
      <div class="card">
        <a-space style="margin-bottom:10px">
          <a-button type="primary" @click="showFollowUpSheet(tableData)">创建随访单</a-button>
          <a-button type="primary" ghost style="float: right;">+健康指导</a-button>
        </a-space>
        <div class="card-row" v-for="item in tableData" :key="item.id">
          <a-row class="card-title">
            <a-col :span="22" @click="cardShow(item)">
              <span style="font-size: 20px;color: white;">慢病名称: </span>
              <span style="font-size: 20px;color: white;">{{ item.chronicDisease.name }}</span>
              <span @click="changeStatus(item.status, item)">
                <a-tag style="margin-left: 10px;" :color="item.status === 'diagnosed' ? 'rgba(217, 0, 27, 0.768627450980392)' : (item.status === 'exception' ? 'blue' : 'rgba(245, 154, 35, 1)')">
                  {{ item.status | filterChronicStatus }}
                </a-tag>
              </span>
              <span>
                <a-tag :color="item.level <= 5 ? '' : 'rgba(217, 0, 27, 0.768627450980392)'">{{ item.level }}</a-tag>
              </span>
            </a-col>
            <a-col :span="2">
              <!-- <a :id="'str'+item.id" class="showData" style="font-size: 20px;color: white;" @click="showCard(item.id)">展开</a> -->
              <a style="font-size: 20px;color: white;" @click="cardShow(item)">{{ item.showIndex === false ? '展开' : '收起' }}</a>
            </a-col>
          </a-row>
          <a-row v-show="item.showIndex" :id="item.id" class="card-body">
            <a-card style="margin-top: 12px;">
              <template #title>
                <span>指标项</span>
                <span style="margin-left: 12px">
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
                </span>
              </template>
              <ChronicInformationEcharts
                ref="echartsRef"
                :dataArr="item"
                :custId="custId"
              />
            </a-card>
            <a-card title="慢病随访记录" style="margin-top: 12px;">
              <FollowUpRecords :diseaseId="item.id" :customerId="custId"/>
            </a-card>
            <a-card title="管理目标" style="margin-top: 12px; margin-bottom: 12px;">
              <span>根据慢病管理中显示慢病已设定的管理目标，当首次随访完成后显示</span>
            </a-card>
          </a-row>
        </div>
      </div>
      <AddFollowUpSheet ref="FollowUpSheetRef"/>
    </a-modal>
    <ChronicInformationChangeStatus ref="ChangeStatus"/>
  </div>
</template>
<script>
import { getChronicManage as apiGetChronicManage } from '@/api/customer'
import FollowUpRecords from './FollowUpRecords.vue'
import AddFollowUpSheet from './AddFollowUpSheet.vue'
import ChronicInformationChangeStatus from './ChronicInformationChangeStatus.vue'
import ChronicInformationEcharts from './ChronicInformationEcharts.vue'

export default {
  components: {
    FollowUpRecords,
    AddFollowUpSheet,
    ChronicInformationChangeStatus,
    ChronicInformationEcharts
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
    }
  },
  data () {
    return {
      userInfo: [],
      chronicInfoVisible: false,
      custId: null,
      tableData: []
    }
  },
  methods: {
    // 打开慢病管理弹窗
    openChronicInfo (custId, userInfo) {
      this.chronicInfoVisible = true
      this.custId = custId
      this.userInfo = userInfo
      // console.log(userInfo)
      apiGetChronicManage(custId).then(res => {
          if (res.status === 200) {
              // const tableData = res.data
              this.tableData = res.data.map((item) => {
                item.showIndex = false
                return item
              })
              console.log('tableData', this.tableData)
          }
      })
      // 解决重新打开modal框，文字为收起问题
      const dom = document.getElementsByClassName('showData')
      for (var j = 0; j < dom.length; j++) {
        dom[j].innerHTML = '展开'
      }
      // 解决重新打开modal框，文字为收起问题
    },
    closeChronicInfo () {
      this.chronicInfoVisible = false
    },
    // showCard (id) {
    //   if (document.getElementById('str' + id).innerHTML === '展开') {
    //     document.getElementById('str' + id).innerHTML = '收起'
    //     document.getElementById(id).style.display = 'block'
    //   } else {
    //     document.getElementById('str' + id).innerHTML = '展开'
    //     document.getElementById(id).style.display = 'none'
    //   }
    // },
    cardShow (showIndex) {
      if (showIndex.showIndex === false) {
        showIndex.showIndex = true
      } else {
        showIndex.showIndex = false
      }
    },
    // 点击修改慢病状态
    changeStatus (status, item) {
      // console.log('修改状态', status, 'item', item)
      if (status === 'suspect') {
        const userInfo = this.userInfo
        const diseaseData = item
        this.$refs.ChangeStatus.openChangeStatus(userInfo, diseaseData)
      }
    },
    onChange (value, dateString) {
      // console.log('Selected Time: ', value)
      // console.log('Formatted Selected Time: ', dateString)
    },
    onOk (value) {
      // console.log('onOk: ', value)
      this.openChronicInfo()
    },
    showFollowUpSheet (_tableData) {
      this.$refs.FollowUpSheetRef.openModal(this.userInfo, this.tableData)
    }
  }
}
</script>
<style lang="less">
.card{
  // margin:0 100px;
  padding: 0px 10px;
}
.card-row {
  margin: 6px 0;
}
.card-title {
  background-color: rgba(64, 158, 255, 1);
  border-radius: 4px;
  /* margin: 3px 0; */
  /* height: 50px; */
  padding: 12px;
}
.card-body {
  border: 1px #eee solid;
  padding: 6px 24px;
  margin-bottom: 24px;
}

</style>
