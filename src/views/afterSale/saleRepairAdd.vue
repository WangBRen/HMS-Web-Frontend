<template>
  <div>
    <a-modal
      :width="1000"
      :visible="repairAddVisible"
      v-if="repairAddVisible"
      @cancel="handleCancel"
      :maskClosable="false"
      :footer="null"
    >
      <a-form-model
        ref="infoForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="infoForm"
        :rules="addRules"
      >
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="客户名称" prop="customerName">
              <a-input placeholder="请输入客户名称" v-model="infoForm.customerName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户电话" prop="customerPhone">
              <a-input placeholder="请输入客户电话" v-model="infoForm.customerPhone"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="购买日期" prop="purchaseDate">
              <a-date-picker
                v-model="infoForm.purchaseDate"
                placeholder="请选择购买日期"
                style="width: 100%;"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="产品品牌" prop="brand">
              <a-select placeholder="请选择产品品牌" v-model="infoForm.brand">
                <a-select-option v-for="(item) in brandArrs" :key="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="产品型号" prop="productModel">
              <a-select :disabled="!infoForm.brand" placeholder="请选择产品型号" v-model="infoForm.productModel">
                <a-select-option v-for="(item) in modelArr" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="产品编号" prop="productNo">
              <a-input placeholder="请输入产品编号" v-model="infoForm.productNo"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="问题分类" prop="problemCategoryArr">
              <!-- <a-select></a-select> -->
              <a-cascader v-model="infoForm.problemCategoryArr" :options="question" placeholder="选择问题分类" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="问题描述" prop="problemExplain">
              <a-textarea
                v-model="infoForm.problemExplain"
                placeholder="输入问题描述"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="上传">
              <a-upload
                name="file"
                multiple
                :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-'"
                @change="value => handleChangeUpload(value)"
              >
                <a-button><a-icon type="upload" />上传资料</a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="收货地址" prop="receiveAddress">
              <a-input placeholder="请输入收货地址" v-model="infoForm.receiveAddress"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="上门地址与收货地址">
              <a-radio-group v-model="addressIndex" @change="onChangeAddress">
                <a-radio :value="1">
                  一致
                </a-radio>
                <a-radio :value="2">
                  不一致
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="addressIndex===2">
          <a-col :span="12">
            <a-form-model-item label="上门地址" prop="serviceAddress">
              <a-input placeholder="请输入上门地址" v-model="infoForm.serviceAddress"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="text-align: center;">
          <a-col :span="24">
            <a-popconfirm title="确定新建？" @confirm="onSubmit">
              <a-button style="margin: 0 20px;" type="primary">确认</a-button>
            </a-popconfirm>
            <a-popconfirm title="确定重置信息？" @confirm="resetForm">
              <a-button style="margin: 0 20px;">重置</a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { addAfterSale as apiAddAfterSale } from '@/api/afterSale'

