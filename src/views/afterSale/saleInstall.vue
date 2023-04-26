<template>
  <div>
    <a-card>
      <a-tabs>
        <a-tab-pane key="1" tab="待安装">
          <a-button type="primary" @click="openAddInstall">新增安装工单</a-button>
          <a-table
            :columns="waitInstallColumns"
            :rowKey="(record, index) => index"
            :data-source="waitInstallData"
            :pagination="false"
          >
            <span slot="status" slot-scope="text">
              {{ text | filterStatus }}
            </span>
            <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
            <span slot="action" slot-scope="text,record">
              <a @click="openInstallModal(record)">评估</a>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="待评估"></a-tab-pane>
        <a-tab-pane key="3" tab="待评估"></a-tab-pane>
      </a-tabs>
    </a-card>
    <saleInstallModal
      :installVisible="installVisible"
      @closeInstallModal="closeInstallModal"
      :waitData="waitData"
      :current="current"
    />
    <saleInstallAdd
      :installAddVisible="installAddVisible"
      @closeAddInstall="closeAddInstall"
    />
  </div>
</template>
<script>
import { getAfterSale as apiGetAfterSale } from '@/api/afterSale'
import saleInstallAdd from './saleInstallAdd.vue'
import saleInstallModal from './saleInstallModal.vue'
export default {
  components: {
    saleInstallModal,
    saleInstallAdd
  },
  filters: {
    filterStatus (value) {
      switch (value) {
        case 'WAIT_EVALUATE':
          return '待评估'
        case 'EVALUATED':
          return '已评估'
        case 'PAID':
          return '已支付'
        case 'WAIT_VISIT':
          return '待上门'
        case 'SOLVED':
          return '已解决'
      }
    }
  },
  data () {
    return {
      installVisible: false,
      installAddVisible: false,
      allData: [],
      waitInstallData: [],
      waitInstallColumns: [
        {
          title: '客户名',
          dataIndex: 'customerInfo.customerName',
          key: 'customerInfo.customerName',
          align: 'center'
        },
        {
          title: '联系方式',
          dataIndex: 'customerInfo.customerPhone',
          key: 'customerInfo.customerPhone',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '操作',
          // width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      waitData: {},
      current: 0
    }
  },
  methods: {
    openInstallModal (data) {
      console.log(data)
      this.waitData = data
      this.installVisible = true
      switch (data.status) {
        case 'WAIT_EVALUATE':
          this.current = 0
          break
        case 'EVALUATED':
          this.current = 1
          break
        case 'PAID':
          this.current = 2
          break
        case 'WAIT_VISIT':
          this.current = 3
          break
        case 'SOLVED':
          this.current = 4
          break
      }
    },
    closeInstallModal () {
      this.installVisible = false
    },
    openAddInstall () {
      this.installAddVisible = true
      console.log('新建')
    },
    closeAddInstall () {
      this.installAddVisible = false
    },
    getAfterSaleData () {
      apiGetAfterSale().then(res => {
        if (res.status === 200) {
          this.allData = res.data.filter(item => {
            return item.type === 'INSTALL'
          })
          this.waitInstallData = this.allData.filter(item => {
            if (item.status === 'WAIT_EVALUATE') {
              return item
            }
          })
          console.log('allData', this.allData)
          console.log('waitInstallData', this.waitInstallData)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.getAfterSaleData()
  }
}
</script>
<style lang="scss" scoped>

</style>
