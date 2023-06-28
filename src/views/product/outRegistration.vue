<template>
  <a-modal
    :title="mode==='shipment'?'出库登记':'出库详情'"
    :visible="outModelvisible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1200"
    :footer="mode === 'shipment' ? undefined : null"
  >
    <a-form-model
      v-if="mode==='shipment'"
      ref="ruleForm"
      :model="form"
      :label-col="{ span:6 }"
      :wrapper-col="{ span: 18 }"
      :rules="formRules"
    >
      <a-row>
        <a-col :span="12">
          <a-form-model-item ref="name" label="客户名称" prop="name">
            <a-input
              v-model="form.name"
              placeholder="请输入客户姓名"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item ref="phone" label="客户电话" prop="phone">
            <a-input
              v-model="form.phone"
              placeholder="请输入客户手机号"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="出货地:">
            <Address @changes="getAddress($event)" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="详细地址:" prop="address">
            <a-input v-model="form.address" placeholder="请输入详细地址"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item ref="logistics" label="物流方" prop="logistics">
            <a-select v-model="form.logistics" placeholder="请选择物流">
              <a-select-option value="中通">
                中通
              </a-select-option>
              <a-select-option value="申通">
                申通
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-row>
            <!-- <a-col :span="4"></a-col> -->
            <a-col :span="11" :offset="3">
              <a-form-model-item ref="totalPrice" label="应收总价" prop="totalPrice">
                <a-input-number v-model="form.totalPrice" :min="0"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="10">
              <a-form-model-item ref="amountReceived" label="实收总价" prop="amountReceived">
                <a-input-number v-model="form.amountReceived" :min="0"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <!-- <a-row>
      </a-row> -->
    </a-form-model>
    <a-descriptions bordered title="出库登记表" style="margin:10px 28px" v-if="mode==='viewDetail'">
      <a-descriptions-item label="出库编号">
        {{ viewDetail.outNumber }}
      </a-descriptions-item>
      <a-descriptions-item label="出库总数量">
        {{ viewDetail.totalAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="出库时间">
        {{ viewDetail.outTime }}
      </a-descriptions-item>
      <a-descriptions-item label="客户名称">
        {{ viewDetail.name }}
      </a-descriptions-item>
      <a-descriptions-item label="客户电话">
        {{ viewDetail.phone }}
      </a-descriptions-item>
      <a-descriptions-item label="出库人员">
        {{ viewDetail.outPerson }}
      </a-descriptions-item>
      <a-descriptions-item label="物流方">
        {{ viewDetail.logistics }}
      </a-descriptions-item>
      <a-descriptions-item label="应收金额">
        {{ viewDetail.totalPrice }}
      </a-descriptions-item>
      <a-descriptions-item label="实收金额">
        {{ viewDetail.amountReceived }}
      </a-descriptions-item>
      <a-descriptions-item label="出货地">
        {{ viewDetail.province }}{{ viewDetail.city }}{{ viewDetail.area }}
      </a-descriptions-item>
      <a-descriptions-item label="详细地址" :span="2">
        {{ viewDetail.address }}
      </a-descriptions-item>
    </a-descriptions>
    <a-card :title="`出库单【 总数：${totalNum} 】`" style="margin:10px 28px">
      <a-table :columns="columns" :data-source="importDataList" :rowKey="(record, index) => index">
        <span slot="status" slot-scope="text,scope">
          <span v-for="item in scope.status" :key="item.index">
            <div v-if="item.status==='NOT_OUT'"><a><a-icon type="check-circle" /> 检验通过</a></div>
            <a-tag v-else-if="item.status==='OUT'" color="volcano">{{ item.serialNumber }} 已出库</a-tag>
            <div v-else style="color:red;">{{ item.serialNumber }} {{ item.status }}</div>
          </span>
        </span>
        <span slot="serialNumber" slot-scope="text,scope">
          <a v-for="item in scope.serialNumbers" :key="item.index">
            <a-tag>{{ item }}</a-tag>
          </a>
        </span>
      </a-table>
    </a-card>
  </a-modal>
</template>

<script>
import Address from '@/components/CheckAddress/CheckAddress.vue'
import { creatOrders, updateDevices, getDevices } from '@/api/product'
import { getUserInfo } from '@/api/login'
import moment from 'moment'

const columns = [
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
    title: '单价',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '数量',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: '产品编号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    width: 200,
    scopedSlots: { customRender: 'serialNumber' }
  },
  {
    title: '校验结果',
    dataIndex: 'status',
    key: 'status',
    width: 300,
    scopedSlots: { customRender: 'status' }
  }
]
export default {
  components: {
    Address
  },
  props: {
    outModelvisible: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    viewDetail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    mode: {
      type: String,
      default: null
    }
  },
  mounted () {
    getUserInfo().then(res => {
      this.outPerson = res.data.nickname
      // console.log('getUserInfo', res)
    })
    this.getDevices()
    var num = 0
    this.importDataList.map(item => {
      num = num + item.serialNumbers.length
    })
    this.totalNum = num
  },
  data () {
    return {
      columns,
      form: {
        name: '',
        phone: '',
        address: '',
        province: '',
        city: '',
        area: '',
        street: '',
        logistics: '',
        totalPrice: 0,
        amountReceived: 0
      },
      formRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        // street: [
        //   { required: true, message: '请选择出货地区', trigger: 'blur' }
        // ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        logistics: [
          { required: true, message: '请选择物流方', trigger: 'blur' }
        ]
      },
      totalNum: 0, // 出库总数量
      deviceList: [],
      importDataList: [...this.dataList],
      outPerson: ''
    }
  },
  methods: {
    // 创建出库订单
    async creatOrders (payLoad) {
      const res = await creatOrders(payLoad)
      console.log('创建订单', res)
      if (res.status === 200) {
        this.$emit('successOut')
      }
    },
    // 更新设备信息
    updateDevices () {
      this.deviceList.map(item => {
        this.importDataList.map(device => {
          device.serialNumbers.map(number => {
            if (number === item.serialNumber) {
              this.updateDevice(item)
            }
          })
        })
      })
    },
    async updateDevice (item) {
      const payLoad = {}
      payLoad.serialNumber = item.serialNumber
      payLoad.productId = item.product.id
      payLoad.status = 'OUT'
      payLoad.operator = item.operator
      payLoad.deliveryPeople = this.outPerson
      payLoad.deliveryDate = new Date()
      const res = await updateDevices(item.id, payLoad)
      console.log(res)
    },
    async getDevices () {
      const res = await getDevices({ page: 0, size: 1 })
      const pages = {
        page: 0,
        size: res.data.totalElements || 1
      }
      const resp = await getDevices(pages)
      if (resp.status === 200) {
        this.deviceList = resp.data.content
      }
      this.importDataList = this.importDataList.map(item => {
        const statusList = []
        item.serialNumbers.map(number => {
          this.deviceList.map(device => {
            if (device.serialNumber === number) {
              statusList.push({ serialNumber: number, status: device.status })
            }
          })
          const isStrInArr = this.deviceList.map(item => item.serialNumber === number).includes(true)
          if (!isStrInArr) {
            statusList.push({ serialNumber: number, status: '编号不存在' })
          }
        })
        return { ...item, status: statusList }
      })
    },
    handleOk (e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const payLoad = this.form
          payLoad.outNumber = 'CK' + moment(new Date()).format('YYYYMMDDHHmmss') // 出库单号
          payLoad.outPerson = this.outPerson
          payLoad.outTime = new Date()
          payLoad.orders = this.importDataList.map(item => { return { brand: item.brand, productModel: item.productModel, price: item.price, amount: item.amount, serialNumbers: item.serialNumbers } })
          payLoad.totalAmount = this.totalNum // 出库总数量
          console.log('payLoad', payLoad)
          this.creatOrders(payLoad)
          this.updateDevices()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel (e) {
      this.$emit('closeOutModal')
    },
    getAddress (value) {
      this.form.province = value.pro
      this.form.city = value.city
      this.form.area = value.area
      this.form.street = value.street
      console.log('address', value)
    }
  }
}
</script>

<style>

</style>
