<template>
  <div>
    <a-modal
      :width="1000"
      :visible="drawbackVisible"
      v-if="drawbackVisible"
      @cancel="handleCancel"
      :maskClosable="false"
      :footer="null"
    >
      <div style="padding: 20px;">
        <!-- {{ drawbackData.processes[0].afterSaleExpresses }} -->
        <div v-for="(item1,index1) in drawbackData.processes" :key="item1.id" style="padding-bottom:50px;">
          <div>
            <a-descriptions
              :title="`第${ index1+1 }次评估：`"
              bordered
              size="small"
              :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
            >
              <a-descriptions-item label="支付单号">{{ item1.pays[0].outTradeNo }}</a-descriptions-item>
              <a-descriptions-item label="支付时间">{{ item1.pays[0].payTime | moment }}</a-descriptions-item>
              <a-descriptions-item label="退款状态">{{ item1.pays[0].actualAmount===0?'不支持退款':'' }}</a-descriptions-item>
              <a-descriptions-item label="是否在保修期内">{{ item1.isOverWarranty?'是':'否' }}</a-descriptions-item>
              <a-descriptions-item label="订单总金额">￥{{ item1.pays[0].totalAmount }}</a-descriptions-item>
              <a-descriptions-item label="实际支付金额">￥{{ item1.pays[0].actualAmount }}</a-descriptions-item>
              <!-- <a-descriptions-item label="实际支付金额">￥{{ item1.pays[0].actualAmount }}</a-descriptions-item> -->
              <a-descriptions-item label="退款配件及数量" :span="2">
                <div v-for="(item2, index2) in item1.afterSaleExpresses" :key="index2">
                  {{ item2.pieceName }}：
                  <a-input-number :min="1" :max="item2.pieceNum" @change="value => accessoriesChange(item1.id,item2,value)"/>
                </div>
              </a-descriptions-item>
              <a-descriptions-item label="退款操作"><a-button :disabled="item1.pays[0].actualAmount===0?true:false" @click="handRefund(item1)">退款</a-button></a-descriptions-item>
            </a-descriptions>
            <!-- <div style="font-size: 24px;">第{{ index1+1 }}次评估：</div> -->
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { saleRefund, processPay } from '@/api/afterSale'
import md5 from '../../utils/md5'
export default {
  props: {
    drawbackVisible: {
      type: Boolean,
      default: false
    },
    drawbackData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      accessories: []
    }
  },
  methods: {
    handleCancel () {
      this.$emit('closeDrawback')
    },
    nonceStr () {
      const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var n = ''
      for (var i = 0; i < 32; i++) {
        n += t.charAt(Math.floor(Math.random() * 32))
      }
      return n
    },
    sign () {
      const stringA = `appid=wxc849c3cfa10ea1d2&body=test&device_info=1000&mch_id=1635883921&nonce_str=${this.nonceStr()}`
      const stringSignTemp = stringA + '&key=yt191017yt191017yt191017yt191017'
      return md5(stringSignTemp)
    },
    handRefund (item1) {
      const myDate = new Date()
      const myYear = myDate.getFullYear()
      const myMonth = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      const myToday = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
      const outRefundNo = 'TK' + myYear + myMonth + myToday + this.drawbackData.id
      const payLoad = {
        appid: 'wx60c0211b98af5b12', // 新杜马小程序
        // appid: 'wxc849c3cfa10ea1d2', // 健康小程序
        mchId: '1635883921',
        nonceStr: this.nonceStr(), // 32位随机字符串
        sign: this.sign(), // 签名
        signType: 'MD5',
        outTradeNo: item1.pays[0].outTradeNo, // 订单号
        outRefundNo: outRefundNo,
        notifyUrl: 'https://dev.hms.yootane.com/afterSale/saleRepair', // 微信支付结果通知的回调地址
        totalFee: 2, // 订单金额  item1.pays[0].actualAmount
        refundFee: 2,
        refundDesc: '寄件退款' // 退款描述
      }
      this.refund(payLoad, item1.id)
    },
    async refund (payLoad, processId) {
      const res = await saleRefund(payLoad)
      console.log('退款成功', res)
      // if (res.status === 200) {
        // this.$message.success('退款成功')
        const requestBody = {
          submitType: 'REFUND',
          outRefundNo: res.outRefundNo,
          refundReason: null,
          refundStatus: 'SUCCESS',
          refundTime: new Date()
        }
        const resp = await processPay(processId, requestBody)
        if (resp.status === 200) {
          this.$message.success('退款成功')
        }
        console.log('保存退款信息', processId, resp)
      // }
    },
    accessoriesChange (proId, item1, value) {
      const a = this.accessories.map(item => {
        if (item.processId === proId) {
          if (item.parts.length === 0) {
            item.parts.push({ accessoryName: item1.pieceName, piecePrice: item1.piecePrice, num: value })
            return item
          } else {
            const parts = item.parts.filter(part => {
              if (part.accessoryName === item1.pieceName) {
                part.num = value
                return part
              }
            })
            if (parts.length !== 0) {
              return item
            } else {
              item.parts.push({ accessoryName: item1.pieceName, piecePrice: item1.piecePrice, num: value })
              return item
            }
          }
        }
      })
      console.log('选择的寄件', a)
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    // 总配件
    drawbackData (newData, oldData) {
      console.log('初始化', newData)
    },
    // 添加的配件
    drawbackArr (newData, oldData) {
    },
    drawbackVisible (newData) {
      console.log(newData)
      if (newData) {
        this.accessories = this.drawbackData.processes.map(item => {
          return { processId: item.id, parts: [] }
        })
        console.log('this.accessories', this.accessories)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
