<template>
  <div>
    <a-card>
      <a-button style="margin-bottom: 16px;" type="primary" @click="handAddProduct">新增设备</a-button>
      <a-button style="margin: 0 0 16px 20px;" :disabled="!hasSelected" @click="batchOutProdect">批量出库</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `选中 ${selectedRowKeys.length} 项` }}
        </template>
      </span>
      <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection" :rowKey="(record, index) => index">
        <span slot="operation" slot-scope="text,scope">
          <a @click="outProdect(scope)" v-if="scope.status==='NOT_OUT'">出库</a>
          <span v-else>-</span>
        </span>
        <span slot="serialNumber" slot-scope="text">
          <a>{{ text }}</a>
        </span>
        <a-tag slot="status" slot-scope="text" :color="text === 'OUT'?'blue':(text === 'BOUND'?'green':'')">{{ text | filterProductStatus }}</a-tag>
      </a-table>
    </a-card>
    <outRegistration
      v-if="outModelvisible"
      :dataList="dataList"
      :outModelvisible="outModelvisible"
      @closeOutModal="closeOutModal"
      @successOut="successOut"
      :mode="mode"
    />
    <addProduct
      v-if="productAddVisible"
      @closeProductAdd="closeProductAdd"
      @successProductAdd="successProductAdd"
      :productAddVisible="productAddVisible"
    />
  </div>
</template>

<script>
import outRegistration from './outRegistration.vue'
import addProduct from './addProduct.vue'
import { getDevices } from '@/api/product'
import moment from 'moment'

const columns = [
  {
    title: '设备编号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    scopedSlots: { customRender: 'serialNumber' }
  },
  {
    title: '品牌',
    dataIndex: 'product.productBrand',
    key: 'productBrand'
  },
  {
    title: '型号',
    dataIndex: 'product.productModel',
    key: 'productModel'
  },
  {
    title: '生产日期',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: (text, record, index) => record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  {
    title: '生产人',
    dataIndex: 'operator',
    key: 'operator'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' },
    filters: [{ text: '未出库', value: 'NOT_OUT' },
              { text: '已出库', value: 'OUT' },
              { text: '已绑定', value: 'BOUND' },
              { text: '维修中', value: 'REPAIRING' },
              { text: '已作废', value: 'INVALID' }],
    onFilter: (value, record) => record.status === value
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  filters: {
    filterProductStatus: function (value) {
      // console.log(value)
      if (value) {
        if (value === null) {
          return null
        } else if (value === 'NOT_OUT') {
          return '未出库'
        } else if (value === 'OUT') {
          return '已出库'
        } else if (value === 'BOUND') {
          return '已绑定'
        } else if (value === 'REPAIRING') {
          return '维修中'
        } else if (value === 'INVALID') {
          return '已废弃'
        }
      }
    }
  },
  components: {
    outRegistration,
    addProduct
  },
  data () {
    return {
      columns,
      dataSource: [],
      selectedRowKeys: [],
      outModelvisible: false, // 出库登记弹框
      productAddVisible: false,
      dataList: [],
      mode: null,
      type: ''
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.onChange(selectedRowKeys, selectedRows)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.status !== 'NOT_OUT',
            status: record.status
          }
        }),
        selectedRowKeys: this.selectedRowKeys
      }
    }
  },
  created () {
    this.type = this.$route.name
  },
  mounted () {
    this.getDevices()
  },
  methods: {
    onChange (selectedRowKeys, selectedRows) {
      this.dataList = selectedRows
      this.selectedRowKeys = selectedRowKeys
      // console.log('selectedRows: ', selectedRows, selectedRowKeys)
    },
    clearSelectedRows () {
      // 取消选择所有已经勾选的行
      this.selectedRowKeys = []
    },
    outProdect (scope) {
      console.log(scope)
      this.outModelvisible = true
      this.dataList = []
      const data = {
        brand: scope.product.productBrand,
        productModel: scope.product.productModel,
        price: scope.product.productPrice,
        amount: 1,
        serialNumbers: [],
        status: scope.status
      }
      data.serialNumbers.push(scope.serialNumber)
      this.dataList.push(data)
      this.mode = 'shipment'
    },
    batchOutProdect () {
      console.log('list', this.dataList)
      this.outModelvisible = true
      this.mode = 'shipment'
      this.dataList = this.dataList.map(item => {
        return {
          brand: item.product?.productBrand,
          productModel: item.product?.productModel,
          price: item.product?.productPrice,
          amount: 1,
          serialNumbers: [item.serialNumber],
          status: item.status
        }
      })
      console.log('555', this.dataList)
    },
    closeOutModal () {
      this.outModelvisible = false
      this.clearSelectedRows()
    },
    successOut () {
      this.outModelvisible = false
      this.$message.success('出库成功')
      this.clearSelectedRows()
      this.getDevices()
    },
    handAddProduct () {
      this.productAddVisible = true
    },
    closeProductAdd () {
      this.productAddVisible = false
    },
    successProductAdd () {
      this.productAddVisible = false
      this.$message.success('设备添加成功')
      this.getDevices()
    },
    async getDevices () {
      const resp = await getDevices({ page: 0, size: 1 })
      const pages = {
        page: 0,
        size: resp.data.totalElements
      }
      const res = await getDevices(pages)
      if (res.status === 200) {
        if (this.type === 'productManage') {
          this.dataSource = res.data.content.filter(item => {
            return item.status !== 'NOT_OUT'
          })
        } else {
          this.dataSource = res.data.content.sort((a, b) => {
            return b.createdAt > a.createdAt ? 1 : -1
          })
        }
      // this.pagination.total = res.data.totalElements
      }
    }
  },
  watch: {
    '$route.name' (newVal, oldVal) {
      this.type = newVal
      this.getDevices()
      console.log('newVal, oldVal', newVal, oldVal)
    }
  }
}
</script>

<style>

</style>
