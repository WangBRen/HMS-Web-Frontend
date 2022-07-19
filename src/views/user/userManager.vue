<template>
  <a-card :bordered="false" class="search">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item >
              <a-input-search
                placeholder="请输入关键字"
                enter-button="查询"
                :loading="loadingShow"
                @search="onSearch"
              />
            </a-form-item>
          </a-col>
          <a-col :md="13" :sm="24"/>
          <a-col :md="3" :sm="24">
            <span class="table-page-search-submitButtons">
              <!-- <a-button type="primary">查询</a-button> -->
              <a-button type="primary " style="margin-left: 8px">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="table-content">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">新建用户</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑群组</a>
      </span>
      <a-table
        class="child-table"
        slot="expandedRowRender"
        slot-scope="inner"
        :columns="innerColumns"
        :data-source="inner.members"
        :pagination="false"
      >
        <span slot="operation" class="table-operation">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item>编辑用户信息</a-menu-item>
              <a-menu-item>移除用户</a-menu-item>
            </a-menu>
            <a>
              更多
              <a-icon type="down" />
            </a>
          </a-dropdown>
        </span>
      </a-table>
    </a-table>
  </a-card>
</template>
<script>
import { customerSearch } from '@/api/customer'
import moment from 'moment'

const columns = [
  { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  { title: '群名', dataIndex: 'name', key: 'name', align: 'center' },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
    customRender: (text, record, index) => {
    return record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
  }
 },
  { title: '群主', dataIndex: 'manager.nickname', key: 'manager.nickname', align: 'center' },
  { title: '联系方式', dataIndex: 'manager.telephone', key: 'manager.telephone', align: 'center' },
  { title: '成员人数', dataIndex: 'members.length', key: 'members.length', align: 'center' },
  { title: '操作', dataIndex: '', key: 'x', align: 'center', scopedSlots: { customRender: 'action' } }
]

const innerColumns = [
  { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  { title: '名字', dataIndex: 'member.nickname', key: 'member.nickname', align: 'center' },
  { title: '手机号', dataIndex: 'member.account', key: 'member.account', align: 'center' },
  {
      title: '加入时间',
      dataIndex: 'member.createdAt',
      key: 'member.createdAt',
      align: 'center',
      customRender: (text, record, index) => {
        return record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
]
export default {
  data () {
    return {
      loadingShow: true,
      data: [],
      columns,
      innerColumns,
      pages: {
        page: 1,
        size: 10
      }
    }
  },
  created () {
    this.onSearch()
  },
  methods: {
    async onSearch (value) {
      console.log(value)
       await customerSearch(value, this.pages).then(res => {
        if (res.status === 200) {
          this.loadingShow = false
          this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
        }
        console.log(res)
      })
    }
  }
}
</script>
<style scoped>
.table-page-search-wrapper{
  margin:  0 auto;
}
.search{
  text-align: center;
}
</style>

<style lang="less">
.actvs{
  background-color: #b9e1f8;
}
.table-content tr.ant-table-expanded-row {
  background: #54a3ed !important;
}

.child-table {
  background: white;
}
.child-table th {
  line-height: 24px;
  padding: 4px 16px !important;
}
.child-table td {
  line-height: 24px;
  padding: 4px 16px !important;
}
</style>
