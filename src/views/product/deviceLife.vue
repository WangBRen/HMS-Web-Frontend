<template>
  <a-modal
    :title="`设备流程追踪【 ${deviceData.serialNumber} 】`"
    :visible="deviceVisible"
    :footer="null"
    @cancel="handleCancel"
    :width="1200"
  >
    <div style="padding:10px 38px;">
      <a-steps :current="current" type="navigation">
        <a-step title="设备生产" :sub-title="createdAt" :description="`生产人：${deviceData.operator}`" />
        <a-step title="设备出库" :sub-title="current>0?createdAt:''" :description="current>0?`出库人：${deviceData.operator}`:''" />
        <a-step title="设备绑定" :sub-title="current>1?createdAt:''"/>
      </a-steps>
      <a-descriptions title="设备信息" style="margin-top:50px;">
        <a-descriptions-item label="设备编号">
          {{ deviceData.serialNumber }}
        </a-descriptions-item>
        <a-descriptions-item label="品牌">
          {{ deviceData.product.productBrand }}
        </a-descriptions-item>
        <a-descriptions-item label="品牌简称">
          {{ deviceData.product.name }}
        </a-descriptions-item>
        <a-descriptions-item label="型号">
          {{ deviceData.product.productModel }}
        </a-descriptions-item>
        <a-descriptions-item label="出厂价">
          {{ deviceData.product.productPrice }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions title="用户信息" v-if="current>=2" style="margin-top:50px;">
        <a-descriptions-item label="用户姓名">
          {{ deviceData.guarantee.name }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号">
          {{ deviceData.guarantee.phone }}
        </a-descriptions-item>
        <a-descriptions-item label="地址">
          {{ deviceData.guarantee.remark }}
        </a-descriptions-item>
        <a-descriptions-item label="购买日期">
          {{ deviceData.guarantee.startAt | moment }}
        </a-descriptions-item>
        <a-descriptions-item label="购买凭证">
          <a :href="deviceData.guarantee.file.url" target="_blank">
            <a-avatar size="large" shape="square" :src="deviceData.guarantee.file.url" />
          </a>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    deviceVisible: {
      type: Boolean,
      default: false
    },
    deviceData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      current: null,
      createdAt: ''
    }
  },
  methods: {
    // handleOk () {},
    handleCancel () {
      this.$emit('closeDeviceLife')
    }
  },
  mounted () {
    this.createdAt = moment(this.deviceData.createdAt).format('YYYY-MM-DD HH:mm')
    const status = this.deviceData.status
    if (status === 'NOT_OUT') {
      this.current = 0
    } else if (status === 'OUT') {
      this.current = 1
    } else if (status === 'BOUND') {
      this.current = 2
    }
    console.log('deviceData', this.deviceData)
  }
}
</script>

<style>

</style>
