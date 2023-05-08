<template>
  <div>
    <a-card>
      <a-row>
        <a-col :span="6">
          <a-input-search
            placeholder="请输入关键字"
            enter-button="查询"
            @search="onSearch"
          />
        </a-col>
        <a-col :span="6">
          <span>&nbsp;月结单：</span>
          <a-select v-model="checkMonthly" default-value="all" style="width: 100px;">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="true">是</a-select-option>
            <a-select-option value="false">否</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="9">
        </a-col>
        <a-button type="primary" @click="exportAllData">导出信息单</a-button>
      </a-row>
      <div>
        <a-tabs default-active-key="1" @change="checkTab">
          <a-tab-pane key="1" tab="待评估">
            <a-space>
              <a-button type="primary" @click="openAddRepair">新增维修工单</a-button>
              <a-upload name="file" accept=".xls,xlsx" :customRequest="importData" :showUploadList="false">
                <a-button> <a-icon type="upload" />导入excel</a-button>
              </a-upload>
            </a-space>
            <a-table
              :columns="estimateColumns"
              :rowKey="(record, index) => index"
              :data-source="estimateData"
              :pagination="false"
            >
              <span slot="processes" slot-scope="record">
                {{ record.processes.length }}
              </span>
              <span slot="monthlyStatement" slot-scope="record">
                {{ record.monthlyStatement | filterBoolean }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">评估</a>
                <a-popconfirm title="确定删除？" @confirm="delRepair(record)">
                  <a v-if="record.monthlyStatement"> | 删除</a>
                </a-popconfirm>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已评估">
            <a-table
              :columns="estimateOkColumns"
              :rowKey="(record, index) => index"
              :data-source="estimateOkData"
              :pagination="false"
            >
              <span slot="processes" slot-scope="record">
                {{ record.processes.length }}
              </span>
              <span slot="monthlyStatement" slot-scope="record">
                {{ record.monthlyStatement | filterBoolean }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">查看</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="3" tab="已支付">
            <a-table
              :columns="payColumns"
              :rowKey="(record, index) => index"
              :data-source="payData"
              :pagination="false"
            >
              <span slot="monthlyStatement" slot-scope="record">
                {{ record.monthlyStatement | filterBoolean }}
              </span>
              <span slot="processes" slot-scope="record">
                {{ record.processes.length }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">填单</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="4" tab="待上门">
            <a-table
              :columns="comeColumns"
              :rowKey="(record, index) => index"
              :data-source="comeData"
              :pagination="false"
            >
              <span slot="monthlyStatement" slot-scope="record">
                {{ record.monthlyStatement | filterBoolean }}
              </span>
              <span slot="processes" slot-scope="record">
                {{ record.processes.length }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">维修反馈</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="5" tab="已解决">
            <a-button type="primary" @click="exportData">导出对账单</a-button>
            <a-table
              :columns="solveColumns"
              :rowKey="(record, index) => index"
              :data-source="solveData"
              :pagination="false"
            >
              <span slot="monthlyStatement" slot-scope="record">
                {{ record.monthlyStatement | filterBoolean }}
              </span>
              <span slot="processes" slot-scope="record">
                {{ record.processes.length }}
              </span>
              <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
              <span slot="action" slot-scope="text,record">
                <a @click="openRepairModal(record)">查看</a> |
                <a @click="openDrawbackModal(record)">退款</a>
              </span>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <a-modal :visible="visible" title="导入数据" @ok="saveImport" @cancel="close" :width="1200">
      <a-table :data-source="importDataList" :columns="importColumns" :rowKey="(record, index) => index"/>
    </a-modal>
    <a-modal
      title="导出全部数据"
      :visible="exportVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-row>
        <a-col :span="4" :offset="2">筛选品牌：
          <a-select placeholder="请选择产品品牌" v-model="filterBrand" style="width: 120px" @change="handleChangeBrand">
            <a-select-option v-for="(item) in brandArrs" :key="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4" :offset="8">筛选型号：
          <a-select placeholder="请选择产品型号" v-model="selectModel" style="width: 120px" @change="handleChangeModel">
            <a-select-option v-for="(item) in modelArr" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row style="margin-top:16px;">
        <a-col :offset="2">
          <a-icon type="container" theme="twoTone" /> 预计导出 <span style="color:red;font-size:20px;">{{ this.exportfilterData.length }}</span> 条数据
        </a-col>
      </a-row>
    </a-modal>
    <saleRepairModal
      :repairVisible="repairVisible"
      :repairData="repairData"
      @closeRepairModal="closeRepairModal"
      :current="current"
      :transferData="transferData"
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
import xlsx from 'xlsx'
import moment from 'moment'
import saleRepairModal from './saleRepairModal.vue'
import saleRepairAdd from './saleRepairAdd.vue'
import saleRepairDrawback from './drawbackModal.vue'
import { getAfterSale as apiGetAfterSale, searchAfterSale as apiSearchAfterSale, addAfterSale, delAfterSale as apiDelAfterSale } from '@/api/afterSale'
import { export_json_to_excel as exportExcel } from '../../utils/excel/Export2Excel'
import { getUserInfo } from '@/api/login'
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
    },
    filterBoolean (value) {
      if (value === true) {
        return '是'
      } else if (value === false) {
        return '否'
      } else if (value === null) {
        return '---'
      }
    }
  },
  data () {
    return {
      MyInfo: {},
      repairVisible: false,
      repairAddVisible: false,
      drawbackVisible: false,
      visible: false,
      exportVisible: false,
      // 总数据
      salesData: [
      ],
      exportfilterData: [],
      estimateData: [
      ],
      importColumns: [
      {
          title: '客户名',
          dataIndex: 'customerName',
          key: 'customerName',
          align: 'center'
        },
        {
          title: '联系方式',
          dataIndex: 'customerPhone',
          key: 'customerPhone',
          align: 'center'
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          key: 'brand',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel',
          align: 'center'
        },
        {
          title: '产品编号',
          dataIndex: 'productNo',
          key: 'productNo',
          align: 'center'
        },
        {
          title: '购买日期',
          dataIndex: 'purchaseDate',
          key: 'purchaseDate',
          align: 'center',
          customRender: (text) => text ? moment(text).format('YYYY年MM月DD日') : ''
        },
        {
          title: '问题分类',
          dataIndex: 'problemCategory',
          key: 'problemCategory',
          align: 'center'
        },
        {
          title: '收货地址',
          dataIndex: 'receiveAddress',
          key: 'receiveAddress',
          align: 'center'
        }
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
        {
          title: '品牌',
          dataIndex: 'customerInfo.brand',
          key: 'customerInfo.brand',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'customerInfo.productModel',
          key: 'customerInfo.productModel',
          align: 'center'
        },
        {
          title: '产品编号',
          dataIndex: 'customerInfo.productNo',
          key: 'customerInfo.productNo',
          align: 'center'
        },
        {
          title: '是否月结单',
          scopedSlots: { customRender: 'monthlyStatement' },
          align: 'center'
        },
        {
          title: '评估次数',
          scopedSlots: { customRender: 'processes' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
          sorter: (a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t1 - t2
          }
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
          title: '品牌',
          dataIndex: 'customerInfo.brand',
          key: 'customerInfo.brand',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'customerInfo.productModel',
          key: 'customerInfo.productModel',
          align: 'center'
        },
        {
          title: '产品编号',
          dataIndex: 'customerInfo.productNo',
          key: 'customerInfo.productNo',
          align: 'center'
        },
        {
          title: '记录客服',
          dataIndex: 'customerService',
          key: 'customerService',
          align: 'center'
        },
        {
          title: '是否月结单',
          scopedSlots: { customRender: 'monthlyStatement' },
          align: 'center'
        },
        {
          title: '评估次数',
          scopedSlots: { customRender: 'processes' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
          sorter: (a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t1 - t2
          }
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
          title: '品牌',
          dataIndex: 'customerInfo.brand',
          key: 'customerInfo.brand',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'customerInfo.productModel',
          key: 'customerInfo.productModel',
          align: 'center'
        },
        {
          title: '产品编号',
          dataIndex: 'customerInfo.productNo',
          key: 'customerInfo.productNo',
          align: 'center'
        },
        {
          title: '是否月结单',
          scopedSlots: { customRender: 'monthlyStatement' },
          align: 'center'
        },
        {
          title: '记录客服',
          dataIndex: 'customerService',
          key: 'customerService',
          align: 'center'
        },
        {
          title: '评估次数',
          scopedSlots: { customRender: 'processes' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
          sorter: (a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t1 - t2
          }
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
          title: '品牌',
          dataIndex: 'customerInfo.brand',
          key: 'customerInfo.brand',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'customerInfo.productModel',
          key: 'customerInfo.productModel',
          align: 'center'
        },
        {
          title: '产品编号',
          dataIndex: 'customerInfo.productNo',
          key: 'customerInfo.productNo',
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
          title: '是否月结单',
          scopedSlots: { customRender: 'monthlyStatement' },
          align: 'center'
        },
        {
          title: '评估次数',
          scopedSlots: { customRender: 'processes' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
          sorter: (a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t1 - t2
          }
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
          title: '品牌',
          dataIndex: 'customerInfo.brand',
          key: 'customerInfo.brand',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'customerInfo.productModel',
          key: 'customerInfo.productModel',
          align: 'center'
        },
        {
          title: '产品编号',
          dataIndex: 'customerInfo.productNo',
          key: 'customerInfo.productNo',
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
          title: '是否月结单',
          scopedSlots: { customRender: 'monthlyStatement' },
          align: 'center'
        },
        {
          title: '评估次数',
          scopedSlots: { customRender: 'processes' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
          sorter: (a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t1 - t2
          }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      solveData: [],
      // 传给子组件的数据
      repairData: {},
      current: 0,
      saleId: null,
      checkMonthly: 'all',
      changeStatus: 'WAIT_EVALUATE',
      importDataList: [], // 导入的数据
      transferData: null, // 月结单
      brandArrs: [
        {
          name: '杜马',
          modelArr: ['A4', 'A5', 'A6', 'A6+', '202', 'U1', 'U1-A', 'U1-b', 'U2', 'U3', 'U5-03', 'U6-A', 'U6-b', 'U6-03', 'U7', 'U8', 'K3', 'K4', 'K5', 'K6', '1012', '2023', 'T1', 'T5']
        },
        {
          name: '德希顿',
          modelArr: ['A4', 'A5', 'A6', '202', 'U5-03', 'U6-03', 'U7', 'K4', 'K5', 'K6', '1012', '2023']
        },
        {
          name: '攸太',
          modelArr: ['A4', 'A5', 'A6', 'A6+', '202', 'U1', 'U1-A', 'U1-b', 'U2', 'U3', 'U5-03', 'U6-A', 'U6-b', 'U6-03', 'U7', 'U8', 'K3', 'K4', 'K5', 'K6', '1012', '2023', 'IUW', 'T1', 'T5']
        },
        {
          name: '摩琥',
          modelArr: ['A4', 'A5', 'A6', '202', 'K4', 'K5']
        },
        {
          name: '北控',
          modelArr: ['A4', 'A5', 'A6']
        },
        {
          name: '法仕德',
          modelArr: ['A4', 'A5', 'A6', 'U1', 'U2', 'U6-03', 'K4']
        },
        {
          name: '徳斯图',
          modelArr: ['A4', 'A5', 'A6', 'K5']
        },
        {
          name: '舒艾莎',
          modelArr: ['A4', 'A5', 'A6', 'U1', 'U2', 'U6-03']
        },
        {
          name: '北极熊',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03', 'U7']
        },
        {
          name: '芙林',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03', 'U7']
        },
        {
          name: '麦特拉赫',
          modelArr: ['U1', 'U2', 'U3', 'U7']
        },
        {
          name: '嘉饰缇娜',
          modelArr: ['U1', 'U2', 'U3']
        },
        {
          name: '有质',
          modelArr: ['U1', 'U2', 'U3', 'K5']
        },
        {
          name: '一米',
          modelArr: ['U1', 'U2', 'U3', 'U6-03', 'K4', 'K5']
        },
        {
          name: '德爽康',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03']
        },
        {
          name: '哈雅',
          modelArr: ['U1', 'U2', 'U6-03', 'U7', 'K4']
        },
        {
          name: '史密斯',
          modelArr: ['U1', 'U2', 'U6-03', 'U7']
        },
        {
          name: '犀鸟',
          modelArr: ['U1', 'U2', 'U3', 'U5-03', 'U6-03', 'U7', 'K4', 'K5']
        },
        {
          name: '摩柏',
          modelArr: ['U1', 'U2', 'K4', 'K5']
        },
        {
          name: '梵云优尚',
          modelArr: ['U2', 'U3', 'K5']
        },
        {
          name: '事达',
          modelArr: ['U2', 'U3', 'U5-03', 'U6-03', 'K5']
        },
        {
          name: '亨本',
          modelArr: ['U2', 'K4']
        },
        {
          name: '法兰多',
          modelArr: ['U3', 'U5-03']
        },
        {
          name: '德朗斯汀',
          modelArr: ['U6-03', 'K4', 'K5']
        },
        {
          name: '博蒙',
          modelArr: ['K4', 'K5']
        },
        {
          name: '德斯图',
          modelArr: ['K4']
        },
        {
          name: '蒙娜丽莎',
          modelArr: ['K4', 'K5']
        },
        {
          name: '卡恩诺',
          modelArr: ['K4', 'K5']
        }
      ],
      filterBrand: '',
      selectModel: '',
      modelArr: [],
      allModel: ['A4', 'A5', 'A6', 'A6+', '202', 'U1', 'U1-A', 'U1-b', 'U2', 'U3', 'U5-03', 'U6-A', 'U6-b', 'U6-03', 'U7', 'U8', 'K3', 'K4', 'K5', 'K6', '1012', '2023', 'IUW', 'T1', 'T5']
    }
  },
  methods: {
    async getMe () {
      const res = await getUserInfo()
      this.MyInfo = res.data
    },
    saveImport () {
      this.visible = false
      this.importDataList.map(item => {
        this.addSaleForm(item)
      })
    },
    async addSaleForm (apiData) {
      const res = await addAfterSale(apiData)
      if (res.status === 200) {
        this.getAfterSaleData() // 再请求下数据
      }
    },
    importData (file) {
      this.importDataList = []
      let reader = new FileReader()
      reader.readAsBinaryString(file.file) // 这个是file.file文件，可不是file……
      reader.onload = (ev) => {
        const res = ev.target.result
        const worker = xlsx.read(res, { type: 'binary' })
        // 将返回的数据转换为json对象的数据
        reader = xlsx.utils.sheet_to_json(worker.Sheets[worker.SheetNames[0]])
        const date = new Date() // 日期
        for (let i = 0; i < reader.length; i++) {
          // 定义要导出的
          const sheetData = {
            customerName: reader[i]['客户名称'],
            customerPhone: reader[i]['客户电话'],
            brand: reader[i]['产品品牌'],
            productNo: reader[i]['产品编号'],
            productModel: reader[i]['产品型号'],
            problemCategory: reader[i]['问题分类'],
            problemExplain: reader[i]['问题描述'],
            receiveAddress: reader[i]['收货地址'],
            serviceAddress: reader[i]['上门地址'],
            purchaseDate: moment(new Date(parseInt(date.setTime(Math.round(reader[i]['购买日期'] * 24 * 60 * 60 * 1000) + Date.parse('1899-12-30')).toString()))),
            monthlyStatement: true
          }
          this.importDataList.push(sheetData)
        }
        this.visible = true
        console.log(this.importDataList, '导入的数据是---')
      }
    },
    close () {
      this.visible = false
    },
    handleChangeBrand (value) {
      this.filterBrand = value
      this.selectModel = ''
      this.exportfilterData = this.salesData.filter(item => {
        return item.customerInfo.brand === value
      })
      this.brandArrs.filter(item => {
        if (item.name === this.filterBrand) {
          this.modelArr = item.modelArr
        }
      })
    },
    handleChangeModel (value) {
      this.selectModel = value
      if (this.filterBrand !== '') {
        this.exportfilterData = this.salesData.filter(item => {
          return item.customerInfo.productModel === value && item.customerInfo.brand === this.filterBrand
        })
      } else {
        this.exportfilterData = this.salesData.filter(item => {
          return item.customerInfo.productModel === value
        })
      }
    },
    exportData () {
      if (this.solveData.length === 0) {
        this.$message.warning('导出数据不能为空')
        return
      }
      const that = this
      this.$confirm({
        title: `确认导出 ${that.solveData.length} 条数据吗?`,
        content: `是否月结单：${that.checkMonthly === 'true' ? '是' : (that.checkMonthly === 'false' ? '否' : '全部订单')}`,
        onOk () {
          console.log('需要导出的数据', that.solveData)
          const tHeader = ['报修日期', '客户名', '客户手机', '客户上门地址', '购买时间', '品牌', '型号', '产品编号', '售后问题', '售后解决', '是否上门', '是否寄件', '是否月结单', '是否保质期内', '应付金额', '实付金额']
          const fitlerVal = [
            'createdAt',
            'customerName',
            'customerPhone',
            'serviceAddress',
            'purchaseDate',
            'brand',
            'productModel',
            'productNo',
            'problemCategory',
            'problems',
            'needVisit',
            'needPieceSend',
            'monthlyStatement',
            'isOverWarranty',
            'totalCost',
            'customerPay'
          ]
          that.filterExcelData(tHeader, fitlerVal, that.solveData, 'account')
        },
        onCancel () {}
      })
    },
    filterExcelData (tHeader, fitlerVal, filterExportData, mode) {
      const res = filterExportData.map((v) => fitlerVal.map((j) => {
        if (j === 'createdAt' || j === 'purchaseDate') {
          return moment(v[j]).format('YYYY-MM-DD')
        } else if (j === 'serviceAddress') {
          if (v.customerInfo[j] !== '') {
            return v.customerInfo[j]
          } else {
            return v.customerInfo['receiveAddress']
          }
        } else if (j === 'monthlyStatement') {
          return v[j] ? '是' : (v[j] == null ? '-' : '否')
        } else if (j === 'isOverWarranty') {
          if (v.processes.length > 0) {
            return v.processes[0][j] ? '是' : '否'
          } else {
            return '-'
          }
        } else if (j === 'totalCost' || j === 'customerPay') {
          var totalCost = 0
          v.processes.map(item => {
            totalCost = item[j] + totalCost
          })
          return totalCost
        } else if (j === 'needPieceSend' || j === 'needVisit') {
          if (v.processes.length > 0) {
            const sendList = v.processes.filter(item => {
            return item[j]
            })
            if (sendList.length > 0) {
              return '是'
            } else { return '否' }
          } else {
            return '-'
          }
        } else if (j === 'problems') {
          var problemList = ''
          v.processes.map(item => {
            item.problems.map(pro => {
              problemList = pro.problemJudge.firstPro + '/' + pro.problemJudge.secondPro
            })
          })
          return problemList
        } else if (j === 'status') {
          if (v[j] === 'WAIT_EVALUATE') {
            return '待评估'
          } else if (v[j] === 'EVALUATED' || v[j] === 'WAIT_PAY') {
            return '待支付'
          } else if (v[j] === 'PAID') {
            return '待派工'
          } else if (v[j] === 'WAIT_VISIT') {
            return '待上门'
          } else if (v[j] === 'SOLVED') { return '已解决' }
        } else {
          return v.customerInfo[j]
        }
      }))
      // 获取当前时间
      const myDate = new Date()
      const today = moment(myDate).format('YYYY-MM-DD ')
      const name = this.MyInfo.nickname
      if (mode === 'all') {
        exportExcel(tHeader, res, this.filterBrand + '信息单' + today + name)
      } else if (mode === 'account') {
        exportExcel(tHeader, res, '对账单' + today + name)
      }
    },
    exportAllData () {
      this.filterBrand = ''
      this.selectModel = ''
      this.exportfilterData = this.salesData
      this.modelArr = this.allModel
      this.exportVisible = true
    },
    handleOk () {
      if (this.exportfilterData.length === 0) {
        this.$message.warning('导出数据不能为空')
        return
      }
      // 导出筛选好的数据
      const tHeader = ['报修日期', '客户名', '客户手机', '客户上门地址', '购买时间', '品牌', '型号', '产品编号', '售后问题', '售后解决', '是否上门', '是否寄件', '是否月结单', '是否保质期内', '状态']
      const fitlerVal = [
      'createdAt',
        'customerName',
        'customerPhone',
        'serviceAddress',
        'purchaseDate',
        'brand',
        'productModel',
        'productNo',
        'problemCategory',
        'problems',
        'needVisit',
        'needPieceSend',
        'monthlyStatement',
        'isOverWarranty',
        'status'
      ]
      this.filterExcelData(tHeader, fitlerVal, this.exportfilterData, 'all')
    },
    handleCancel () {
      this.exportVisible = false
    },
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
      const testData = data.processes.sort((a, b) => {
        return a.id - b.id
      })
      this.repairData = data
      this.repairData.processes = testData
      this.transferData = this.repairData.monthlyStatement
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
          // 总排序
          this.salesData = this.salesData.sort((a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t1 - t2
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
          // 已解决倒序
          this.solveData = this.solveData.sort((a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t2 - t1
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
      // console.log('售后类型', 'REPAIR', '搜索', value, '状态', this.changeStatus, '是否月结单', this.checkMonthly)
      const apiData = {
        word: value,
        type: 'REPAIR',
        status: this.changeStatus
      }
      if (this.checkMonthly === 'true') {
        apiData.monthlyStatement = true
        // console.log(apiData)
      } else if (this.checkMonthly === 'false') {
        apiData.monthlyStatement = false
      }
      apiSearchAfterSale(apiData).then(res => {
        if (res.status === 200) {
          // console.log(res.data)
          switch (this.changeStatus) {
            case 'WAIT_EVALUATE':
              this.estimateData = res.data
              break
            case 'EVALUATED':
              this.estimateOkData = res.data
              break
            case 'PAID':
              this.payData = res.data
              break
            case 'WAIT_VISIT':
              this.comeData = res.data
              break
            case 'SOLVED':
              this.solveData = res.data.sort((a, b) => {
                const t1 = new Date(a.createdAt).getTime()
                const t2 = new Date(b.createdAt).getTime()
                return t2 - t1
              })
              break
          }
        } else {
          this.$message.error('搜索失败' + res.message)
        }
      })
    },
    checkTab (key) {
      // console.log(key)
      switch (key) {
        case '1':
          this.changeStatus = 'WAIT_EVALUATE'
          break
        case '2':
          this.changeStatus = 'EVALUATED'
          break
        case '3':
          this.changeStatus = 'PAID'
          break
        case '4':
          this.changeStatus = 'WAIT_VISIT'
          break
        case '5':
          this.changeStatus = 'SOLVED'
          break
      }
    },
    delRepair (data) {
      console.log(data)
      const delId = data.id
      apiDelAfterSale(delId).then(res => {
        if (res.status === 200) {
          this.$message.success('删除成功')
          this.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
    // 查询工单
    this.getAfterSaleData()
    this.getMe()
  }
}
</script>
<style lang="scss" scoped>

</style>
