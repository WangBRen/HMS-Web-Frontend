<template>
  <div>
    <a-modal
      title="新建产品型号"
      v-if="modalVisible"
      :visible="modalVisible"
      @ok="okModal"
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
              <!-- <a-input placeholder="请输入产品功能" v-model="productForm.productFunctions"></a-input> -->
              <a-select style="width: 200px" >
                <a-select-option v-for="item in partData" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
              {{ productForm.productFunctions }}
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-model-item label="产品配件" prop="productParts">
              <a-select @change="checkFirstPart" style="width: 200px" v-model="checkA">
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
              {{ productForm.productParts.pieceName }}
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
      checkA: null,
      checkB: null
    }
  },
  methods: {
    closeEditModal1 () {
      this.checkA = null
      this.checkB = null
      this.$refs.productForm.resetFields()
    },
    closeEditModal () {
      this.checkA = null
      this.checkB = null
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
    checkFirstPart (data) {
      this.checkB = null
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
      this.checkA = null
      this.checkB = null
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
        this.$forceUpdate()
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
