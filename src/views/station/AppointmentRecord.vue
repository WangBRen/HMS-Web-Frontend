<template>
  <div>
    <a-card>
      <a-button type="primary" @click="addAppointment" style="margin-bottom:10px;">
        新增预约
      </a-button>
      <span style="margin-left:20px;">今日预约统计：上午 <span style="font-size:20px;">2</span> 人，下午 <span style="font-size:20px;">5</span> 人</span>
      <a-table :columns="columns" :data-source="dataSource">
        <span slot="type" slot-scope="text">
          <a-tag v-if="text === 'EXAMINATION'" color="green">体检预约</a-tag>
          <a-tag v-if="text === 'STATION'" color="blue">小站预约</a-tag>
        </span>
        <span slot="status" slot-scope="text">
          <a v-if="text.status === 'UNEXECUTED'" @click="changeStatus(text)"><a-icon type="question-circle" /> 未处理</a>
          <span v-if="text.status === 'EXECUTED'"><a-icon type="check-circle" /> 已签到</span>
          <span v-if="text.status === 'CANCELED'"><a-icon type="stop" /> 已取消</span>
          <span style="color:red" v-if="text.status === 'DELAYED'"><a-icon type="warning" /> 推迟</span>
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="editAppointment(record)"><a-icon type="edit" /> 编辑</a>
        </span>
      </a-table>
    </a-card>
    <a-modal
      title="更新预约状态"
      :visible="visible"
      @ok="handleOk"
      :width="500"
      @cancel="handleCancel"
    >
      <div class="radios">
        <a-radio-group v-model="statusChange">
          <a-radio value="EXECUTED">预约签到</a-radio>
          <a-radio value="DELAYED">预约推迟</a-radio>
          <a-radio value="CANCELED">取消预约</a-radio>
        </a-radio-group>
      </div>
    </a-modal>
    <AppointmentAdd
      v-if="AppointmentVisible"
      :visible="AppointmentVisible"
      :bookingId="bookingId"
      :appointmentInfo="appointmentInfo"
      @successAppointment="successAppointment"
    />
  </div>
</template>

<script>
import moment from 'moment'
import AppointmentAdd from './components/AppointmentAdd.vue'
import { getAppointments, signInAppointment } from '@/api/station'
const columns = [
  {
    title: '预约用户',
    dataIndex: 'customer.nickname'
  },
  {
    title: '联系电话',
    dataIndex: 'customer.telephone'
  },
  {
    title: '预约小站',
    dataIndex: 'healthStation.name'
  },
  {
    title: '预约项目',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '预约时间',
    dataIndex: 'bookingDate',
    customRender: (text, record) => {
      return record ? moment(record.bookingDate).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    AppointmentAdd
  },
  data () {
    return {
      columns,
      dataSource: [],
      AppointmentVisible: false,
      statusChange: '',
      visible: false,
      bookingId: '',
      stationId: 4,
      appointmentInfo: {}
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await getAppointments(this.stationId)
      if (res.status === 200) {
        this.dataSource = res.data
      }
    },
    addAppointment () {
      this.AppointmentVisible = true
      this.bookingId = null
    },
    successAppointment () {
      this.AppointmentVisible = false
      this.loadData()
    },
    editAppointment (record) {
      this.AppointmentVisible = true
      this.appointmentInfo = record
      this.bookingId = record.id
    },
    changeStatus (e) {
      this.statusChange = ''
      this.bookingId = e.id
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      if (this.statusChange !== '') {
        signInAppointment(this.stationId, this.bookingId, this.statusChange).then(res => {
          if (res.status === 200) {
            this.visible = false
            if (this.statusChange === 'EXECUTED') {
              this.$message.success('签到成功')
            } else if (this.statusChange === 'DELAYED') {
              this.$message.success('该预约已推迟')
            }
          }
        })
      }
    }
  }
}
</script>

<style>
.radios{
  margin: 12px 0px;
}
.radios .ant-radio-wrapper{
  font-size: 16px;
  margin-right: 0px;
}
</style>
