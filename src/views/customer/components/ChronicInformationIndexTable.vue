<template>
  <div>
    <!-- <a-button @click="dj">点击</a-button> -->
    <a-table :columns="indexColumns" rowKey="id" :data-source="indexArr">
      <span slot="testAt" slot-scope="text, record">
        {{ record.testAt | getMoment }}
      </span>
    </a-table>
  </div>
</template>
<script>
import { getCustomerChronicIndex as apiGetCustomerChronicIndex } from '@/api/customer'
import moment from 'moment'

export default {
  props: {
    data: {
        type: Object,
        default: null
    },
    custId: {
        type: Number,
        default: null
    }
  },
  filters: {
    getMoment: function (value) {
        if (value === null) {
            return ''
        } else {
            return moment(value).format('YYYY-MM-DD HH:mm')
        }
    }
  },
//   name: 'APP',
  data () {
    return {
       indexData: this.data,
       id: this.custId,
       indexArr: [],
       indexTable: [],
       indexColumns: [
       {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '时间',
          dataIndex: 'testAt',
          key: 'testAt',
          scopedSlots: { customRender: 'testAt' }
        },
        {
          title: '数值',
          dataIndex: 'value',
          key: 'value'
        },
        {
          title: '参考结果',
          dataIndex: 'result',
          key: 'result'
        }
      ]
    }
  },
  methods: {
    dj () {
      console.log('indexArr', this.indexArr)
    }
  },
  created () {
  },
  mounted () {
    // console.log(this.id, '???', this.indexData.id)
    const indexArr = []
    apiGetCustomerChronicIndex(this.id, this.indexData.id).then(res => {
        if (res.status === 200) {
            this.indexTable = res.data
            // console.log('res', this.indexTable)
            const indexTable = this.indexTable
            for (var i = 0; i < indexTable.length; i++) {
                // console.log('indexTable', indexTable[i].data)
                // console.log('name', indexTable[i].info.name)
                for (var j = 0; j < indexTable[i].data.length; j++) {
                    indexTable[i].data[j].name = indexTable[i].info.name
                    indexArr.push(indexTable[i].data[j])
                }
            }
            // console.log('indexArr', indexArr)
            this.indexArr = indexArr
        }
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
