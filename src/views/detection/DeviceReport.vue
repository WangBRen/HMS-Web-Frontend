<template>
  <div>
    <a-card :bordered="false">
      <!-- <a slot="extra" href="#">more</a> -->
      <div>
        <a-select default-value="--" style="width: 120px" v-model="type">
          <a-select-option value="--">
            全部
          </a-select-option>
          <a-select-option value="ecg">
            心电
          </a-select-option>
          <a-select-option value="urine">
            尿检
          </a-select-option>
        </a-select>
        <a-select default-value="all" style="width: 120px" v-model="mode">
          <a-select-option value="all">
            全部
          </a-select-option>
          <a-select-option value="taken">
            已领取
          </a-select-option>
          <a-select-option value="untaken">
            未领取
          </a-select-option>
        </a-select>
        <a-button type="primary " style="margin-left: 8px;float: right;" @click="handleSearch">查询</a-button>
      </div>
      <a-table :columns="columns" :data-source="deviceReportList" :rowKey="(record,index)=>{return index}" :pagination="pagination">
        <a slot="action" slot-scope="text, record" @click="seeDetail(record)">查看</a>
      </a-table>
    </a-card>
    <EcgDetailVue v-if="detailVisible" :visible="detailVisible" :reportId="reportId" @cancel="cancel"/>
  </div>
</template>

<script>
import { getDeviceReport } from '@/api/device'
import moment from 'moment'
import EcgDetailVue from './EcgDetail.vue'
const columns = [
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: (text, record, index) => record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  {
    title: '报告类型',
    dataIndex: 'reportType',
    key: 'reportType'
  },
  {
    title: '检测人',
    dataIndex: 'customer.baseInfo.name'
  },
  {
    title: '检测设备',
    dataIndex: 'device.name'
  },
  { title: '操作', scopedSlots: { customRender: 'action' } }
]
export default {
  components: {
    EcgDetailVue
  },
  data () {
    return {
      mode: 'all',
      type: '--',
      deviceReportList: [],
      columns,
      detailVisible: false,
      reportId: null,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个报告`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  mounted () {
    this.getDevice()
  },
  methods: {
    handleSearch () {
      this.pagination.current = 1
      this.getDevice()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getDevice()
    },
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      this.getDevice()
    },
    async getDevice () {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      const type = this.type === '--' ? '' : this.type
      const res = await getDeviceReport(pages, this.mode, type)
      this.deviceReportList = res.data.content
      this.pagination.total = res.data.totalElements
      console.log(res.data.content)
    },
    seeDetail (record) {
      console.log('record', record)
      this.detailVisible = true
      this.reportId = record.id
    },
    cancel () {
      this.detailVisible = false
    }
  }
}
</script>

<style>

</style>
