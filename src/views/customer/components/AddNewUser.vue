<template>
  <div>
    <a-button type="primary" @click="showModal"> Open Modal with async logic </a-button>
    <a-modal
      :title="title"
      :visible="isVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="800"
    >
      <div style="margin-bottom: 16px">
        <a-input-search
          placeholder="请输入姓名"
          enter-button="查询"
          :loading="loading"
          @search="onSearch"
        />
        <!-- <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="start"> 确定新增 </a-button> -->
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            <!-- {{ `当前选中了 ${selectedRowKeys.length} 用户` }} -->
          </template>
        </span>
      </div>
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="data"
      />
    </a-modal>
  </div>
</template>
<script>
import { addCustomerSearch } from '@/api/customer'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  })
}
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data,
      columns,
      ModalText: this.title,
      confirmLoading: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
       pages: {
        page: 1,
        size: 10
      }
    }
  },
  created () {
    this.onSearch()
    console.log('qqqq')
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
      console.log(value)
       await addCustomerSearch(value, this.pages).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.loadingShow = false
          this.data = (res.data.content || []).map(record => { return { ...record, key: record.id } })
        }
      })
    },
    showModal (record) {
        // console.log('子组件接收的id', record)
        this.visible = true
    },
    handleOk (e) {
        this.loading = true
        this.ModalText = 'The modal will be closed after two seconds'
        this.confirmLoading = true
        setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.loading = false
            this.selectedRowKeys = []
        }, 2000)
    },
    handleCancel (e) {
        this.$emit('handleCancel')
    },
     start (value) {
      this.loading = true
      console.log(value)
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false
        this.selectedRowKeys = []
      }, 1000)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      const id = selectedRows.map(record => {
        return record.key
      })
      console.log(id)
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>
