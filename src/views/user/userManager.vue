<template>
  <a-card :bordered="false" class="search">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="家庭名称">
              <a-input placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button type="primary " style="margin-left: 8px">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      :rowClassName="setRowClassName"
      @expand="handleUnfold"
      :columns="columns"
      :data-source="data"
      class="tableContent">
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">新建用户</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑群组</a>
        <!-- <a @click="handleEdit(record)"> <a-tag color="#f50">删除</a-tag></a> -->
        <!-- <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">新建</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">编辑</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->
      </span>
      <a-table
        class="towTables"
        slot="expandedRowRender"
        slot-scope="inner"
        :columns="innerColumns"
        :data-source="inner.innerData"
        :pagination="false"
      >
        <span slot="operation" class="table-operation">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item>Action 1</a-menu-item>
              <a-menu-item>Action 2</a-menu-item>
            </a-menu>
            <a>
              More
              <a-icon type="down" />
            </a>
          </a-dropdown>
        </span>
      </a-table>
    </a-table>
  </a-card>
</template>
<script>
const columns = [
  { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  { title: '群组', dataIndex: 'homeName', key: 'homeName', align: 'center' },
  { title: '创建时间', dataIndex: 'time', key: 'time', align: 'center' },
  { title: '群主', dataIndex: 'groupOwner', key: 'groupOwner', align: 'center' },
  { title: '联系方式', dataIndex: 'phone', key: 'phone', align: 'center' },
  { title: '成员人数', dataIndex: 'num', key: 'num', align: 'center' },
  { title: '操作', dataIndex: '', key: 'x', align: 'center', scopedSlots: { customRender: 'action' } }
]

const data = [
  {
    key: 0,
    homeName: '李华的家庭',
    time: '2022-07-15',
    groupOwner: '李华',
    phone: '15994206754',
    num: '4',
    innerData: [
        {
          key: 11,
          name: '李明明',
          sex: '男',
          phone: 15994206754,
          time: '2022-07-15'
        }
      ]
  },
  {
    key: 1,
    homeName: '张三的家庭',
    time: '2022-07-15',
    groupOwner: '张三',
    phone: '15994206754',
    num: '4',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  },
  {
    key: 2,
    homeName: '王五的家庭',
    time: '2022-07-15',
    groupOwner: '王五',
    phone: '15994206754',
    num: '4',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  }
]

const innerColumns = [
  { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  { title: '名字', dataIndex: 'name', key: 'name', align: 'center' },
  { title: '性别', dataIndex: 'sex', key: 'sex', align: 'center' },
  { title: '手机号', dataIndex: 'phone', key: 'phone', align: 'center' },
  { title: '加入时间', dataIndex: 'time', key: 'hobby', align: 'center' },
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
      data,
      columns,
      innerColumns
    }
  },
  methods: {
    // setRowClassName (record, index) {
    //   console.log(index)
    //     return record.id === this.className ? 'actvs' : ''
    // },
    handleUnfold (expanded, record) {
      // var show = document.getElementsByClassName('.ant-table-row ant-table-row-level-0')
      var show = document.documentElement
        // this.setRowClassName(record, '0', expanded)
       document.body.style.background = '#CCC'
      console.log('展开啦', show, record)
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
.tableContent{
    text-align: center;
}
/* ::v-deep .tableContent .ant-table-thead > tr > th  {
      font-size: 1.3em;
      font-weight: bold;
}
::v-deep .towTables .ant-table-thead >tr >th{
      font-size: 1em;
      font-weight: bold;
} */
</style>

<style lang="less">
.actvs{
  background-color: #b9e1f8;
}
.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
  background:	#36648B!important;
}
.tableContent{
    .ant-table-thead > tr > th {
      background-color: #004d8c;
      color: #fff;
       font-size: 1.1em;
       font-weight: bold;
  }
  .ant-table{
    font-size: 18px;
  }
}
.towTables{
  // background-color: #b9e1f8;
  .ant-table-thead >tr > th {
      font-size: 1em;
      font-weight: bold;
 }
 .ant-table{
    font-size: 16px;
  }
// .ant-table-tbody .ant-table-row-level-0{
//     background: #054672!important;
// }
// .ant-table-tbody .ant-table-row-level-1{
//     background:#0F4D73!important;
// }
}
</style>
