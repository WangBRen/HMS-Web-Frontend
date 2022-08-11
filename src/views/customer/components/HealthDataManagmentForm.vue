<template>
  <div>
    <a-modal
      :maskClosable="false"
      :width="1200"
      :title="title"
      :visible="openHealthvisible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :ok-button-props="{ style: {display: 'none'} }"
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
                <a-button type="primary " @click="handleFiltrateTitle">筛选</a-button>
                <a-button type="primary " @click="handOpenHealthAdd" style="margin-left: 8px">新建</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="data" :rowKey="(record,index)=> index">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewingTheTeportForm(record)">查看报告单</a>
        </span>
      </a-table>
    </a-modal>
    <FiltersHealthDataTableHeadersVue
      ref="filterRef"
      :columns="dataColums"
      @ok="selectHealthTitleOk"
    />
    <AddHealthData ref="child" />
  </div>
</template>
<script>
import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
import AddHealthData from './AddHealthData.vue'
import { getHealthReport as apiGetHealthReports, getHealthCustomerReport } from '@/api/health'
import { getIndexColumns as apiGetIndexColumns } from '@/api/healthIndexes'

const data = []

export default {
   components: {
    FiltersHealthDataTableHeadersVue,
    AddHealthData
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
      data,
      columns: [],
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
      },
      actions: {
        title: '操作',
        dataIndex: 'action',
        key: 'x',
        align: 'center',
        fixed: 'right',
        width: 200,
        scopedSlots: { customRender: 'action' }
      }
    }
  },
  created () {
    this.onSearch()
  },
  methods: {
    async onSearch () {
      const resColumus = await apiGetIndexColumns()
      const totalColumns = (resColumus.data || []).map(column => {
        return { ...column, align: 'center' }
      })
      this.columns = totalColumns.filter(column => !column.hide).concat(this.actions)
      this.dataColums = (resColumus.data || []).map(column => {
        return { ...column, align: 'center' }
      })
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
       this.data = res.data.content || []
    },
    // 点击了取消
    handleCancel () {
      this.$emit('handleCancel')
      this.filtersVisible = false
    },
    /**
     * 点开筛选表头
     */
    handleFiltrateTitle () {
      this.filtersVisible = true
      this.$refs.filterRef.open(this.columns) // 伪双向绑定
    },
    /**
     * 确定筛选
     */
    selectHealthTitleOk (selectColumns) {
      this.columns = selectColumns.filter(column => !column.hide).concat(this.actions)
      // console.log(selectColumns)
    },
    // 新建报告单
    handOpenHealthAdd () {
      // 在这传custmoerId
      const cusmId = '2'
      this.$refs.child.openModel()
      this.$refs.child.AddHealthCom(cusmId) // 点击新建弹窗
    },
    // 查看报告单
    handleViewingTheTeportForm (data) {
      const cusmId = '2' // 存customerId
      const reportId = '5' // 存reportId
      console.log('cusmId', this.custId)
      console.log('报告单', data)
      getHealthCustomerReport(cusmId, reportId).then(res => {
        if (res.status === 200) {
          console.log('接口查', res.data)
          this.$refs.child.openModel()
          this.$refs.child.seeHealthCom(res.data)
        }
      })
    }
  }
}
</script>
