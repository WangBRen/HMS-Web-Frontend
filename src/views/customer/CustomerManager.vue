<template>
  <div>
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
                <a-button type="primary " style="margin-left: 8px" @click="handleOpen">新建</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        :rowKey="(record,index)=>{return index}"
        :columns="columns"
        @expand="selectGroup"
        :data-source="data"
        class="table-content"
        :pagination="pagination"
        expandRowByClick
      >
        <span slot="action" slot-scope="text, grecord">
          <a @click="handleAdd(grecord)">新增用户</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(grecord)">添加用户</a>
        </span>
        <!-- <span slot="action" slot-scope="text, grecord">
          <a @click="handleEdit(grecord)">添加用户</a>
        </span> -->
        <span slot="avatar" slot-scope="text, grecord">
          <a-avatar size="large" icon="user" :src="grecord.avatar"/>
        </span>
        <a-table
          bordered
          :rowKey="(record,index)=>{return index}"
          class="child-table"
          slot="expandedRowRender"
          slot-scope="inner"
          :columns="innerColumns"
          :data-source="inner.members"
          :pagination="false"
        >
          <span slot="healthStatus" slot-scope="text, record">
            <!-- {{ record.member.healthStatus }} -->
            <a-tag v-for="tag in record.member.healthStatus" :key="tag">
              {{ tag | filterHealthStatus }}
            </a-tag>
          </span>
          <span slot="cavatar" slot-scope="text, record">
            <a-avatar :src="record.member.avatar" icon="user"/>
          </span>
          <span slot="operation" slot-scope="text, record">
            <a @click="handleHealthData(record)">健康信息</a>
            <a-divider type="vertical" />
            <a @click="chronicInfo(record)">慢病管理</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="editUser(inner, record)">编辑</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    v-if="data.length"
                    title="是否移除该用户？"
                    @confirm="() => removeCustomer(inner, record)"
                  >
                    <a href="javascript:;">移除用户</a>
                  </a-popconfirm>
                </a-menu-item>
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
    <Customer-InfoForm :dataTypes="dataTypes" ref="child"/>
    <EditUserMsg ref="editUserRef" @onSearch="onSearch"/>
    <!-- 群组管理 -->
    <AddNewUserVue
      :key="openKey"
      @onSearch="onSearch"
      @handleCancel="handleCancel"
      :visible="visible"
      :checkedRowKeys="checkedRowKeys"
      :title="title"
      :selectId="selectId"
      ref="addUserRef"
    />
    <!-- 查看健康信息 -->
    <HealthDataManagmentFormVue
      :openHealthvisible="openHealthvisible"
      @handleCancel="handleCancel"
      :customerId="currentCustomerId"
      ref="healthDataManagmentRef"
    />
    <!-- 新的慢病 -->
    <ChronicInformation ref="ChronicInfoRef"/>
  </div>
</template>
<script>
import { searchCustomerUnderGroup as apiCustomerSearch, removeCustomerGroup as apiRemoveCustomerGroup } from '@/api/customer'
import moment from 'moment'
import ChronicInformation from './components/ChronicInformation.vue'
import CustomerInfoForm from './components/CustomerInfoForm.vue'
import EditUserMsg from './components/EditUserMsg.vue'
import AddNewUserVue from './components/AddNewUser.vue'
import HealthDataManagmentFormVue from './components/HealthDataManagmentForm.vue'

const columns = [
  // { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  { title: '头像', dataIndex: 'avatar', key: 'avatar', scopedSlots: { customRender: 'avatar' }, align: 'center' },
  { title: '群组名称', dataIndex: 'name', key: 'name', align: 'center' },
  { title: '管理员', dataIndex: 'manager.baseInfo.name', key: 'manager.baseInfo.name', align: 'center' },
  { title: '联系方式', dataIndex: 'manager.telephone', key: 'manager.telephone', align: 'center' },
  { title: '成员人数', dataIndex: 'members.length', key: 'members.length', align: 'center' },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
    customRender: (text, record, index) => record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  { title: '操作', dataIndex: '', key: 'operation', align: 'center', scopedSlots: { customRender: 'action' } }
]

