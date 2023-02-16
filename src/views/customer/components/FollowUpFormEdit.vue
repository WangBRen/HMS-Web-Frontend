<template>
  <div class="modal-container">
    <!-- 基础信息开始 -->
    <a-card title="基础信息" :loading="loading" class="card">
      <a-row :gutter="24">
        <a-col :span="8">
          <span class="basic-info-label">姓名：</span>
          <span class="basic-info-value">{{ baseInfo.name }}</span>
        </a-col>
        <a-col :span="8">
          <span class="basic-info-label">性别：</span>
          <span class="basic-info-value">{{ baseInfo.gender }}</span>
        </a-col>
        <a-col :span="8">
          <span class="basic-info-label">年龄：</span>
          <span class="basic-info-value">{{ userAge }}</span>
        </a-col>
        <a-col :span="8">
          <span class="basic-info-label">血型：</span>
          <span class="basic-info-value">{{ baseInfo.aboBloodType }}</span>
        </a-col>
        <a-col :span="8">
          <span class="basic-info-label">本人电话：</span>
          <span class="basic-info-value">{{ baseInfo.phoneNumber }}</span>
        </a-col>
        <a-col :span="8">
          <span class="basic-info-label">家人电话：</span>
          <span class="basic-info-value">{{ baseInfo.contactNumber }}</span>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="填写提示" :loading="loading" class="card" :body-style="cardBodyStyle">
      <a-textarea v-model="payload.hints" class="hint-textarea" placeholder="请输入填写必要的提示内容，如：尽量在今日下班前提交，并与工作人员确认提交内容无误" />
    </a-card>
    <!-- 慢病选择开始 -->
    <a-card :loading="loading" class="card">
      <template #title>
        <span>慢病选择</span>
        <a-button @click="openChronicDiseaseModal" type="dashed" style="float: right">
          <a-icon type="plus" /> 选择添加随访慢病
        </a-button>
      </template>
      <div v-if="payload.diseases">
        <span v-for="item in payload.diseases" :key="item.id">
          <span v-if="diseaseId"><a-tag color="blue">{{ item.chronicDisease.name }}</a-tag></span>
          <span v-else><a-tag color="blue">{{ item.name }}</a-tag></span>
        </span>
      </div>
    </a-card>
    <!-- 检查项目选择开始 -->
    <a-card :loading="loading" class="card">
      <template #title>
        <span>检查项目选择</span>
        <a-button @click="openObjectModal" type="dashed" style="float: right">
          <a-icon type="plus" /> 选择检查项目
        </a-button>
      </template>
      <div v-if="payload.projects">
        <span v-for="item in payload.projects" :key="item.id">
          <!-- <span v-if="diseaseId"><a-tag color="blue">{{ item.chronicDisease.name }}</a-tag></span> -->
          <span><a-tag color="orange">{{ item.name }}</a-tag></span>
        </span>
      </div>
    </a-card>
    <!-- 指标选择开始 -->
    <a-card :loading="loading" class="card" :body-style="cardBodyStyle">
      <template #title>
        <span>指标选择</span>
        <span v-if="projects.length > 0" style="margin-left:20px;font-size:14px;color:#888;">必查项目:
          <a-tooltip>
            <template slot="title">
              <span v-for="project in projects" :key="project.id">
                【{{ project.name }}】
              </span>
            </template>
            <span v-for="project in projects" :key="project.id">
              【{{ project.name }}】
            </span>
          </a-tooltip>
        </span>
      </template>
      <a-table bordered :data-source="payload.items" :columns="itemColumns" rowKey="id" :pagination="false">
        <span slot="checked" slot-scope="text, record">
          <a-checkbox v-model="record.isChecked" :disabled="record.disabled"/>
        </span>
        <span slot="TableInput" slot-scope="text, record">
          <a-input v-if="!record.isIndex && !record.disabled" v-model="record.name"/>
          <span v-else-if="!record.disabled">{{ text }}</span>
          <span v-else class="disabled-text">{{ text }}</span>
        </span>
        <span slot="TableUnit" slot-scope="text, record">
          <span v-if="!record.isIndex && !record.disabled" >
            <span v-if="record.type !== 'input'">-</span>
            <a-input v-else v-model="record.unit"/>
          </span>
          <span v-else-if="!record.disabled">{{ text }}</span>
          <span v-else class="disabled-text">{{ text }}</span>
        </span>
        <span slot="TableSelect" slot-scope="text, record">
          <span v-if="!record.isIndex && !record.disabled">
            <a-select v-model="record.type" :options="itemTypeOptions" style="width: 130px" @change="handleChange"/>
            <a-select
              v-model="record.options"
              v-if="record.type === 'options'"
              mode="tags"
              style="width: 150px;margin-top: 10px;"
              :token-separators="[' ']"
              placeholder="请输入选项按空格"
              :options="record.defineOptions"
              :open="false"
            ></a-select>
          </span>
          <a-tag v-else-if="!record.disabled">{{ text | fliterIndexType }}</a-tag>
          <a-tag v-else class="disabled-text">{{ text | fliterIndexType }}</a-tag>
        </span>
        <span slot="remark" slot-scope="text, record">
          <a-textarea :disabled="record.disabled" :defaultValue="record.remark" placeholder="请输入备注" auto-size v-model="record.remark"/>
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="handleOnDisableClicked(record, !record.disabled)">
            <span v-if="record.disabled">启用</span>
            <span v-else>禁用</span>
          </a>
        </span>
      </a-table>
      <a-button class="button-addline" type="dashed" @click="handleAddIndex">添加一行新数据</a-button>
    </a-card>
    <!-- 指标选择结束 -->
    <!-- 药物选择开始 -->
    <a-card :loading="loading" class="card">
      <template #title>
        <span>药物选择</span>
      </template>
      <div v-if="payload.diseases.length>0">
        <!-- <span v-for="item in payload.diseases" :key="item.id">
          <span v-for="medicine in item.medicines" :key="medicine.medicine.id"><a-tag closable>{{ medicine.medicine.name }}</a-tag></span>
        </span> -->
        <span v-if="medicineTags.length > 0">
          <span v-for="medicineTag in medicineTags" :key="medicineTag"><a-tag :key="medicineTag" :closable="medicineTag.index !== 0" @close="() => handleClose(medicineTag)">{{ medicineTag }}</a-tag></span>
        </span>
        <a-tag v-if="addBtn" style="background: #fff; borderStyle: dashed;" @click="showSelect">
          <a-icon type="plus" /> 添加其他药物
        </a-tag>
        <span v-else>
          <a-select style="width: 120px" @change="changeCategory">
            <a-select-option v-for="category in categoryData" :key="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
          <a-select v-model="secondMedicine" style="width: 120px">
            <a-select-option v-for="medicine in medicines" :key="medicine.id" :value="medicine.name">
              {{ medicine.name }}
            </a-select-option>
          </a-select>
          <a-button @click="handleMedicine">确定</a-button>
        </span>
      </div>
    </a-card>
    <!-- 选择慢病弹框 -->
    <a-modal v-model="modalSelectChronic.visible" title="选择需要进行随访的慢病" @ok="handleChronicDiseaseOK" width="600px">
      <a-row>
        <a-col :span="24" >
          <a-checkbox-group v-model="defaultChecked">
            <a-checkbox :value="item.id" v-for="item in totalChronicDiseases" :key="item.id" class="chronicCheckbox">
              <span v-if="diseaseId">{{ item.chronicDisease.name }}</span>
              <span v-else>{{ item.name }}</span>
            </a-checkbox>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 选择检查项目弹框 -->
    <a-modal v-model="modalProject.visible" title="选择需要进行检查的项目" @ok="handleProjectOK" width="800px">
      <a-row>
        <a-col :span="24" >
          <a-checkbox-group v-model="defaultProject">
            <a-checkbox :value="item.id" v-for="item in modalProject.projects" :key="item.id" class="projectCheckbox">
              <span>
                {{ item.name | ellipsis }}
              </span>
            </a-checkbox>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { getChronicManage as apiGetChronicManage, getChronicDetail } from '@/api/customer'
