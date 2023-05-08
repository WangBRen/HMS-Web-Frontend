<template>
  <div>
    <a-modal
      :width="1000"
      :visible="installVisible"
      @cancel="closeInstallModal"
      :maskClosable="false"
      :footer="null"
    >
      <div style="margin: 20px;">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div>
          <div class="big_title">客户信息</div>
          <a-descriptions bordered size="small">
            <a-descriptions-item label="客户名">
              {{ waitData.customerInfo.customerName }}
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">
              {{ waitData.customerInfo.customerPhone }}
            </a-descriptions-item>
            <a-descriptions-item label="购买日期">
              {{ waitData.customerInfo.purchaseDate | getDay }}
            </a-descriptions-item>
            <a-descriptions-item label="品牌">
              {{ waitData.customerInfo.brand }}
            </a-descriptions-item>
            <a-descriptions-item label="型号">
              {{ waitData.customerInfo.productModel }}
            </a-descriptions-item>
            <a-descriptions-item label="编号">
              {{ waitData.customerInfo.productNo || '---' }}
            </a-descriptions-item>
            <a-descriptions-item label="收货地址">
              {{ waitData.customerInfo.receiveAddress }}
            </a-descriptions-item>
            <a-descriptions-item label="上门地址">
              {{ waitData.customerInfo.isSameAddress? waitData.customerInfo.receiveAddress:waitData.customerInfo.serviceAddress }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    installVisible: {
      type: Boolean,
      default: false
    },
    waitData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  filters: {
    getDay: function (value) {
      if (value === null) {
        return ''
      } else {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  },
  data () {
    return {
      steps: [
        {
          title: '待评估'
        },
        {
          title: '已评估'
        },
        {
          title: '已支付'
        },
        {
          title: '待安装'
        },
        {
          title: '已解决'
        }
      ]
    }
  },
  methods: {
    closeInstallModal () {
      this.$emit('closeInstallModal')
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style scoped>
.big_title {
  font-size: 18px;
  line-height: 40px;
  margin-top: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}
</style>