const innerColumns = [
  // { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  { title: '头像', dataIndex: 'member.avatar', key: 'member.avatar', scopedSlots: { customRender: 'cavatar' }, align: 'center' },
  { title: '名字', dataIndex: 'member.baseInfo.name', key: 'member.baseInfo.name', align: 'center' },
  { title: '手机号', dataIndex: 'member.telephone', key: 'member.telephone', align: 'center' },
  { title: '健康状态', dataIndex: 'member.healthStatus', key: 'member.healthStatus', scopedSlots: { customRender: 'healthStatus' }, align: 'center' },
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
   components: {
    CustomerInfoForm,
    AddNewUserVue,
    HealthDataManagmentFormVue,
    EditUserMsg,
    ChronicInformation
  },
  filters: {
    filterHealthStatus: function (value) {
      // console.log(value)
      if (value) {
        if (value === null) {
          return null
        } else if (value === 'normal') {
          return '正常'
        } else if (value === 'suspect') {
          return '存在疑似'
        } else if (value === 'diagnosed') {
          return '全部确诊'
        } else if (value === 'hospitalized') {
          return '住院'
        } else if (value === 'processing') {
          return '慢病管理中'
        } else if (value === 'suspend') {
          return '暂停'
        } else if (value === 'withdraw') {
          return '退出'
        }
      }
    }
  },
  data () {
    return {
      dataTypes: {},
      loadingShow: true,
      data: [],
      columns,
      innerColumns,
      visible: false,
      pages: {},
      title: '',
      selectId: -1,
      selectGroupId: '',
      checkedRowKeys: [],
      openKey: 0, // 为了重新渲染子组件
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个群组`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      openHealthvisible: false,
      // 健康报告列表
      currentCustomerId: -1
    }
  },
  created () {
    this.$setPageDataLoader(this.onSearch)
    this.onSearch()
  },
  methods: {
    editUser (inner, userData) {
      const groupId = inner.id
      this.$refs.editUserRef.openModel()
      this.$refs.editUserRef.getUserData(groupId, userData)
      // console.log('编辑用户', userData)
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
       this.onSearch()
    },
    onSizeChange (current, pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.onSearch()
    },
    handleHealthData (record) {
      this.currentCustomerId = record.member.id
      this.openHealthvisible = true
      this.$refs.healthDataManagmentRef.setCustomerId(record.member.id)
      this.$refs.healthDataManagmentRef.findCustomerHealthReports()
    },
    // 点击新的慢病
    chronicInfo (record) {
      this.$refs.ChronicInfoRef.openChronicInfo(record.member.id, record.member.baseInfo)
    },

    /**
     * 取消按钮
     * @param {e} e
     */
    handleCancel (e) {
      this.visible = false
      this.openHealthvisible = false
    },
    handleOpen () {
      // console.log('弹窗')
      this.$refs.child.openModel()
      this.$refs.child.addComponent()
    },
    handleEdit (record, value) {
      this.selectId = record.id
      this.visible = true
      this.addtitle = '添加用户'
      this.$refs.addUserRef.onSearch()
      this.openKey++
      this.checkedRowKeys = []
    },
    handleAdd (grecord) {
      this.$refs.child.openModel()
      this.dataTypes.data = JSON.parse(JSON.stringify(grecord))
      this.$refs.child.initComponent(this.dataTypes.data)
      // console.log('???', JSON.parse(JSON.stringify(grecord)))
    },
    onSearch (value) {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      apiCustomerSearch(value, pages).then(res => {
        if (res.status === 200) {
          this.loadingShow = false
          this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
          this.pagination.total = res.data.totalElements
        }
      })
    },
    selectGroup (expanded, record) {
      this.selectGroupId = record.id
    },
    removeCustomer (inner, record) {
      const that = this
      const cId = record.member.id
      const gId = inner.id
      apiRemoveCustomerGroup(gId, cId).then(res => {
        if (res.status === 200) {
          that.$message.success('移除成功')
          that.onSearch()
        } else {
          that.$message.error(res.message || '移除失败')
        }
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
  background: #E9E9E9 !important;
}

.child-table {
  background: white;
}
.child-table th {
  line-height: 24px;
  padding: 4px 16px !important;
  font-weight: bold;
  background: #F2F2F2;
}
.child-table td {
  line-height: 24px;
  padding: 4px 16px !important;
}
</style>
