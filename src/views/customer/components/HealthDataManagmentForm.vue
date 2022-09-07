<template>
  <div>
    <a-modal
      forceRender
      :maskClosable="false"
      :width="1200"
      :title="title"
      :visible="openHealthvisible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :ok-button-props="{ style: {display: 'none'} }"
      :scroll="{ x: true }"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item >
                <a-input-search
                  placeholder="请输入关键字"
                  enter-button="查询"
                  :loading="confirmLoading"
                  @search="onSearch"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24"/>
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
      <a-table :columns="columns" :dataSource="dataSource" :rowKey="(record,index)=> index">
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewingTheTeportForm(record)">查看报告单</a>
        </span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color=" 'geekblue'"
          >{{ tag }}</a-tag>
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
    <!-- <AddHealthData ref="child" /> -->
    <HealthReportSee ref="seeReport" />
    <HealthReportAdd ref="addReport" />
  </div>
</template>
<script>
import moment from 'moment'
import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
// import AddHealthData from './AddHealthData.vue'
import HealthReportSee from './HealthReportSee.vue'
import HealthReportAdd from './HealthReportAdd.vue'
import { getHealthReport as apiGetHealthReports, getHealthCustomerReport } from '@/api/health'
import { getIndexColumns as apiGetIndexColumns } from '@/api/healthIndexes'

const dataSource = []

export default {
   components: {
    FiltersHealthDataTableHeadersVue,
    // AddHealthData,
    HealthReportSee,
    HealthReportAdd
  },
  props: {
    openHealthvisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      custId: '',
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
            title: '健康项目名称',
            dataIndex: 'projects',
            key: 'projects',
            align: 'center',
            scopedSlots: { customRender: 'tags' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' },
            width: 260
          }
      ],
      dataColums: [],
      confirmLoading: false,
      filtersVisible: false,
      saveTableTitle: [],
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
    this.onSearch()
  },
  methods: {
    moment,
    async onSearch () {
      const resColumus = await apiGetIndexColumns()
      // const totalColumns = (resColumus.data || []).map(column => {
      //   return { ...column, align: 'center', scopedSlots: { customRender: column.dataIndex } }
      // })
      // this.columns = totalColumns.filter(column => !column.hide).concat(this.actions)
      this.dataColums = (resColumus.data || []).map(column => {
        return { ...column, align: 'center', scopedSlots: { customRender: column.dataIndex } }
      })
      console.log('this.dataColums', this.dataColums)
    },
    /**
     * 查找用户自己的指标
     */
    async findCustomerHealthReports (customersId) {
      this.custId = customersId
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      const res = await apiGetHealthReports(customersId, pages)
       this.dataSource = res.data.content || []
       console.log('this.dataSource', this.dataSource)
    },
    // 点击了取消
    handleCancel () {
      this.$emit('handleCancel')
      this.filtersVisible = false
      this.dataSource = []
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
      // this.$refs.child.openModel()
      // this.$refs.child.AddHealthCom(cusmId) // 点击新建弹窗
      this.$refs.addReport.openAddModal()
      this.$refs.addReport.openADDmodalCustId(cusmId)
    },
    // 查看报告单
    handleViewingTheTeportForm (data) {
      const cusmId = this.custId // 存customerId
      const reportId = data.id // 存reportId
      // console.log('cusmId', cusmId)
      // console.log('报告单', reportId)
      getHealthCustomerReport(cusmId, reportId).then(res => {
        if (res.status === 200) {
          // console.log('接口查报告单', res.data)
          this.$refs.seeReport.openSeeModal()
          this.$refs.seeReport.seeReportCom(res.data)
        }
      })
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
