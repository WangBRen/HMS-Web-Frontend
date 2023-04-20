<template>
  <div>
    <a-modal
      :width="1000"
      :visible="drawbackVisible"
      @cancel="handleCancel"
      :maskClosable="false"
      :footer="null"
    >
      <div style="padding: 20px;">
        <!-- {{ drawbackData.processes[0].afterSaleExpresses }} -->
        <a-row class="returnNo">
          <a-col>退件快递单号：</a-col>
          <a-col :span="6"><a-input placeholder="请输入用户退件的快递单号" v-model="returnNo"/></a-col>
          <a-col><a-button type="primary" @click="handReturnNo">添加</a-button></a-col>
        </a-row>
        <a-row class="returnNo">
          <a-col>退件快递单号：</a-col>
          <a-col>{{ this.drawbackData.returnsNumber }}</a-col>
        </a-row>
        <div v-for="(item1,index1) in drawbackData.processes" :key="item1.id" style="padding-bottom:50px;">
          <div class="title">第{{ index1+1 }}次评估：</div>
          <div class="itemBox">
            <a-descriptions
              bordered
              size="small"
              :column="3"
              v-if="item1.pays.length>0"
            >
              <a-descriptions-item label="支付单号"><span v-for="pay in item1.pays" :key="pay.id"><span v-if="pay.submitType=='PAY'">{{ pay.outTradeNo }}</span></span></a-descriptions-item>
              <a-descriptions-item label="支付时间"><span v-for="pay in item1.pays" :key="pay.id"><span v-if="pay.submitType=='PAY'">{{ pay.payTime | moment }}</span></span></a-descriptions-item>
              <a-descriptions-item label="当前状态">
                <a-badge color="#f50" text="不支持退款" v-if="item1.pays[0].actualAmount===0 && item1.pays.length==1"/>
                <a-badge color="#bbb" text="无退款记录" v-else-if="item1.pays.length<=1"/>
                <a-badge color="#2db7f5" :text="`已退款`" v-else-if="item1.pays.length>1"/>
              </a-descriptions-item>
              <a-descriptions-item label="是否在保修期内">{{ item1.isOverWarranty?'是':'否' }}</a-descriptions-item>
              <a-descriptions-item label="订单总金额">￥<span v-for="pay in item1.pays" :key="pay.id"><span v-if="pay.submitType=='PAY'">{{ pay.totalAmount }}</span></span></a-descriptions-item>
              <a-descriptions-item label="实际支付金额">￥<span v-for="pay in item1.pays" :key="pay.id"><span v-if="pay.submitType=='PAY'">{{ pay.actualAmount }}</span></span></a-descriptions-item>
              <a-descriptions-item label="退款历史记录" :span="3" v-if="item1.pays.length>1">
                <a-row style="font-weight:600;line-height:2">
                  <a-col :span="7">退款单号</a-col>
                  <a-col :span="4">退款金额</a-col>
                  <a-col :span="6">退款时间</a-col>
                  <a-col :span="7">备注</a-col>
                </a-row>
                <a-row v-for="(pay, index) in item1.pays" :key="index" class="rowActive">
                  <span v-if="pay.outRefundNo">
                    <a-col :span="7">{{ pay.outRefundNo }}</a-col>
                    <a-col :span="4">￥{{ pay.refundAmount /100 }}</a-col>
                    <a-col :span="6">{{ pay.refundTime | moment }}</a-col>
                    <a-col :span="7">{{ pay.refundReason }}</a-col>
                  </span>
                </a-row>
              </a-descriptions-item>
              <a-descriptions-item label="选择退款配件及数量" :span="2">
                <a-row style="font-weight:600;line-height:2">
                  <a-col :span="8">已发配件</a-col>
                  <a-col :span="4">单价</a-col>
                  <a-col :span="6">已发数量</a-col>
                  <a-col :span="6">选择退款数量</a-col>
                </a-row>
                <div v-for="(item2, index2) in item1.afterSaleExpresses" :key="index2">
                  <a-row>
                    <a-col :span="8">{{ item2.pieceName }}</a-col>
                    <a-col :span="4">{{ item2.piecePrice }}</a-col>
                    <a-col :span="6">{{ item2.pieceNum }}</a-col>
                    <a-col :span="6"><a-input-number :min="0" :max="item2.pieceNum" @change="value => accessoriesChange(item1.id,item2,value)"/></a-col>
                  </a-row>
                </div>
                <div v-for="total in totalRefund" :key="total.id">
                  <span v-if="total.id===item1.id" style="color:red;padding-top: 20px;">
                    <span v-if="item1.discount">折扣：{{ item1.discount }}折 <span style="margin-left:100px;">本次预计退款：￥{{ total.totalNum * item1.discount / 10 }}</span></span>
                    <span v-else>本次预计退款：￥{{ total.totalNum }}</span>
                  </span>
                </div>
              </a-descriptions-item>
              <a-descriptions-item label="退款操作"><a-button :disabled="item1.pays[0].actualAmount===0?true:false" @click="handRefund(item1)">退款</a-button></a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { saleRefund, processPay, getSaleRepair, updateStatus } from '@/api/afterSale'
