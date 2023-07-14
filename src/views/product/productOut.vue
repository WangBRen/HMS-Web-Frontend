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
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination">
        <span slot="operation" slot-scope="text,scope">
          <a @click="viewDetails(scope)">查看</a>
        </span>
      </a-table>
    </a-card>
    <outRegistration
      v-if="outModelvisible"
      :outModelvisible="outModelvisible"
      @closeOutModal="closeOutModal"
      @successOut="successOut"
      :dataList="importDataList"
      :mode="mode"
      :viewDetail="detailData"
    />
  </div>
</template>

<script>
import outRegistration from './outRegistration.vue'
import { getOrders } from '@/api/product'
import moment from 'moment'
import xlsx from 'xlsx'
const columns = [
  {
    title: '出库编号',
    dataIndex: 'outNumber',
    key: 'outNumber'
  },
  {
    title: '出库数量',
    dataIndex: 'totalAmount',
    key: 'totalAmount'
  },
  {
    title: '客户名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '客户电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '出库人',
    dataIndex: 'outPerson',
    key: 'outPerson'
  },
  {
    title: '出库日期',
    dataIndex: 'outTime',
    key: 'outTime',
    customRender: (text, record, index) => record ? moment(record.outTime).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    outRegistration
  },
  data () {
    return {
      columns,
      dataSource: [],
      selectedRowKeys: [],
      outModelvisible: false, // 出库登记弹框
      mode: null,
      detailData: {},
      importDataList: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个订单`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  mounted () {
    this.getOrders()
  },
  methods: {
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getOrders()
    },
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      this.getOrders()
    },
    async getOrders () {
      const pages = {
        page: this.pagination.current - 1,
        size: this.pagination.pageSize
      }
      const res = await getOrders(pages)
      if (res.status === 200) {
        this.dataSource = res.data.content
      }
      this.pagination.total = res.data.totalElements
      console.log(res)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    successOut () {
      this.$message.success('出库成功')
      this.outModelvisible = false
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
            price: reader[i]['单价'],
            amount: reader[i]['型号数量'],
            serialNumbers: reader[i]['产品编号'].split('、')
          }
          console.log('切割编号', reader[i]['产品编号'].split('、'))
          this.importDataList.push(sheetData)
        }
        this.outModelvisible = true
        this.mode = 'shipment'
        console.log(this.importDataList, '导入的数据是---')
      }
    },
    viewDetails (data) {
      console.log('data', data)
      this.outModelvisible = true
      this.detailData = data
      this.importDataList = data.orders
      this.mode = 'viewDetail'
    }
  }
}
</script>

<style>

</style>
