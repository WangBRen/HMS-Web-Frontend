<template>
  <div>
    <a-modal
      title="设备管理"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1100"
    >
      <!-- <a-button type="primary" @click="editEquipment">新增设备</a-button> -->
      <a-button type="primary" @click="addEquipment">新增设备</a-button>
      <a-table :columns="columns" :data-source="dataSource" :rowKey="(record,index)=>{return index}">
        <span slot="status" slot-scope="text, scope">{{ scope.status | filterStatus }}</span>
        <span slot="operation" slot-scope="text, scope">
          <a @click="editEquipment(scope)">编辑</a>
          <a-divider type="vertical" />
          <!-- <a style="color:red" @click="delEquipment(scope)">删除</a> -->
          <a-popconfirm
            :title="`确定删除【${scope.name}】吗`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="delEquipment(scope)"
          >
            <a style="color:red">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-modal>
    <EditEquipment
      v-if="editVisible"
      :editVisible="editVisible"
      :mode="mode"
      :equipmentData="equipmentData"
      :stationId="stationId"
      @closeEditModel="closeEditModel"
    />
  </div>
</template>

<script>
import moment from 'moment'
import EditEquipment from './EditEquipment.vue'
import { getDevice as apiGetDevice, delDevice as apiDelDevice } from '@/api/station'
const columns = [
  {
    title: '设备编号',
    dataIndex: 'number'
  },
  {
    title: '设备名称',
    dataIndex: 'name'
  },
  {
    title: '状态',
    // dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '型号',
    dataIndex: 'model'
  },
  {
    title: '启用时间',
    // dataIndex: 'enableTime',
    customRender: (text, record, index) => {
      return record.enableTime ? moment(record.enableTime).format('YYYY-MM-DD') : '---'
    }
  },
  {
    title: '生产日期',
    // dataIndex: 'productionTime',
    // scopedSlots: { customRender: 'productionTime' },
    customRender: (text, record, index) => {
      return record.productionTime ? moment(record.productionTime).format('YYYY-MM-DD') : '---'
    }
  },
  {
    title: '厂商',
    dataIndex: 'manufacturer'
  },
  {
    title: '备注',
    dataIndex: 'remarks'
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
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
    closeModel: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  components: {
    EditEquipment
  },
  filters: {
    filterStatus (data) {
      if (data === 'OPEN') {
        return '启用'
      } else if (data === 'CLOSE') {
        return '退休'
      } else if (data === 'DISABLED') {
        return '检修'
      }
    }
  },
  data () {
    return {
      columns,
      dataSource: [{
        id: 1,
        number: '001',
        status: 'OPEN',
        name: '验光机',
        model: 'MD100736',
        enableTime: '2022-1-1',
        productionTime: '2021-11-16',
        manufacturer: '广东省深圳市xxx厂',
        remarks: '我是备注'
        // operation: '编辑'
      }],
      editVisible: false,
      equipmentData: {},
      mode: ''
    }
  },
  mounted () {
    this.getDevice(this.stationId)
  },
  methods: {
    handleOk () {
      this.$emit('closeModel')
    },
    handleCancel () {
      this.$emit('closeModel')
    },
    addEquipment () {
      this.mode = 'add'
      this.editVisible = true
    },
    editEquipment (scope) {
      // console.log(scope)
      this.mode = 'edit'
      this.editVisible = true
      // this.equipmentData = scope
      this.equipmentData = JSON.parse(JSON.stringify(scope))
    },
    closeEditModel () {
      this.equipmentData = {}
      this.editVisible = false
    },
    delEquipment (data) {
      // console.log('删除', this.stationId, data.id)
      apiDelDevice(this.stationId, data.id).then(res => {
        // console.log('res', res)
        if (res.status === 204) {
          this.$message.success('删除设备成功')
          this.getDevice(this.stationId)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getDevice (stationId) {
      apiGetDevice(stationId).then(res => {
        if (res.status === 200) {
          // console.log('进入', this.stationId)
          // console.log(res.data)
          this.dataSource = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