import md5 from '../../utils/md5'
export default {
  props: {
    drawbackVisible: {
      type: Boolean,
      default: false
    },
    saleId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      accessories: [], // 退款配件数据
      drawbackData: [], // 当前订单数据
      totalRefund: [],
      returnNo: ''
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
      const myDate = Date.parse(new Date())
      // const myYear = myDate.getFullYear()
      // const myMonth = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      // const myToday = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
      // const myHour = myDate.getHours()
      const outRefundNo = 'TK' + myDate + this.drawbackData.id + item1.id
      const refundFee = this.totalRefund.filter(item => {
        return item.id === item1.id
      })
      var refundReason = ''
      this.accessories.map(item => {
        if (item.processId === item1.id) {
          item.parts.map(part => {
            refundReason = refundReason + part.accessoryName + '(' + part.num + '件)；'
          })
        }
      })
      var outTradeNo = ''
      item1.pays.map(item => {
        if (item.submitType === 'PAY') {
          outTradeNo = item.outTradeNo
        }
      })
      const payLoad = {
        appid: 'wx60c0211b98af5b12', // 新杜马小程序
        // appid: 'wxc849c3cfa10ea1d2', // 健康小程序
        mchId: '1635883921',
        nonceStr: this.nonceStr(), // 32位随机字符串
        sign: this.sign(), // 签名
        signType: 'MD5',
        outTradeNo: outTradeNo, // 订单号
        outRefundNo: outRefundNo,
        notifyUrl: 'https://dev.hms.yootane.com/afterSale/saleRepair', // 微信支付结果通知的回调地址
        totalFee: item1.pays[0].actualAmount * 100, // 订单金额  item1.pays[0].actualAmount
        refundFee: refundFee[0].totalNum * item1.discount / 10 * 100,
        refundDesc: refundReason // 退款描述
      }
      this.refund(payLoad, item1.id, refundReason)
    },
    async refund (payLoad, processId, refundReason) {
      const res = await saleRefund(payLoad)
      if (res.resultCode === 'SUCCESS') {
        console.log('退款成功', res)
        this.$message.success('退款成功')
        const requestBody = {
          submitType: 'REFUND',
          outRefundNo: res.outRefundNo,
          refundReason: refundReason,
          refundAmount: res.refundFee,
          refundStatus: res.resultCode,
          refundTime: new Date()
        }
        const resp = await processPay(processId, requestBody)
        if (resp.status === 200) {
          this.getSaleDate()
        }
      }
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
        } else {
          return { ...item }
        }
      })
      this.totalRefund = a.map(item => {
        var totalNum = 0
        item.parts.map(part => {
          totalNum = totalNum + part.piecePrice * part.num
        })
        return { id: item.processId, totalNum: totalNum }
      })
      console.log('选择的寄件', a)
    },
    async getSaleDate () {
      const res = await getSaleRepair(this.saleId)
      if (res.status === 200) {
        console.log('单个数据详情', res)
        this.drawbackData = res.data
      }
      this.accessories = this.drawbackData.processes.map(item => {
        return { processId: item.id, parts: [] }
      })
    },
    async handReturnNo () {
      if (this.returnNo) {
        const data = { returnsNumber: this.returnNo }
        const res = await updateStatus(this.drawbackData.id, data)
        console.log(res)
        if (res.status === 200) {
          this.$message.success('添加成功')
        }
      } else {
        this.$message.warning('请填写退件单号')
      }
    }
  },
  created () {
  },
  mounted () {
    this.getSaleDate()
  }
}
</script>
<style scoped>
.title{
  font-size: 16px;
  color: #000000d9;
  font-weight: bold;
  line-height: 1.5;
  margin-bottom: 20px;
}
.itemBox:hover{
  border: 1px solid #40a9ffa1;
  box-shadow: 1px 1px 10px #55c7db81,
  -1px -1px 6px #7ee7faa4;
}
.rowActive:hover{
  background: #7ee7fa3d;
}
.returnNo{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
