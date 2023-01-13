<template>
  <div>
    <a-card>
      <a-button type="primary" @click="addAppointment" style="margin-bottom:10px;">
        新增预约
      </a-button>
      <span style="margin-left:20px;">今日预约统计：上午 <span style="font-size:20px;">{{ morningNum }}</span> 人，下午 <span style="font-size:20px;">{{ afternoonNum }}</span> 人</span>
      <a-table :columns="columns" :data-source="dataSource">
        <span slot="type" slot-scope="text">
          <a-tag v-if="text === 'EXAMINATION'" color="green">体检预约</a-tag>
          <a-tag v-if="text === 'STATION'" color="blue">小站预约</a-tag>
        </span>
        <span slot="status" slot-scope="text">
          <a v-if="text.status === 'UNEXECUTED'" @click="changeStatus(text)"><a-icon type="question-circle" /> 未处理</a>
          <span style="color:#52c41a;" v-if="text.status === 'EXECUTED'"><a-icon type="check-circle" /> 已签到</span>
          <span v-if="text.status === 'CANCELED'"><a-icon type="stop" /> 已取消</span>
          <a style="color:red" v-if="text.status === 'DELAYED'" @click="changeStatus(text)"><a-icon type="warning" /> 推迟</a>
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
        <a-radio-group v-model="statusChange" @change="onChangeStatus">
          <a-radio value="EXECUTED">预约签到</a-radio>
          <a-radio value="DELAYED">预约推迟</a-radio>
          <a-radio value="CANCELED">取消预约</a-radio>
        </a-radio-group>
        <div style="margin: 15px 42px;" v-show="showTime" >
          预约时间：<a-date-picker show-time v-model="appointmentTime" placeholder="请选择时间" />
        </div>
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
import { getAppointments, putAppointment, getStations } from '@/api/station'
import { getUserInfo } from '@/api/login'
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
    customRender: (text, record) => { return record ? moment(record.bookingDate).format('YYYY-MM-DD HH:mm:ss') : '' },
    sorter: (a, b) => Date.parse(a.bookingDate.toString()) - Date.parse(b.bookingDate.toString())
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
      recordData: {},
      appointmentInfo: {},
      showTime: false,
      appointmentTime: null,
      morningNum: 0,
      afternoonNum: 0,
      myId: null
    }
  },
  mounted () {
    this.getUserInfo()
    this.loadData()
  },
  methods: {
    async loadData () {
      this.dataSource = []
      this.morningNum = 0
      this.afternoonNum = 0
      const resp = await getStations()
      if (resp.status === 200) {
        const stations = resp.data.filter(station => {
          for (var doctor of station.doctors) {
            if (doctor.id === this.myId) { return true }
          }
        })
        for (var station of stations) {
          const res = await getAppointments(station.id)
          if (res.status === 200) {
            this.dataSource = [...this.dataSource, ...res.data]
          }
        }
        const myDate = moment(new Date()).format('YYYY-MM-DD')
        this.dataSource.forEach(item => {
          const hour = moment(item.bookingDate).format('HH')
          const appoint = moment(item.bookingDate).format('YYYY-MM-DD')
          // console.log('123', hour, appoint, myDate)
          if (hour < 12 && appoint === myDate) {
            this.morningNum++
          } else if (appoint === myDate) {
            this.afternoonNum++
          }
        })
      }
    },
    // 进入预约页面时获取当前登录账号的信息
    async getUserInfo () {
      const res = await getUserInfo()
      if (res.status === 200) {
        this.myId = res.data.id
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
      this.recordData = e
      this.statusChange = ''
      this.bookingId = e.id
      this.visible = true
      this.showTime = false
      this.appointmentTime = null
    },
    onChangeStatus (e) {
      if (e.target.value === 'DELAYED') {
        this.showTime = true
      } else {
        this.showTime = false
      }
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      if (this.statusChange !== '') {
        if (this.statusChange === 'DELAYED' && this.appointmentTime === null) {
          this.$message.warning('请选择预约时间')
          return
        }
        const payload = {}
        payload.customerId = this.recordData.customer.id
        payload.bookingTime = this.appointmentTime || this.recordData.bookingDate
        payload.remark = this.recordData.remark
        payload.type = this.recordData.type
        payload.status = this.statusChange
        putAppointment(this.stationId, this.bookingId, payload).then(res => {
          if (res.status === 200) {
            this.visible = false
            if (this.statusChange === 'EXECUTED') {
              this.$message.success('签到成功')
            } else if (this.statusChange === 'DELAYED') {
              this.$message.success('该预约已推迟')
            } else if (this.statusChange === 'CANCELED') {
              this.$message.success('已取消')
            }
            this.loadData()
          }
        })
        // signInAppointment(this.stationId, this.bookingId, this.statusChange).then(res => {
        // })
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
