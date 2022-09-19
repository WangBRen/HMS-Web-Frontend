<template>
  <div>
    <a-table :columns="recordColumns" :data-source="recordData" :pagination="pagination">
      <span slot="result" slot-scope="result">
        <a-tag
          :color="result=='已回收' ? 'geekblue' : result=='回收中' ? '#e5e5e5' : 'orange'">
          {{ result }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, grecord">
        <a @click="retransmission(text, grecord)" v-if="grecord.level=='-'">重发</a>
        <a @click="retransmission(text, grecord)" v-else-if="grecord.level=='待判定'">判定</a>
        <a @click="retransmission(text, grecord)" v-else>查看随访表</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import { getFollowRecords as apiFollowUpRecords } from '@/api/health'
export default {
  name: 'FollowUpRecords',
  data () {
    return {
      recordColumns: [
        {
          title: '发送日期',
          dataIndex: 'SendData',
          key: 'a',
          align: 'center'
        },
        {
          title: '随访健康师',
          dataIndex: 'HealthSpecialist',
          key: 'b',
          align: 'center'
        },
        {
          title: '判定级别',
          dataIndex: 'level',
          key: 'c',
          align: 'center'
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
          dataIndex: 'RecyclingDate',
          key: 'e',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'f',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      recordData: [
        {
          SendData: '2022-09-09 19:45',
          HealthSpecialist: '张晓刚',
          level: '-',
          result: '回收中',
          RecyclingDate: '2022-10-09 13:25'
        },
        {
          SendData: '2022-09-08 19:45',
          HealthSpecialist: '张晓刚',
          level: '待判定',
          result: '已回收',
          RecyclingDate: '2022-10-09 13:25'
        },
        {
          SendData: '2022-09-08 19:45',
          HealthSpecialist: '张晓刚',
          level: '1级',
          result: '已回收',
          RecyclingDate: '2022-10-09 13:25'
        },
        {
          SendData: '2022-09-07 19:45',
          HealthSpecialist: '王小明',
          level: '-',
          result: '超时',
          RecyclingDate: '2022-10-09 13:25'
        }
      ],
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
    onSearch (value) {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      apiFollowUpRecords(value, pages).then(res => {
        if (res.status === 200) {
          this.loadingShow = false
          this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
          this.pagination.total = res.data.totalElements
        }
      })
    },
    retransmission (text, grecord) {
      console.log(text, grecord)
    }
  }

}
</script>

<style>

</style>
