<template>
  <a-modal
    title="新增产品编号"
    :visible="productAddVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="1000"
    okText="新增并导出"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :label-col="{ span:4 }"
      :wrapper-col="{ span: 18 }"
      :rules="formRules"
    >
      <!-- <a-form-model-item ref="productId" label="产品" prop="productId">
        <a-select v-model="form.productId" placeholder="请选择产品">
          <a-select-option :value="product.id" v-for="product in products" :key="product.id">
            {{ product.productNumber }}_{{ product.productModel }}_{{ product.productBrand }}
          </a-select-option>
        </a-select>
      </a-form-model-item> -->
      <a-row>
        <a-col :offset="4">
          <a-tag>{{ brandName }}</a-tag>
        </a-col>
      </a-row>
      <a-form-model-item ref="brand" label="品牌" prop="brand">
        <a-select v-model="form.brand" placeholder="请选择品牌" @change="changeBrand">
          <a-select-option :value="brand" v-for="brand in brands" :key="brand.index">
            {{ brand }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="productModel" label="型号" prop="productModel">
        <a-select :disabled="!form.brand" v-model="form.productModel" placeholder="请选择型号">
          <a-select-option :value="model" v-for="model in models" :key="model.index">
            {{ model }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="color" label="颜色" prop="color">
        <a-select v-model="form.color" placeholder="请选择颜色">
          <a-select-option value="C">玫瑰金 - C</a-select-option>
          <a-select-option value="A">红色 - A</a-select-option>
          <a-select-option value="J">黑色 - J</a-select-option>
          <a-select-option value="0">白色/银色 - 0</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="definition" label="功能含义" prop="definition">
        <a-select v-model="form.definition" placeholder="请选择功能含义">
          <a-select-option value="0">
            欧枫加器_0
          </a-select-option>
          <a-select-option value="T">
            泡沫盾+语音_T
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="controlMode" label="控制方式" prop="controlMode">
        <a-select v-model="form.controlMode" placeholder="请选择控制方式">
          <a-select-option value="1">蓝牙_1</a-select-option>
          <a-select-option value="0">射频_0</a-select-option>
          <a-select-option value="P">蓝牙款8个按键(pl)遥控器_P</a-select-option>
          <a-select-option value="8">蓝牙款8个按键(老款钮扣电池)遥控器_8</a-select-option>
          <a-select-option value="0">不是蓝牙款(是20个按键的遥控器) _0</a-select-option>
          <a-select-option value="1">东宝加热器(U5U6绿色遥控器带显示屏)_1</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="ceramicPitSpacing" label="陶瓷坑距" prop="ceramicPitSpacing">
        <a-select v-model="form.ceramicPitSpacing" placeholder="请选择陶瓷坑距">
          <a-select-option value="M">M305坑距</a-select-option>
          <a-select-option value="L">L400坑距</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="num" label="台数" prop="num">
        <a-input-number v-model="form.num" :min="1" :max="999" :formatter="formatNumber"/>
        <span style="margin-left:20px;">
          编号预览：{{ brandName }}{{ form.productModel }}{{ form.ceramicPitSpacing }}{{ form.color }}{{ form.definition }}{{ form.controlMode }}{{ form.ceramicPitSpacing==='M'?'3':form.ceramicPitSpacing==='L'?'4':'' }}{{ myDate }}
        </span>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { creatDevice, getDevices, getProducts } from '@/api/product'
import { getUserInfo } from '@/api/login'
import moment from 'moment'
import { export_json_to_excel as exportExcel } from '../../utils/excel/Export2Excel'

export default {
  props: {
    productAddVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        // productId: undefined,
        brand: undefined,
        productModel: undefined,
        color: undefined,
        definition: undefined,
        ceramicPitSpacing: undefined,
        num: null
      },
      formRules: {
        brand: [
          { required: true, message: '请选择品牌', trigger: 'blur' }
        ],
        productModel: [
          { required: true, message: '请选择型号', trigger: 'blur' }
        ],
        // productId: [
        //   { required: true, message: '请选择产品', trigger: 'blur' }
        // ],
        color: [
          { required: true, message: '请选择颜色', trigger: 'blur' }
        ],
        definition: [
          { required: true, message: '请选择功能含义', trigger: 'blur' }
        ],
        controlMode: [
          { required: true, message: '请选择控制方式', trigger: 'blur' }
        ],
        ceramicPitSpacing: [
          { required: true, message: '请选择陶瓷坑距', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入台数', trigger: 'blur' }
        ]
      },
      operator: '',
      totalNum: '',
      products: [],
      brands: [],
      models: [],
      brandName: '-',
      myDate: ''
    }
  },
  methods: {
    changeBrand (e) {
      console.log(e)
      this.form.productModel = undefined
      const models = new Set(this.products.filter(item => {
        return item.productBrand.trim() === e
      }).map(product => { return product.productModel }))
      this.models = [...models]
      this.brandName = this.products.filter(item => {
        return item.productBrand === e
      })[0].name
    },
    async getProducts () {
      const pages = {
        page: 0,
        size: 1
      }
      const resp = await getProducts(pages)
      pages.size = resp.data.totalElements || 1
      const res = await getProducts(pages)
      this.products = res.data.content
      const brands = new Set(this.products.map(item => {
        return item.productBrand.trim()
      }))
      this.brands = [...brands]
    },
    async getTodayNum () {
      const resp = await getDevices({ page: 0, size: 1 })
      const size = resp.data.totalElements || 1
      const res = await getDevices({ page: 0, size: size })
      if (res.status === 200) {
        const num = res.data.content.filter(item => {
          return moment(item.createdAt).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')
        })
        this.totalNum = num.length
      }
    },
    handleOk (e) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // const today = new Date()
          // const year = today.getFullYear() % 100
          // const month = String(today.getMonth() + 1).padStart(2, '0')
          // const day = String(today.getDate()).padStart(2, '0')
          const form = this.form
          const product = this.products.filter(item => {
            return item.productBrand === form.brand && item.productModel === form.productModel
          })[0]
          var Spacing
          if (form.ceramicPitSpacing === 'M') {
            Spacing = '3'
          } else if (form.ceramicPitSpacing === 'L') {
            Spacing = '4'
          }
          const serialNumber = this.brandName + form.productModel + form.ceramicPitSpacing + form.color + form.definition + form.controlMode + Spacing + this.myDate // 产品编号前缀
          const payLoad = {}
          payLoad.productId = product.id
          payLoad.status = 'NOT_OUT'
          payLoad.operator = this.operator
          const numbers = []
          for (var i = 1; i <= form.num; i++) {
            payLoad.serialNumber = serialNumber + String(i + this.totalNum).padStart(3, '0')
            numbers.push({ serialNumber: payLoad.serialNumber })
            this.creatDevice(payLoad)
          }
          this.exportNumberData(numbers)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async creatDevice (payLoad) {
      const res = await creatDevice(payLoad)
      if (res.status === 200) {
        this.$emit('successProductAdd')
      }
      console.log('创建设备', res)
    },
    handleCancel (e) {
      this.$emit('closeProductAdd')
    },
    exportNumberData (numbers) {
      const tHeader = ['产品编号']
      const fitlerVal = ['serialNumber']
      const res = numbers.map((v) => fitlerVal.map((j) => { return v[j] }))
      const myDate = new Date()
      const today = moment(myDate).format('YYYY-MM-DD ')
      exportExcel(tHeader, res, '批量生产设备' + today)
    },
    formatNumber (value) {
      // 返回整数值
      return Math.round(value)
    }
  },
  mounted () {
    const today = new Date()
    const year = today.getFullYear() % 100
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    this.myDate = day + month + year
    this.getProducts()
    this.getTodayNum()
    getUserInfo().then(res => {
      this.operator = res.data.nickname
      // console.log('getUserInfo', res)
    })
  }
}
</script>

<style>

</style>
