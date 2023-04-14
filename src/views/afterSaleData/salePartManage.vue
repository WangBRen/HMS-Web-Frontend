<template>
  <div>
    <a-card>
      <div>
        <a-row>
          <a-col :span="10">
            <a-input-group class="topSearch">
              <a-select style="width: 100px" default-value="name" @change="handleChangeKey">
                <a-select-option value="serialNumber">
                  编码
                </a-select-option>
                <a-select-option value="name">
                  配件名
                </a-select-option>
                <a-select-option value="belongProduct">
                  所属型号
                </a-select-option>
              </a-select>
              <a-input-search v-model="keyWord" enter-button @search="onSearch" style="width: 42%" placeholder="请输入关键字" />
              <a-button style="margin-left: 10px" type="primary" @click="reset">重置</a-button>
            </a-input-group>
          </a-col>
          <a-col :span="12"></a-col>
          <a-col :span="2">
            <a-button type="primary" @click="handAddNewPart">新建配件</a-button>
          </a-col>
        </a-row>
      </div>
      <a-tabs default-active-key="1" @change="callback" >
        <a-tab-pane v-for="item in categorys" :key="item" :tab="`${item}`">
          <!-- 表格数据 -->
          <a-table :columns="columns" :data-source="filterDataSource" :rowKey="(record, index) => { return index }" :pagination="false" size="small">
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
      category: '', // 当前选中类别
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
      selectKey: 'name',
      keyWord: ''
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
    getpartList (keyObj) {
      const obj = { page: 0, size: 1 }
      if (keyObj) {
        const newObj = Object.assign(obj, keyObj)
        this.getParts(newObj)
      } else {
        this.getParts(obj)
      }
    },
    async getParts (obj) {
      const res = await getParts(obj)
      if (res.status === 200) {
        if (res.data.totalElements === 0) {
          this.filterDataSource = []
        } else {
          obj.size = res.data.totalElements
          console.log('obj', obj)
          const resp = await getParts(obj)
          if (resp.status === 200) {
            this.dataSource = resp.data.content
            const set = this.dataSource.map(item => {
              return item.belongPart
            })
            this.categorys = [...new Set(set)]
            this.filterDataSource = this.dataSource.filter(item => {
              return item.belongPart === this.category
            })
          }
        }
      }
    },
    successAddNewPart () {
      this.partModelVisible = false
      console.log('创建成功')
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
      this.category = e
      this.filterDataSource = this.dataSource.filter(item => {
        return item.belongPart === e
      })
    },
    onSearch () {
      console.log('this.selectKey', this.selectKey)
      if (this.selectKey === 'name') {
        const obj = { name: this.keyWord || '' }
        this.getpartList(obj)
      } else if (this.selectKey === 'belongProduct') {
        const obj = { belongProduct: this.keyWord || '' }
        this.getpartList(obj)
      } else if (this.selectKey === 'serialNumber') {
        const obj = { serialNumber: this.keyWord || '' }
        this.getpartList(obj)
      }
    },
    handleChangeKey (e) {
      this.selectKey = e
    },
    reset () {
      this.getParts({ page: 0, size: 10 })
    }
  },
  created () {
    this.$setPageDataLoader(this.getpartList)
  },
  mounted () {
    this.getpartList()
    setTimeout(() => {
      this.category = this.categorys[0]
      this.filterDataSource = this.dataSource.filter(item => {
        return item.belongPart === this.category
      })
    }, 1000)
  }
}
</script>
<style scoped>
.topSearch{
  display: flex;
  align-items: center;
}
</style>
