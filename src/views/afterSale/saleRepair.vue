<template>
  <div>
    <a-card>
      <div>
        <!-- <a-table
          :columns="formColumns"
          row-key="id"
          :data-source="salesDate"
          :pagination="pagination"
        >
          <span slot="action" slot-scope="text,record">
            <a>{{ record.status }}</a>
          </span>
        </a-table> -->
        <a-tabs>
          <a-tab-pane key="1" tab="待评估">

          </a-tab-pane>
          <a-tab-pane key="2" tab="已评估">

          </a-tab-pane>
          <a-tab-pane key="3" tab="待支付">

          </a-tab-pane>
          <a-tab-pane key="4" tab="待上门">

          </a-tab-pane>
          <a-tab-pane key="5" tab="已解决">

          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>
<script>
export default {
  name: 'APP',
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
          dataIndex: 'staturs',
          key: 'staturs',
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
          name: '测试',
          telephone: '123456',
          orderNumber: '10010',
          customerService: '张三',
          staturs: '待评估'
        },
        {
          name: '测试',
          telephone: '123456789',
          orderNumber: '10011',
          customerService: '李四',
          staturs: '已评估'
        },
        {
          name: '测试',
          telephone: '147258369',
          orderNumber: '10012',
          customerService: '王五',
          staturs: '待上门'
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
      }
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
      this.getAccount()
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
