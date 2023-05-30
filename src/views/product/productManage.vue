<template>
  <div>
    <a-card>
      <a-button style="margin-bottom: 16px;" type="primary">新增产品编号</a-button>
      <!-- <a-button style="margin: 0 0 16px 20px;" :disabled="!hasSelected" @click="outProdect">批量出库</a-button> -->
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `选中 ${selectedRowKeys.length} 项` }}
        </template>
      </span>
      <a-table :columns="columns" :data-source="dataSource" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
        <a slot="operation" @click="outProdect">出库</a>
        <a-tag slot="chuku" slot-scope="text">{{ text }}</a-tag>
      </a-table>
    </a-card>
    <outRegistration
      :outModelvisible="outModelvisible"
      @closeOutModal="closeOutModal"
    />
  </div>
</template>

<script>
import outRegistration from './outRegistration.vue'
const columns = [
  {
    title: '产品编号',
    dataIndex: 'number',
    key: 'number'
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
    title: '出库状态',
    dataIndex: 'chuku',
    key: 'chuku',
    scopedSlots: { customRender: 'chuku' }
  },
  {
    title: '出库日期',
    dataIndex: 'chukuDate',
    key: 'chukuDate'
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
    number: 'DM3401230052023001',
    date: '2023-05-30 09:18',
    name: '王强',
    chuku: '已出库',
    chukuDate: '2023-05-30 09:28'
  },
  {
    key: '2',
    number: 'DM3401230052023002',
    date: '2023-05-30 09:18',
    name: '王强',
    chuku: '已出库',
    chukuDate: '2023-05-30 09:28'
  }
]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  components: {
    outRegistration
  },
  data () {
    return {
      columns,
      dataSource,
      rowSelection,
      selectedRowKeys: [],
      outModelvisible: false // 出库登记弹框
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    outProdect () {
      this.outModelvisible = true
      console.log(this.outModelvisible)
    },
    closeOutModal () {
      this.outModelvisible = false
    }
  }
}
</script>

<style>

</style>
