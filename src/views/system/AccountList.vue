<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
          <a-col :md="4" :sm="12">
            <span class="table-page-search-submitButtons">
              <a-button @click="openCreateModal" type="primary" style="float: right">创建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
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
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

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
import { getUserList, getRoleList, getServiceList } from '@/api/manage'
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
    dataIndex: 'nickname'
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (status) => {
      switch (status) {
        case 'inactive':
          return '未激活'
        case 'active':
          return '正常'
        case 'disable':
          return '不可用'
      }
      return status
    }
    // scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    scopedSlots: { customRender: 'createTime' },
    sorter: true
  }, {
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
      role: {
        list: [],
        initialValue: -1
      },
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
      loadData: parameter => {
        return getUserList({ page: parameter.pageNo - 1, size: parameter.pageSize })
          .then(res => {
            // console.log('getUserList', res)
            // 展开全部行
            // this.expandedRowKeys = res.result.data.map(item => item.id)
            return {
              data: res.data.content,
              pageNo: res.data.number + 1,
              pageSize: res.data.size,
              totalCount: res.data.totalElements,
              totalPage: res.data.totalPages
            }
          })
      },

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
  created () {
    getServiceList().then(res => {
      console.log('getServiceList.call()', res)
    })

    getRoleList().then(res => {
      this.role.list = (res.data || []).filter(role => role.name !== 'root')
      if (this.role.list.length > 0) {
        this.role.initialValue = this.role.list[0].id
      }
      console.log('getRoleList.call()', res.data)
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
      console.log('record', record)

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
        console.log('permissions', this.permissions)
        console.log('checkboxGroup', checkboxGroup)

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
      console.log('expanded', expanded, record)
      if (expanded) {
        this.expandedRowKeys.push(record.id)
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(item => record.id !== item)
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
