<template>
  <div :bordered="false">
    <!-- 所有慢病 -->
    <a-config-provider v-if="(!showLoading && diseaseData.length === 0)">
      <template #renderEmpty>
        <div style="text-align: center">
          <a-icon type="file-protect" style="font-size: 40px;line-height: 60px;" />
          <p>暂时还没有发现慢病哦</p>
        </div>
      </template>
      <a-list/>
    </a-config-provider>
    <div style="display: flex;justify-content: center;margin: 20px;" v-show="showLoading"><a-spin tip="玩命加载中..."/></div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane v-for="disease in diseaseData" :key="disease.diseaseId" :tab="disease.diseaseName">
        <a-table :columns="columns" :data-source="customers" :customRow="rowClick" style="background:#fff;padding: 0 10px;">
          <a slot="name" slot-scope="text, scope" @click.stop="seeUser(scope)">{{ text }}</a>
          <span slot="state" slot-scope="text, scope">
            <span v-for="Mydisease in scope.diseasesDetail" :key="Mydisease.id">
              <span v-if="Mydisease.chronicDisease.id === diseaseId">
                <a-tag color="orange" v-if="Mydisease.status === 'suspect'">疑似</a-tag>
                <a-tag v-if="Mydisease.status === 'exception'">系统误判</a-tag>
                <span v-if="Mydisease.status === 'diagnosed'">
                  <a-tag v-if="Mydisease.level === null" color="geekblue">已确诊</a-tag>
                  <a-tag v-else color="red">{{ Mydisease.level.level }}级</a-tag>
                </span>
              </span>
            </span>
            <!-- <span v-for=""></span> -->
          </span>
          <span slot="sexAge" slot-scope="text, scope">
            {{ scope.baseInfo.gender }} {{ getAge(scope.baseInfo.birthDate) }}
          </span>
          <span slot="nextCheckAt" slot-scope="text, scope">
            <span v-for="item in scope.diseasesDetail" :key="item.index">
              <span v-if="item.chronicDisease.id === diseaseId && item.status==='diagnosed'">{{ getNextCheckAt(item.nextCheckAt) }}</span>
            </span>
          </span>
          <span slot="remarkInterval" slot-scope="text, scope">
            <span v-for="item in scope.diseasesDetail" :key="item.index">
              <span v-if="item.chronicDisease.id === diseaseId && item.status==='diagnosed'">{{ item.remarkInterval || 0 }}天</span>
            </span>
          </span>
          <span slot="countDown" slot-scope="text, scope">
            <span v-for="item in scope.diseasesDetail" :key="item.index">
              <span v-if="item.chronicDisease.id === diseaseId && item.status==='diagnosed'">{{ getCountDown(item.nextCheckAt) }}</span>
              <span v-else-if="item.chronicDisease.id === diseaseId">-</span>
            </span>
          </span>
          <span slot="operation" slot-scope="text, scope">
            <a @click.stop="handleHealthData(scope)">健康信息</a>
          </span>
        </a-table>
        <a-row style="margin-top:20px" :gutter="16">
          <!-- <a-col :span="16"> -->
          <a-table :columns="columnForm" :data-source="AllFollowForms" style="background:#fff;padding: 0 10px;">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="result" slot-scope="text, record" rowkey="">
              <a-tag v-if="record.sendAt=== null" color="#ccc">已创建</a-tag>
              <a-tag v-else-if="record.status==='failure'" color="orange">超时</a-tag>
              <a-tag v-else-if="record.receivedAt===null" color="#999">回收中</a-tag>
              <a-tag v-if="record.status==='success'" color="geekblue">已回收</a-tag>
            </span>
            <span slot="operation" slot-scope="text, scope">
              <a @click="ViewFollowUpTable(text, scope)">查看随访单</a>
            </span>
          </a-table>
          <!-- </a-col> -->
          <!-- <a-col :span="8">
            <a-card title="消息通知" :bordered="false">
              <a slot="extra" href="#">more</a>
              <div class="list">
                <div class="rowUp" style="display: flex;justify-content: space-between;line-height: 32px;" v-for="message in messages" :key="message.index">
                  <span>{{ message.id }}、{{ message.name }} {{ message.content }}  </span><span>{{ message.date }}</span>
                </div>
              </div>
            </a-card>
          </a-col> -->
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <ChronicInformation
      v-if="chronicList.visible"
      :custId="chronicList.custId"
      :baseInfo="chronicList.baseInfo"
      :chronicVisible="chronicList.visible"
      @onclose="closeChronicModal"/>
    <!-- 查看健康信息 -->
    <HealthDataManagmentFormVue
      :openHealthvisible="openHealthvisible"
      @handleCancel="handleCancel"
      :customerId="currentCustomerId"
      ref="healthDataManagmentRef"
    />
    <!-- 查看随访单 -->
    <SeeFollowUpSheet
      v-if="currentSelectedForm.visible"
      :formId="currentSelectedForm.id"
      :customerId="customerId"
      :diseaseId="currentSelectedForm.diseaseId"
      :visible="currentSelectedForm.visible"
      @onclose="closeFollowUpFormModal"
      @grandFatherMethod="handleSuccessLevel"/>
    <SeeUserMsg
      v-if="seeVisible"
      :seeVisible="seeVisible"
      :seeData="seeData"
      @closeSeeModal="closeSeeModal"
      :customerId="healthCustomerId"
    />
  </div>
