<template>
  <div>
    <a-card>
      <a-upload name="file" accept=".xls,xlsx" :customRequest="importData" :showUploadList="false">
        <a-button><a-icon type="export" />excel出库</a-button>
      </a-upload>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `选中 ${selectedRowKeys.length} 项` }}
        </template>
      </span>
      <a-table :columns="columns" :data-source="dataSource">
        <a slot="operation">查看</a>
      </a-table>
    </a-card>
    <outRegistration
      v-if="outModelvisible"
      :outModelvisible="outModelvisible"
      @closeOutModal="closeOutModal"
      :importDataList="importDataList"
    />
  </div>
</template>

<script>
import outRegistration from './outRegistration.vue'
// import moment from 'moment'
import xlsx from 'xlsx'
const columns = [
  {
    title: '出库编号',
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '出库数量',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName'
  },
  {
    title: '客户电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '出库人',
    dataIndex: 'name',
    key: 'name'
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
    num: 23,
    customerName: '张三',
    phone: '18237463647',
    name: '王强',
    chuku: '已出库',
    chukuDate: '2023-05-30 09:28'
  }
]
export default {
  components: {
    outRegistration
  },
  data () {
    return {
      columns,
      dataSource,
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
    closeOutModal () {
      this.outModelvisible = false
    },
    importData (file) {
      this.importDataList = []
      let reader = new FileReader()
      reader.readAsBinaryString(file.file) // 这个是file.file文件，可不是file……
      reader.onload = (ev) => {
        const res = ev.target.result
        const worker = xlsx.read(res, { type: 'binary' })
        // 将返回的数据转换为json对象的数据
        reader = xlsx.utils.sheet_to_json(worker.Sheets[worker.SheetNames[0]])
        for (let i = 0; i < reader.length; i++) {
          // 定义要导出的
          const sheetData = {
            brand: reader[i]['产品品牌'],
            productModel: reader[i]['产品型号'],
            unitPrice: reader[i]['单价'],
            number: reader[i]['型号数量'],
            productNo: reader[i]['产品编号']
          }
          this.importDataList.push(sheetData)
        }
        this.outModelvisible = true
        console.log(this.importDataList, '导入的数据是---')
      }
    }
  }
}
</script>

<style>

</style>
