<template>
  <div>
    <a-modal
      :maskClosable="false"
      :width="1200"
      :title="title"
      :visible="openHealthvisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
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
      @selectHealthTitleCancel="selectHealthTitleCancel"
      :filtersVisible="filtersVisible"
      @handleCancel="handleCancel"
      :saveTableTitle="saveTableTitle"
      :dataColums="dataColums"
      @parseColumns="parseColumns"
    />
    <AddHealthData ref="child" />
  </div>
</template>
<script>
import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
import AddHealthData from './AddHealthData.vue'
import { getHealthReport as apiGethealthReports } from '@/api/health'
import { getHealthIndexes as apiGethealthIndexes } from '@/api/healthIndexes'
const columns = [
  {
    title: '检验号',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    width: 100,
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 100,
    scopedSlots: { customRender: 'name' },
    align: 'center'
  },
  {
    title: '疟原虫抗体和抗原',
    dataIndex: 'age',
    key: 'age',
    align: 'center'
  },
  {
    title: '人类免疫缺陷病毒抗体',
    dataIndex: 'address',
    key: 'address 1',
    align: 'center'
  },
  {
    title: '遗传筛查',
    dataIndex: 'address',
    key: 'address 2',
    align: 'center'
  },
  {
    title: '唾液肌酐',
    dataIndex: 'address',
    key: 'address 3',
    align: 'center'
  },
  {
    title: '99Tcm-DTPA肺上皮细胞通透性测定',
    dataIndex: 'address',
    key: 'address 4',
    align: 'center'
  },
  { title: '操作',
    dataIndex: 'action',
    key: 'x',
    align: 'center',
    fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

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
      data,
      columns,
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
    // 过滤表头
    parseColumns () {
      const userDefinedColumns = this.dataColums || []
      const hideIndexes = JSON.parse(window.localStorage.getItem('selectTitle')) || []
      console.log(hideIndexes)
      hideIndexes.filter(item => { return item.id })
      this.columns = userDefinedColumns.filter(column => hideIndexes.includes(column.dataIndex)).concat(this.actions)
      window.localStorage.setItem('columns', JSON.stringify(this.columns) || [])
    },
    async onSearch () {
      const res = await apiGethealthIndexes()
      const datas = (res.data || []).map(item => item.items).flat().map(col => {
        const field = 'field_' + col.id
        return {
          title: col.name,
          key: col.id,
          dataIndex: field + '.value',
          align: 'center',
          scopedSlots: { customRender: field + '.value' }
          // customRender: (text, record) => {
          //   console.log(record[field])
          //   // return text
          //   // return `${text.value}(${text.result})`
          // }
        }
      }).concat(this.actions)
      this.dataColums = datas
      this.columns = datas
      window.localStorage.setItem('columns', columns)
    },
    /**
     * 查找用户自己的指标
     */
    async findCustomerHealthReports (customersId) {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      const res = await apiGethealthReports(customersId, pages)
      console.log(res)
      const items = (res.data.content || [])
        .map(record => record.projects).flat().map(project => {
          return (project.items || []).map(item => {
            return { ...item, projectId: project.id, projectName: project.indexProjectName }
          }).reduce((acc, item) => {
            const key = 'field_' + item.healthIndexItem.id
            acc[key] = item
            return acc
          }, {})
        })
      this.data = items
    },
    /**
     * 点击了确定
     */
    handleOk () {
      console.log('1111')
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
    selectHealthTitleOk () {
      this.filtersVisible = false
      this.$refs.filterRef.handleOk()
    },
    // 新建报告单
    handOpenHealthAdd () {
      this.$refs.child.openModel()
      // 在这传custmoerId
      const cusmId = 50
      this.$refs.child.AddHealthCom(cusmId) // 点击新建弹窗
    },
    // 查看报告单
    handleViewingTheTeportForm (data) {
      const custmoerId = 50
      apiGethealthReports(custmoerId).then(res => {
        if (res.status === 200) {
          const report = res.data.content[4]
          // console.log(res.data.content[3])
          this.$refs.child.openModel()
          this.$refs.child.seeHealthCom(report)
        }
      })
    },
      // console.log('data', data)
    /**
     * 子组件传过来的列名
     */
    selectHealthTitles (sTableTitle) {
      console.log('子组件传过来的列名', sTableTitle)
      this.saveTableTitle = sTableTitle
      this.filterTitlie() // 调用过滤方法
    },
    /**
     *取消筛选
     */
    selectHealthTitleCancel () {
      this.filtersVisible = false
    }
  }
}
</script>
