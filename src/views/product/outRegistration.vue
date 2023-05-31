<template>
  <a-modal
    :title="mode==='shipment'?'出库登记':'出库详情'"
    :visible="outModelvisible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1200"
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
              <a-select-option value="shanghai">
                中通
              </a-select-option>
              <a-select-option value="beijing">
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
        DM3401230052023001
      </a-descriptions-item>
      <a-descriptions-item label="出库总数量">
        10
      </a-descriptions-item>
      <a-descriptions-item label="出库时间">
        2023-05-30 18:00:00
      </a-descriptions-item>
      <a-descriptions-item label="客户名称">
        张三
      </a-descriptions-item>
      <a-descriptions-item label="客户电话">
        18273627362
      </a-descriptions-item>
      <a-descriptions-item label="出库人员">
        李斯
      </a-descriptions-item>
      <a-descriptions-item label="物流方">
        中通快递
      </a-descriptions-item>
      <a-descriptions-item label="应收金额">
        1000
      </a-descriptions-item>
      <a-descriptions-item label="实收金额">
        800
      </a-descriptions-item>
      <a-descriptions-item label="出货地">
        广东省深圳市南山区
      </a-descriptions-item>
      <a-descriptions-item label="详细地址" :span="2">
        南山智园108号
      </a-descriptions-item>
    </a-descriptions>
    <a-card title="出库单" style="margin:10px 28px">
      <a-table :columns="columns" :data-source="importDataList" :rowKey="(record, index) => index">
        <span slot="result" slot-scope="text,scope">
          <a v-if="scope.productModel==='K5'"><a-icon type="check-circle" /> 检验通过</a>
          <!-- <a v-else>DM3423430052023006 不存在</a> -->
          <span v-else style="color:red;">DM3423430052023005 已出库</span>
        </span>
      </a-table>
    </a-card>
  </a-modal>
</template>

<script>
import Address from '@/components/CheckAddress/CheckAddress.vue'
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
    dataIndex: 'unitPrice',
    key: 'unitPrice'
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: '产品编号',
    dataIndex: 'productNo',
    key: 'productNo',
    width: 200
  },
  {
    title: '校验结果',
    dataIndex: 'result',
    key: 'result',
    width: 240,
    scopedSlots: { customRender: 'result' }
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
    importDataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    mode: {
      type: String,
      default: null
    }
  },
  mounted () {
    console.log(this.mode)
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
      }
    }
  },
  methods: {
    handleOk (e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('closeOutModal')
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
