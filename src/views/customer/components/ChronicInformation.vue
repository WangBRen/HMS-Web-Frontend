<template>
  <div>
    <a-modal
      :visible="chronicVisible"
      :title="`慢病管理${baseInfo?'【'+baseInfo.name+'】': ''}`"
      :footer="null"
      @cancel="closeChronicInfo"
      :width="1200"
      :dialog-style="{ top: '50px' }"
    >
      <div class="card">
        <a-space style="margin-bottom:10px">
          <a-button type="primary" @click="showFollowUpSheet" :disabled="disableFollow">创建随访单</a-button>
          <!-- <a-tooltip placement="top" :visible="disable">
            <template slot="title">
              <span>该患者暂无已分级慢病，请分级后再指导</span>
            </template>
            <div>
              <a-button type="primary" ghost @click="showHealthCoaching" style="float: right;" :disabled="disable">+健康指导</a-button>
            </div>
          </a-tooltip> -->
          <a-button type="primary" ghost @click="showHealthCoaching" style="float: right;" :disabled="disable">+健康指导</a-button>
        </a-space>
        <a-skeleton active :loading="loading"/>
        <div class="card-row" v-for="item in tableData" :key="item.id">
          <div @click="cardShow(item)">
            <a-row class="card-title" :style="`cursor: pointer; border-bottom: ${item.showIndex ? '1px solid #61affe' : 'none'}`">
              <a-col :span="23">
                <span class="all-tags">
                  <!-- <a-tag style="width:80px;" :color="item.status === 'diagnosed' ? 'red' : (item.status === 'exception' ? '' : 'orange')">
                    {{ item.status | filterChronicStatus }}
                  </a-tag> -->
                  <a-tag v-if="item.status==='exception'" color="">系统误判</a-tag>
                  <span v-if="item.status==='suspect'">
                    <a-tag color="orange" @click="changeStatus(item.status, item)">
                      <a-icon type="question-circle" /> 疑似
                    </a-tag>
                  </span>
                  <span v-if="item.status==='diagnosed'" class="all-tags">
                    <a-tag v-if="item.level === null" color="geekblue">已确诊</a-tag>
                    <a-tag v-else color="red">{{ item.level.level }}级</a-tag>
                  </span>
                </span>
                <span style="font-size: 16px;color: inherit;margin:0 10px;">{{ item.chronicDisease.name }}</span>
              </a-col>
              <a-col :span="1">
                <a style="font-size: 20px;color: inherit;float: right;">
                  <a-icon v-if="item.showIndex===false" type="right"/>
                  <a-icon v-if="item.showIndex" type="down"/>
                </a>
              </a-col>
            </a-row>
          </div>
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
                :dataArr="item"
                :custId="custId"
              />
            </a-card>
            <a-card title="慢病随访记录" style="margin-top: 12px;" :loading="loading">
              <span v-if="item.status !== 'diagnosed'">
                <a-icon type="question-circle" />
                温馨提示：你还没有对该慢病确诊，暂无法进行随访
              </span>
              <div v-else>
                <FollowUpRecords
                  :diseaseId="item.id"
                  :customerId="custId"
                  :diseaseObj="item"
                  @addNewDisease="getDiseaseName"
                />
              </div>
            </a-card>
            <a-card title="健康指导记录" style="margin-top: 12px;" :loading="loading">
              <span v-if="item.level == null">
                <a-icon type="question-circle" />
                温馨提示：你还没有对该慢病分级，暂无法进行健康指导
              </span>
              <div v-else>
                <HealthCoachingRecords :diseaseId="item.id" :customerId="custId" @setRefreshCallback="handleSetRefreshCallback"/>
                <a-button type="primary" class="HealthCoachingBtn" ghost @click="startHealthCoaching(item.id)">开始指导</a-button>
              </div>
            </a-card>
            <a-card title="管理目标" style="margin-top: 12px; margin-bottom: 12px;" :loading="loading">
              <span>根据慢病管理中显示慢病已设定的管理目标，当首次随访完成后显示</span>
            </a-card>
          </a-row>
        </div>
        <!-- 查看所有随访单 -->
        <a-card title="全部随访记录" style="margin-top: 30px;" :loading="loading" v-show="!disableFollow">
          <FollowUpRecords
            :diseaseId="-1"
            :customerId="custId"
            :create-button-visible="isShowBtn"
          />
        </a-card>
      </div>
      <AddFollowUpSheet
        v-if="addFollowFormVisible"
        :visible="addFollowFormVisible"
        :customerId="custId"
        :diseaseId="diseaseId"
        :baseInfo="baseInfo"
        @close="closeAddFollowForm"
        @onMessageSent="handleOnMessageSent"/>
    </a-modal>
    <ChronicInformationChangeStatus
      :userInfo="userInfo"
      :diseaseId="diseaseId"
      :customerId="custId"
      :changeStatusVisible="StatusVisible"
      @onClose="closeStatusModel"
      @successChangeState="updateStatusModel"/>
    <AddHealthCoaching
      :coachingVisible="coachingVisible"
      :customerId="custId"
      :diseaseId="diseaseId"
      :baseInfo="baseInfo"
      :tableData="tableData"
      @close="closeCoaching"
      @successCreat="successCreatCoaching"
    />
  </div>
