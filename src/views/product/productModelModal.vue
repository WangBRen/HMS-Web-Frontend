<template>
  <div>
    <a-modal
      :title="modalIndex === 1?'新建产品型号':'编辑产品型号'"
      v-if="modalVisible"
      :visible="modalVisible"
      :footer="null"
      @cancel="closeEditModal"
      :width="1000"
    >
      <a-form-model
        ref="productForm"
        :model="productForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="modelRules"
      >
        <a-row>
          <a-col>
            <a-form-model-item label="产品号" prop="productNumber">
              <a-input placeholder="请输入产品号" v-model="productForm.productNumber"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="产品型号" prop="productModel">
              <a-input placeholder="请输入产品型号" v-model="productForm.productModel"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="产品序列" prop="productSequence">
              <a-input placeholder="请输入产品序列" v-model="productForm.productSequence"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="产品功能" prop="productFunctions">
              <a-select placeholder="请选择产品功能" style="width: 200px" v-model="checkC">
                <a-select-option v-for="item in functionsData" :key="item.funName">
                  {{ item.funName }}
                </a-select-option>
              </a-select>
              <a-button style="line-height: 30px;" @click="addFun" :disabled="!checkC" type="primary">添加</a-button>
              <div>
                <div v-for="item in productForm.productFunctions" :key="item.funName">
                  {{ item.funName }}
                  <span>
                    <a-icon @click="delFun(item)" type="close-circle" />
                  </span>
                </div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="产品配件" prop="productParts">
              <a-select placeholder="请选择产品配件" @change="checkFirstPart" style="width: 200px" v-model="checkA">
                <a-select-option v-for="item in partData" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
              <a-select :disabled="!secondPart.length" style="width: 200px" v-model="checkB">
                <a-select-option v-for="item in secondPart" :key="item.pieceName">
                  {{ item.pieceName }}
                </a-select-option>
              </a-select>
              <a-button style="line-height: 30px;" @click="addPart" :disabled="!checkB" type="primary">添加</a-button>
              <div>
                <div v-for="item in productForm.productParts" :key="item.pieceName">
                  {{ item.pieceName }}
                  <span>
                    <a-icon @click="delPart(item)" type="close-circle" />
                  </span>
                </div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="控制方案" prop="productControl">
              <a-input placeholder="请输入控制方案" v-model="productForm.productControl"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="出厂价格" prop="factoryPrice">
              <a-input placeholder="请输入出厂价格" v-model="productForm.factoryPrice"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="品牌" prop="productBrand">
              <a-input placeholder="请输入品牌" v-model="productForm.productBrand"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="text-align: center;">
          <a-col>
            <a-popconfirm title="确定提交信息？" @confirm="okModal">
              <a-button style="margin: 0 20px;" type="primary">确认</a-button>
            </a-popconfirm>
            <a-popconfirm title="确定重置信息？" @confirm="resetModal">
              <a-button style="margin: 0 20px;">重置</a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getParts as apiGetParts } from '@/api/afterSale'