</template>

<script>
// import { getChronic as apiGetChronic } from '@/api/chronic'
import { getChronic } from '@/api/customer'
import { allFollowForm } from '@/api/followUpForm'
import { age } from '@/utils/age'
import ChronicInformation from '../customer/components/ChronicInformation.vue'
import HealthDataManagmentFormVue from '../customer/components/HealthDataManagmentForm.vue'
import SeeFollowUpSheet from '../customer/components/SeeFollowUpSheet.vue'
import SeeUserMsg from '../customer/components/SeeUserMsg.vue'
import moment from 'moment'
const columns = [
  {
    title: '姓名',
    dataIndex: 'nickname',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号',
    dataIndex: 'telephone'
  },
  {
    title: '性别 / 年龄',
    align: 'center',
    scopedSlots: { customRender: 'sexAge' }
  },
  {
    title: '状态',
    align: 'center',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '复查时间',
    scopedSlots: { customRender: 'nextCheckAt' }
    // customRender: (text, record) => record ? moment(record.diseasesDetail.nextCheckAt).format('YYYY-MM-DD HH:mm') : ''
  },
  {
    title: '复查间隔',
    align: 'center',
    scopedSlots: { customRender: 'remarkInterval' }
  },
  {
    title: '随访倒计时',
    align: 'center',
    scopedSlots: { customRender: 'countDown' }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
const columnForm = [
  {
    title: '随访时间',
    customRender: (text, record) => {
      return record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  {
    title: '随访用户',
    align: 'center',
    customRender: (text, record) => {
      return record ? record.customer.nickname : ''
    }
  },
  {
    title: '随访健康师',
    align: 'center',
    customRender: (text, record) => {
      return record.createdBy ? record.createdBy.nickname : ''
    }
  },
  {
    title: '回收结果',
    align: 'center',
    scopedSlots: { customRender: 'result' }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    ChronicInformation,
    HealthDataManagmentFormVue,
    SeeFollowUpSheet,
    SeeUserMsg
  },
  data () {
    return {
      columns,
      columnForm,
      diseaseData: [], // 所有人得的慢病
      customers: [], // 当前慢病下的人
      AllFollowForms: [], // 当前慢病下的随访记录
      diseaseChoose: '', // 当前选中慢病
      chronicList: { visible: '', custId: null, baseInfo: {} },
      openHealthvisible: false,
      currentCustomerId: null,
      currentSelectedForm: {
        id: -1,
        visible: false,
        diseaseId: -1
      },
      diseaseId: null,
      seeData: null,
      seeVisible: false,
      healthCustomerId: null,
      showLoading: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 100 // 默认每页显示数量
        // showSizeChanger: true, // 显示可改变每页数量
        // pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        // showTotal: total => `共 ${total} 个慢病`, // 显示总数
        // onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        // onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  mounted () {
    this.loadDate()
  },
  methods: {
    loadDate () {
      this.getChronic()
      // this.onSearchCustomer()
    },
    // 获取慢病表
    async getChronic () {
      const pages = {
        page: 1,
        size: 100
      }
      // const res = await apiGetChronic(pages)
      this.showLoading = true
      const res = await getChronic(pages)
      this.showLoading = false
      if (res.status === 200) {
        // this.customerData = (res.data.content || []).map(record => { return { ...record, key: record.id } })
        // const diseaseData = new Set()
        const diseaseData = []
        const customerData = []
        for (var member of res.data.content) {
          if (member.diseasesDetail.length > 0) {
            customerData.push(member)
            for (var disease of member.diseasesDetail) {
              const diseaseIdName = {
                diseaseName: disease.chronicDisease.name, diseaseId: disease.chronicDisease.id
              }
              // diseaseData.add(diseaseIdName)
              diseaseData.push(diseaseIdName)
            }
          }
        }
        var map = new Map()
        for (const item of diseaseData) {
          map.set(item.diseaseId, item)
        }
        this.diseaseData = [...map.values()]
        const diseaseChoose = this.diseaseData[0]
        this.diseaseId = diseaseChoose.diseaseId
        this.customerData = customerData
        this.filterMember(customerData, diseaseChoose.diseaseId)
        if (diseaseChoose.diseaseId) {
          this.getAllFollowForm(diseaseChoose.diseaseId)
        }
      }
    },
    // 获取该慢病下的随访记录
    async getAllFollowForm (diseaseId) {
      const res = await allFollowForm(-1, diseaseId)
      if (res.status === 200) {
        this.AllFollowForms = res.data.content
      }
    },
    // onSearchCustomer (value) {
    //   const pages = {
    //     page: this.pagination.current,
    //     size: this.pagination.pageSize
    //   }
    //   apiCustomerSearch(value, pages).then(res => {
    //     if (res.status === 200) {
    //       // this.customerData = (res.data.content || []).map(record => { return { ...record, key: record.id } })
    //       const customerData = []
    //       const diseaseData = new Set()
    //       for (var family of res.data.content) {
    //         for (var member of family.members) {
    //           customerData.push(member.member)
    //           for (var disease of member.member.diseases) {
    //             diseaseData.add(disease.name)
    //           }
    //         }
    //       }
    //       this.diseaseData = [...diseaseData]
    //       this.customerData = customerData
    //       this.diseaseName = this.diseaseData[0]
    //       this.filterMember(customerData, this.diseaseName)
    //       this.pagination.total = res.data.totalElements
    //     }
    //   })
    // },
    // 过滤有这种慢病的人
    filterMember (customerData, diseaseId) {
      const customers = new Set()
      for (var i of customerData) {
        for (var j of i.diseasesDetail) {
          if (diseaseId === j.chronicDisease.id) {
            customers.add(i)
          }
        }
      }
      this.customers = [...customers]
    },
    // 切换慢病
    callback (key) {
      console.log('切换慢病', key)
      this.filterMember(this.customerData, key)
      this.diseaseId = key
      this.getAllFollowForm(key)
    },
    getAge (birthDate) {
      return age(birthDate)
    },
    seeUser (record) {
      this.seeData = record.baseInfo
      this.seeVisible = true
      this.healthCustomerId = record.id
    },
    closeSeeModal () {
      this.seeVisible = false
    },
    closeChronicModal () {
      this.chronicList.visible = false
    },
    // 查看健康信息
    handleHealthData (record) {
      console.log('recordrecord', record)
      this.currentCustomerId = record.id
      this.openHealthvisible = true
      this.$refs.healthDataManagmentRef.setCustomerId(record.id, record)
      this.$refs.healthDataManagmentRef.findCustomerHealthReports()
    },
    handleCancel () {
      this.openHealthvisible = false
    },
    // 查看随访单
    ViewFollowUpTable (text, grecord) {
      this.customerId = grecord.customerId
      this.openFollowUpFormModal(grecord.id)
    },
    openFollowUpFormModal (formId, diseaseId) {
      this.currentSelectedForm.id = formId
      this.currentSelectedForm.visible = true
      if (diseaseId) {
        this.currentSelectedForm.diseaseId = diseaseId
      }
    },
    closeFollowUpFormModal () {
      this.currentSelectedForm.id = -1
      this.currentSelectedForm.visible = false
    },
    handleSuccessLevel () {
      this.currentSelectedForm.visible = false
      this.$message.success('分级成功')
      this.onSearch()
      this.$emit('successRefresh')
      // this.$reload()
    },
    rowClick (record) {
      return {
        on: {
          click: () => {
            this.chronicList.custId = record.id
            this.chronicList.baseInfo = record.baseInfo
            this.chronicList.visible = true
          }
        }
      }
    },
    getNextCheckAt (checkTime) {
      if (checkTime) {
        return moment(checkTime).calendar()
      } else {
        return '-'
      }
    },
    getCountDown (checkTime) {
      // return moment().endOf('checkTime').calendar()
      // this.timer = setInterval(() => {
        const nowTime = +new Date()
      // }, 1000)
      // console.log(this.nowTime)
        const futureTime = moment(checkTime).valueOf()
        if (futureTime > nowTime) {
          const totalSeconds = (futureTime - nowTime) / 1000
          const day = parseInt(totalSeconds / 60 / 60 / 24)
          return '剩余' + day + '天'
        } else {
          return '已超时'
        }
    }
  },
  created () {
    this.$setPageDataLoader(this.loadDate)
  }
}
</script>

<style>
@keyframes rowup {
  0% {
    -webkit-transform: translate3d(0,10px,0);
    transform: translate3d(0,10px,0);
  }
  100% {
    -webkit-transform: translate3d(0,-50px,0);
    transform: translate3d(0,-20px,0);
  }
}
  .list{
    height: 160px;
  }
  .rowUp{
    -webkit-animation: 10s rowup linear infinite normal;
    animation: 3s rowup linear infinite normal;
    position: relative;
  }
</style>
