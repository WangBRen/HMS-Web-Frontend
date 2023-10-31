<template>
  <div>
    <a-tabs
      default-active-key="1"
      :tab-position="mode"
      @tabClick="callback"
      @nextClick="callback"
    >
      <a-tab-pane v-for="i in productList" :key="i.id" :tab="`${i.name}`">
        <a-table :columns="columns" :data-source="deviceList" :rowKey="(record,index)=>{return index}" :pagination="pagination" style="background:#fff;padding: 0 10px">
          <a slot="workingStatus" slot-scope="text">
            <span v-if="text==='offline'">离线</span>
            <span v-if="text==='online'">在线</span>
            <span v-if="text==='running'">使用中</span>
          </a>
          <span slot="bind" slot-scope="text">
            <a-tag color="blue" v-if="text">已绑定</a-tag>
            <a-tag v-if="!text">未绑定</a-tag>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getProducts, getDevice } from '@/api/device'
import moment from 'moment'
const columns = [
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '绑定状态',
    dataIndex: 'bind',
    key: 'bind',
    scopedSlots: { customRender: 'bind' }
  },
  {
    title: '工作状态',
    dataIndex: 'workingStatus',
    key: 'workingStatus',
    scopedSlots: { customRender: 'workingStatus' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: (text, record, index) => record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
  }
]
export default {
  data () {
    return {
      mode: 'left',
      deviceList: [],
      productList: [],
      columns,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个设备`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  mounted () {
    this.getProduct()
  },
  methods: {
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getDevice(this.productId)
    },
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      this.getDevice(this.productId)
    },
    callback (val) {
      this.getDevice(val)
      this.productId = val
      console.log('123', val)
    },
    async getProduct () {
      const pages = {
        page: 1,
        size: 100
      }
      const res = await getProducts(pages)
      this.productList = res.data.content
      this.productId = this.productList[0].id
      this.getDevice(this.productId)
      console.log(res.data.content)
    },
    async getDevice (productId) {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      const res = await getDevice(pages, productId)
      this.deviceList = res.data.content
      this.pagination.total = res.data.totalElements
      console.log(res.data.content)
    }
  }
}
</script>

<style>

</style>
