<template>
  <div>
    <a-card>
      <a-button style="margin-bottom: 16px;" type="primary" @click="handAddProduct">新增产品编号</a-button>
      <a-button style="margin: 0 0 16px 20px;" :disabled="!hasSelected" @click="batchOutProdect">批量出库</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `选中 ${selectedRowKeys.length} 项` }}
        </template>
      </span>
      <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection">
        <span slot="operation" slot-scope="text,scope">
          <a @click="outProdect(scope)" v-if="scope.state==='未出库'">出库</a>
          <span v-else>-</span>
        </span>
        <a-tag slot="state" slot-scope="text">{{ text }}</a-tag>
      </a-table>
    </a-card>
    <outRegistration
      :importDataList="dataList"
      :outModelvisible="outModelvisible"
      @closeOutModal="closeOutModal"
      :mode="mode"
    />
    <addProduct
      v-if="productAddVisible"
      @closeProductAdd="closeProductAdd"
      :productAddVisible="productAddVisible"
    />
  </div>
</template>

<script>
import outRegistration from './outRegistration.vue'
import addProduct from './addProduct.vue'
const columns = [
  {
    title: '产品编号',
    dataIndex: 'productNo',
    key: 'productNo'
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand'
  },
  {
    title: '型号',
    dataIndex: 'productModel',
    key: 'productModel'
  },
  {
    title: '生产日期',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: '生产人',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
const dataSource = [
  {
    key: '1',
    productNo: 'DM3401230052023001',
    date: '2023-05-30 09:18',
    brand: '杜马',
    productModel: 'U32',
    name: '王强',
    state: '已出库'
  },
  {
    key: '2',
    productNo: 'DM3401230052023002',
    date: '2023-05-30 09:18',
    brand: '杜马',
    productModel: 'U32',
    name: '王强',
    state: '未出库'
  },
  {
    key: '3',
    productNo: 'DM3401230052023003',
    date: '2023-05-30 09:18',
    brand: '杜马',
    productModel: 'U32',
    name: '王强',
    state: '已绑定'
  },
  {
    key: '4',
    productNo: 'DM3401230052023004',
    date: '2023-05-30 09:18',
    brand: '杜马',
    productModel: 'U32',
    name: '王强',
    state: '未出库'
  }
]
export default {
  components: {
    outRegistration,
    addProduct
  },
  data () {
    return {
      columns,
      dataSource,
      selectedRowKeys: [],
      outModelvisible: false, // 出库登记弹框
      productAddVisible: false,
      dataList: [],
      mode: null
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // this.dataList = selectedRows
          // this.selectedRowKeys = selectedRowKeys
          this.onChange(selectedRowKeys, selectedRows)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.state !== '未出库',
            state: record.state
          }
        })
      }
    }
  },
  methods: {
    onChange (selectedRowKeys, selectedRows) {
      this.dataList = selectedRows
      this.selectedRowKeys = selectedRowKeys
      // console.log('selectedRows: ', selectedRows, this.dataList)
    },
    outProdect (scope) {
      console.log(scope)
      this.outModelvisible = true
      this.dataList = []
      const data = {
        brand: scope.brand,
        productModel: scope.productModel,
        unitPrice: 0,
        quantity: 1,
        productNo: scope.productNo
      }
      this.dataList.push(data)
      this.mode = 'shipment'
    },
    batchOutProdect () {
      this.outModelvisible = true
      this.mode = 'shipment'
    },
    closeOutModal () {
      this.outModelvisible = false
    },
    handAddProduct () {
      this.productAddVisible = true
    },
    closeProductAdd () {
      this.productAddVisible = false
    }
  }
}
</script>

<style>

</style>
