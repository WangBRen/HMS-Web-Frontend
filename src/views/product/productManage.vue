<template>
  <div>
    <a-card>
      <a-button style="margin: 0 0 16px 20px;" :disabled="!hasSelected" @click="batchOutProdect">批量出库</a-button>
      <span style="float:right;">
        <a-upload name="file" accept=".xls,xlsx" :customRequest="importData" :showUploadList="false" style="margin:0 16px 0 0">
          <a-button> <a-icon type="upload" />excel导入设备</a-button>
        </a-upload>
        <a-button type="primary" @click="handAddProduct">新增设备</a-button>
      </span>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `选中 ${selectedRowKeys.length} 项` }}
        </template>
      </span>
      <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection" :rowKey="(record, index) => record.id">
        <span slot="operation" slot-scope="text,scope">
          <a @click="outProdect(scope)" v-if="scope.status==='NOT_OUT'">出库</a>
          <span v-else>-</span>
        </span>
        <span slot="serialNumber" slot-scope="text,scope">
          <a @click="viewDeviceLife(scope)">{{ text }}</a>
        </span>
        <a-tag slot="status" slot-scope="text" :color="text === 'OUT'?'blue':(text === 'BOUND'?'green':'')">{{ text | filterProductStatus }}</a-tag>
      </a-table>
    </a-card>
    <a-modal
      v-if="visible"
      :visible="visible"
      title="批量导入设备"
      @ok="saveImport"
      @cancel="close"
      :width="1000">
      <a-row>
        <a-col :span="3" :offset="1" style="font-weight:bold;font-size:17px;">选择设备状态：</a-col>
        <a-col :span="5">
          <a-radio-group button-style="solid" v-model="deviceStatus">
            <a-radio-button value="OUT">已出库</a-radio-button>
            <a-radio-button value="NOT_OUT">未出库</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-table :data-source="importDataList" :columns="importColumns" :rowKey="(record, index) => index">
        <span slot="result" slot-scope="text,scope">
          <a v-if="scope.exist" style="color:red;">设备已存在，请勿重复导入</a>
          <a v-else-if="scope.productId">校验成功</a>
          <a v-else style="color:orange;">该品牌型号的产品不存在</a>
        </span>
      </a-table>
    </a-modal>
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
    <deviceLife
      v-if="deviceVisible"
      :deviceVisible="deviceVisible"
      :deviceData="deviceData"
      @closeDeviceLife="closeDeviceLife"
    />
  </div>
</template>

<script>
import xlsx from 'xlsx'
import outRegistration from './outRegistration.vue'
import deviceLife from './deviceLife.vue'
import addProduct from './addProduct.vue'
import { getDevices, creatDevice, getProducts } from '@/api/product'
import moment from 'moment'
import { getUserInfo } from '@/api/login'

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
    addProduct,
    deviceLife
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
      type: '',
      importColumns: [
        {
          title: '产品编号',
          dataIndex: 'productNo',
          key: 'productNo',
          align: 'center'
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          key: 'brand',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel',
          align: 'center'
        },
        {
          title: '设备校验',
          dataIndex: 'productId',
          key: 'productId',
          scopedSlots: { customRender: 'result' }
        }
      ],
      importDataList: [],
      deviceStatus: '',
      visible: false,
      deviceVisible: false,
      deviceData: {},
      operator: ''
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
    getUserInfo().then(res => {
      this.operator = res.data.nickname
    })
  },
  methods: {
    async getProducts () {
      const pages = {
        page: 0,
        size: 1
      }
      const resp = await getProducts(pages)
      pages.size = resp.data.totalElements || 1
      getProducts(pages).then(res => {
        if (res.status === 200) {
          const productList = res.data.content
          this.importDataList = this.importDataList.map(item => {
            const product = productList.filter(product => { return product.productModel.trim() === item.productModel.trim() && product.productBrand.trim() === item.brand.trim() })
            const isStringIncluded = this.dataSource.some(obj => obj.serialNumber === item.productNo)
            if (isStringIncluded) {
              return { ...item, productId: product[0]?.id, exist: true }
            } else {
              return { ...item, productId: product[0]?.id }
            }
          })
        }
      })
    },
    viewDeviceLife (item) {
      this.deviceVisible = true
      this.deviceData = item
    },
    closeDeviceLife () {
      this.deviceVisible = false
    },
    close () {
      this.visible = false
    },
    saveImport () {
      const filterDevice = this.importDataList.filter(item => { return !item.productId || item.exist })
      if (filterDevice.length > 0) {
        this.$message.warning(filterDevice.length + '个设备校验失败，请检查后重试')
        return
      }
      if (this.deviceStatus === '') {
        this.$message.warning('请先选择设备状态')
      } else {
        this.importDataList.map(item => {
          const payLoad = {}
          payLoad.serialNumber = item.productNo
          payLoad.productId = item.productId
          payLoad.status = this.deviceStatus
          payLoad.operator = this.operator
          if (this.deviceStatus === 'OUT') {
            payLoad.deliveryPeople = this.operator
            payLoad.deliveryDate = new Date()
          }
          this.excelCreatDevice(payLoad)
        })
      }
    },
    async excelCreatDevice (payLoad) {
      const res = await creatDevice(payLoad)
      if (res.status === 200) {
        this.$message.success('设备创建成功')
        this.visible = false
        this.getDevices()
      } else if (res.status === 400) {
        this.$message.warning('设备已存在')
      }
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
            productNo: reader[i]['产品编号'],
            brand: reader[i]['产品品牌'],
            productModel: reader[i]['产品型号']
          }
          this.importDataList.push(sheetData)
        }
        this.visible = true
        this.getProducts()
        console.log(this.importDataList, '导入的数据是---')
      }
    },
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
          }).sort((a, b) => {
            return b.createdAt > a.createdAt ? 1 : -1
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
