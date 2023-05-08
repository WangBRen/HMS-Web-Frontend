<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :rowKey="(record,index)=>{return index}">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <!-- <span slot="customTitle"><a-icon type="smile-o" /> Name</span> -->
      <span slot="status" slot-scope="text, scope">
        <span v-if="scope.status === 'success' && scope.read === true">已读</span>
        <span v-if="scope.status === 'success' && scope.read === false">发送成功</span>
        <span v-if="scope.status === 'created'">创建成功</span>
      </span>
      <span slot="action" slot-scope="text, scope">
        <a v-if="scope.status !== 'success'" @click="retransmission(text, scope)">重发 | </a>
        <a @click="coachingSee(text, scope)">查看</a>
      </span>
    </a-table>
    <HealthCoachingSend
      v-if="sendVisible"
      :customerId="customerId"
      :guidanceId="guidanceId"
      :coachingSendVisible="sendVisible"
      @onclose="closeSendModel"
      @onMessageSendSuccess="closeSendModel"
    />
    <HealthCoachingSee
      v-if="coachingVisible"
      :customerId="customerId"
      :guidanceId="guidanceId"
      :coachingVisible="coachingVisible"
      @onclose="closeCoachingModel"
    />
  </div>
</template>

<script>
import { getGuidanceRecords as apiGuidanceRecords } from '@/api/guidance'
import HealthCoachingSend from './HealthCoachingSend.vue'
import HealthCoachingSee from './HealthCoachingSee.vue'
import moment from 'moment'
const columns = [
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    align: 'center',
    key: 'createdAt',
    customRender: (text, record, index) => {
      return record.createdAt ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'
    }
  },
  {
    title: '创建人',
    key: 'name',
    align: 'center',
    dataIndex: 'name',
    customRender: (text, record, index) => {
      return record.createdBy.nickname
    }
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'HealthCoachingRecords',
  components: {
    HealthCoachingSend,
    HealthCoachingSee
  },
  props: {
    customerId: {
      type: Number,
      default: null
    },
    diseaseId: {
      type: Number,
      default: null
    },
    setRefreshCallback: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  filters: {
  },
  data () {
    return {
      columns,
      dataSource: [],
      pages: {},
      sendVisible: false,
      guidanceId: null,
      coachingVisible: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['5', '10', '20'], // 每页数量选项
        showTotal: total => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  mounted () {
    this.loadData()
    this.$emit('setRefreshCallback', this.diseaseId, this.loadData)
  },
  methods: {
    onPageChange (page, _pageSize) {
      this.pagination.current = page
      this.loadData()
      // this.$reload()
    },
    onSizeChange (_current, pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.loadData()
        // this.$reload()
    },
    async loadData () {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      const resp = await apiGuidanceRecords(this.customerId, this.diseaseId, pages)
      if (resp.status === 200) {
        this.dataSource = resp.data.content || []
        this.pagination.total = resp.data.totalElements
      } else {
        this.dataSource = []
      }
    },
    retransmission (_text, scope) {
      this.guidanceId = scope.id
      this.sendVisible = true
    },
    closeSendModel () {
      // console.log('关闭')
      this.sendVisible = false
    },
    coachingSee (text, scope) {
      this.guidanceId = scope.id
      this.coachingVisible = true
    },
    closeCoachingModel () {
      this.coachingVisible = false
    }
  }
}
</script>

<style>

</style>