</template>
<script>
import { getChronicManage as apiGetChronicManage } from '@/api/customer'
import FollowUpRecords from './FollowUpRecords.vue'
import AddFollowUpSheet from './AddFollowUpSheet.vue'
import ChronicInformationChangeStatus from './ChronicInformationChangeStatus.vue'
import ChronicInformationEcharts from './ChronicInformationEcharts.vue'
import { notification } from 'ant-design-vue'
import AddHealthCoaching from './AddHealthCoaching.vue'
import HealthCoachingRecords from './HealthCoachingRecords.vue'

const refreshGuidanceTable = {}

export default {
  components: {
    FollowUpRecords,
    AddFollowUpSheet,
    ChronicInformationChangeStatus,
    ChronicInformationEcharts,
    AddHealthCoaching,
    HealthCoachingRecords
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
  props: {
    custId: {
      type: Number,
      default: 0
    },
    baseInfo: {
      type: Object,
      default: function () {
        return {}
      }
    },
    chronicVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      userInfo: {},
      diseaseData: {},
      // custId: null,
      tableData: [],
      isShowBtn: false,
      addFollowFormVisible: false,
      diseaseObj: {},
      diseaseId: null,
      coachingVisible: false,
      StatusVisible: false,
      disable: true,
      disableFollow: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.loading = true
      // 获取慢病信息
      const resp = await apiGetChronicManage(this.custId)
      this.loading = false
      if (resp.status === 200) {
        this.tableData = resp.data.map((item) => {
          item.showIndex = false
          return item
        })
        console.log('tableData', this.tableData)
      } else {
        notification.open({
          message: '慢病信息获取失败',
          description: resp.message
        })
      }
      // 获取是否有已分级的慢病
      const chronicData = this.tableData.filter(chronic => {
        if (chronic.level !== null) {
            return chronic
        }
      })
      if (chronicData.length > 0) {
        this.disable = false
      } else {
        this.disable = true
        // this.$message.warning('该患者暂无已分级的慢病，请分级后再指导')
      }
      // 判断是否有已确诊的慢病
      const chronicDiagnosisData = this.tableData.filter(chronic => {
        if (chronic.status === 'diagnosed') {
            return chronic
        }
      })
      if (chronicDiagnosisData.length > 0) {
        this.disableFollow = false
      } else {
        this.disableFollow = true
      }
    },
    // 打开慢病管理弹窗
    // openChronicInfo (custId, userInfo) {
    //   this.chronicInfoVisible = true
    //   this.custId = custId
    //   this.userInfo = userInfo
    //   // console.log(userInfo)
    // },
    // renovateData (custId) {
    //   this.loadData()
    // },
    closeChronicInfo () {
      this.$emit('onclose')
    },
    updateStatusModel () {
      this.StatusVisible = false
      this.loadData()
    },
    closeStatusModel () {
      this.StatusVisible = false
    },
    cardShow (showIndex) {
      showIndex.showIndex = !showIndex.showIndex
    },
    // 点击修改慢病状态
    changeStatus (status, item) {
      event.stopPropagation()
      this.diseaseId = item.id
      if (status === 'suspect') {
        this.StatusVisible = true
      }
    },
    showFollowUpSheet () {
      this.addFollowFormVisible = true
    },
    getDiseaseName (diseaseId) {
      this.addFollowFormVisible = true
      this.diseaseId = diseaseId
      // this.$refs.FollowUpSheetRef.openAddFollow(val, this.tableData)
    },
    // getformData (val, callback) {
    //   this.$refs.FollowUpSheetRef.openSunModel(val, callback)
    // }
    closeAddFollowForm () {
      this.addFollowFormVisible = false
    },
    handleOnMessageSent (success) {
      if (success) {
        this.$message.success('发送成功')
        this.addFollowFormVisible = false
      } else {
        // notification.xxx
      }
    },
    showHealthCoaching () { // 新增健康指导
      this.coachingVisible = true
      this.diseaseId = -1
    },
    startHealthCoaching (diseaseId) {
      this.coachingVisible = true
      this.diseaseId = diseaseId
    },
    closeCoaching () {
      this.coachingVisible = false
    },
    async successCreatCoaching (diseaseId) {
      this.coachingVisible = false
      const refresh = refreshGuidanceTable['d-' + diseaseId]
      refresh && await refresh()
    },
    handleSetRefreshCallback (diseaseId, loadData) {
      refreshGuidanceTable['d-' + diseaseId] = loadData
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
.HealthCoachingBtn{
  width: 260px;
  top: -36px;
  z-index: 999;
}
</style>
