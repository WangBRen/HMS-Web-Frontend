<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row>
          <a-col :xl="5" :sm="10">
            <a-form-item label="用户名">
              <a-input v-model="checkId" placeholder="请输入用户名"/>
            </a-form-item>
          </a-col>
          <a-col :xl="3" :sm="10">
            <span class="table-page-search-submitButtons">
              <a-button @click="searchId" type="primary">查询</a-button>
            </span>
          </a-col>
          <a-col :xl="5" :sm="10">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-model="checkState" default-value="all">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="active">正常</a-select-option>
                <a-select-option value="disable">禁用</a-select-option>
                <a-select-option value="registering">未激活</a-select-option>
                <a-select-option value="inactive">激活中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="3" :sm="10">
            <span class="table-page-search-submitButtons">
              <a-button @click="searchStatus" type="primary">查询</a-button>
            </span>
          </a-col>
          <a-col :xl="8" :sm="10">
            <span class="table-page-search-submitButtons">
              <a-button @click="openCreateModal" type="primary" style="float: right">创建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :data-source="accountData"
      :pagination="pagination"
    >
      <span slot="displayName" slot-scope="text, record">
        <span v-for="item in roles" :key="item.id">
          <a-tag v-if="(item.name===record.roleName)">{{ item.displayName }}</a-tag>
        </span>
      </span>
      <span slot="nickname" slot-scope="text">
        {{ text || '----' }}
      </span>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          v-if="record.status !== 'disable'"
          title="确定禁用此用户吗?"
          @confirm="statusDisable(record)"
        >
          <a >禁用</a>
        </a-popconfirm>
        <a v-else>---</a>
      </span>
    </a-table>

    <!-- <s-table
      row-key="id"
      size="default"
      :columns="columns"
      :data="loadData"
      :expandedRowKeys="expandedRowKeys"
      @expand="handleExpand"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(item, index) in record.permissions" :key="index" :style="{ marginBottom: '12px', height: '23px' }">
            <a-col :lg="4" :md="24">
              <span>{{ item.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="item.actionList && item.actionList.length > 0">
              <a-tag color="cyan" v-for="action in item.actionList" :key="action">{{ action | permissionFilter }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag>
      <span slot="displayName" slot-scope="text, record">
        <span v-for="item in roles" :key="item.id">
          <a-tag v-if="(item.name===record.roleName)">{{ item.displayName }}</a-tag>
        </span>
      </span>
      <span slot="nickname" slot-scope="text">
        {{ text || '----' }}
      </span>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-popconfirm
          title="确定禁用此用户吗?"
          @confirm="statusDisable(record)"
        >
          <a>禁用</a>
        </a-popconfirm>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm
                title="确定禁用此用户吗?"
                @confirm="statusDisable(record)"
              >
                <a>禁用</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table> -->

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form class="permission-form" :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="唯一识别码"
            disabled="disabled"
            v-decorator="['id']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
          hasFeedback
          validateStatus="success"
        >
          <a-input
            placeholder="起一个名字"
            v-decorator="['name']"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
          validateStatus="warning"
        >
          <a-select v-decorator="['status', { initialValue: 1 }]">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea
            :rows="5"
            placeholder="..."
            id="describe"
            v-decorator="['describe']"
          />
        </a-form-item>

        <a-divider>拥有权限</a-divider>
        <template v-for="permission in permissions">
          <a-form-item
            class="permission-group"
            v-if="permission.actionsOptions && permission.actionsOptions.length > 0"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :key="permission.permissionId"
            :label="permission.permissionName"
          >
            <a-checkbox>全选</a-checkbox>
            <a-checkbox-group v-decorator="[`permissions.${permission.permissionId}`]" :options="permission.actionsOptions"/>
          </a-form-item>
        </template>

      </a-form>
    </a-modal>

    <a-modal
      title="新建账户"
      style="top: 20px;"
      :width="800"
      v-model="createModalVisible"
      @ok="handleCreateOk"
      ok-text="下载账户 Excel 文件"
    >
      <a-form class="create-account-form" :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色"
        >
          <a-select v-decorator="['roleId', { initialValue: role.initialValue }]">
            <a-select-option v-for="item in role.list" :value="item.id" :key="item.id">
              {{ item.displayName || item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数量"
        >
          <a-input
            type="number"
            placeholder="1-10"
            min="1"
            v-decorator="['amount', { initialValue: 1 }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getUserList, getRoleList, getServiceList, changeDisable } from '@/api/manage'
// import { getRoleList, getServiceList } from '@/api/manage'
import { PERMISSION_ENUM } from '@/core/permission/permission'

const STATUS = {
  1: '启用',
  2: '禁用'
}

const columns = [
  {
    title: '用户账号',
    dataIndex: 'account'
  },
  {
    title: '用户名',
    dataIndex: 'nickname',
    scopedSlots: { customRender: 'nickname' }
  },
  {
    title: '用户角色',
    dataIndex: 'displayName',
    scopedSlots: { customRender: 'displayName' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (status) => {
      switch (status) {
        case 'inactive':
          return '激活中'
        case 'active':
          return '正常'
        case 'disable':
          return '禁用'
        case 'registering':
          return '未激活'
      }
      return status
    }
    // scopedSlots: { customRender: 'status' }
  },
  {
    title: '手机号',
    dataIndex: 'telephone'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    scopedSlots: { customRender: 'createTime' }
    // sorter: true
  },
  {
    title: '操作',
    width: '150px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'AccountList',
  components: {
    STable
  },
  data () {
    return {
      accountData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        // showSizeChanger: true, // 显示可改变每页数量
        // pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个账户`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      checkState: 'all',
      checkId: null,
      role: {
        list: [],
        initialValue: -1
      },
      roles: [],
      createModalVisible: false,

      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      permissions: [],

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   return getUserList({ page: parameter.pageNo - 1, size: parameter.pageSize })
      //     .then(res => {
      //       // console.log('getUserList', res)
      //       // 展开全部行
      //       // this.expandedRowKeys = res.result.data.map(item => item.id)
      //       return {
      //         data: res.data.content,
      //         pageNo: res.data.number + 1,
      //         pageSize: res.data.size,
      //         totalCount: res.data.totalElements,
      //         totalPage: res.data.totalPages
      //       }
      //     })
      // },

      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (key) {
      return STATUS[key]
    },
    permissionFilter (key) {
      const permission = PERMISSION_ENUM[key]
      return permission && permission.label
    }
  },
  mounted () {
    this.getAccount()
  },
  created () {
    getServiceList().then(res => {
      // console.log('getServiceList.call()', res)
    })

    getRoleList().then(res => {
      this.roles = res.data || []
      this.role.list = (res.data || []).filter(role => role.name !== 'root')
      if (this.role.list.length > 0) {
        this.role.initialValue = this.role.list[0].id
      }
      // console.log('getRoleList.call()', res.data)
    })
  },
  methods: {
    openCreateModal () {
      this.createModalVisible = true
    },
    closeCreateModal () {
      this.createModalVisible = false
    },
    handleCreateOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // download files
          const a = document.createElement('a')
          a.id = 'account-gen-a'
          a.href = `/api/users/generate/${values.roleId}/${values.amount}/自动生成账户（${values.amount}个）.xlsx`
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.getElementById('account-gen-a').remove()
        }
      })
    },
    // 原方法：
    handleEdit (record) {
      this.visible = true
      // console.log('record', record)

      const checkboxGroup = {}
      this.permissions = record.permissions.map(permission => {
        const groupKey = `permissions.${permission.permissionId}`
        checkboxGroup[groupKey] = permission.actionList
        const actionsOptions = permission.actionEntitySet.map(action => {
          return {
            label: action.describe,
            value: action.action,
            defaultCheck: action.defaultCheck
          }
        })
        return {
          ...permission,
          actionsOptions
        }
      })

      this.$nextTick(() => {
        // console.log('permissions', this.permissions)
        // console.log('checkboxGroup', checkboxGroup)

        this.form.setFieldsValue(pick(record, ['id', 'status', 'describe', 'name']))
        this.form.setFieldsValue(checkboxGroup)
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(err, values)
      })
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleExpand (expanded, record) {
      // console.log('expanded', expanded, record)
      if (expanded) {
        this.expandedRowKeys.push(record.id)
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(item => record.id !== item)
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    searchId () {
      // console.log('搜索Id', this.checkId)
      this.pagination.current = 1
      this.getAccount()
    },
    searchStatus () {
      // console.log('搜索状态', this.checkState)
      this.pagination.current = 1
      this.getAccount()
      // const state = this.checkState
      // api(state).then(res => {
      //   if (res.status === 200) {
      //     this.accountData
      //   }
      // })
    },
    statusDisable (data) {
      const id = data.id
      const apiData = {
        status: 'disable'
      }
      changeDisable(id, apiData).then(res => {
        // console.log('res', res)
        if (res.status === 200) {
          // console.log('成功')
          this.$message.info('禁用成功')
          this.getAccount()
        } else {
          this.$message.error('禁用失败,' + res.message)
        }
      })
      // console.log(apiData, 'data', id)
    },
    getAccount () {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      if (this.checkState !== 'all') {
        pages.status = this.checkState
      }
      // console.log('pages', test)
      getUserList(pages).then(res => {
        if (res.status === 200) {
          // console.log(res.data)
          this.accountData = (res.data.content || []).map(record => { return { ...record, key: record.id } })
          this.pagination.total = res.data.totalElements
        }
      })
    },
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      this.getAccount()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getAccount()
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>

<style lang="less" scoped>
.permission-form {
  /deep/ .permission-group {
    margin-top: 0;
    margin-bottom: 0;
  }
}

</style>
