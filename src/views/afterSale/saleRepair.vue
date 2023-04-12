<template>
  <div>
    <a-card>
      <div>
        <a-tabs>
          <a-tab-pane key="1" tab="待评估">
            <a-button type="primary" @click="openAddRepair">新增维修工单</a-button>
            <a-table
              :columns="estimateColumns"
              :rowKey="(record, index) => index"
              :data-source="estimateData"
              :pagination="false"
              :scroll="{ y: 600 }"
            >
              <span slot="status" slot-scope="text">
                {{ text | filterStatus }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">评估</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已评估">
            <a-table
              :columns="estimateOkColumns"
              :rowKey="(record, index) => index"
              :data-source="estimateOkData"
              :pagination="false"
              :scroll="{ y: 600 }"
            >
              <span slot="status" slot-scope="text">
                {{ text | filterStatus }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">评估</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="3" tab="已支付">
            <a-table
              :columns="payColumns"
              :rowKey="(record, index) => index"
              :data-source="payData"
              :pagination="false"
              :scroll="{ y: 600 }"
            >
              <span slot="status" slot-scope="text">
                {{ text | filterStatus }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">评估</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="4" tab="待上门">
            <a-table
              :columns="comeColumns"
              :rowKey="(record, index) => index"
              :data-source="comeData"
              :pagination="false"
              :scroll="{ y: 600 }"
            >
              <span slot="status" slot-scope="text">
                {{ text | filterStatus }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">评估</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="5" tab="已解决">
            <div style="">
              <a-row>
                <a-col :span="6">
                  <a-input-search
                    placeholder="请输入关键字"
                    enter-button="查询"
                    @search="onSearch"
                  />
                </a-col>
              </a-row>
            </div>
            <a-table
              :columns="solveColumns"
              :rowKey="(record, index) => index"
              :data-source="solveData"
              :pagination="false"
              :scroll="{ y: 600 }"
            >
              <span slot="status" slot-scope="text">
                {{ text | filterStatus }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">评估</a> |
                <a @click="openDrawbackModal(record)">退款</a>
              </span>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <saleRepairModal
      :repairVisible="repairVisible"
      :repairData="repairData"
      @closeRepairModal="closeRepairModal"
      :current="current"
    />
    <saleRepairAdd
      :repairAddVisible="repairAddVisible"
      @closeAddRepair="closeAddRepair"
    />
    <saleRepairDrawback
      v-if="drawbackVisible"
      :saleId="saleId"
      :drawbackVisible="drawbackVisible"
      @closeDrawback="closeDrawback"
    />
  </div>
</template>
<script>
import saleRepairModal from './saleRepairModal.vue'
import saleRepairAdd from './saleRepairAdd.vue'
import saleRepairDrawback from './drawbackModal.vue'
import { getAfterSale as apiGetAfterSale } from '@/api/afterSale'
export default {
  components: {
    saleRepairAdd,
    saleRepairModal,
    saleRepairDrawback
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
      repairVisible: false,
      repairAddVisible: false,
      drawbackVisible: false,
      // 总数据
      salesData: [
      ],
      estimateData: [
      ],
      estimateColumns: [
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
        // {
        //   title: '记录客服',
        //   dataIndex: 'customerService',
        //   key: 'customerService',
        //   align: 'center'
        // },
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
      estimateOkColumns: [
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
          title: '记录客服',
          dataIndex: 'customerService',
          key: 'customerService',
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
      estimateOkData: [
      ],
      payColumns: [
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
          title: '记录客服',
          dataIndex: 'customerService',
          key: 'customerService',
          align: 'center'
        },
        // {
        //   title: '记录内勤',
        //   dataIndex: 'managerName',
        //   key: 'managerName',
        //   align: 'center'
        // },
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
      payData: [],
      comeColumns: [
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
          title: '记录客服',
          dataIndex: 'customerService',
          key: 'customerService',
          align: 'center'
        },
        {
          title: '记录内勤',
          dataIndex: 'managerName',
          key: 'managerName',
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
      comeData: [],
      solveColumns: [
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
          title: '记录客服',
          dataIndex: 'customerService',
          key: 'customerService',
          align: 'center'
        },
        {
          title: '记录内勤',
          dataIndex: 'managerName',
          key: 'managerName',
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
      solveData: [],
      // 传给子组件的数据
      repairData: {},
      current: 0,
      saleId: null
    }
  },
  methods: {
    openRepairModal (data) {
      // console.log(data)
      this.repairVisible = true
      // this.current = 0
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
      this.repairData = data
      console.log('评估', this.repairData)
    },
    closeRepairModal () {
      this.repairVisible = false
    },
    openAddRepair () {
      // console.log('新增')
      this.repairAddVisible = true
    },
    closeAddRepair () {
      this.repairAddVisible = false
    },
    closeDrawback () {
      this.drawbackVisible = false
    },
    getAfterSaleData () {
      apiGetAfterSale().then(res => {
        if (res.status === 200) {
          // console.log('查询工单', res.data)
          this.salesData = res.data.filter(item => {
            return item.type !== 'INSTALL'
          })
          this.estimateData = this.salesData.filter(item => {
            if (item.status === 'WAIT_EVALUATE') {
              return item
            }
          })
          this.estimateOkData = this.salesData.filter(item => {
            if (item.status === 'EVALUATED') {
              return item
            }
          })
          this.payData = this.salesData.filter(item => {
            if (item.status === 'PAID') {
              return item
            }
          })
          this.comeData = this.salesData.filter(item => {
            if (item.status === 'WAIT_VISIT') {
              return item
            }
          })
          this.solveData = this.salesData.filter(item => {
            if (item.status === 'SOLVED') {
              return item
            }
          })
        }
      })
    },
    openDrawbackModal (data) {
      // console.log(data, '打开退款')
      this.saleId = data.id
      this.drawbackVisible = true
      // console.log('打开退款获取id', this.saleId)
    },
    onSearch (value) {
      console.log('搜索', value)
    }
  },
  created () {
  },
  mounted () {
    // 查询工单
    this.getAfterSaleData()
  }
}
</script>
<style lang="scss" scoped>

</style>
