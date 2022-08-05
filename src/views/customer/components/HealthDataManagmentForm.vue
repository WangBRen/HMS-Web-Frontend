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
                <a-button type="primary " style="margin-left: 12px">新建</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="data">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewingTheTeportForm(record)">查看报告单</a>
        </span>
      </a-table>
    </a-modal>
    <FiltersHealthDataTableHeadersVue
      ref="filterRef"
      @selectHealthTitleCancel="selectHealthTitleCancel"
      @filterTitlie="filterTitlie"
      :filtersVisible="filtersVisible"
      @handleCancel="handleCancel"
      :saveTableTitle="saveTableTitle"
    />
  </div>
</template>
<script>
import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
import { gethealthIndexes as apiGethealthIndexes } from '@/api/healthIndexes'
import { gethealthReports as apiGethealthReports } from '@/api/customer'
const info = [
  {
    title: '头像',
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
  }
]
const columns = [
   {
    title: '头像',
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
    title: '舒张压',
    dataIndex: 'age',
    key: 'age',
    align: 'center'
  },
  {
    title: '收缩压',
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

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

export default {
   components: {
    FiltersHealthDataTableHeadersVue
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
      info,
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
      }).concat({
        title: '操作',
        dataIndex: 'action',
        key: 'x',
        align: 'center',
        fixed: 'right',
        width: 200,
        scopedSlots: { customRender: 'action' }
      })
      this.columns = datas
      console.log('columns', datas)
    },
    /**
     * 查找用户自己的指标
     */
    async findCustomerHealthReports (customersId) {
      console.log('查找', customersId)
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
            // const key = item.projectName + '-' + item.healthIndexItem.name
            const key = 'field_' + item.healthIndexItem.id
            acc[key] = item
            return acc
          }, {})
        })
      this.data = items
      // .map(projects => projects.items).flat().map(item => {
      //   return {
      //     key: item.healthIndexItem.id,
      //     name: item.healthIndexItem.name,
      //     dataIndex: item.healthIndexItem.id,
      //     align: 'center'
      //   }
      // })
      console.log('==================>:', items)
    },
    /**
     * 点击了确定
     */
    handleOk () {
      console.log('1111')
    },
    /**
     * 点击了取消
     */
    handleCancel () {
      this.$emit('handleCancel')
      this.filtersVisible = false
    },
    /**
     * 点开筛选表头
     */
    handleFiltrateTitle () {
      this.filtersVisible = true
      this.$refs.filterRef.open() // 伪双向绑定
      // // this.$refs.filterRef.onSearch()
      // console.log(this.$refs.filterRef.open())
    },
    /**
     * 确定筛选
     */
    selectHealthTitleOk () {
      this.filtersVisible = false
      this.$refs.filterRef.handleOk()
    },
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
    },
    /**
     * @param {过滤表头}
     */
    filterTitlie () {
     const titles = this.saveTableTitle
     console.log(titles)
     const dataSource = columns.filter(item =>
        titles.includes(item.title)
      )
     this.columns = info.concat(dataSource).concat({
        title: '操作',
        dataIndex: 'action',
        key: 'x',
        align: 'center',
        fixed: 'right',
        width: 200,
        scopedSlots: { customRender: 'action' }
      })
    }
  }
}
</script>