export default {
  props: {
    repairAddVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addressIndex: 2,
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
      infoForm: {
        customerName: '', // 客户名称
        customerPhone: '', // 客户电话
        productModel: undefined, // 产品型号
        productNo: '', // 产品编号
        brand: undefined, // 品牌
        purchaseDate: '', // 购买日期
        problemCategoryArr: [], // 客户填写问题分类
        problemExplain: '', // 客户填写问题描述
        uploadImage: [], // 上传
        receiveAddress: '', // 收货地址
        isSameAddress: false, // 判断收货和上门地址是否一样
        serviceAddress: '' // 上门地址
      },
      question: [
        {
          value: '漏水',
          label: '漏水',
          children: [
            {
              value: '破洞',
              label: '修补漏洞'
            },
            {
              value: '制水器故障',
              label: '维修制水器'
            },
            {
              value: '破壁',
              label: '修补内外壁'
            }
          ]
        },
        {
          value: '问题二',
          label: '问题二',
          children: [
            {
              value: '防护',
              label: '修补防护'
            },
            {
              value: '净水',
              label: '维修净水器'
            },
            {
              value: '引流',
              label: '修补引流'
            }
          ]
        }
      ],
      addRules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        customerPhone: [
          { required: true, message: '请输入客户电话', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ],
        purchaseDate: [
          { required: true, message: '请输入购买日期', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请选择产品品牌', trigger: 'blur' }
        ],
        productModel: [
          { required: true, message: '请选择产品型号', trigger: 'blur' }
        ],
        problemCategoryArr: [
          { required: true, message: '请选择问题分类', trigger: 'blur' }
        ],
        receiveAddress: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ],
        serviceAddress: [
          { required: true, message: '请输入上门地址', trigger: 'blur' }
        ]
      },
      // 品牌库
      brandArrs: [
        {
          name: '杜马',
          modelArr: ['A4', 'A5', 'A6', 'A6+', '202', 'U1', 'U1-A', 'U1-b', 'U2', 'U3', 'U5-03', 'U6-A', 'U6-b', 'U6-03', 'U7', 'U8', 'K3', 'K4', 'K5', 'K6', '1012', '2023', 'T1', 'T5']
        },
        {
          name: '德希顿',
          modelArr: ['A4', 'A5', 'A6', '202', 'U5-03', 'U6-03', 'U7', 'K4', 'K5', 'K6', '1012', '2023']
        },
        {
          name: '攸太',
          modelArr: ['A4', 'A5', 'A6', 'A6+', '202', 'U1', 'U1-A', 'U1-b', 'U2', 'U3', 'U5-03', 'U6-A', 'U6-b', 'U6-03', 'U7', 'U8', 'K3', 'K4', 'K5', 'K6', '1012', '2023', 'IUW', 'T1', 'T5']
        },
        {
          name: '摩琥',
          modelArr: ['A4', 'A5', 'A6', '202', 'K4', 'K5']
        },
        {
          name: '北控',
          modelArr: ['A4', 'A5', 'A6']
        },
        {
          name: '法仕德',
          modelArr: ['A4', 'A5', 'A6', 'U1', 'U2', 'U6-03', 'K4']
        },
        {
          name: '徳斯图',
          modelArr: ['A4', 'A5', 'A6', 'K5']
        },
        {
          name: '舒艾莎',
          modelArr: ['A4', 'A5', 'A6', 'U1', 'U2', 'U6-03']
        },
        {
          name: '北极熊',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03', 'U7']
        },
        {
          name: '芙林',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03', 'U7']
        },
        {
          name: '麦特拉赫',
          modelArr: ['U1', 'U2', 'U3', 'U7']
        },
        {
          name: '嘉饰缇娜',
          modelArr: ['U1', 'U2', 'U3']
        },
        {
          name: '有质',
          modelArr: ['U1', 'U2', 'U3', 'K5']
        },
        {
          name: '一米',
          modelArr: ['U1', 'U2', 'U3', 'U6-03', 'K4', 'K5']
        },
        {
          name: '德爽康',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03']
        },
        {
          name: '哈雅',
          modelArr: ['U1', 'U2', 'U6-03', 'U7', 'K4']
        },
        {
          name: '史密斯',
          modelArr: ['U1', 'U2', 'U6-03', 'U7']
        },
        {
          name: '犀鸟',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03', 'U7', 'K4', 'K5']
        },
        {
          name: '摩柏',
          modelArr: ['U1', 'U2', 'K4', 'K5']
        },
        {
          name: '梵云优尚',
          modelArr: ['U2', 'U3', 'K5']
        },
        {
          name: '事达',
          modelArr: ['U2', 'U3', 'U5-03', 'U6-03', 'K5']
        },
        {
          name: '亨本',
          modelArr: ['U2', 'K4']
        },
        {
          name: '法兰多',
          modelArr: ['U3', 'U5-03']
        },
        {
          name: '德朗斯汀',
          modelArr: ['U6-03', 'K4', 'K5']
        },
        {
          name: '博蒙',
          modelArr: ['K4', 'K5']
        },
        {
          name: '德斯图',
          modelArr: ['K4']
        },
        {
          name: '蒙娜丽莎',
          modelArr: ['K4', 'K5']
        },
        {
          name: '卡恩诺',
          modelArr: ['K4', 'K5']
        }
      ],
      // 产品库
      modelArr: []
    }
  },
  methods: {
    handleCancel () {
      this.$refs.infoForm.resetFields()
      this.$emit('closeAddRepair')
    },
    onChangeAddress (e) {
      if (e.target.value === 1) {
        this.infoForm.serviceAddress = this.infoForm.receiveAddress
      } else if (e.target.value !== 1) {
        this.infoForm.serviceAddress = null
      }
    },
    onSubmit () {
    //   const apiData = JSON.parse(JSON.stringify(this.infoForm))
    //   apiData.problemCategory = this.infoForm.problemCategoryArr[0]
    //   apiData.problemExplain = this.infoForm.problemCategoryArr[1]
    //   console.log('提交表单', this.infoForm)
      this.$refs.infoForm.validate(valid => {
        if (valid) {
        //   console.log('校验ok')
          const apiData = JSON.parse(JSON.stringify(this.infoForm))
          apiData.problemCategory = this.infoForm.problemCategoryArr[0] + '/' + this.infoForm.problemCategoryArr[1]
          apiData.problemExplain = this.infoForm.problemExplain
          apiData.afterSaleType = 'WEB'
          delete apiData.problemCategoryArr
        //   console.log('提交表单', apiData)
          apiAddAfterSale(apiData).then(res => {
            if (res.status === 200) {
            //   console.log('调接口')
              this.$refs.infoForm.resetFields()
              this.$message.success('维修工单新建成功')
              this.$parent.getAfterSaleData()
              this.$emit('closeAddRepair')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
        //   console.log('校验失败')
        }
      })
    },
    resetForm () {
    //   console.log('重置', this.infoForm)
      this.$refs.infoForm.resetFields()
    },
    handleChangeUpload (data) {
    //   console.log(this.infoForm.uploadImage)
      if (data.file.status === 'done') {
        this.infoForm.uploadImage.push(data.file.response.data)
      } else if (data.file.status === 'error') {

      } else if (data.file.status === 'removed') {
        const testArr = data.fileList.map(item => {
          return item.response.data
        })
        this.infoForm.uploadImage = testArr
        // console.log(testArr)
      }
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    'infoForm.receiveAddress' (newData, oldData) {
    //   console.log(newData, oldData)
      if (this.addressIndex === 1) {
        this.infoForm.serviceAddress = newData
      }
    },
    'infoForm.brand' (newData, oldData) {
    //   console.log(newData, oldData)
    //   console.log('brandArrs', this.brandArrs)
      this.infoForm.productModel = undefined
      this.brandArrs.filter(item => {
        if (item.name === newData) {
          this.modelArr = item.modelArr
        }
      })
    //   console.log('this.modelArr', this.modelArr)
    }
  }
}
</script>
<style scoped>

</style>
