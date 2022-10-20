<template>
  <div>
    <a-modal
      :visible="visible"
      @cancel="handleOnModalCancel"
      :title="`慢病随访单记录表${headerTips}`"
      :width="1100"
      :footer="(followTableData.level==null&&followTableData.status=='success') ? undefined : null"
    >
      <template #footer>
        <a-popconfirm
          title="你确定废除本条随访记录吗?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="handleAbolish"
          placement="topRight"
        >
          <a-button danger>废除</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="handleGrade">分级</a-button>
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
        <a-card v-if="hintShow" title="填写提示" :loading="loading" class="card" :body-style="cardBodyStyle">
          <span class="hint-textarea" >{{ followTableData.hints }}</span>
        </a-card>
        <!-- 慢病选择开始 -->
        <a-card title="慢病选择" :loading="loading" class="card">
          <div v-if="followTableData.diseases">
            <span v-for="item in followTableData.diseases" :key="item.id"><a-tag color="blue">{{ item.chronicDisease.name }}</a-tag></span>
          </div>
        </a-card>
        <!-- 指标选择开始 -->
        <a-card title="指标选择" :loading="loading" class="card" :body-style="cardBodyStyle">
          <a-table bordered :data-source="followTableData.items" :columns="itemColumns" rowKey="id" :pagination="false">
            <span slot="checked" slot-scope="text, record">
              <a-checkbox v-model="record.required" disabled/>
            </span>
            <span slot="TableSelect" slot-scope="text">
              <a-tag>{{ text | fliterIndexType }}</a-tag>
            </span>
            <span slot="inputValue" slot-scope="text, record">
              <span v-if="record.type === 'upload'">{{ record.value }}</span>
              <span v-else>{{ record.value }}</span>
            </span>
          </a-table>
          <!-- <div v-for="item in items" :key="item.id">
            <div class="itemTitle">
              <text class="IndexName">{{ item.name }}：</text>
            </div>
            <span class="Index">
              <div style="position:relative" class="parent">
                <span class="unit">${obj.unit}</span>
              </div>
              <div class="Notes" id="Notes{id}">${obj.remark && '备注：' + obj.remark}</div>
            </span>
          </div> -->
        </a-card>
        <!-- 指标选择结束 -->
      </div>
      <DefineLevel
        ref="GradeModelRef"
        :customerId="customerId"
        :diseaseId="diseaseId"
        :followId="followId"
        @fatherMethod="fatherMethod"
        :fatherMode="modalSelf.visible"
        :chronicDiseaseId="chronicDiseaseId"/>
      <!-- 判定 -->
      <!-- <div style="padding: 0 24px;">
        <a-card title="慢病分级" :loading="loading" class="card">
          <a-radio-group v-model="radioValue" @change="radioChange">
            <a-radio :value="1">判定有效</a-radio>
            <a-radio :value="2">判定无效</a-radio>
          </a-radio-group>
          <div v-show="valid" style="margin:20px 0">
            <span>选择慢病分级：</span>
            <a-select
              placeholder="请选择"
              style="width: 200px"
              :options="gradeOptions"
            ></a-select>
          </div>
          <div class="FailReason" v-show="invalid">
            <span>请填写判定失效的原因：</span>
            <a-textarea placeholder="请输入"/>
          </div>
        </a-card>
      </div> -->
    </a-modal>
  </div>
</template>

<script>
import DefineLevel from './DefineLevel.vue'
import { notification } from 'ant-design-vue'
import { abandonFollow as apiAbandonFollow, showFollowForm as apiShowFollowForm } from '@/api/followUpForm'
// import moment from 'moment'
const columns = [
  {
    title: '是否必填',
    dataIndex: 'required',
    width: '10%',
    align: 'center',
    scopedSlots: { customRender: 'checked' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '值类型',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'TableSelect' }
  },
  {
    title: '用户输入值',
    dataIndex: 'value',
    align: 'center',
    width: '20%',
    scopedSlots: { customRender: 'inputValue' }
  },
  {
    title: '单位',
    dataIndex: 'unit',
    align: 'center',
    width: '12%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center'
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
// const gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => { return { value: step, label: step + '级' } })

export default {
  name: 'SeeFollowUpSheet',
  components: {
    DefineLevel
  },
  props: {
    diseaseId: {
      type: Number,
      default: 0
    },
    customerId: {
      type: Number,
      default: 0
    },
    formId: {
      type: Number,
      default: -1
    },
    visible: {
      type: Boolean,
      default: false
    },
    onclose: {
      type: Function,
      default: function () {
        return null
      }
    }
  },
  data () {
    return {
      loading: false,
      totalChronicDiseases: [], // read only
      baseInfo: {}, // read only
      itemColumns: columns, // read only
      itemTypeOptions: options, // read only
      // gradeOptions: gradeOptions,
      followTableData: {},
      items: [],
      modalSelf: {
        visible: false
      },
      // styles:
      cardBodyStyle: {
        padding: '0 0 24px 0'
      },
      // radioValue: '',
      // valid: false,
      // invalid: false,
      hintShow: true, // 是否展示填写提示
      followId: 0,
      headerTips: '',
      chronicDiseaseId: null
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
    this.loadData()
  },
  methods: {
    // 查看随访单弹窗
    async loadData () {
      if (this.formId === -1) return
      this.loading = true
      const resp = await apiShowFollowForm(this.customerId, this.formId)
      this.loading = false
      if (resp.status !== 200) { return }
      const followTableData = resp.data || {}
      console.log('随访单数据', followTableData)
      this.modalSelf.visible = true
      this.baseInfo = followTableData.customer.baseInfo
      this.followTableData = followTableData
      this.followId = followTableData.id
      this.items = followTableData.items
      const destroy = followTableData.destroy
      let tips = ''
      if (destroy) {
        tips = '【已废弃】'
      } else {
        if (followTableData.level !== null) {
          const levelByName = followTableData.level.levelBy.nickname
          tips = `【分级人: ${levelByName}】`
        } else {
          tips = `【未分级】`
        }
      }
      this.headerTips = tips
      if (followTableData.hints === '') {
        this.hintShow = false
      }
      const diseaseList = followTableData.diseases.filter(disease => disease.id === this.diseaseId)
      if (diseaseList.length !== 0) {
        this.chronicDiseaseId = diseaseList[0].chronicDisease.id
      } else {
        this.chronicDiseaseId = undefined
      }
    },
    handleOnDisableClicked (record, disabled) {
      record.disabled = disabled
    },
    // radioChange (e) {
    //   if (e.target.value === 1) {
    //     this.valid = true
    //     this.invalid = false
    //   } else {
    //     this.valid = false
    //     this.invalid = true
    //   }
    // },
    handleGrade () {
      this.$refs.GradeModelRef.openGradeModal()
    },
    // 废弃随访单
    handleAbolish () {
      apiAbandonFollow(this.customerId, this.followId).then(res => {
        if (res.status === 200) {
          this.modalSelf.visible = false
          notification.open({
            message: '提示',
            description:
              '本条随访记录已废除'
          })
        } else {
          this.$message.error(res.message || '本条随访单废弃失败')
        }
      })
    },
    fatherMethod (val) {
      this.modalSelf.visible = val
      this.$emit('grandFatherMethod')
    },
    handleOnModalCancel () {
      this.$emit('onclose')
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
.FailReason{
  display: flex;
  margin-top: 20px;
}
</style>
