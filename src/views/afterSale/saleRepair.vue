<template>
  <div>
    <a-card>
      <a-row style="display:flex;align-items: center;">
        <a-col :span="3">
          <span>&nbsp;月结单：</span>
          <a-select @change="changeMonthly" v-model="checkMonthly" default-value="all" style="width: 50%;">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="true">是</a-select-option>
            <a-select-option value="false">否</a-select-option>
            <a-select-option value="wait">---</a-select-option>
          </a-select>
          <!-- <a-button @click="onSearch(null)">筛选</a-button> -->
        </a-col>
        <a-col :span="7">
          <a-range-picker
            style="width: 100%;"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            @change="changeTime"
          />
        </a-col>
        <a-col :span="4">
          <a-input-search
            placeholder="请输入关键字"
            enter-button="查询"
            @search="onSearch"
          />
        </a-col>
        <a-col :span="2" style="display:flex;align-items:center;justify-content: center;height:auto" v-if="MyInfo.roleName === 'After-salesAsst'">
          <a-switch checked-children="仅看自己" un-checked-children="全部数据" default-checked v-model="filterMe" @change="changeFilterMe"/>
          <!-- <a-switch v-if="MyInfo.roleName === 'After-salesAsst'"/> -->
        </a-col>
        <a-col style="text-align: right;float: right;" :span="8">
          <a-button style="margin-right: 10px;" type="dashed" @click="openAddRepair">新增维修单</a-button>
          <a-button @click="exportData"><a-icon type="pay-circle" />导出对账单</a-button>
          <a-button type="primary" ghost @click="exportAllData">导出信息单</a-button>
        </a-col>
      </a-row>
      <div>
        <a-tabs default-active-key="1" @change="checkTab">
          <a-tab-pane key="1" tab="待评估">
            <a-space>
              <!-- <a-button type="primary" @click="openAddRepair">新增维修工单</a-button> -->
              <a-upload name="file" accept=".xls,xlsx" :customRequest="importData" :showUploadList="false">
                <a-button> <a-icon type="upload" />导入excel</a-button>
              </a-upload>
              <a-button v-if="MyInfo.roleName === 'After_salesDirector' || MyInfo.roleName === 'After_salesManager'" @click="sendOrders"> <a-icon type="contacts" />派单</a-button>
            </a-space>
            <a-table
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
                <a @click="openRepairModal(record)" v-if="record.customerService === '' || record.customerService === null">评估</a>
                <a @click="openRepairModal(record)" v-else-if="(MyInfo.roleName === 'After_salesTechnology' || MyInfo.roleName === 'After-salesAsst') && MyInfo.userInfo.name !== record.customerService">--</a>
                <a @click="openRepairModal(record)" v-else>评估</a>
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
          <a-tab-pane key="4" tab="已寄件">
            <a-table
              :columns="sendColumns"
              :rowKey="(record, index) => index"
              :data-source="sendData"
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
          <a-tab-pane key="5" tab="待上门">
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
          <a-tab-pane key="6" tab="已解决">
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
                <a @click="openDrawbackModal(record)">退件退款</a>
              </span>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="7">
            <span slot="tab">
              <a-icon type="delete" />已作废
            </span>
            <a-table
              :columns="estimateColumns"
              :rowKey="(record, index) => index"
              :data-source="voidData"
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
        </a-tabs>
      </div>
    </a-card>
    <a-modal :visible="visible" title="导入数据" @ok="saveImport" @cancel="close" :width="1500">
      <a-table :data-source="importDataList" :columns="importColumns" :rowKey="(record, index) => index"/>
    </a-modal>
    <a-modal
      v-if="exportVisible"
      :title="topTitle==='info'?'导出信息单':'导出对账单'"
      :visible="exportVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-row>
        <a-col :offset="2">
          <a-range-picker
            :ranges="ranges"
            :disabled-date="disabledDate"
            @change="onChangeDate"
            v-model="selectDate"
          />
        </a-col>
      </a-row>
      <a-row style="color:#888;margin-top:4px;">
        <a-col :offset="2" v-if="topTitle==='info'"><a-icon type="info-circle"/> 将导出【创建时间】在此范围内的订单</a-col>
        <a-col :offset="2" v-else><a-icon type="info-circle"/> 将导出【寄件时间、退款时间】在此范围内的订单</a-col>
      </a-row>
      <a-row style="margin-top:30px">
        <a-col :span="4" :offset="2">筛选品牌：
          <a-select placeholder="请选择产品品牌" v-model="filterBrand" style="width: 130px" @change="handleChangeBrand">
            <a-select-option v-for="(item) in brandArrs" :key="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4" :offset="8">筛选型号：
          <a-select placeholder="请选择产品型号" v-model="selectModel" style="width: 130px" @change="handleChangeModel">
            <a-select-option v-for="(item) in modelArr" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row style="margin-top:16px;">
        <a-col :span="8" :offset="2">
          <a-icon type="container" theme="twoTone" /> 预计导出 <span style="color:red;font-size:20px;">{{ this.exportfilterData.length }}</span> 个订单
        </a-col>
        <a-col :span="4" :offset="4" v-if="topTitle==='account'">月结单：
          <a-select @change="handSelectMonth" v-model="selectMonthly" style="width: 130px;" :disabled="disableMonth">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option value="true">是</a-select-option>
            <a-select-option value="false">否</a-select-option>
            <a-select-option value="null">---</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      title="派单"
      :visible="sendOrderVisible"
      @ok="handleSendOrder"
      @cancel="handleCancelSendOrder"
    >
      <div style="padding:0 30px;">
        <p>请选择要派单的人员</p>
        <a-radio-group v-model="sendOrderName" :default-value="1">
          <a-radio :style="radioStyle" :value="item.userInfo.name" v-for="item in receiveList" :key="item.id">{{ item.userInfo.name }}</a-radio>
          <a-radio :style="radioStyle" value="">清空订单负责人</a-radio>
        </a-radio-group>
      </div>
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
import { getAfterSale as apiGetAfterSale, searchAfterSale as apiSearchAfterSale, addAfterSale, delAfterSale as apiDelAfterSale, updateStatus } from '@/api/afterSale'
import { export_json_to_excel as exportExcel } from '../../utils/excel/Export2Excel'
import { getUserInfo } from '@/api/login'
import { getUserList } from '@/api/manage'
import { brandData } from './saleRepairData'

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
        case 'SEND':
          return '已寄件'
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
      selectedRowKeys: [],
      selectedRows: [],
      receiveList: [],
      MyInfo: {},
      sendOrderName: null,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      sendOrderVisible: false,
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
      voidData: [], // 作废数据
      importColumns: [
        {
          title: '客户名',
          dataIndex: 'customerName',
          key: 'customerName',
          align: 'center',
          width: 80
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
          align: 'center',
          width: 80
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel',
          align: 'center',
          width: 100
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
          width: 150,
          customRender: (text) => text ? moment(text).format('YYYY年MM月DD日') : ''
        },
        {
          title: '问题分类',
          dataIndex: 'problemCategory',
          key: 'problemCategory',
          align: 'center'
        },
        {
          title: '问题分类',
          dataIndex: 'problemExplain',
          key: 'problemExplain',
          align: 'center'
        },
        {
          title: '收货地址',
          dataIndex: 'receiveAddress',
          key: 'receiveAddress',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
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
          title: '负责人',
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
          width: '100px',
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
          title: '评估客服',
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
          title: '评估客服',
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
      sendColumns: [],
      sendData: [],
      comeColumns: [],
      comeData: [],
      solveColumns: [],
      solveData: [],
      // 传给子组件的数据
      repairData: {},
      current: 0,
      saleId: null,
      checkMonthly: 'all',
      changeStatus: 'WAIT_EVALUATE',
      importDataList: [], // 导入的数据
      transferData: null, // 月结单
      brandArrs: brandData,
      selectDate: null,
      selectMonthly: 'all',
      disableMonth: false,
      filterBrand: '',
      selectModel: '',
      modelArr: [],
      allModel: ['A4', 'A5', 'A6', 'A6+', '202', 'U1', 'U1-A', 'U1-b', 'U2', 'U3', 'U5-03', 'U6-A', 'U6-b', 'U6-03', 'U7', 'U8', 'K3', 'K4', 'K5', 'K6', '1012', '2023', 'IUW', 'T1', 'T5'],
      startTime: null,
      endTime: null,
      exportStart: '',
      exportEnd: '',
      moment,
      ranges: {
      '今天': [moment(), moment()],
      '本月': [moment().startOf('month'), moment().endOf('month')],
      '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      topTitle: '',
      filterMe: true
    }
  },
  methods: {
    changeFilterMe (e) {
      this.filterViewMyData()
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    async getUserList () {
      const res = await getUserList({ page: 1, size: 1 })
      if (res.status === 200) {
        const resp = await getUserList({ page: 1, size: res.data.totalElements })
        this.receiveList = resp.data.content.filter(item => {
          return (item.roleName === 'After-salesAsst' || item.roleName === 'After_salesTechnology') && item.status === 'active'
        })
        console.log(resp)
      }
      console.log(res)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    sendOrders () {
      console.log('开始排单', this.selectedRows)
      this.sendOrderVisible = true
    },
    handleCancelSendOrder () {
      this.sendOrderVisible = false
    },
    handleSendOrder () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('你还有没选择订单哦')
      } else if (this.sendOrderName === null) {
        this.$message.warning('请先选择派单对象')
      } else {
        this.selectedRows.map(item => {
          this.updateStatus(item.id)
        })
      }
    },
    async updateStatus (id) {
      const payLoad = {}
      payLoad.customerService = this.sendOrderName
      const res = await updateStatus(id, payLoad)
      if (res.status === 200) {
        this.getAfterSaleData()
        this.selectedRowKeys = []
        this.sendOrderVisible = false
      }
      console.log(res)
    },
    onChangeDate (date, dateString) {
      this.disableMonth = false
      this.selectMonthly = 'all'
      this.exportStart = dateString[0]
      this.exportEnd = dateString[1]
      const filterData = this.salesData.filter(item => {
        if (this.filterBrand !== '' && this.filterBrand !== null && this.selectModel !== '' && this.selectModel !== null) {
          return item.customerInfo.brand === this.filterBrand && item.customerInfo.productModel === this.selectModel
        } else if (this.filterBrand !== '' && this.filterBrand !== null) {
          return item.customerInfo.brand === this.filterBrand
        } else if (this.selectModel !== '' && this.selectModel !== null) {
          return item.customerInfo.productModel === this.selectModel
        } else {
          return true
        }
      })
      this.filterTime(filterData)
      console.log(date, dateString, this.exportfilterData)
    },
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
            remark: reader[i]['备注'],
            purchaseDate: moment(new Date(parseInt(date.setTime(Math.round(reader[i]['购买日期'] * 24 * 60 * 60 * 1000) + Date.parse('1899-12-30')).toString())))
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
    handSelectMonth () {
      // this.handleChangeModel(this.selectModel)
      this.exportfilterData = this.exportfilterData.filter(item => {
        if (this.selectMonthly === 'all') {
          return item
        } else if (this.selectMonthly === 'true') {
          return item.monthlyStatement
        } else if (this.selectMonthly === 'false') {
          if (item.monthlyStatement === false) {
            return item
          }
        } else {
          return item.monthlyStatement === null
        }
      })
      this.disableMonth = true
    },
    filterTime (filterData) {
      if (this.exportStart !== '' && this.exportEnd !== '') {
        this.exportfilterData = filterData.filter(item => {
          if (this.topTitle === 'info') {
            const dateTime = moment(item.createdAt).format('YYYY-MM-DD')
            if (dateTime >= this.exportStart && dateTime <= this.exportEnd) {
              return true
            }
          } else {
            for (const process of item.processes) {
              const sendTime = moment(process.sendTime).format('YYYY-MM-DD')
              if (sendTime >= this.exportStart && sendTime <= this.exportEnd) {
                return true
              } else if (process.returnParts.length > 0) {
                for (const returnPart of process.returnParts) {
                  const refundTime = moment(returnPart.returnTime).format('YYYY-MM-DD')
                  if (refundTime >= this.exportStart && refundTime <= this.exportEnd) {
                    return true
                  }
                }
              }
              // 按退款时间导出
              // else if (process.pays.length > 1) {
              //   for (const pay of process.pays) {
              //     const refundTime = moment(pay.refundTime).format('YYYY-MM-DD')
              //     if (pay.submitType === 'REFUND' && refundTime >= this.exportStart && refundTime <= this.exportEnd) {
              //       return true
              //     }
              //   }
              // }
            }
          }
        })
      } else {
        this.exportfilterData = filterData
      }
      console.log('this.exportfilterData', this.exportfilterData)
    },
    handleChangeBrand (value) {
      this.disableMonth = false
      this.selectMonthly = 'all'
      this.filterBrand = value
      this.selectModel = ''
      const filterData = this.salesData.filter(item => {
        return item.customerInfo.brand === value
      })
      this.filterTime(filterData)
      this.brandArrs.filter(item => {
        if (item.name === this.filterBrand) {
          this.modelArr = item.modelArr
        }
      })
    },
    handleChangeModel (value) {
      this.disableMonth = false
      this.selectMonthly = 'all'
      this.selectModel = value
      const filterData = this.salesData.filter(item => {
        if (this.filterBrand !== '') {
          return item.customerInfo.productModel === value && item.customerInfo.brand === this.filterBrand
        } else {
          return item.customerInfo.productModel === value
        }
      })
      this.filterTime(filterData)
    },
    exportData () {
      this.exportDataInit('account')
      // if (this.solveData.length === 0) {
      //   this.$message.warning('导出数据不能为空')
      //   return
      // }
      // const that = this
      // this.$confirm({
      //   title: `确认导出 ${that.solveData.length} 条数据吗?`,
      //   content: `是否月结单：${that.checkMonthly === 'true' ? '是' : (that.checkMonthly === 'false' ? '否' : '全部订单')}`,
      //   onOk () {
      //     console.log('需要导出的数据', that.solveData)
      //     const tHeader = ['报修日期', '客户名', '客户手机', '客户上门地址', '购买时间', '品牌', '型号', '产品编号', '售后问题', '售后解决', '是否上门', '是否寄件', '是否月结单', '是否保质期内', '应付金额', '实付金额']
      //     const fitlerVal = [
      //       'createdAt',
      //       'customerName',
      //       'customerPhone',
      //       'serviceAddress',
      //       'purchaseDate',
      //       'brand',
      //       'productModel',
      //       'productNo',
      //       'problemCategory',
      //       'problems',
      //       'needVisit',
      //       'needPieceSend',
      //       'monthlyStatement',
      //       'isOverWarranty',
      //       'totalCost',
      //       'customerPay'
      //     ]
      //     that.filterExcelData(tHeader, fitlerVal, that.solveData, 'account')
      //   },
      //   onCancel () {}
      // })
    },
    filterExcelData (v, j, process, returnPart) {
      console.log('456', v, j)
      if (j === 'id') {
        return v[j]
      }
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
          return '待寄件'
        } else if (v[j] === 'WAIT_VISIT' || v[j] === 'SEND') {
          return '待上门'
        } else if (v[j] === 'SOLVED') {
          return '已解决'
        } else if (v[j] === 'CANCEL') { return '已废弃' }
      } else if (j === 'pieceName') {
        if (process.afterSaleExpresses.length > 0 && returnPart === 'send') {
          return process['afterSaleExpresses'].map(piece => {
            return piece.pieceName + '_' + piece.pieceNum + '个'
          })
        } else {
          return '-'
        }
      } else if (j === 'sendTime') {
        if (returnPart === 'send') {
          return process[j] ? moment(process[j]).format('YYYY-MM-DD') : '-'
        } else { return '-' }
      } else if (j === 'pieceDeliveryNo') {
        if (returnPart === 'send') {
          return process.pieceDeliveryNo ? process.pieceDeliveryNo : '-'
        } else { return '-' }
      } else if (j === 'returnName') {
        return returnPart?.returnName || '-'
      } else if (j === 'returnNum') {
        return returnPart?.returnNum || '-'
      } else if (j === 'unitPrice') {
        return returnPart?.unitPrice || '-'
      } else if (j === 'totalPrice') {
        return returnPart?.totalPrice || '-'
      } else if (j === 'returnTime') {
        return moment(returnPart?.returnTime).format('YYYY-MM-DD') || '-'
      } else {
        return v.customerInfo[j]
      }
    },
    exportAllData () {
      this.exportDataInit('info')
    },
    exportDataInit (data) {
      this.topTitle = data
      this.selectDate = null
      this.filterBrand = ''
      this.selectModel = ''
      this.exportStart = ''
      this.exportEnd = ''
      this.exportfilterData = this.salesData
      this.modelArr = this.allModel
      this.exportVisible = true
      this.disableMonth = false
    },
    handleOk () {
      if (this.exportfilterData.length === 0) {
        this.$message.warning('导出数据不能为空')
        return
      }
      // 导出筛选好的数据
      // 获取当前时间
      const myDate = new Date()
      const today = moment(myDate).format('YYYY-MM-DD ')
      const name = this.MyInfo.nickname
      if (this.topTitle === 'info') {
        const tHeader = [
          '报修日期', '客户名', '客户手机', '客户上门地址', '购买时间', '品牌', '型号',
          '产品编号', '售后问题', '售后解决', '是否上门', '是否寄件', '是否月结单', '是否保修期内', '状态'
        ]
        const filterVal = [
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
        const res = this.exportfilterData.map((v) => filterVal.map((j) => {
          return this.filterExcelData(v, j)
        }))
        exportExcel(tHeader, res, this.filterBrand + '信息单' + today + name)
      } else if (this.topTitle === 'account') {
        const tHeader = [
        '订单编号', '报修日期', '客户名', '客户手机', '客户上门地址', '购买时间', '品牌', '型号',
          '产品编号', '售后问题', '售后解决', '是否上门', '是否寄件', '是否月结单', '是否保修期内', '状态', '寄件', '寄件单号', '寄件时间', '退件名称', '退件数量', '退件单价', '退件金额', '退件时间'
        ]
        const filterVal = [
          'id',
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
          'status',
          'pieceName',
          'pieceDeliveryNo',
          'sendTime',
          'returnName',
          'returnNum',
          'unitPrice',
          'totalPrice',
          'returnTime'
        ]
        const resultData = []
        this.exportfilterData.map((obj) => {
          const newArr = obj.processes.filter((process) => {
            const sendTime = moment(process.sendTime).format('YYYY-MM-DD')
            if (sendTime >= this.exportStart && sendTime <= this.exportEnd) {
              return true
            } else if (process.returnParts.length > 0) {
              process.returnParts.map(item => {
                const refundTime = moment(item.returnTime).format('YYYY-MM-DD')
                if (refundTime >= this.exportStart && refundTime <= this.exportEnd) {
                  return true
                }
              })
            }
          })
          newArr.map(process => {
            const temp = filterVal.map((j) => {
              return this.filterExcelData(obj, j, process, 'send')
            })
            resultData.push(temp)
          })
          newArr.map(process => {
            process.returnParts.map(item => {
              const refundTime = moment(item.returnTime).format('YYYY-MM-DD')
              if (refundTime >= this.exportStart && refundTime <= this.exportEnd) {
                const returnArr = filterVal.map((j) => {
                  return this.filterExcelData(obj, j, process, item)
                })
                resultData.push(returnArr)
              }
            })
          })
        })
        exportExcel(tHeader, resultData, this.filterBrand + '对账单' + today + name)
      }
    },
    handleCancel () {
      this.exportVisible = false
    },
    openRepairModal (data) {
      // console.log(data)
      this.repairVisible = true
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
        case 'SEND':
          this.current = 3
          break
        case 'WAIT_VISIT':
          this.current = 4
          break
        case 'SOLVED':
          this.current = 5
          break
        case 'CANCEL':
          this.current = 6
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
          this.filterViewMyData()
        }
      })
    },
    filterViewMyData () {
      const roleName = this.MyInfo.roleName
      this.estimateData = this.salesData.filter(item => {
        if (item.status === 'WAIT_EVALUATE') {
          if (roleName === 'After-salesAsst' && this.filterMe) {
            return item.customerService === this.MyInfo.userInfo.name
          } else {
            return item
          }
        }
      })
      this.voidData = this.salesData.filter(item => {
        if (item.status === 'CANCEL') {
          if (roleName === 'After-salesAsst' && this.filterMe) {
            return item.customerService === this.MyInfo.userInfo.name
          } else {
            return item
          }
        }
      })
      this.estimateOkData = this.salesData.filter(item => {
        if (item.status === 'EVALUATED') {
          if (roleName === 'After-salesAsst' && this.filterMe) {
            return item.customerService === this.MyInfo.userInfo.name
          } else {
            return item
          }
        }
      })
      this.payData = this.salesData.filter(item => {
        if (item.status === 'PAID') {
          if (roleName === 'After-salesAsst' && this.filterMe) {
            return item.customerService === this.MyInfo.userInfo.name
          } else {
            return item
          }
        }
      })
      this.sendData = this.salesData.filter(item => {
        if (item.status === 'SEND') {
          if (roleName === 'After-salesAsst' && this.filterMe) {
            return item.customerService === this.MyInfo.userInfo.name
          } else {
            return item
          }
        }
      })
      this.comeData = this.salesData.filter(item => {
        if (item.status === 'WAIT_VISIT') {
          if (roleName === 'After-salesAsst' && this.filterMe) {
            return item.customerService === this.MyInfo.userInfo.name
          } else {
            return item
          }
        }
      })
      this.solveData = this.salesData.filter(item => {
        if (item.status === 'SOLVED') {
          if (roleName === 'After-salesAsst' && this.filterMe) {
            return item.customerService === this.MyInfo.userInfo.name
          } else {
            return item
          }
        }
      })
      // 已解决倒序
      this.solveData = this.solveData.sort((a, b) => {
        const t1 = new Date(a.createdAt).getTime()
        const t2 = new Date(b.createdAt).getTime()
        return t2 - t1
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
      // 是否筛选时间
      if (this.startTime) {
        // console.log(this.startTime, this.endTime)
        const localOffset = new Date().getTimezoneOffset() * 60000
        const startTime = new Date(this.startTime - localOffset).toISOString()
        const endTime = new Date(this.endTime - localOffset).toISOString()
        apiData.start = startTime
        apiData.end = endTime
      }
      // 是否月结
      if (this.checkMonthly === 'true') {
        apiData.monthlyStatement = true
      } else if (this.checkMonthly === 'false') {
        apiData.monthlyStatement = false
      } else if (this.checkMonthly === 'wait') {
        apiData.waitMonthlyStatement = true
      }
      apiSearchAfterSale(apiData).then(res => {
        if (res.status === 200) {
          // console.log(res.data)
          res.data.sort((a, b) => {
            const t1 = new Date(a.createdAt).getTime()
            const t2 = new Date(b.createdAt).getTime()
            return t1 - t2
          })
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
            case 'SEND':
              this.sendData = res.data
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
    changeTime (value) {
      this.startTime = value[0]
      this.endTime = value[1]
      this.onSearch()
      // this.startTime = moment(value[0]).format('YYYY-MM-DD')
      // this.endTime = moment(value[1]).format('YYYY-MM-DD')
      // console.log(moment(value[0]).format('YYYY-MM-DD HH:mm'))
      // console.log(moment(value[1]).format('YYYY-MM-DD HH:mm'))
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
          this.changeStatus = 'SEND'
          break
        case '5':
          this.changeStatus = 'WAIT_VISIT'
          break
        case '6':
          this.changeStatus = 'SOLVED'
          break
      }
    },
    delRepair (data) {
      // console.log(data)
      const delId = data.id
      apiDelAfterSale(delId).then(res => {
        if (res.status === 200) {
          this.$message.success('删除成功')
          this.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    changeMonthly () {
      this.onSearch()
    }
  },
  created () {
    this.$setPageDataLoader(this.getAfterSaleData)
  },
  mounted () {
    this.getUserList()
    const basicColumns = [
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
        title: '评估客服',
        dataIndex: 'customerService',
        key: 'customerService',
        align: 'center'
      },
      {
        title: '寄件内勤',
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
      }
    ]
    this.sendColumns = JSON.parse(JSON.stringify(basicColumns))
    this.sendColumns.push(
      {
        title: '操作',
        // width: '150px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
      }
    )
    this.comeColumns = JSON.parse(JSON.stringify(basicColumns))
    this.comeColumns.push(
      {
        title: '操作',
        width: '100px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
      }
    )
    // 已解决列
    this.solveColumns = JSON.parse(JSON.stringify(basicColumns))
    this.solveColumns.push(
      {
        title: '操作',
        width: '150px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
      }
    )
    // 查询工单
    this.getAfterSaleData()
    this.getMe()
  }
}
</script>
<style lang="scss" scoped>

</style>
