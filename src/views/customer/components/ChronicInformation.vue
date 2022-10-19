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
      <a-skeleton active :loading="loading"/>
      <div class="card">
        <a-space style="margin-bottom:10px">
          <a-button type="primary" @click="showFollowUpSheet(tableData)">创建随访单</a-button>
          <a-button type="primary" ghost style="float: right;">+健康指导</a-button>
        </a-space>
        <div class="card-row" v-for="item in tableData" :key="item.id">
          <a-row class="card-title" :style="`cursor: pointer; border-bottom: ${item.showIndex ? '1px solid #61affe' : 'none'}`">
            <a-col :span="23" @click="cardShow(item)">
              <span class="all-tags">
                <!-- <a-tag style="width:80px;" :color="item.status === 'diagnosed' ? 'red' : (item.status === 'exception' ? '' : 'orange')">
                  {{ item.status | filterChronicStatus }}
                </a-tag> -->
                <a-tag v-if="item.status==='exception'" color="">系统误判</a-tag>
                <a-tag v-if="item.status==='suspect'" color="orange" @click="changeStatus(item.status, item)">
                  <a-icon type="question-circle" /> 疑似
                </a-tag>
                <span v-if="item.status==='diagnosed'" class="all-tags">
                  <a-tag v-if="item.level===null||item.level===0" color="geekblue">已确诊</a-tag>
                  <a-tag v-if="item.level>0" color="red">{{ item.level }}级</a-tag>
                </span>
              </span>
              <span style="font-size: 16px;color: inherit;margin:0 10px;">{{ item.chronicDisease.name }}</span>
            </a-col>
            <a-col :span="1">
              <a style="font-size: 20px;color: inherit;float: right;" @click="cardShow(item)">
                <a-icon v-if="item.showIndex===false" type="right"/>
                <a-icon v-if="item.showIndex" type="down"/>
              </a>
            </a-col>
          </a-row>
          <a-row v-show="item.showIndex" :id="item.id" class="card-body">
            <a-card style="margin-top: 12px;" :loading="loading">
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
            <a-card title="慢病随访记录" style="margin-top: 12px;" :loading="loading">
              <FollowUpRecords
                :diseaseId="item.id"
                :customerId="custId"
                :diseaseObj="item"
                @addNewDisease="getDiseaseName"
              />
            </a-card>
            <a-card title="管理目标" style="margin-top: 12px; margin-bottom: 12px;" :loading="loading">
              <span>根据慢病管理中显示慢病已设定的管理目标，当首次随访完成后显示</span>
            </a-card>
          </a-row>
        </div>
        <!-- 查看所有随访单 -->
        <a-card title="全部随访记录" style="margin-top: 30px;">
          <FollowUpRecords
            :diseaseId="-1"
            :customerId="custId"
            :create-button-visible="isShowBtn"
          />
        </a-card>
      </div>
      <AddFollowUpSheet ref="FollowUpSheetRef"/>
    </a-modal>
    <ChronicInformationChangeStatus ref="ChangeStatus" :tableData="tableData"/>
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
      loading: false,
      userInfo: [],
      chronicInfoVisible: false,
      custId: null,
      tableData: [],
      isShowBtn: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.loading = true
      const resp = await apiGetChronicManage(this.custId)
      this.loading = false
      if (resp.status === 200) {
          this.tableData = resp.data.map((item) => {
            item.showIndex = false
            return item
          })
          // console.log('tableData', this.tableData)
      }
    },
    // 打开慢病管理弹窗
    openChronicInfo (custId, userInfo) {
      this.chronicInfoVisible = true
      this.custId = custId
      this.userInfo = userInfo
      // console.log(userInfo)
    },
    renovateData (custId) {
      apiGetChronicManage(custId).then(res => {
          if (res.status === 200) {
              // const tableData = res.data
              this.tableData = res.data.map((item) => {
                item.showIndex = false
                return item
              })
              // console.log('tableData', this.tableData)
          }
      })
    },
    closeChronicInfo () {
      this.chronicInfoVisible = false
    },
    cardShow (showIndex) {
      showIndex.showIndex = !showIndex.showIndex
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
    showFollowUpSheet (_tableData) {
      this.$refs.FollowUpSheetRef.openModal(this.userInfo, this.tableData)
    },
    getDiseaseName (val) {
      this.$refs.FollowUpSheetRef.openAddFollow(val, this.tableData)
    }
    // getformData (val, callback) {
    //   this.$refs.FollowUpSheetRef.openSunModel(val, callback)
    // }
  }
}
</script>
<style lang="less">
.card{
  // margin:0 100px;
  padding: 0px 10px;
}
.card-row {
  margin: 8px 0;
  border: 1px solid #61affe;
  border-radius: 4px;
}
.card-title {
  background-color: rgba(97,175,254,.1);
  border-bottom: none;
  /* margin: 3px 0; */
  /* height: 50px; */
  padding: 6px 10px;
}
.card-body {
  // border: 1px #eee solid;
  padding: 6px 24px;
  // margin-bottom: 24px;
  background-color: rgba(97,175,254,.1);
}
.all-tags>*{
  width: 65px;
  text-align: center;
}
</style>
