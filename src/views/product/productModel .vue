<template>
  <div>
    <a-card>
      <a-row>
        <a-col :span="3">
          <a-button @click="openEditModal('add')" type="primary">新建产品型号</a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="modelColumns"
        :rowKey="(record, index) => index"
        :data-source="modelData"
        :pagination="false"
      >
        <span slot="action" slot-scope="text,record">
          <!-- <a-popconfirm title="确定删除？" @confirm="(record)"> -->
          <a @click="openEditModal('edit', record)">编辑 </a>
          <a @click="delProduct(record)">| 删除</a>
          <!-- </a-popconfirm> -->
        </span>
      </a-table>
    </a-card>
    <productModelModal
      :modalData="modalData"
      :modalVisible="modalVisible"
      @closeEditModal="closeEditModal"
      :modalIndex="modalIndex"
    />
  </div>
</template>
<script>
import productModelModal from './productModelModal.vue'

const modelData = [
  {
    productNumber: 123, // 产品号
    productModel: '产品型号113',
    productSequence: '产品序列',
    productFunctions: [
      {
        funName: '功能一'
      },
      {
        funName: '功能二'
      },
      {
        funName: '功能三'
      }
    ],
    productParts: [
      {
        pieceName: '配件一',
        piecePrice: 100
      },
      {
        pieceName: '配件二',
        piecePrice: 40
      }
    ],
    productControl: 123456, // 产品控制方案
    factoryPrice: 1001, // 出厂价格
    productBrand: '品牌逆风'
  },
  {
    productNumber: 31, // 产品号
    productModel: '产品型号007',
    productSequence: '产品序列',
    productFunctions: ['功能一', '功能二', '功能三'],
    productParts: ['配件1', '配件5'],
    productControl: 12, // 产品控制方案
    factoryPrice: 8000, // 出厂价格
    productBrand: '品牌顺风'
  }
]
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
        // {
        //   title: '产品功能',
        //   dataIndex: 'productFunctions',
        //   key: 'productFunctions',
        //   align: 'center'
        // },
        // {
        //   title: '产品配件',
        //   dataIndex: 'productParts',
        //   key: 'productParts',
        //   align: 'center'
        // },
        {
          title: '控制方案',
          dataIndex: 'productControl',
          key: 'productControl',
          align: 'center'
        },
        {
          title: '出厂价格',
          dataIndex: 'factoryPrice',
          key: 'factoryPrice',
          align: 'center'
        },
        {
          title: '品牌',
          dataIndex: 'productBrand',
          key: 'productBrand',
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
      modelData,
      modalVisible: false,
      modalIndex: 1,
      modalData: {}
    }
  },
  methods: {
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
    delProduct (data) {
      console.log(data)
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="scss">

</style>
