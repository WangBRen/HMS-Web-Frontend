<template>
  <div>
    <a-card :loading="loading">
      <span slot="title">
        <a-button @click="openEditModal('add')" type="primary">新建产品型号</a-button>
      </span>
      <!-- <a-row>
        <a-col :span="3">
        </a-col>
      </a-row> -->
      <a-table
        :columns="modelColumns"
        :rowKey="(record, index) => index"
        :data-source="modelData"
        :pagination="false"
        :scroll="{ y: 600 }"
      >
        <span slot="action" slot-scope="text,record">
          <a @click="openEditModal('edit', record)">编辑 </a>
          <a-popconfirm title="确定删除？" @confirm="delProduct(record)">
            <a>| 删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <productModelModal
      :modalData="modalData"
      :modalVisible="modalVisible"
      @closeEditModal="closeEditModal"
      @successEdit="successEdit"
      :modalIndex="modalIndex"
    />
  </div>
</template>
<script>
import productModelModal from './productModelModal.vue'
import { getProducts, delProduct } from '@/api/product'
export default {
  components: {
    productModelModal
  },
  data () {
    return {
      modelColumns: [
        {
          title: '产品号',
          dataIndex: 'productNumber',
          key: 'productNumber',
          align: 'center'
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          key: 'productModel',
          align: 'center'
        },
        {
          title: '品牌',
          dataIndex: 'productBrand',
          key: 'productBrand',
          align: 'center'
        },
        {
          title: '品牌简称',
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: '出厂价格',
          dataIndex: 'productPrice',
          key: 'productPrice',
          align: 'center'
        },
        {
          title: '控制方案',
          dataIndex: 'productControlPlan',
          key: 'productControlPlan',
          align: 'center'
        },
        {
          title: '操作',
          width: '100px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      modelData: [],
      modalVisible: false,
      modalIndex: 1,
      modalData: {},
      loading: true
    }
  },
  methods: {
    async getModel () {
      this.loading = true
      const pages = {
        page: 0,
        size: 1
      }
      const resp = await getProducts(pages)
      pages.size = resp.data.totalElements || 1
      const res = await getProducts(pages)
      this.loading = false
      if (res.status === 200) {
        this.modelData = res.data.content
      }
      console.log('产品型号库', res)
    },
    openEditModal (index, record) {
      // console.log(record)
      if (index === 'add') {
        this.modalIndex = 1
        this.modalData = {}
      } else if (index === 'edit') {
        this.modalIndex = 2
        this.modalData = JSON.parse(JSON.stringify(record))
      }
      this.modalVisible = true
    },
    closeEditModal () {
      this.modalVisible = false
    },
    successEdit () {
      this.modalVisible = false
      this.getModel()
    },
    delProduct (data) {
      delProduct(data.id).then(res => {
        if (res.status === 200) {
          this.$message.success('删除成功')
          this.getModel()
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.getModel()
  }
}
</script>
<style lang="scss">

</style>