import { getHealthIndex } from '@/api/health'
// import { getToken } from '@/api/followUpForm'
import { age } from '@/utils/age'
import { notification } from 'ant-design-vue'
import { getChronic } from '@/api/chronic'
import { getMedicine as apiGetMedicine } from '@/api/medicine'
const columns = [
  {
    title: '是否必填',
    dataIndex: 'isChecked',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'checked' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
    scopedSlots: { customRender: 'TableInput' }
  },
  {
    title: '值类型',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'TableSelect' }
  },
  {
    title: '单位',
    dataIndex: 'unit',
    align: 'center',
    width: '12%',
    scopedSlots: { customRender: 'TableUnit' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: '10%',
    scopedSlots: {
      customRender: 'operation'
    }
  }
]

const options = [
  {
    value: 'input',
    label: '数值'
  },
  {
    value: 'textarea',
    label: '主观文本'
  },
  {
    value: 'upload',
    label: '图文报告'
  },
  {
    value: 'options',
    label: '选项'
  }
]

const parseIndexType = (indexType) => {
  switch (indexType) {
    case 'Float':
    case 'Integer':
      return 'input'
    case 'Text':
      return 'textarea'
    case 'Report':
      return 'upload'
  }
  return null
}
export default {
  props: {
    customerId: {
      type: Number,
      default: null
    },
    diseaseId: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    onMessageSent: {
      type: Function,
      default: () => {
        return null
      }
    },
    myToken: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      totalChronicDiseases: [], // read only 总的慢病
      // baseInfo: {}, // read only
      payload: { // edit
        myToken: '',
        hints: '',
        diseases: [],
        items: [],
        projects: []
      },
      itemColumns: columns, // read only
      itemTypeOptions: options, // read only
      modalPreviewInfo: false,
      modalSelectChronic: {
        visible: false,
        diseases: [] // used for: save select chronic diseases
      },
      modalProject: {
        visible: false,
        projects: []
      },
      defineOptions: [
        {
          value: '',
          label: ''
        }
      ],
      inputType: '',
      lastUpdateAt: '',
      // styles:
      cardBodyStyle: {
        padding: '0 0 24px 0'
      },
      sendModal: false,
      formId: null,
      userAge: null,
      defaultChecked: [],
      defaultProject: [],
      totalIndexOfThisPeople: [],
      projects: [], // 指标相关项目
      addBtn: true,
      categoryData: [], // 所有药物类别
      medicines: [], // 当前类别下的药物
      secondMedicine: '', // 选择药物的第二个下拉框
      medicineTags: [] // 随访时新增的药物
    }
  },
  filters: {
    fliterIndexType (type) {
      switch (type) {
        case 'input': return '数值'
        case 'textarea': return '文本'
        case 'options': return '选项'
        case 'upload': return '文件'
      }
    },
    ellipsis (value) {
      if (value.length > 10) {
        return value.slice(0, 12) + '...'
      }
      return value
    }
  },
  mounted () {
    // getToken().then(res => {
    //     if (res.status === 200) {
    //         this.payload.myToken = res.data
    //     }
    // })
    this.loadData()
  },
  methods: {
    // 打开创建随访单弹窗
    async loadData () {
      if (this.diseaseId !== null) {
        const resp = await apiGetChronicManage(this.customerId)
        if (resp.status === 200) {
          this.totalChronicDiseases = resp.data
        }
        const res = await getChronicDetail(this.customerId, this.diseaseId)
        if (res.status === 200) {
          const diseaseObj = res.data
          this.modalSelectChronic.diseases.push(diseaseObj)
          this.defaultChecked = [diseaseObj.id]
          this.handleChronicDiseaseOK()
        }
      } else {
        const pages = { page: 1, size: 100 }
        const res = await getChronic(pages)
        if (res.status === 200) {
          this.totalChronicDiseases = res.data.content
        }
      }
      const userAge = age(this.baseInfo.birthDate)
      if (userAge > 0) {
        this.userAge = userAge + '岁'
      } else {
        this.userAge = '/'
      }
      this.getAllMedicine()
    },
    handleChronicDiseaseOK () {
      // transfer:
      this.payload.diseases = this.totalChronicDiseases.filter(item => {
        return this.defaultChecked.includes(item.id)
      })
      this.medicineTags = []
      this.payload.diseases.forEach(diseases => {
        if (this.diseaseId) {
          for (var chronicMedicine of diseases.chronicDisease.medicines) {
            if (this.medicineTags.indexOf(chronicMedicine.medicine.name) === -1) {
              this.medicineTags.push(chronicMedicine.medicine.name)
            }
          }
        } else {
          for (var medicine of diseases.medicines) {
            if (this.medicineTags.indexOf(medicine.medicine.name) === -1) {
              this.medicineTags.push(medicine.medicine.name)
            }
          }
        }
      })
      this.modalSelectChronic.visible = false
      // update index table
      if (this.diseaseId === null) {
        this.totalIndexOfThisPeople = (this.payload.diseases || []).map(dis => dis.items).flat().map(item => item.indexItem)
      } else {
        this.totalIndexOfThisPeople = (this.payload.diseases || []).map(dis => dis.chronicDisease.items).flat().map(item => item.indexItem)
      }
      // console.log('totalIndexOfThisPeople', totalIndexOfThisPeople)
      const items = this.totalIndexOfThisPeople.map(index => {
        return {
          id: index.id,
          indexId: index.id,
          isIndex: true,
          name: index.name,
          remark: index.remark,
          unit: index.unit,
          isChecked: false,
          type: parseIndexType(index.type),
          disabled: false
        }
      }).reduce((array, current) => {
        for (const item of array) {
          if (current.indexId === item.indexId) { // if exist
            return array
          }
        }
        array.push(current)
        return array
      }, [])
      this.payload.items = items
      this.getHealthIndex()
    },
    handleProjectOK () {
      this.payload.projects = this.modalProject.projects.filter(item => {
        return this.defaultProject.includes(item.id)
      })
      this.modalProject.visible = false
    },
    // 获取指标项目名
    async getHealthIndex () {
      const res = await getHealthIndex()
      if (res.status === 200) {
        this.projects = (res.data || []).filter(project => {
          for (var index of project.items) {
            for (var i of this.payload.items) {
              if (i.id === index.id) { return true }
            }
          }
        })
          this.defaultProject = this.projects.map(project => {
            return project.id
          })
          this.payload.projects = this.projects
        this.modalProject.projects = res.data // 总的检查项目
      }
    },
    handleAddIndex () {
      const itemObject = {
        id: new Date().getTime(),
        indexId: null,
        isIndex: false,
        name: '',
        remark: '',
        unit: '',
        isChecked: false,
        type: 'input',
        disabled: false
      }
      this.payload.items.push(itemObject)
    },
    openChronicDiseaseModal () {
        this.modalSelectChronic.visible = true
    },
    openObjectModal () {
        this.modalProject.visible = true
    },
    // 创建随访单
    doRequest () {
      // 参数校验
      if (this.payload.items.length === 0) {
        notification.warning({ message: '表单项为空', description: '请至少填写一个表单项' })
        return
      }
      if (this.payload.diseases.length === 0) {
        notification.warning({ message: '慢病项为空', description: '请至少选择一个慢病' })
        return
      }
      this.payload.items.forEach(item => {
        if (!item.name) {
          notification.warning({ message: '表单项名称为空', description: '请填写表单项名称' })
          return false
        }
      })
      // do request
      let apiPayload = {}
      if (this.diseaseId > 0) {
        apiPayload = { diseaseIds: [], items: [], hints: null, token: '' }
        this.payload.diseases.forEach(function (diseas) {
          apiPayload.diseaseIds.push(diseas.id)
        })
      } else {
        apiPayload = { items: [], hints: null, token: '', projects: [], medicines: [] }
      }
      if (this.payload.items.length !== 0) {
            apiPayload.hints = this.payload.hints
            this.payload.items.forEach(function (itemVal) {
              const item = {
                indexItemId: itemVal.indexId,
                required: itemVal.isChecked,
                name: itemVal.name,
                type: itemVal.type,
                unit: itemVal.unit,
                remark: itemVal.remark,
                options: [],
                disabled: itemVal.disabled
              }
              if (itemVal.name !== '' && itemVal.type !== '') {
                if (itemVal.type === 'textarea' || itemVal.type === 'upload') {
                  item.unit = '-'
                }
                apiPayload.items.push(item)
              }
            })
            apiPayload.projects = this.payload.projects
            apiPayload.medicines = this.medicineTags
            apiPayload.token = this.myToken
      }
      this.$emit('checkSuccess', apiPayload)
      // return apiCreateFollowUpForm(this.customerId, apiPayload)
      // // 调接口创建随访单
      // return apiCreateFollowUpForm(customerId, apiPayload).then(res => {
      //     if (res.status === 201) {
      //       console.log('创建随访单成功')
      //       // show preview or somthing else
      //       // successCallback && successCallback() // == if (successCallback) { successCallback() }
      //       return true
      //     } else {
      //       // notification.warning('表单预览失败：' + res.message)
      //       throw Error(res.message)
      //     }
      // })
    },
    handleChange (record) {
      this.inputType = record
      // console.log(this.inputType)
    },
    handleOnDisableClicked (record, disabled) {
      // console.log(record, disabled)
      record.disabled = disabled
    },
    showSelect () {
      this.addBtn = false
      this.secondMedicine = ''
    },
    getAllMedicine () {
      apiGetMedicine().then(res => {
        if (res.status === 200) {
          this.categoryData = res.data
        } else {
          this.$message.error('获取失败' + res.message)
        }
      })
    },
    changeCategory (value) {
      const category = this.categoryData.filter(item => {
        if (item.id === value) {
          return true
        } else return false
      })
      this.medicines = category[0].medicines
      this.secondMedicine = ''
    },
    handleMedicine () {
      if (this.secondMedicine !== '') {
        this.addBtn = true
        if (this.secondMedicine && this.medicineTags.indexOf(this.secondMedicine) === -1) {
          this.medicineTags = [...this.medicineTags, this.secondMedicine]
        } else {
          this.$message.warning('药物已存在，请勿重复添加')
        }
      } else {
        this.$message.error('请选择药物')
      }
    },
    // 关闭新增的药物
    handleClose (removedTag) {
      const tags = this.medicineTags.filter(tag => tag !== removedTag)
      this.medicineTags = tags
    }
  }
}
</script>

<style>
.chronicCheckbox {
  display: inline-block;
  width: 266px;
  height: 30px;
  margin-left: 8px;
}
.projectCheckbox{
  margin-left: 8px;
  height: 30px;
  width: 242px;
}
.modal-container {
  /* padding: 0 24px; */
  margin-top: 20px;
}
/* .basic-info-label {
  display: inline-block;
  width: 80px;
  font-weight: 500;
  margin-bottom: 12px;
} */
.card {
  margin-bottom: 24px;
}
/* .hint-body {
  padding: 24px 6px !important;
} */
.hint-textarea {
  border: none;
  padding: 24px;
}
.button-addline{
  margin-top: 6px;
  width: 100%;
}
.disabled-text {
  text-decoration: line-through;
}
</style>
