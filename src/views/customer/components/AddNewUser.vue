<template>
  <div>
    <a-modal
      :maskClosable="false"
      :title="title"
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
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps
        }"
        :columns="columns"
        :data-source="data"
      >
        <span slot="pic" slot-scope="text, record">
          <img style="width:50px;heigth:50px" :src="record.avatar" />
        </span>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import { searchCustomers as apiAdd, createGroupCustomer as apiCreateGroupCustomer } from '@/api/customer'
const columns = [
  { title: '序号', customRender: (text, record, index) => `${index + 1}`, align: 'center' },
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    align: 'center',
    scopedSlots: { customRender: 'pic' }
  },
  {
    title: '姓名',
    dataIndex: 'baseInfo.contactName',
    key: 'baseInfo.contactName',
    align: 'center'
  },
  {
    title: '性别',
    dataIndex: 'baseInfo.gender',
    key: 'baseInfo.gender',
    align: 'center'
  },
  {
    title: '手机号码',
    dataIndex: 'baseInfo.contactNumber',
    key: 'baseInfo.contactNumber',
    align: 'center'
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
    title: {
      type: String,
      default: null
    },
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
      pages: {
        page: 1,
        size: 10
      },
      closeRefresh: true
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
      const res = await apiAdd(value, this.pages)
      if (res.status === 200) {
        this.loadingShow = false
        this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
      }
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
