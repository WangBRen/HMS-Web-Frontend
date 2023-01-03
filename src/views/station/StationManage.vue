<template>
  <div>
    <a-button type="primary" @click="addStation" style="margin-bottom:10px;">
      新增小站
    </a-button>
    <a-table :columns="columns" :data-source="dataSource"></a-table>
    <HealthStationAdd :visible="stationVisible" @successAddStation="closeAddStationModel"/>
  </div>
</template>

<script>
import HealthStationAdd from './components/HeathStationAdd.vue'
const columns = [
  {
    title: '小站名称'
  },
  {
    title: '店长'
  },
  {
    title: '联系电话'
  },
  {
    title: '健康师'
  },
  {
    title: '地址',
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
  methods: {
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
