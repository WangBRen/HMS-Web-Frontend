<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
      <a-form-model-item label="小站名称" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="小站地址" prop="address">
        <a-input v-model="form.address" />
      </a-form-model-item>
      <a-form-model-item label="小站电话" prop="phone">
        <a-input v-model="form.phone" />
      </a-form-model-item>
      <!-- <a-form-model-item label="小站成立日期">
        <a-date-picker
          v-model="form.date1"
          show-time
          type="date"
          placeholder="请选择小站成立日期"
          style="width: 100%;"
        />
      </a-form-model-item> -->
      <a-form-model-item label="营业状态" prop="stationStatus">
        <a-radio-group v-model="form.stationStatus">
          <a-radio value="营业中">营业中</a-radio>
          <a-radio value="休息中">休息中</a-radio>
          <a-radio value="搬离">暂停</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="小站介绍">
        <a-input v-model="form.remark" type="textarea" />
      </a-form-model-item>
      <a-divider v-if="this.stationId">小站人员</a-divider>
      <a-form-model-item label="小站店长" prop="stationmaster" v-if="this.stationId">
        <a-select v-model="form.stationmaster" placeholder="请选择小站店长">
          <a-select-option v-for="item in managers" :key="item.index" :value="item.nickname">
            {{ item.nickname }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="健康师人员" v-if="this.stationId">
        <a-checkbox-group v-model="form.doctors">
          <span v-for="item in doctors" :key="item.index">
            <span v-if="item.status === 'active'">
              <a-checkbox :value="item" name="type" style="width:120px;">
                {{ item.nickname }}
              </a-checkbox>
            </span>
          </span>
        </a-checkbox-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getUserList } from '@/api/manage'
import { addStation, editstation, addManager, addDoctors } from '@/api/station'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    stationId: {
      type: Number,
      default: null
    },
    stationInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    successAddStation: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        address: '',
        stationmaster: '',
        phone: '',
        date1: undefined,
        doctors: [],
        stationStatus: '',
        remark: ''
      },
      doctors: [],
      managers: [],
      rules: {
        name: [{ required: true, message: '请输入小站名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入小站地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入小站联系电话', trigger: 'blur' }],
        stationmaster: [{ required: true, message: '请选择小站管理员', trigger: 'change' }],
        stationStatus: [{ required: true, message: '请选择营业状态', trigger: 'change' }]
      },
      title: '新增小站'
    }
  },
  mounted () {
    if (this.stationId) {
      this.getUser()
      this.title = '编辑小站'
      console.log('this.stationInfo', this.stationInfo)
      this.form.name = this.stationInfo.name
      this.form.address = this.stationInfo.address
      this.form.phone = this.stationInfo.phone
      this.form.doctors = this.stationInfo.doctors
      this.form.stationmaster = this.stationInfo.manager.nickname
      this.form.remark = this.stationInfo.remark
    }
  },
  methods: {
    handleOk () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          const apiForm = {}
          apiForm.name = form.name
          apiForm.address = form.address
          apiForm.phone = form.phone
          apiForm.remark = form.remark
          // apiForm.manager.nickname = form.stationmaster
          const manager = { nickname: '' }
          manager.nickname = form.stationmaster
          const doctors = form.doctors.map(item => {
            return { nickname: item }
          })
          addManager(this.stationId, manager).then(res => {
            console.log('manager', res)
          })
          addDoctors(this.stationId, doctors).then(res => {
            console.log('doctors', res)
          })
          this.postForm(apiForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 提交表单
    async postForm (apiForm) {
      if (this.stationId) {
        const res = await editstation(this.stationId, apiForm)
        if (res.status === 200) {
          this.$message.success('修改成功')
          this.$emit('successAddStation')
        }
      } else {
        const res = await addStation(apiForm)
        if (res.status === 201) {
          this.$message.success('小站创建成功')
          this.$emit('successAddStation')
        }
      }
    },
    handleCancel () {
      this.$emit('successAddStation')
    },
    // 获取所有健康师账号
    async getUser () {
      const res = await getUserList({ page: 0, size: 100 })
      if (res.status === 200) {
        this.doctors = res.data.content
        this.managers = this.doctors.filter(item => {
          return item.roleName === 'jk'
        })
      }
    }
  }
}
</script>

<style>
.ant-radio-wrapper{
  margin: 10px 16px;
}

</style>
