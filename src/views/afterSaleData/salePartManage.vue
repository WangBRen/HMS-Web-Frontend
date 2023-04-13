<template>
  <div>
    <a-card>
      <div>
        <a-row>
          <a-col :span="4">
            <a-button type="primary" @click="handAddNewPart">新建配件</a-button>
          </a-col>
        </a-row>
      </div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane v-for="category in categorys" :key="category" :tab="`${category}`">
          <!-- 表格数据 -->
          <a-table :columns="columns" :data-source="filterDataSource" :rowKey="(record, index) => { return index }">
            <span slot="operation" slot-scope="scope">
              <a @click="editPart(scope)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="`确定删除【${scope.name}】吗`"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deletePart(scope.id)"
              >
                <a >删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <addNewPart
      v-if="partModelVisible"
      :partModelVisible="partModelVisible"
      @closePartModel="closePartModel"
      @successAddNewPart="successAddNewPart"
      :partData="partData"
      :mode="mode"
      :categorys="categorys"
    />
  </div>
</template>
<script>
import addNewPart from './addNewPart.vue'
import { getParts, deletePart } from '@/api/afterSale'
export default {
  components: {
    addNewPart
  },
  data () {
    return {
      categorys: [],
      columns: [
        {
          title: '编码',
          key: 'serialNumber',
          dataIndex: 'serialNumber'
        },
        {
          title: '配件名',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '成本价(元)',
          key: 'cost',
          dataIndex: 'cost'
        },
        {
          title: '报价(元)',
          key: 'price',
          dataIndex: 'price'
        },
        {
          title: '库存',
          key: 'stock',
          dataIndex: 'stock'
        },
        {
          title: '单位',
          key: 'unit',
          dataIndex: 'unit'
        },
        {
          title: '所属型号',
          key: 'belongProduct',
          dataIndex: 'belongProduct',
          align: 'center'
        },
        {
          title: '规格/用途',
          key: 'specification',
          dataIndex: 'specification'
        },
        {
          title: '备注',
          key: 'remark',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      dataSource: [],
      filterDataSource: [],
      partData: null, // 单个配件信息
      partModelVisible: false,
      mode: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        // showSizeChanger: true, // 显示可改变每页数量
        // pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个账户`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      }
    }
  },
  methods: {
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      // this.getAccount()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getAccount()
    },
    handAddNewPart () {
      this.mode = 'creat'
      this.partModelVisible = true
    },
    closePartModel () {
      this.partModelVisible = false
      this.getpartList()
    },
    async getpartList () {
      const res = await getParts()
      if (res.status === 200) {
        this.dataSource = res.data.content
        const set = this.dataSource.map(item => {
          return item.belongPart
        })
        this.categorys = [...new Set(set)]
      }
    },
    successAddNewPart () {
      this.partModelVisible = false
      this.getpartList()
    },
    editPart (partData) {
      this.mode = 'edit'
      this.partModelVisible = true
      this.partData = partData
    },
    async deletePart (id) {
      const res = await deletePart(id)
      this.$message.success('删除成功')
      this.getpartList()
      console.log('删除配件', id, res)
    },
    callback (e) {
      console.log(e)
      this.filterDataSource = this.dataSource.filter(item => {
        console.log(item)
        return item.belongPart === e
      })
    }
  },
  created () {
  },
  mounted () {
    this.getpartList()
    setTimeout(() => {
      this.filterDataSource = this.dataSource.filter(item => {
        return item.belongPart === this.categorys[0]
      })
    }, 500)
  }
}
</script>
<style lang="scss" scoped>

</style>
