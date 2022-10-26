<template>
  <div>
    <a-modal
      :visible="coachingVisible"
      :title="`健康指导【】`"
      @cancel="closeCoachingModel"
      :width="900"
    >
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
            <span class="basic-info-value">{{ userAge }}岁</span>
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
      <div style="margin: 24px 0"></div>
      <div v-if="isShow">
        <span>选择需要指导的慢病：</span>
        <a-select
          show-search
          placeholder="请选择"
          option-filter-prop="children"
          style="width: 200px"
          :filter-option="filterOption"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
        >
          <a-select-option value="jack">
            高血压
          </a-select-option>
          <a-select-option value="lucy">
            糖尿病
          </a-select-option>
          <a-select-option value="tom">
            心脏病
          </a-select-option>
        </a-select>
      </div>
      <div style="margin: 24px 0"></div>
      <a-textarea
        :loading="loading"
        placeholder="请输入健康指导..."
        :auto-size="{ minRows: 10, maxRows: 20 }"
      />
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    coachingVisible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: null
    },
    diseaseId: {
      type: Number,
      default: null
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false,
      userAge: 17
    }
  },
  methods: {
    closeCoachingModel () {
      this.$emit('close')
    },
    handleChange (value) {
      // console.log(`selected ${value}`)
    },
    handleBlur () {
      // console.log('blur')
    },
    handleFocus () {
      // console.log('focus')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style>

</style>
