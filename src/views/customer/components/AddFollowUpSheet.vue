<template>
  <div>
    <a-modal
      v-model="modalSelf.visible"
      title="慢病随访单记录表"
      :width="1100"
    >
      <template #footer>
        <a-button type="primary" @click="handlePreview">预览</a-button>
      </template>
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
              <span class="basic-info-value">{{ baseInfo.age }}岁</span>
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
            <span v-for="item in payload.diseases" :key="item.id"><a-tag color="blue">{{ item.chronicDisease.name }}</a-tag></span>
          </div>
        </a-card>
        <!-- 指标选择开始 -->
        <a-card title="指标选择" :loading="loading" class="card" :body-style="cardBodyStyle">
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
              <a-input v-if="!record.isIndex && !record.disabled" v-model="record.unit"/>
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
                  style="width: 130px"
                  :token-separators="[' ']"
                  placeholder="请输入选择项"
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
      </div>
    </a-modal>
    <a-modal
      v-model="modalPreviewInfo"
      :title="`预览随访单【最近编辑时间：${lastUpdateAt}】`"
      @ok="handleSend"
      width="900px"
      okText="发送">
      <div id="container" style="width:100%;height: 900px;pointer-events: none;"></div>
    </a-modal>
    <a-modal v-model="modalSelectChronic.visible" title="选择需要进行随访的慢病" @ok="handleChronicDiseaseOK" width="600px">
      <a-row>
        <a-col :span="24" >
          <a-checkbox-group v-model="modalSelectChronic.diseases">
            <a-checkbox :value="item" v-for="item in totalChronicDiseases" :key="item.id" class="checkbox">
              {{ item.chronicDisease.name }}
            </a-checkbox>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </a-modal>
    <ChronicInformationVisit ref="Visit"/>
  </div>
</template>

<script>
import ChronicInformationVisit from './ChronicInformationVisit.vue'
import { STable } from '@/components'
import { addFollowUpSheet as apiCreateFollowUpForm, getPreviewForm, getToken } from '@/api/followUpForm'
import { notification } from 'ant-design-vue'
import moment from 'moment'
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
  name: 'AddFollowUpSheet',
  components: {
    STable,
    ChronicInformationVisit
  },
  data () {
    return {
      loading: false,
      totalChronicDiseases: [], // read only
      baseInfo: {}, // read only
      payload: { // edit
        myToken: '',
        hints: '',
        diseases: [],
        items: []
      },
      itemColumns: columns, // read only
      itemTypeOptions: options, // read only
      modalSelf: {
        visible: false
      },
      modalPreviewInfo: false,
      modalSelectChronic: {
        visible: false,
        diseases: [] // used for: save select chronic diseases
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
      }
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
    }
  },
  mounted () {
    getToken().then(res => {
        if (res.status === 200) {
            // console.log('唯一 TOKEN 获取成功', res.data)
            this.payload.myToken = res.data
        }
    })
  },
  methods: {
    // 打开创建随访单弹窗
    openModal (baseInfo, totalChronicDiseases = []) {
      // console.log('慢病列表', totalChronicDiseases)
      this.totalChronicDiseases = totalChronicDiseases
      this.baseInfo = baseInfo || {}
      this.baseInfo.age = 17
      // console.log('baseInfo', baseInfo)
      // re-initial data-source
      this.payload.diseases = []
      this.payload.items = []
      this.modalSelf.visible = true
    },
    async handlePreview () {
      const resp = await this.doRequest()
      // console.log({ resp })
      if (resp) {
        if (resp.status === 201) {
          this.modalPreviewInfo = true
          const formDataId = resp.data.id
          const customerId = resp.data.customer.id
          getPreviewForm(customerId, formDataId).then(res => {
            if (res.status === 200) {
                this.lastUpdateAt = moment(res.data.lastUpdateAt).format('YYYY-MM-DD HH:mm:ss')
                const previewUrl = res.data.url
                document.getElementById('container').innerHTML = `<object type="text/html" data="${previewUrl}" width="100%" height="100%"></object>`
            } else {
                notification.warning({ message: '预览失败', description: resp.message })
            }
          })
        } else {
          notification.warning({ message: '预览失败', description: resp.message })
        }
      }
    },
    handleSend () {
      // this.createFollowUpList(() => {
      //   console.log('创建成功')
      // })
      const promise = this.doRequest()
      if (promise) {
        promise.then(res => {
          if (res.status === 201) {
            // console.log('创建成功的res', res)
            this.$refs.Visit.openVisit(res.data)
          }
        }).catch(err => {
          notification.warning({ description: err })
        })
      }
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

      // do request
      const apiPayload = { diseaseIds: [], items: [], hints: null, token: '' }
      const customerId = this.baseInfo.customerId
      if (this.payload.items.length !== 0) {
        // console.log('发送给用户的', this.payload)
            apiPayload.hints = this.payload.hints
            this.payload.diseases.forEach(function (diseas) {
              // console.log(diseas)
              apiPayload.diseaseIds.push(diseas.id)
            })
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
            apiPayload.token = this.payload.myToken
            // console.log('发给后端的', apiPayload)
      }
      return apiCreateFollowUpForm(customerId, apiPayload)
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
    openChronicDiseaseModal () {
        this.modalSelectChronic.visible = true
    },
    handleChronicDiseaseOK () {
      // console.log('已选的慢病', this.modalSelectChronic.diseases)
      // transfer:
      this.payload.diseases = this.modalSelectChronic.diseases
      this.modalSelectChronic.visible = false
      // console.log({ diseases: this.payload.diseases })
      // update index table
      const totalIndexOfThisPeople = (this.payload.diseases || []).map(dis => dis.chronicDisease.items).flat().map(item => item.indexItem)
      // console.log('totalIndexOfThisPeople', totalIndexOfThisPeople)
      const items = totalIndexOfThisPeople.map(index => {
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
    handleOnDisableClicked (record, disabled) {
      // console.log(record, disabled)
      record.disabled = disabled
    },
    handleChange (record) {
      this.inputType = record
      // console.log(this.inputType)
    }
  }
}
</script>

<style lang="less" scoped>
.checkbox {
  display: inline-block;
  width: 266px;
  height: 30px;
  margin-left: 8px;
}
.modal-container {
  padding: 0 24px;
}
.basic-info-label {
  display: inline-block;
  width: 80px;
  font-weight: 500;
  margin-bottom: 12px;
}
.basic-info-value {
}
.card {
  margin-bottom: 24px;
}
.hint-body {
  padding: 24px 6px !important;
}
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
