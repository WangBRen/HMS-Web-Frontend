<template>
  <div>
    <a-modal
      forceRender
      destroyOnClose
      :width="1200"
      :footer="null"
      :visible="openHealthvisible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :ok-button-props="{ style: { display: 'none' } }"
      :scroll="{ x: true }"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item>
                <a-input-search
                  placeholder="请输入关键字"
                  enter-button="查询"
                  :loading="confirmLoading"
                  v-model="wordValue"
                  @search="findCustomerHealthReports"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" />
            <a-col :md="4" :sm="24" :pull="1">
              <span class="table-page-search-submitButtons">
                <!-- <a-button type="primary">查询</a-button> -->
                <!-- <a-button type="primary " @click="handleFiltrateTitle">筛选</a-button> -->
                <a-button type="primary " @click="handOpenHealthAdd" style="margin-left: 8px">新建</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :columns="columns" :dataSource="dataSource" :rowKey="(record,index)=> index" :pagination="pagination">
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewingTheTeportForm(record)">查看报告单</a>
          <!-- <a-popconfirm title="你确定要删除吗" @confirm="confirm($event,action)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm> -->
        </span>
        <span slot="tags" slot-scope="text, record">
          <a-tag
            v-for="item in record.projects"
            :key="item"
            :color=" 'geekblue'"
          >{{ item }}</a-tag>
          <span v-if="record.symptom.length > 0">
            <a-tooltip placement="top">
              <template slot="title">
                {{ record.symptom }}
              </template>
              <a-tag :color=" 'orange'">用户症状</a-tag>
            </a-tooltip>
          </span>
          <span v-if="record.disease">
            <a-tooltip placement="top">
              <template slot="title">
                {{ record.disease.title }}
              </template>
              <a-tag :color=" 'volcano'">用户诊断</a-tag>
            </a-tooltip>
          </span>
        </span>
        <!-- <span slot="updatedAt" slot-scope="text, record">
          {{ record.updatedAt ? moment(record?.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '' }}
        </span> -->
      </a-table>
    </a-modal>
    <!-- <FiltersHealthDataTableHeadersVue
      ref="filterRef"
      :columns="dataColums"
      @ok="selectHealthTitleOk"
    />
    <AddHealthData ref="child" /> -->
    <HealthReportSee ref="seeReport" />
    <HealthReportAdd ref="addReport" @successCreatReport="RefreshReport"/>
  </div>
</template>
<script>
import moment from 'moment'
// import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
// import AddHealthData from './AddHealthData.vue'
import HealthReportSee from './HealthReportSee.vue'
import HealthReportAdd from './HealthReportAdd.vue'
import { getHealthReport as apiGetHealthReports, getHealthCustomerReport } from '@/api/health'
// import { getIndexColumns as apiGetIndexColumns } from '@/api/healthIndexes'

const dataSource = []

export default {
   components: {
    // FiltersHealthDataTableHeadersVue,
    // AddHealthData,
    HealthReportSee,
    HealthReportAdd
  },
  props: {
    openHealthvisible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      custId: '',
      userInfo: [], // 保存用户信息
      reportId: '',
      // eslint-disable-next-line no-undef
      dataSource,
      columns: [
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
          width: 260,
          customRender: (text, record, index) => {
            return record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
          }
        },
        {
          title: '创建人',
          dataIndex: 'createdBy',
          key: 'createdBy',
          align: 'center',
          width: 260,
          customRender: (text, record) => {
            return record.createdBy ? record.createdBy.nickname : ''
          }
        },
        {
          title: '健康项目名称',
          dataIndex: 'projects',
          key: 'projects',
          align: 'center',
          scopedSlots: { customRender: 'tags' },
          filters: [{ text: '用户诊断', value: 'disease' },
                    { text: '用户症状', value: 'symptom' },
                    { text: '其他指标', value: 'projects' }],
          onFilter: (value, record) => {
            if (value === 'disease' && record.disease !== null) { return true }
            if (value === 'symptom' && record.symptom.length > 0) { return true }
            if (value === 'projects' && record.projects.length !== 0) { return true }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 230
        }
      ],
      // dataColums: [],
      confirmLoading: false,
      filtersVisible: false,
      saveTableTitle: [],
      wordValue: '',
      pages: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  created () {
    if (this.custId) {
      this.findCustomerHealthReports()
    }
  },
  methods: {
    moment,
    setCustomerId (customersId, userInfo) {
      this.custId = customersId
      this.userInfo = userInfo
    },
    /**
     * 查找用户自己的指标
     */
    findCustomerHealthReports (value) {
      this.loadingShow = true
      // this.dataSource = []
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      apiGetHealthReports(this.custId, value, pages).then(res => {
      if (res.status === 200) {
        this.loadingShow = false
        this.dataSource = res.data.content || []
        this.pagination.total = res.data.totalElements
      } else {
        this.dataSource = []
      }
      // console.log('this.dataSource', this.dataSource)
      })
    },
    onPageChange (page, _pageSize) {
      this.pagination.current = page
      this.findCustomerHealthReports(this.wordValue)
    },
    onSizeChange (_current, pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.findCustomerHealthReports(this.wordValue)
    },
    // 点击了取消
    handleCancel () {
      this.$emit('handleCancel')
      this.filtersVisible = false
    },
    /**
     * 点开筛选表头
     */
    // handleFiltrateTitle () {
    //   this.filtersVisible = true
    //   this.$refs.filterRef.open(this.columns) // 伪双向绑定
    // },
    // /**
    //  * 确定筛选
    //  */
    // selectHealthTitleOk (selectColumns) {
    //   this.columns = selectColumns.filter(column => !column.hide).concat(this.actions)
    //   // console.log(selectColumns)
    // },
    // 新建报告单
    handOpenHealthAdd () {
      // 在这传custmoerId
      // const cusmId = '2'
      // console.log('???')
      const cusmId = this.custId
      const userInfo = this.userInfo
      // this.$refs.child.openModel()
      // this.$refs.child.AddHealthCom(cusmId) // 点击新建弹窗
      this.$refs.addReport.openAddModal(userInfo)
      this.$refs.addReport.openADDmodalCustId(cusmId)
    },
    // 查看报告单
    handleViewingTheTeportForm (data) {
      const cusmId = this.custId // 存customerId
      const reportId = data.id // 存reportId
      // console.log('cusmId', cusmId)
      // console.log('报告单', reportId)
      getHealthCustomerReport(cusmId, reportId).then((res) => {
        if (res.status === 200) {
          // console.log('接口查报告单', res.data)
          this.$refs.seeReport.openSeeModal()
          this.$refs.seeReport.seeReportCom(res.data)
        }
      })
    },
    // 创建报告单成功后刷新
    RefreshReport () {
      this.findCustomerHealthReports()
    }
  }
  // watch: {
	// 		// 监听,当路由从查看界面返回到全部界面时，获取缓存中的数据
	// 		$route: {
	// 			handler: function (val, oldVal) {
  //         console.log('val', val, 'oldval', oldVal)
	// 				if (val.name === '首页路由名称' && oldVal.name === '/health-reports/1/reports') {
	// 					this.getFair() // 调用获取数据的方法
	// 				}
	// 			}
	// 	}
  // }
}
</script>
