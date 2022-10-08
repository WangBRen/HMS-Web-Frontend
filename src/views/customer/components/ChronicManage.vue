<template>
  <div>
    <a-modal
      forceRender
      v-model="chronicManageVisible"
      :title="'慢病管理--[' + userData.name + ']'"
      @cancel="closeChronicManageModal"
      :width="1150"
    >
      <a-table :columns="columns" :data-source="tableData" :rowKey="tableData => tableData.id">
        <span slot="name" slot-scope="text, record">
          <a-tooltip>
            <template slot="title">
              {{ record.chronicDisease.describe }}
            </template>
            {{ text }}
          </a-tooltip>
        </span>
        <span slot="time" slot-scope="text">
          {{ text | filterChronictime }}
        </span>
        <span slot="chronicStatus" slot-scope="text">
          <!-- <a-tag :color="text === 'diagnosed' ? 'red' : 'blue' "> -->
          <a-tag :color="text === 'diagnosed' ? 'red' : (text === 'suspect' ? 'blue' : '') ">
            {{ text | filterChronicStatus }}
          </a-tag>
        </span>
        <span slot="chronicLevel" slot-scope="text,record">
          <span v-if="record.status === 'suspect'">{{ text }}<a-icon class="icon" type="question" /></span>
          <span v-if="record.status === 'exception'">-</span>
          <span v-if="record.status === 'diagnosed'">{{ text }}</span>
        </span>
        <span slot="chronicAction" slot-scope="text,record">
          <span v-if="record.status === 'suspect'">
            <a @click="editChronic(record)">确诊 | </a>
            <a-popconfirm
              title="确定进行误判操作吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="suspectOk(record)"
            >
              <a>误判</a>
            </a-popconfirm>
          </span>
          <!-- <a v-if="record.status !== 'exception'" @click="editChronicException(record)">误判 | </a>
          <a v-if="record.status === 'diagnosed'" @click="editChronic(record)">确诊 | </a>-->
          <!-- 需要操作功能时 -->
          <!-- <a @click="editChronic(record)"> [操作]</a> -->
        </span>
      </a-table>
    </a-modal>
    <!-- 确诊弹窗 -->
    <a-modal
      forceRender
      v-model="editModalVisible"
      title="确诊信息"
      @cancel="closeEditModel"
      @ok="editOk"
      :width="900"
    >
      <a-form-model
        ref="ruleForm"
        :rules="rules"
        v-if="editData.chronicDisease.name"
        :model="editData"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-form-model-item label="慢性病名">
          {{ editData.chronicDisease.name }}
        </a-form-model-item>
        <!-- 需要操作功能时 -->
        <!-- <a-form-model-item label="慢性病状态">
          <a-select v-model="editData.status" :default-value="editData.status" style="width: 120px;">
            <a-select-option v-for="(state) in chronicStateArr" :key="state.value">
              {{ state.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="慢性病等级" prop="level">
          <a-select v-model="editData.level" :default-value="editData.level" style="width: 120px;">
            <a-select-option v-for="(level) in chronicLevelArr" :key="level">
              {{ level }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="诊断时间" prop="diseaseAt">
          <a-date-picker
            show-time
            v-model="editData.diseaseAt"
            type="date"
            placeholder="请选择诊断时间"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
// import { getChronicManage } from '@/api/customer'
import { getChronicManage, editCustomerChronicDiseases } from '@/api/customer'

export default {
    filters: {
        filterChronicStatus: function (value) {
            if (value === 'suspect') {
                return '疑似'
            } else if (value === 'diagnosed') {
                return '已确诊'
            } else if (value === 'exception') {
                return '系统误判'
            }
        },
        filterChronictime: function (value) {
            if (value === null) {
                return '无诊断记录'
            } else {
                return moment(value).format('YYYY-MM-DD HH:mm')
            }
        }
    },
    data () {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            chronicManageVisible: false,
            editModalVisible: false,
            custId: null,
            tableData: [],
            editData: {
                chronicDisease: {
                    name: null
                }
            },
            userData: [],
            columns: [
                { title: '慢性病名', width: 200, dataIndex: 'chronicDisease.name', key: 'chronicDisease.name', scopedSlots: { customRender: 'name' } },
                { title: '诊断时间', dataIndex: 'diseaseAt', key: 'diseaseAt', scopedSlots: { customRender: 'time' } },
                // { title: '慢性病描述', dataIndex: 'chronicDisease.describe', key: 'chronicDisease.describe' },
                { title: '慢性病状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'chronicStatus' } },
                { title: '慢性病等级', dataIndex: 'level', key: 'level', scopedSlots: { customRender: 'chronicLevel' } },
                { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'chronicAction' } }
            ],
            chronicStateArr: [
                { name: '疑似', value: 'suspect' },
                { name: '已确诊', value: 'diagnosed' },
                { name: '系统误判', value: 'exception' }
            ],
            chronicLevelArr: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            rules: {
              level: [
                { required: true, message: '请选择慢病等级', trigger: 'blur' }
              ],
              diseaseAt: [
                { required: true, message: '请输入时间', trigger: 'blur' }
              ]
            }
        }
    },
    mounted () {
    },
    methods: {
        // 打开慢病管理弹窗
        openChronicManageModal (custId) {
            this.chronicManageVisible = true
            this.custId = custId
            getChronicManage(custId).then(res => {
                if (res.status === 200) {
                    this.tableData = res.data
                    // console.log(this.tableData)
                }
            })
        },
        // 获取用户信息
        getUserInfo (userInfo) {
            this.userData = userInfo
            // console.log('userInfo', userInfo)
        },
        // 关闭慢病管理弹窗
        closeChronicManageModal () {
            this.chronicManageVisible = false
            // this.$refs.ruleForm.resetFields()
            // this.$nextTick(() => {
            //   this.$refs.ruleForm.resetFields()
            // })
        },
        // 点击确诊按钮，弹出确诊弹窗
        editChronic (data) {
            this.editData = JSON.parse(JSON.stringify(data))
            this.editModalVisible = true
            // console.log('编辑', data)
        },
        // 误判操作
        editChronicException (data) {
          const apidata = JSON.parse(JSON.stringify(data))
          // 将状态设为exception(系统误判)
          apidata.status = 'exception'
          // console.log('custId', this.custId, 'disId', data.id)
          editCustomerChronicDiseases(this.custId, apidata.id, apidata).then(res => {
            if (res.status === 200) {
                // console.log('编辑成功')
                this.$message.success('编辑成功')
                this.editModalVisible = false
                // 刷新表
                getChronicManage(this.custId).then(res => {
                    if (res.status === 200) {
                        this.tableData = res.data
                        // console.log(this.tableData)
                    }
                })
            } else {
                this.$message.error('编辑失败')
            }
          })
          // console.log(data)
          // console.log(apidata)
        },
        // 关闭确诊弹窗
        closeEditModel () {
            this.editModalVisible = false
        },
        // 点击确诊弹窗确认按钮
        editOk () {
            // console.log('custId', this.custId, 'disId', this.editData.id)
            // 需要操作功能时
            this.$refs.ruleForm.validate(valid => {
              if (valid) {
                this.editData.status = 'diagnosed'
                editCustomerChronicDiseases(this.custId, this.editData.id, this.editData).then(res => {
                    if (res.status === 200) {
                        // console.log('编辑成功')
                        this.$message.success('编辑成功')
                        this.editModalVisible = false
                        // 刷新表
                        getChronicManage(this.custId).then(res => {
                            if (res.status === 200) {
                                this.tableData = res.data
                                // console.log(this.tableData)
                            }
                        })
                    } else {
                        this.$message.error('编辑失败')
                        // console.log('编辑失败')
                    }
                })
              } else {
                return false
              }
            })
        },
        // 点击误判
        suspectOk (data) {
          // console.log(data)
          this.editChronicException(data)
        }
    }
}
</script>
<style>
.icon{
  color: #CD7F32;
}
</style>
