<template>
  <div>
    <a-card>
      <div>
        <a-row>
          <a-col :span="6">
            <a-input placeholder="请输入用户名"/>
          </a-col>
          <a-col :span="6">
            <a-button type="primary">查询</a-button>
          </a-col>
          <a-col :span="4">
            <a-button type="primary">新建</a-button>
          </a-col>
          <a-col :span="4" style="line-height:32px;">
            <a-checkbox>
              我的用户
            </a-checkbox>
          </a-col>
        </a-row>
      </div>
      <div>
        <a-table
          row-key="id"
          :columns="formColumns"
          :data-source="salesDate"
          :pagination="pagination"
        >
          <span slot="action" slot-scope="text,record">
            <a @click="openActionModal(record)">操作</a>
          </span>
        </a-table>
      </div>
    </a-card>
    <saleInstallModal
      :installVisible="installVisible"
      :checkData="checkData"
      :current="checkData.statusId"
      @clostActionModal="clostActionModal"
    />
  </div>
</template>
<script>
import saleInstallModal from './saleInstallModal.vue'
export default {
  components: {
    saleInstallModal
  },
  data () {
    return {
      formColumns: [
        {
          title: '客户名',
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: '联系方式',
          dataIndex: 'telephone',
          key: 'telephone',
          align: 'center'
        },
        {
          title: '订单号',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
          align: 'center'
        },
        {
          title: '记录客服',
          dataIndex: 'customerService',
          key: 'customerService',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          align: 'center'
        },
        {
          title: '操作',
          // width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      salesDate: [
        {
          id: '1',
          name: '测试',
          telephone: '123456',
          orderNumber: '10010',
          customerService: '张三',
          status: '待评估',
          statusId: 0
        },
        {
          id: '2',
          name: '测试',
          telephone: '123456789',
          orderNumber: '10011',
          customerService: '李四',
          status: '已评估',
          statusId: 1
        },
        {
          id: '3',
          name: '测试',
          telephone: '147258369',
          orderNumber: '10012',
          customerService: '王五',
          status: '待上门',
          statusId: 2
        },
        {
          id: '4',
          name: '测试',
          telephone: '147258369',
          orderNumber: '10012',
          customerService: '赵六',
          status: '已解决',
          statusId: 3
        }
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        // showSizeChanger: true, // 显示可改变每页数量
        // pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个账户`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      installVisible: false,
      checkData: {}
    }
  },
  methods: {
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      // this.getAccount()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      // this.getAccount()
    },
    openActionModal (data) {
      this.installVisible = true
      this.checkData = data
      console.log(data)
    },
    clostActionModal () {
      this.installVisible = false
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>

</style>
