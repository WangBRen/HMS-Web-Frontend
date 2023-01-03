<template>
  <div>
    <a-card :bordered="false" class="search">
      <a-button type="primary" @click="addStation" style="margin-bottom:10px;">
        新增小站
      </a-button>
      <a-table :columns="columns" :data-source="dataSource"></a-table>
    </a-card>
    <HealthStationAdd v-if="stationVisible" :visible="stationVisible" @successAddStation="closeAddStationModel"/>
  </div>
</template>

<script>
import HealthStationAdd from './components/HeathStationAdd.vue'
import { getStations } from '@/api/station'
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
    title: '地址',
    dataIndex: 'address',
    width: 200
  },
  {
    title: '操作'
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
      stationVisible: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await getStations()
      if (res.status === 200) {
        console.log(res)
        this.dataSource = res.data
      }
    },
    addStation () {
      this.stationVisible = true
    },
    closeAddStationModel () {
      this.stationVisible = false
    }
  }
}
</script>

<style>

</style>
