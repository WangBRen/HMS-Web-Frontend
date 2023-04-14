<template>
  <div>
    <a-modal
      :title="`${this.mode==='creat'?'新增配件':'编辑配件'}`"
      :visible="partModelVisible"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form-model :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :rules="rules" ref="ruleForm" :model="form">
        <a-form-model-item label="配件类别" prop="belongPart">
          <a-select show-search v-model="form.belongPart" placeholder="请选择或新增类别">
            <a-select-option v-for="item in categorys" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="新增类别" v-if="form.belongPart==='添加其他类'" prop="elseBelongPart">
          <a-input placeholder="请输入要添加的类名" v-model="form.elseBelongPart"/>
        </a-form-model-item>
        <a-form-model-item label="配件名" prop="name"><a-input placeholder="请输入配件名" v-model="form.name"/></a-form-model-item>
        <a-form-model-item label="编码"><a-input placeholder="请输入配件编码" v-model="form.serialNumber"/></a-form-model-item>
        <a-form-model-item label="成本" >
          <a-input-number :min="0" placeholder="请输入成本" v-model="form.cost" />
        </a-form-model-item>
        <a-form-model-item label="报价" prop="price">
          <a-input-number :min="0" placeholder="请输入报价" v-model="form.price"/>
        </a-form-model-item>
        <a-form-model-item label="库存">
          <a-input-number :min="0" placeholder="请输入库存" v-model="form.stock" />
        </a-form-model-item>
        <a-form-model-item label="单位">
          <a-input placeholder="请输入单位" v-model="form.unit" />
        </a-form-model-item>
        <a-form-model-item label="所属型号" prop="belongProduct">
          <!-- <a-input placeholder="请输入所属型号" v-model="form.belongProduct" /> -->
          <a-select
            mode="multiple"
            placeholder="请选择所属型号"
            v-model="form.belongProduct"
            @change="handleChange"
          >
            <a-select-option v-for="i in product" :key="i">
              {{ i }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="规格/用途" >
          <a-input placeholder="请输入规格/用途" v-model="form.specification" />
        </a-form-model-item>
        <a-form-model-item label="备注" >
          <a-input type="textarea" placeholder="请输入备注" v-model="form.remark" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { addNewPart, editPart } from '@/api/afterSale'
export default {
  props: {
    partModelVisible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: null
    },
    partData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    categorys: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      product: ['A4', 'A5', 'A6', 'A6+', '202', 'U1', 'U1-A', 'U1-b', 'U2', 'U3', 'U5-03', 'U6-A', 'U6-b', 'U6-03', 'U7', 'U8', 'K3', 'K4', 'K5', 'K6', '1012', '2023', 'IUW', 'T1', 'T5'],
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      form: {
        belongPart: undefined, // 配件类别
        name: '',
        price: null,
        cost: 0,
        stock: 0,
        unit: '',
        remark: '',
        belongProduct: [],
        elseBelongPart: '',
        specification: '',
        serialNumber: ''
      },
      partId: null,
      rules: {
        name: [{ required: true, message: '请输入配件名', trigger: 'blur' }],
        belongPart: [{ required: true, message: '请选择配件类别', trigger: 'change' }],
        elseBelongPart: [{ required: true, message: '请输入要添加的类名', trigger: 'blur' }],
        belongProduct: [{ required: true, message: '请输入所属型号', trigger: 'change' }],
        price: [{ required: true, message: '请输入报价', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    if (this.mode === 'edit') {
      console.log('11111', this.partData)
      this.form = this.partData
      this.partId = this.partData.id
    }
    this.categorys.push('添加其他类')
  },
  methods: {
    handleCancel () {
      this.$emit('closePartModel')
    },
    handleOk () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.postNewPart()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async postNewPart () {
      const payLoad = {
        // belongPart: this.form.belongPart,
        name: this.form.name,
        price: this.form.price,
        cost: this.form.cost,
        stock: this.form.stock,
        remark: this.form.remark,
        belongProduct: this.form.belongProduct,
        specification: this.form.specification,
        serialNumber: this.form.serialNumber
      }
      if (this.form.belongPart === '添加其他类') {
        payLoad.belongPart = this.form.elseBelongPart
      } else {
        payLoad.belongPart = this.form.belongPart
      }
      console.log('payLoad', payLoad)
      if (this.mode === 'creat') {
        const res = await addNewPart(payLoad)
        if (res.status === 201) {
          this.$message.success('配件创建成功')
          this.$emit('successAddNewPart')
        }
      } else if (this.mode === 'edit') {
        const res = await editPart(this.partId, payLoad)
        if (res.status === 200) {
          this.$message.success('修改成功')
          this.$emit('successAddNewPart')
        }
      }
    },
    handleChange () {
      console.log('111')
    }
  }
}
</script>

<style>

</style>
