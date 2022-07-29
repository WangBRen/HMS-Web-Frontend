<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
    </div>

    <a-tabs v-model="currentTabKey">
      <a-tab-pane v-for="tab in data" :key="tab.id" :tab="tab.name" >
        <a-table
          row-key="id"
          size="small"
          :columns="columns"
          :data-source="tab.items"
        >
          <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag>
          <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      title="新建账户"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="visible"
      ok-text="下载账户 Excel 文件"
    >
      <a-form class="create-account-form" :form="form">
        <a-form-item label="数量">
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
import { listAllIndexes } from '@/api/health_indexes'
import { ref } from 'vue'

const STATUS = {
  1: '启用',
  2: '禁用'
}

const columns = [
  {
    title: '指标名称',
    dataIndex: 'name'
  },
  {
    title: '检测方式',
    dataIndex: 'testMethod'
  },
  {
    title: '指标单位',
    dataIndex: 'unit',
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
  },
  {
    title: '检测环境',
    dataIndex: 'testEnvironment'
  },
  {
    title: '判定标准',
    dataIndex: 'type'
  },
  {
    title: '参考范围',
    dataIndex: 'range'
  },
  {
    title: '检测频率',
    dataIndex: 'testRate'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    scopedSlots: { customRender: 'createTime' }
  }, {
    title: '操作',
    width: '150px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'IndexPage',
  components: {
    STable
  },
  data () {
    return {
      currentTabKey: null,
      visible: false,
      current: {},
      form: this.$form.createForm(this),
      columns,
      data: []
    }
  },
  filters: {
    statusFilter (key) {
      return STATUS[key]
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const resp = await listAllIndexes()
      if (resp.status === 200) {
        // reform data
        this.data = resp.data || []
        if (!this.currentTabKey) {
          this.currentTabKey = ref('' + resp.data[0].id)
        }
      }
    },
    openModal () {
      this.visible = true
    },
    closeModal () {
      this.visible = false
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
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>

</style>
