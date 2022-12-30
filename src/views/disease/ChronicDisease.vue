<template>
  <div :bordered="false">
    <!-- 所有慢病 -->
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane v-for="disease in diseaseData" :key="disease" :tab="disease.diseaseName">
        <a-table :columns="columns" :data-source="customers" style="background:#fff;padding: 0 10px;">
          <a slot="name" slot-scope="text, scope" @click="showChroncInfo(scope)">{{ text }}</a>
          <span slot="state" slot-scope="text, scope">
            <span v-for="Mydisease in scope.diseasesDetail" :key="Mydisease.id">
              <span v-if="Mydisease.chronicDisease.name === diseaseName">
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
        </a-table>
        <a-row style="margin-top:20px" :gutter="16">
          <a-col :span="16">
            <a-table :columns="columnForm" :data-source="forms">
              <a slot="name" slot-scope="text">{{ text }}</a>
              <span slot="state" slot-scope="text, scope">
                {{ scope }}
                <!-- <span v-for=""></span> -->
              </span>
            </a-table>
          </a-col>
          <a-col :span="8">
            <a-card title="消息通知" :bordered="false">
              <a slot="extra" href="#">more</a>
              <div class="list">
                <div class="rowUp" style="display: flex;justify-content: space-between;line-height: 32px;" v-for="message in messages" :key="message.index">
                  <span>{{ message.id }}、{{ message.name }} {{ message.content }}  </span><span>{{ message.date }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <ChronicInformation
      v-if="chronicList.visible"
      :custId="chronicList.custId"
      :baseInfo="chronicList.baseInfo"
      :chronicVisible="chronicList.visible"
      @onclose="closeChronicModal"/>
  </div>
</template>

<script>
// import { getChronic as apiGetChronic } from '@/api/chronic'
import { getChronic } from '@/api/customer'
import { allFollowForm } from '@/api/followUpForm'
import { age } from '@/utils/age'
import ChronicInformation from '../customer/components/ChronicInformation.vue'
const columns = [
  {
    title: '姓名',
    dataIndex: 'nickname',
    key: 'nickname',
    scopedSlots: { customRender: 'name' }
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
    title: '复查时间'
  },
  {
    title: '随访倒计时'
  },
  {
    title: '操作'
  }
]
const columnForm = [
  {
    title: '姓名'
  },
  {
    title: '随访时间'
  },
  {
    title: '回收结果'
  },
  {
    title: '操作'
  }
]
export default {
  components: {
    ChronicInformation
  },
  data () {
    return {
      columns,
      columnForm,
      diseaseData: [], // 所有人得的慢病
      customers: [], // 当前慢病下的人
      forms: [], // 当前慢病下的随访记录
      diseaseChoose: '', // 当前选中慢病
      chronicList: { visible: '', custId: null, baseInfo: {} },
      messages: [
        { id: '1', name: '张三', date: '18:21', content: '提交一条随访单' },
        { id: '2', name: '李四', date: '16:28', content: '提交一条随访单' },
        { id: '3', name: '李四', date: '13:26', content: '提交一条随访单' },
        { id: '4', name: '李四', date: '昨天', content: '提交一条随访单' },
        { id: '5', name: '李四', date: '12月25日', content: '提交一条随访单' },
        { id: '5', name: '李四', date: '12月25日', content: '提交一条随访单' },
        { id: '5', name: '李四', date: '12月25日', content: '提交一条随访单' },
        { id: '5', name: '李四', date: '12月25日', content: '提交一条随访单' },
        { id: '5', name: '李四', date: '12月25日', content: '提交一条随访单' },
        { id: '6', name: '王五', date: '12月21日', content: '复查时间将至' }
      ],
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
      this.getAllFollowForm()
      // this.onSearchCustomer()
    },
    // 获取慢病表
    async getChronic () {
      const pages = {
        page: this.pagination.current,
        size: 20
      }
      // const res = await apiGetChronic(pages)
      const res = await getChronic(pages)
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
        this.diseaseName = this.diseaseData[0].diseaseName
        this.customerData = customerData
        this.filterMember(customerData, this.diseaseData[0])
      }
    },
    // 获取该慢病下的随访记录
    async getAllFollowForm () {
      const res = await allFollowForm(-1, this.diseaseChoose.diseaseId)
      console.log('所有随访单', res)
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
    filterMember (customerData, diseaseChoose) {
      const customers = new Set()
      for (var i of customerData) {
        for (var j of i.diseasesDetail) {
          if (diseaseChoose.diseaseId === j.chronicDisease.id) {
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
      this.diseaseName = key.diseaseName
    },
    getAge (birthDate) {
      return age(birthDate)
    },
    showChroncInfo (record) {
      this.chronicList.custId = record.id
      this.chronicList.baseInfo = record.baseInfo
      this.chronicList.visible = true
    },
    closeChronicModal () {
      this.chronicList.visible = false
    }
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
