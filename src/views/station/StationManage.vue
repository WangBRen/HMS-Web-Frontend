<template>
  <div>
    <a-card :bordered="false" class="search">
      <a-button type="primary" @click="addStation" style="margin-bottom:10px;">
        新增小站
      </a-button>
      <a-table :columns="columns" :data-source="dataSource">
        <span slot="operation" slot-scope="text, record">
          <a @click="editStation(record)">编辑</a>
          <!-- <a>删除</a> -->
        </span>
      </a-table>
    </a-card>
    <HealthStationAdd
      v-if="stationVisible"
      :visible="stationVisible"
      :stationId="stationId"
      :stationInfo="stationInfo"
      @successAddStation="closeAddStationModel"
    />
  </div>
</template>

<script>
import HealthStationAdd from './components/HeathStationAdd.vue'
import { getStations, getStationInfo } from '@/api/station'
const columns = [
  {
    title: '小站名称',
    dataIndex: 'name'
  },
  {
    title: '店长',
    dataIndex: 'manager.nickname'
  },
  {
    title: '联系电话',
    dataIndex: 'phone'
  },
  {
    title: '健康师'
  },
  {
    title: '营业状态'
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: 200
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    HealthStationAdd
  },
  data () {
    return {
      dataSource: [
      ],
      columns,
      stationVisible: false,
      stationId: null,
      stationInfo: {}
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await getStations()
      if (res.status === 200) {
        this.dataSource = res.data
      }
    },
    addStation () {
      this.stationId = null
      this.stationVisible = true
    },
    closeAddStationModel () {
      this.stationVisible = false
      this.loadData()
    },
    editStation (record) {
      this.stationId = record.id
      getStationInfo(this.stationId).then(res => {
        this.stationInfo = res.data
        this.stationVisible = true
      })
      // editstation(record.id)
    }
  }
}
</script>

<style>

</style>
