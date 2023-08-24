<template>
  <div>
    <a-modal
      :visible="isVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="800"
    >
      <div style="margin-bottom: 16px;width: 60%;">
        <a-input-search
          placeholder="请输入关键字"
          enter-button="查询"
          :loading="loading"
          @search="onSearch"
        />
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            <!-- {{ `当前选中了 ${selectedRowKeys.length} 用户` }} -->
          </template>
        </span>
      </div>
      <a-table
        class="table"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps
        }"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :loading="loadingData"
      >
        <span slot="pic" slot-scope="text, record">
          <a-avatar icon="user" :src="record.avatar" />
        </span>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import { searchCustomers as apiAdd, createGroupCustomer as apiCreateGroupCustomer } from '@/api/customer'
const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    align: 'center',
    scopedSlots: { customRender: 'pic' }
  },
  {
    title: '姓名',
    dataIndex: 'baseInfo.name',
    key: 'baseInfo.name',
    align: 'center',
    customRender: (text, record) => record.baseInfo.name || record.nickname
  },
  {
    title: '性别',
    dataIndex: 'baseInfo.gender',
    key: 'baseInfo.gender',
    align: 'center'
  },
  {
    title: '手机号码',
    dataIndex: 'baseInfo.phoneNumber',
    key: 'baseInfo.phoneNumber',
    align: 'center',
    customRender: (text, record) => record.baseInfo ? record.baseInfo.phoneNumber : record.telephone
  }
]

// const data = []
// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`
//   })
// }
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectId: {
      type: Number,
      default: 0
    },
    checkedRowKeys: {
      type: Array,
      default: function () {
      return []
     }
    }
  },
  data () {
    return {
      data: [],
      columns,
      ModalText: this.title,
      confirmLoading: false,
      customersId: [],
      selectedRowKeys: this.checkedRowKeys, // 选中的key
      loading: false,
      loadingData: false,
      closeRefresh: true,
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
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
    isVisible () {
      return this.visible
    }
  },
  methods: {
    async onSearch (value) {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      if (value) {
        pages.page = 1
      }
      this.loadingData = true
      const res = await apiAdd(value, pages)
      this.loadingData = false
      if (res.status === 200) {
        this.loadingShow = false
        this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
        this.pagination.total = res.data.totalElements
      }
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
   handleOk () {
      const cId = this.customersId
      const gId = this.selectId
      this.loading = true
      this.confirmLoading = true
      apiCreateGroupCustomer(gId, cId).then(res => {
        if (res.status === 200) {
          this.$message.success(res.message || '添加用户成功')
          this.$emit('onSearch')
          setTimeout(() => {
            this.handleCancel()
            this.confirmLoading = false
            this.loading = false
      }, 1000)
        } else {
          this.message.console.error(res.message || '添加不成功')
        }
      })
    },
    handleCancel (e) {
      this.$emit('handleCancel')
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      const id = selectedRows.map(record => record.key)
      this.selectedRowKeys = selectedRowKeys
      this.customersId = id
    },
    getCheckboxProps (record) {
      const gId = record.groups.map(r => r.group.id)
      // 如果已加入，就不可以选
      return {
        props: { disabled: gId.includes(this.selectId), defaultChecked: gId.includes(this.selectId) }
      }
    }
  }
}
</script>
<style lang="less">
.table th {
  line-height: 24px;
  padding: 4px 16px !important;
}
.table td {
  line-height: 24px;
  padding: 4px 16px !important;
}
</style>
