<template>
  <div>
    <a-card :bordered="false" class="search">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row>
            <a-col :span="8">
              <a-input-search
                placeholder="请输入关键字"
                enter-button="查询"
                :loading="loadingShow"
                @search="onQuery"
                v-model="queryData"
              />
            </a-col>
            <a-col :span="4" style="line-height:32px;">
              <a-checkbox @change="checkDuty">
                我的用户
              </a-checkbox>
            </a-col>
            <a-col :span="3" :offset="9">
              <span class="">
                <a-button type="primary " style="margin-left: 8px;float: right;" @click="handleOpen">新建家庭</a-button>
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
        <span slot="createdBy" slot-scope="record">
          <span v-if="record.createdBy">
            <span v-if="record.createdBy.userInfo">{{ record.createdBy.userInfo.name }}</span>
            <span v-else>{{ record.createdBy.nickname }}</span>
          </span>
          <span v-else>---</span>
        </span>
        <span slot="action" slot-scope="text, grecord">
          <a @click="handleAdd(grecord)">新增成员</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(grecord)">添加成员</a>
        </span>
        <!-- <span slot="action" slot-scope="text, grecord">
          <a @click="handleEdit(grecord)">添加用户</a>
        </span> -->
        <!-- <span slot="avatar" slot-scope="text, grecord">
          <a-avatar size="large" icon="user" :src="grecord.avatar"/>
        </span> -->
        <a-table
          :rowKey="(record,index)=>{return index}"
          class="child-table"
          slot="expandedRowRender"
          slot-scope="inner"
          :columns="innerColumns"
          :data-source="inner.members"
          :pagination="false"
          :customRow="rowClick"
        >
          <span slot="baseInfoName" slot-scope="text, record">
            <a v-if="record.member.nickname" @click.stop="seeUser(record)">{{ record.member.nickname || '---' }}</a>
            <a v-else @click.stop="seeUser(record)">---</a>
          </span>
          <span slot="healthStatus" slot-scope="text, record">
            <!-- {{ record.member.healthStatus }} -->
            <a-tag v-for="tag in record.member.healthStatus" :key="tag">
              {{ tag | filterHealthStatus }}
            </a-tag>
          </span>
          <span slot="healthlevel" slot-scope="text, record">
            <a-tag v-for="tag in record.member.diseases" :key="tag.id">
              <span>{{ tag.name }}</span>
              <span v-if="tag.level!==null">:{{ tag.level }}级</span>
            </a-tag>
          </span>
          <span slot="cavatar" slot-scope="text, record">
            <a-avatar :src="record.member.avatar" icon="user"/>
          </span>
          <span slot="operation" slot-scope="text, record">
            <!-- <a @click="seeUser(record)">个人信息</a>
            <a-divider type="vertical" /> -->
            <a @click.stop="handleHealthData(record)">健康信息</a>
            <a-divider type="vertical" />
            <!-- <a @click="chronicInfo(record)">慢病管理</a>
            <a-divider type="vertical" /> -->
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
              <a @click.stop="e => e.preventDefault()">
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
      v-if="visible"
      :checkedRowKeys="checkedRowKeys"
      :selectId="selectId"
    />
    <!-- 查看健康信息 -->
    <HealthDataManagmentFormVue
      v-if="openHealthvisible"
      :healthIndex="healthIndex"
      :userInfo="currentuserInfo"
      :openHealthvisible="openHealthvisible"
      @handleCancel="handleCancel"
      :customerId="currentCustomerId"
    />
    <!-- 新的慢病 -->
    <ChronicInformation
      v-if="chronicList.visible"
      :custId="chronicList.custId"
      :baseInfo="chronicList.baseInfo"
      :chronicVisible="chronicList.visible"
      @onclose="closeChronicModal"/>
    <SeeUserMsg
      v-if="seeVisible"
      :seeVisible="seeVisible"
      :seeData="seeData"
      @closeSeeModal="closeSeeModal"
      :customerId="healthCustomerId"
    />
  </div>
</template>
<script>
import { searchCustomerUnderGroup as apiCustomerSearch, removeCustomerGroup as apiRemoveCustomerGroup } from '@/api/customer'
import { getUserInfo as apiGetUserInfo } from '@/api/login'
import { getHealthIndex } from '@/api/health'
import moment from 'moment'
import ChronicInformation from './components/ChronicInformation.vue'
import CustomerInfoForm from './components/CustomerInfoForm.vue'
import EditUserMsg from './components/EditUserMsg.vue'
import AddNewUserVue from './components/AddNewUser.vue'
import HealthDataManagmentFormVue from './components/HealthDataManagmentForm.vue'
import SeeUserMsg from './components/SeeUserMsg.vue'

