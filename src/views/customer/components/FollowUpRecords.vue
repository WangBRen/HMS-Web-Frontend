<template>
  <div>
    <a-table
      :columns="recordColumns"
      :data-source="recordData"
      :pagination="pagination"
      :rowKey="(record,index)=>{return index}">
      <span slot="HealthSpecialist" slot-scope="text,scope">
        {{ scope.diseases[0].diseasedBy.nickname }}
      </span>
      <span slot="level" slot-scope="text,scope">
        <span v-if="scope.diseases[0].level === 0">
          -
        </span>
        <span v-else>
          {{ scope.diseases[0].level }}
        </span>
      </span>
      <span slot="result" slot-scope="text,scope" rowkey="">
        <a-tag
          :color="scope.status==='success' ? 'geekblue' : scope.status==='pending' ? '#DEE1E6' : 'orange'">
          <span v-if="scope.status==='pending'">回收中</span>
          <span v-else-if="scope.status==='success'">已回收</span>
          <span v-else>超时</span>
        </a-tag>
      </span>
      <span slot="receivedAt" slot-scope="text, scope">
        <span v-if="scope.status==='success'">{{ scope.receivedAt }}</span>
        <span v-else> - </span>
      </span>
      <span slot="action" slot-scope="text, scope">
        <a v-if="scope.status!=='success'">重发</a>
        <a v-else-if="scope.level=='待判定'">判定</a>
        <a @click="ViewFollowUpTable(text, scope)" v-else>查看随访表</a>
      </span>
    </a-table>
    <a-button class="follow-start-button" type="primary" @click="showFollowUpSheet(chroName)">开始随访</a-button>
    <SeeFollowUpSheet ref="SeeFollowUpSheetRef"/>
  </div>
</template>

<script>
import moment from 'moment'
import { getFollowRecords as apiFollowUpRecords } from '@/api/followUpForm'
import { number } from 'echarts/lib/export'
import SeeFollowUpSheet from './SeeFollowUpSheet.vue'
export default {
  name: 'FollowUpRecords',
  components: {
    SeeFollowUpSheet
  },
  props: {
    diseaseId: {
      type: number,
      default: ''
    },
    customerId: {
      type: number,
      default: ''
    }
  },
  data () {
    return {
      recordColumns: [
        {
          title: '发送日期',
          dataIndex: 'sendAt',
          key: 'a',
          align: 'center',
          customRender: (text, record, index) => {
            return record ? moment(record.sendAt).format('YYYY-MM-DD HH:mm:ss') : ''
          }
        },
        {
          title: '随访健康师',
          dataIndex: 'HealthSpecialist',
          key: 'b',
          align: 'center',
          scopedSlots: { customRender: 'HealthSpecialist' }
        },
        {
          title: '判定级别',
          dataIndex: 'level',
          key: 'c',
          align: 'center',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '回收结果',
          dataIndex: 'result',
          key: 'd',
          align: 'center',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '回收日期',
          dataIndex: 'receivedAt',
          key: 'e',
          align: 'center',
          scopedSlots: { customRender: 'receivedAt' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'f',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      recordData: [],
      pages: {},
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
  created () {
    this.$setPageDataLoader(this.onSearch)
    this.onSearch()
  },
  methods: {
    onPageChange (page, _pageSize) {
      this.pagination.current = page
      this.onSearch()
    },
    onSizeChange (_current, pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.onSearch()
    },
    async onSearch () {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      apiFollowUpRecords(this.customerId, this.diseaseId, pages).then(res => {
        if (res.status === 200) {
          console.log(this.diseaseId, '随访记录的值', res.data)
          this.recordData = res.data.content || []
          this.pagination.total = res.data.totalElements
        } else {
          this.recordData = []
        }
      })
    },
    ViewFollowUpTable (text, grecord) {
      this.$refs.SeeFollowUpSheetRef.openFollowUpSheet(grecord)
      console.log('查看随访表', text, grecord)
    },
        // 点击创建随访单
    showFollowUpSheet (chroName) {
      console.log('创建随访单啦')
    }
  }
}
</script>

<style>
.follow-start-button {
  width: 260px;
  top: -36px;
  z-index: 999;
}
</style>
