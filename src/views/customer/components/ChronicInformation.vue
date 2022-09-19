<template>
  <div>
    <a-modal
      forceRender
      v-model="chronicInfoVisible"
      title="慢病管理"
      @cancel="closeChronicInfo"
      :width="1150"
    >
      <a-anchor offsetTop="10">
        <div v-for="item in tableData" :key="item.id" class="ant-anchor">
          <a-anchor-link :href="`#${item.id}`" :title="item.chronicDisease.name"/>
        </div>
      </a-anchor>
      <div class="card">
        <div class="card-body" v-for="item in tableData" :key="item.id">
          <a-row>
            <a-col :span="24">
              <a-row class="card-title">
                <a-col :span="22">
                  <span style="font-size: 20px;color: white;">慢病名称: </span>
                  <span style="font-size: 20px;color: white;">{{ item.chronicDisease.name }}</span>
                </a-col>
                <a-col :span="2">
                  <a :id="'str'+item.id" style="font-size: 20px;color: white;" @click="showCard(item.id)">展开</a>
                </a-col>
              </a-row>
              <a-row :id="item.id" class="card-detail" style="display: none">
                <a-col>
                  <a-row class="card-index">
                    <a-col class="card-index-title title-name" :span="3">指标项</a-col>
                    <a-col class="card-index-data" :span="21">
                      <span v-for="items in item.chronicDisease.items" :key="items.indexItem.id">
                        <a-tooltip>
                          <template slot="title">
                            <span v-for="tip in items.indexItem.result" :key="tip.id">
                              {{ tip | filterTip }}
                            </span>
                          </template>
                          <a-tag>{{ items.indexItem.name }}</a-tag>
                        </a-tooltip>
                      </span>
                    </a-col>
                  </a-row>
                  <a-row class="card-indexData">
                    <a-col :span="12" class="card-indexData-chart">
                      <div id="container"></div>
                    </a-col>
                    <a-col :span="12" class="card-indexData-table">列表</a-col>
                  </a-row>
                  <a-row class="card-record">
                    <a-col :span="3" class="card-record-title title-name">
                      <span>慢病随访记录</span>
                    </a-col>
                    <a-col class="card-record-table" :span="21">
                      <FollowUpRecords/>
                    </a-col>
                  </a-row>
                  <a-row class="card-manage">
                    <a-col :span="3" class="card-manage-title title-name">
                      <span>管理目标</span>
                    </a-col>
                    <a-col :span="21" class="card-manage-body">
                      <span>根据慢病管理中显示慢病已设定的管理目标，当首次随访完成后显示</span>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getChronicManage } from '@/api/customer'
import FollowUpRecords from './FollowUpRecords.vue'

export default {
  components: {
    FollowUpRecords
  },
  filters: {
    filterTip: function (value) {
      // 范围或数值
      if (value.type === 'range') {
      // 范围
      return `${value.name}:\t ${value.start || 'INF'} ≤ 指标值 < ${value.end || 'INF'} `
      } else if (value.type === 'simple') {
      // 数值
      return value.value
      }
    }
  },
  data () {
    return {
      chronicInfoVisible: false,
      custId: null,
      tableData: []
    }
  },
  methods: {
    // 打开慢病管理弹窗
    openChronicInfo (custId) {
      this.chronicInfoVisible = true
      this.custId = custId
      getChronicManage(custId).then(res => {
          if (res.status === 200) {
              this.tableData = res.data
              console.log('this.tableData的值', this.tableData)
          }
      })
    },
    closeChronicInfo () {
      this.chronicInfoVisible = false
    },
    showCard (id) {
      if (document.getElementById('str' + id).innerHTML === '展开') {
        document.getElementById('str' + id).innerHTML = '收起'
        document.getElementById(id).style.display = 'block'
      } else {
        document.getElementById('str' + id).innerHTML = '展开'
        document.getElementById(id).style.display = 'none'
      }
    }
  }
}
</script>
<style>
.card-body{
  margin: 5px 0;
}
.card-title{
  background-color: rgba(64, 158, 255, 1);
  border-style: solid;
  border-width: 1px;
  /* margin: 3px 0; */
  /* height: 50px; */
  padding: 10px;
}
/* .card-detail{
  background-color: blueviolet;
  border-style: solid;
  border-width: 1px;
} */
.title-name{
  border-style: solid;
  border-width: 1px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-index{
  line-height: 60px;
}
.card-index-title{
  line-height: 60px;
}
.card-index-data{
  padding-left: 5px;
  border-style: solid;
  border-width: 1px;
  text-align: left;
  font-size: 14px
}
.card-chart{
  border-style: solid;
  border-width: 1px;
}
.card-table1{
  border-style: solid;
  border-width: 1px;
}
.card-indexData-chart{
  height: 350px;
  border-style: solid;
  border-width: 1px;
}
.card-indexData-table{
  height: 350px;
  border-style: solid;
  border-width: 1px;
}
.card-record{
  /* height: 500px; */
}
.card-record-title{
  min-height: 350px;
}
.card-record-table{
  min-height: 350px;
  border-style: solid;
  border-width: 1px;
}
.card-manage-title{
  min-height: 100px;
}
.card-manage-body{
  border-style: solid;
  border-width: 1px;
  min-height: 100px;
}
.ant-anchor{
  width: 100px;
  line-height: 30px;
}
</style>