const columns = [
  // { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  // { title: '头像', dataIndex: 'avatar', key: 'avatar', scopedSlots: { customRender: 'avatar' }, align: 'center' },
  {
    title: '家庭名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    customRender: (text, record) => {
      return text || record.manager.nickname + '的家庭'
    },
    sorter: (a, b) => {
      if (a.name === null || b.name === null) {
        return a.manager.nickname.localeCompare(b.manager.nickname)
      } else a.name.localeCompare(b.name)
    }
  },
  { title: '管理员', dataIndex: 'manager.userInfo.name', key: 'manager.userInfo.name', align: 'center' },
  {
    title: '创建者',
    scopedSlots: { customRender: 'createdBy' },
    align: 'center'
  },
  { title: '成员数', dataIndex: 'members.length', key: 'members.length', align: 'center', width: 100, sorter: (a, b) => a.members.length - b.members.length },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
    customRender: (text, record, index) => record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
    sorter: (a, b) => Date.parse(a.createdAt.toString()) - Date.parse(b.createdAt.toString())
  },
  { title: '操作', dataIndex: '', key: 'operation', align: 'center', scopedSlots: { customRender: 'action' }, width: 170 }
]

const innerColumns = [
  // { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  { title: '头像', dataIndex: 'member.avatar', key: 'member.avatar', scopedSlots: { customRender: 'cavatar' }, align: 'center' },
  { title: '名字', dataIndex: 'member.baseInfo.name', key: 'member.baseInfo.name', scopedSlots: { customRender: 'baseInfoName' }, align: 'center' },
  { title: '手机号', dataIndex: 'member.telephone', key: 'member.telephone', align: 'center' },
  { title: '健康状态', dataIndex: 'member.healthStatus', key: 'member.healthStatus', scopedSlots: { customRender: 'healthStatus' }, align: 'center' },
  { title: '慢病等级', dataIndex: 'member.level', key: 'member.level', scopedSlots: { customRender: 'healthlevel' }, align: 'center' },
  {
    title: '加入时间',
    dataIndex: 'member.createdAt',
    key: 'member.createdAt',
    align: 'center',
    customRender: (text, record, index) => {
      return record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    width: '160px'
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
    ChronicInformation,
    SeeUserMsg
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
      currentuserInfo: {},
      seeData: null,
      seeVisible: false,
      dataTypes: {},
      loadingShow: true,
      data: [],
      columns,
      innerColumns,
      visible: false,
      pages: {},
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
      currentCustomerId: -1,
      healthCustomerId: -1,
      chronicList: {
        custId: null,
        baseInfo: {},
        visible: false
      },
      dutyIndex: false,
      loginName: null,
      queryData: '',
      healthIndex: [],
      groupId: null
    }
  },
  created () {
    this.groupId = this.$route.query.id
    this.$setPageDataLoader(this.onSearch)
    this.onSearch()
    getHealthIndex().then(res => {
      if (res.status === 200) {
        this.healthIndex = res.data
        // console.log('总指标', this.healthIndex)
      }
    })
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
      this.currentuserInfo = record.member
      this.openHealthvisible = true
    },
    rowClick (record) {
      return {
        on: {
          click: () => {
            // console.log('点击', record)
            this.chronicInfo(record)
          }
        }
      }
    },
    // 点击新的慢病
    chronicInfo (record) {
      this.chronicList.custId = record.member.id
      this.chronicList.baseInfo = record.member.baseInfo
      this.chronicList.visible = true
      // this.$refs.ChronicInfoRef.openChronicInfo(record.member.id, record.member.baseInfo)
    },
    // 关闭慢病弹窗
    closeChronicModal () {
      this.chronicList.custId = -1
      this.chronicList.visible = false
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
      // 判断是否属于自己管理
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      if (this.dutyIndex) {
        pages.createdBy = this.loginName
      } else {
        pages.createdBy = ''
      }
      // 判断是否搜索
      if (this.queryData) {
        value = this.queryData
      } else {
        value = null
      }
      console.log('this.groupId', this.groupId)
      if (this.groupId) {
        pages.groupId = this.groupId
      }
      // console.log(pages)
      apiCustomerSearch(value, pages).then(res => {
        if (res.status === 200) {
          this.loadingShow = false
          this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
          this.pagination.total = res.data.totalElements
          this.$message.success('数据加载成功')
        } else {
          this.$message.error('加载失败')
        }
      })
    },
    onQuery (value) {
      this.pagination.current = 1
      this.onSearch(value)
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
    },
    seeUser (record) {
      // console.log(record)
      this.seeData = record.member.baseInfo
      this.healthCustomerId = record.member.id
      this.seeVisible = true
    },
    closeSeeModal () {
      this.seeVisible = false
    },
    checkDuty (e) {
      this.dutyIndex = e.target.checked
      // console.log('选择自己管理的部分', this.dutyIndex)
    }
  },
  mounted () {
    apiGetUserInfo().then((res) => {
      if (res.status === 200) {
        // console.log(res.data)
        this.loginName = res.data.id
      } else {
        this.$message.error(res.message || '获取账户信息失败')
      }
    })
  }
}
</script>
<style scoped>
.table-page-search-wrapper{
  margin-bottom: 10px;
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
  background: #fbfbfb !important;
}

.child-table .ant-table-thead > tr >th{
  background-color: #fbfbfb;
}
.child-table .ant-table-tbody > td{
  background-color: #fbfbfb;
}

.child-table {
  background: #fbfbfb;
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
