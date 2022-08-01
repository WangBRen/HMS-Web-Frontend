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
    <a-modal
      destroyOnClose
      :width="1200"
      title="健康指标"
      :visible="filtersVisible"
      :confirm-loading="confirmLoading"
      @ok="selectHealthTitleOk"
      @cancel="selectHealthTitleCancel"
    >
      <FiltersHealthDataTableHeadersVue
        @filterTitlie="filterTitlie"
        :filtersVisible="filtersVisible"
        @handleCancel="handleCancel"
        ref="filterRef"
      />
    </a-modal>
  </div>
</template>
<script>
import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
import { gethealthIndexes as apiGethealthIndexes } from '@/api/healthIndexes'
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
      saveTableTitle: []
    }
  },
  created () {
    this.onSearch()
  },
  methods: {
    async onSearch () {
      const res = await apiGethealthIndexes()
      const datas = (res.data || []).map(item => item.items).flat().map(col => {
        return {
          key: col.name,
          name: col.name,
          dataIndex: col.name,
          align: 'center'
        }
      })
      console.log(datas)
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
      // this.$refs.filterRef.open()
      // this.$refs.filterRef.onSearch()
    },
    /**
     * 确定筛选
     */
    selectHealthTitleOk (sTableTitle) {
      this.filtersVisible = false
      this.$refs.filterRef.handleOk()
      this.saveTableTitle = sTableTitle
    },
    /**
     *取消筛选
     */
    selectHealthTitleCancel () {
      this.filtersVisible = false
    },
    filterTitlie (data) {
     console.log(data)
     const c = data
     const a = columns.filter(item =>
        c.includes(item.title)
      )
     this.columns = info.concat(a).concat({
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
