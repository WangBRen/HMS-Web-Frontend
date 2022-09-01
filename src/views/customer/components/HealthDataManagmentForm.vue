<template>
  <div>
    <a-modal
      forceRender
      destroyOnClose
      :maskClosable="false"
      :width="1200"
      :title="title"
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
                  @search="onSearch"
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
      <a-table :columns="columnsData" :dataSource="dataSource" :rowKey="(record,index)=> index" bordered>
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewingTheTeportForm(record)">查看报告单</a>
          <!-- <a-popconfirm title="你确定要删除吗" @confirm="confirm($event,action)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm> -->
        </span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === '个人基础信息' ? 'geekblue' : tag.length > 7 ? 'volcano' : 'green'"
          >{{ tag }}</a-tag>
        </span>
      </a-table>
    </a-modal>
    <!-- <FiltersHealthDataTableHeadersVue ref="filterRef" :columns="dataColums" @ok="selectHealthTitleOk" /> -->
    <AddHealthData ref="child" />
  </div>
</template>
<script>
import moment from 'moment'
import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
import AddHealthData from './AddHealthData.vue'
import { getHealthReport as apiGetHealthReports, getHealthCustomerReport } from '@/api/health'
// import { getIndexColumns as apiGetIndexColumns } from '@/api/healthIndexes'

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
    customerId: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      custId: '',
      reportId: '',
      data,
      columnsData: [
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
          width: 200,
          customRender: (text, record, index) => record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          title: '健康项目名称',
          dataIndex: 'projects',
          align: 'center',
          key: 'id',
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: '操作',
          // dataIndex: 'Operation',
          key: 'Operation',
          align: 'center',
          width: 250,
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      dataItem: [],
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
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  mounted () {
    this.onSearch(this.props.customersId)
  },
  methods: {
    moment,
    async onSearch (customersId) {
      this.custId = customersId
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      this.dataSource = []
      const res = await apiGetHealthReports(customersId, pages)
      this.dataSource = res.data.content || []
      // for (var key in this.dataSource) {
      //   console.log(key)
      //   console.log(this.dataSource[key].indexes)
      //   this.dataItem.push(key)
      // }
      // for (const key in this.dataSource) {
      //   this.dataItem(key).name = key
      //   console.log('dataItem(key).name', this.dataItem(key))
      // }
    },
    // 点击了取消
    handleCancel () {
      this.$emit('handleCancel')
      this.filtersVisible = false
    },
    /**
     * 点开筛选表头
     */
    // handleFiltrateTitle() {
    //   this.filtersVisible = true
    //   this.$refs.filterRef.open(this.columns) // 伪双向绑定
    // },
    /**
     * 确定筛选
     */
    // selectHealthTitleOk(selectColumns) {
    //   this.columns = selectColumns.filter((column) => !column.hide).concat(this.actions)
    //   // console.log(selectColumns)
    // },
    // 新建报告单
    handOpenHealthAdd () {
      // 在这传custmoerId
      // const cusmId = '2'
      const cusmId = this.custId
      this.$refs.child.openModel()
      this.$refs.child.AddHealthCom(cusmId) // 点击新建弹窗
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
          this.$refs.child.openModel()
          this.$refs.child.seeHealthCom(res.data)
        }
      })
    }
  }
}
</script>
