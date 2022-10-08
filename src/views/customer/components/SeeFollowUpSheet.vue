<template>
  <div>
    <a-modal
      v-model="modalSelf.visible"
      title="慢病随访单记录表"
      :width="1100"
    >
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
              <span v-if="record.type === 'upload'">{{ record.value.url }}</span>
              <span v-else>{{ record.value }}</span>
            </span>
          </a-table>
        </a-card>
        <!-- 指标选择结束 -->
      </div>
      <div style="padding: 0 24px;">
        <!-- 判定 -->
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
        <!-- 查看随访表 -->
      </div>
    </a-modal>
  </div>
</template>

<script>
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
const gradeOptions = [
  {
    value: '1级',
    label: '1级'
  },
  {
    value: '2级',
    label: '2级'
  },
  {
    value: '3级',
    label: '3级'
  },
  {
    value: '4级',
    label: '5级'
  },
  {
    value: '5级',
    label: '5级'
  },
  {
    value: '6级',
    label: '6级'
  },
  {
    value: '7级',
    label: '7级'
  },
  {
    value: '8级',
    label: '8级'
  },
  {
    value: '9级',
    label: '9级'
  }
]

export default {
  name: 'SeeFollowUpSheet',
  data () {
    return {
      loading: false,
      totalChronicDiseases: [], // read only
      baseInfo: {}, // read only
      itemColumns: columns, // read only
      itemTypeOptions: options, // read only
      gradeOptions: gradeOptions,
      followTableData: {},
      modalSelf: {
        visible: false
      },
      // styles:
      cardBodyStyle: {
        padding: '0 0 24px 0'
      },
      radioValue: '',
      valid: false,
      invalid: false
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
  methods: {
    // 打开创建随访单弹窗
    openFollowUpSheet (followTableData) {
      this.modalSelf.visible = true
      this.baseInfo = followTableData.customer.baseInfo
      this.followTableData = followTableData
    },
    handleOnDisableClicked (record, disabled) {
      record.disabled = disabled
    },
    radioChange (e) {
      if (e.target.value === 1) {
        this.valid = true
        this.invalid = false
      } else {
        this.valid = false
        this.invalid = true
      }
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
