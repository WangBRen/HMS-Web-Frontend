<template>
  <div>
    <a-tabs
      default-active-key="1"
      :tab-position="mode"
      @tabClick="callback"
      @nextClick="callback"
    >
      <a-tab-pane v-for="i in productList" :key="i.id" :tab="`${i.name}`">
        <a-form layout="inline">
          <a-row>
            <a-col :xl="5" :sm="10">
              <a-form-item label="uuid">
                <a-input v-model="uuid" placeholder="请输入设备uuid"/>
              </a-form-item>
            </a-col>
            <a-col :xl="5" :sm="10">
              <a-form-item label="设备名">
                <a-input v-model="deviceName" placeholder="请输入设备名"/>
              </a-form-item>
            </a-col>
            <a-col :xl="5" :sm="10">
              <span class="table-page-search-submitButtons">
                <a-button @click="searchDevice" type="primary">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
        <a-table :columns="columns" :data-source="deviceList" :rowKey="(record,index)=>{return index}" :pagination="pagination" style="background:#fff;padding: 0 10px">
          <span slot="workingStatus" slot-scope="text">
            <span v-if="text==='offline'">离线</span>
            <a v-if="text==='online'">在线</a>
            <a v-if="text==='running'">使用中</a>
          </span>
          <span slot="bind" slot-scope="text">
            <a-tag color="blue" v-if="text">已绑定</a-tag>
            <a-tag v-if="!text">未绑定</a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <a-popover title="修改试纸数" trigger="click">
              <a slot="content">
                <a-input-number v-model="shizhiNum" :min="1" :max="10" />
                <a-button @click="onChangeNum(record)">确定</a-button>
              </a>
              <a>试纸数</a>
            </a-popover>
            <a-divider v-if="record.bind" type="vertical" />
            <a-popconfirm
              v-if="record.bind"
              title="你确定解绑设备吗?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="unBind(record)"
            >
              <a>解绑</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { getProducts, getDevice, unBindDevice, changeshizhiNum } from '@/api/device'
import moment from 'moment'
const columns = [
  {
    title: '设备ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '设备uuid',
    dataIndex: 'uuid',
    key: 'uuid'
  },
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
    title: '设备管理员',
    customRender: (text, record) => record.deviceManager ? record.deviceManager.nickname : ''
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
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data () {
    return {
      mode: 'left',
      deviceList: [],
      productList: [],
      columns,
      productId: null,
      uuid: '',
      deviceName: '',
      shizhiNum: 0,
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
    async onChangeNum (record) {
      const res = await changeshizhiNum(record.id, this.shizhiNum)
      if (res.status === 200) {
        this.$message.success('试纸数修改成功')
      }
    },
    searchDevice () {
      this.pagination.current = 1
      this.getDevice()
    },
    async unBind (record) {
      const res = await unBindDevice(record.id)
      if (res.status === 200) {
        this.$message.success('解绑成功')
        this.getDevice()
      }
      console.log('record', record, res)
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
    callback (val) {
      this.productId = val
      this.getDevice()
    },
    async getProduct () {
      const pages = {
        page: 1,
        size: 100
      }
      const res = await getProducts(pages)
      this.productList = res.data.content
      this.productId = this.productList[0].id
      this.getDevice()
      console.log(res.data.content)
    },
    async getDevice () {
      const pages = {
        page: this.pagination.current - 1,
        size: this.pagination.pageSize
      }
      const res = await getDevice(pages, this.productId, this.uuid, this.deviceName)
      this.deviceList = res.data.content
      this.pagination.total = res.data.totalElements
      console.log(res.data.content)
    }
  }
}
</script>

<style>

</style>