export default {
  props: {
    modalVisible: {
      type: Boolean,
      default: false
    },
    modalIndex: {
      type: Number,
      default: 1
    },
    modalData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      productForm: {
        productNumber: undefined,
        productModel: undefined,
        productSequence: undefined,
        productFunctions: [],
        productParts: [],
        productControl: undefined,
        factoryPrice: undefined,
        productBrand: undefined
      },
      modelRules: {
        productNumber: [
          { required: true, message: '请输入产品号', trigger: 'blur' }
        ]
      },
      part: [],
      partData: [],
      secondPart: [],
      checkA: undefined,
      checkB: undefined,
      checkC: undefined,
      functionsData: [
        {
          funName: '功能一'
        },
        {
          funName: '功能二'
        }
      ]
    }
  },
  methods: {
    closeEditModal1 () {
      this.checkA = undefined
      this.checkB = undefined
      this.$refs.productForm.resetFields()
    },
    closeEditModal () {
      this.checkA = undefined
      this.checkB = undefined
      this.$refs.productForm.resetFields()
      this.$emit('closeEditModal')
    },
    okModal () {
      console.log('111', this.productForm)
      this.$refs.productForm.validate(valid => {
        if (valid) {
          console.log('222')
        }
      })
    },
    resetModal () {
      this.checkA = undefined
      this.checkB = undefined
      this.$refs.productForm.resetFields()
    },
    checkFirstPart (data) {
      this.checkB = undefined
      this.secondPart = []
      this.part.filter(item => {
        if (item.belongPart === data) {
          const addData = {
            pieceName: item.name,
            piecePrice: item.price, // 报价
            pieceCost: item.cost, // 成本
            pieceStock: item.stock, // 库存
            pieceId: item.id, // id
            pieceNumber: item.serialNumber // 编码
          }
          this.secondPart.push(addData)
        }
      })
    },
    addPart () {
      const partAdd = {}
      this.secondPart.filter(item => {
        if (item.pieceName === this.checkB) {
          partAdd.pieceName = item.pieceName
          partAdd.piecePrice = item.piecePrice
          partAdd.pieceCost = item.pieceCost
          partAdd.pieceStock = item.pieceStock
          partAdd.pieceNum = this.checkE
          partAdd.pieceId = item.pieceId
          partAdd.pieceNumber = item.pieceNumber
        }
      })
      if (this.productForm.productParts.length !== 0) {
        for (let i = 0; i < this.productForm.productParts.length; i++) {
          if (this.checkB === this.productForm.productParts[i].pieceName) {
            // console.log('111')
            this.$message.info('请勿重复添加')
            break
          } else if (i === this.productForm.productParts.length - 1) {
            // console.log('222')
            this.productForm.productParts.push(partAdd)
            break
          }
        }
      } else {
        this.productForm.productParts.push(partAdd)
      }
      this.checkA = undefined
      this.checkB = undefined
      this.secondPart = []
    },
    delPart (deldata) {
      const testData = this.productForm.productParts.filter(item => {
        return item.pieceName !== deldata.pieceName
      })
      this.productForm.productParts = testData
    },
    getPartData () {
      const obj = { page: 0, size: 1 }
      apiGetParts(obj).then(res => {
      if (res.status === 200) {
        obj.size = res.data.totalElements
        apiGetParts(obj).then(res => {
          if (res.status === 200) {
            const partTest = res.data.content
            this.part = partTest
            let aPart = []
            partTest.filter(item => {
              aPart.push(item.belongPart)
            })
            aPart = Array.from(new Set(aPart))
            this.partData = aPart.filter(data => {
              return data !== '师傅上门报价'
            })
          }
        })
      }
    })
    },
    addFun () {
    //   console.log(this.checkC)
      const funAdd = {}
      this.functionsData.filter(item => {
        if (item.funName === this.checkC) {
          funAdd.funName = item.funName
        }
      })
      this.productForm.productFunctions.push(funAdd)
      this.checkC = undefined
    },
    delFun (deldata) {
    //   console.log(222, deldata)
      const testData = this.productForm.productFunctions.filter(item => {
        return item.funName !== deldata.funName
      })
      this.productForm.productFunctions = testData
    }
  },
  created () {
  },
  mounted () {
    this.getPartData()
  },
  watch: {
    modalData: function () {
      if (this.modalIndex === 2) {
        // console.log('11', this.modalData)
        this.productForm = this.modalData
        // this.$forceUpdate()
        console.log(this.productForm)
      } else if (this.modalIndex === 1) {
        // console.log('22', this.modalData)
        this.productForm = {
          productNumber: undefined,
          productModel: undefined,
          productSequence: undefined,
          productFunctions: [],
          productParts: [],
          productControl: undefined,
          factoryPrice: undefined,
          productBrand: undefined
        }
        this.$forceUpdate()
        console.log(this.productForm)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
