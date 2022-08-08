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
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <!-- <a-button type="primary">查询</a-button> -->
                <a-button type="primary " @click="handleFiltrateTitle">筛选</a-button>
                <a-button type="primary " @click="handOpenHealthAdd" style="margin-left: 8px">新建</a-button>
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
      :filtersVisible="filtersVisible"
      @handleCancel="handleCancel"
    />
    <AddHealthData ref="child" />
  </div>
</template>
<script>
import FiltersHealthDataTableHeadersVue from './FiltersHealthDataTableHeaders.vue'
import AddHealthData from './AddHealthData.vue'
import { getHealthReport } from '@/api/health'
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
      confirmLoading: false,
      filtersVisible: false
    }
  },
  created () {
  },
  methods: {
    // 点击了确定
    handleOk () {
      console.log('1111')
    },
    // 点击了取消
    handleCancel () {
      this.$emit('handleCancel')
      this.filtersVisible = false
    },
    /**
     * 筛选表头
     */
    handleFiltrateTitle () {
      console.log('11111')
      this.filtersVisible = true
    },
    async onSearch (value) {
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
      getHealthReport(custmoerId).then(res => {
        if (res.status === 200) {
          const report = res.data.content[4]
          // console.log(res.data.content[3])
          this.$refs.child.openModel()
          this.$refs.child.seeHealthCom(report)
        }
      })
      // console.log('data', data)
    }
  }
}
</script>
