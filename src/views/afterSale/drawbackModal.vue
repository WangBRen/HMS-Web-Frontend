<template>
  <div>
    <a-modal
      :width="1300"
      :visible="drawbackVisible"
      @cancel="handleCancel"
      :footer="null"
    >
      <div style="padding: 20px;">
        <!-- {{ drawbackData.processes[0].afterSaleExpresses }} -->
        <a-row class="returnNo">
          <a-col>退件快递单号：</a-col>
          <a-col :span="6"><a-input placeholder="请输入用户退件的快递单号" v-model="returnNo"/></a-col>
          <a-col><a-button type="primary" @click="handReturnNo">添加</a-button></a-col>
        </a-row>
        <!-- <a-row class="returnNo">
          <a-col>退件快递单号：</a-col>
          <a-col><a-tag v-for="item in drawbackData.returnsNumber" :key="item.index">{{ item }}</a-tag></a-col>
        </a-row> -->
        <a-descriptions bordered>
          <a-descriptions-item label="是否月结">{{ drawbackData.monthlyStatement?'是':(drawbackData.monthlyStatement===null?'--':'否') }}</a-descriptions-item>
          <a-descriptions-item label="是否保修期内">
            <span v-if="drawbackData.processes">{{ drawbackData.processes[drawbackData.processes.length-1]?.isOverWarranty?'是':'否' }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="退件单号">
            <div v-for="item in drawbackData.returnsNumber" :key="item.index">
              <a-tag>{{ item }}</a-tag>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        <div v-for="(item1,index1) in drawbackData.processes" :key="item1.id" style="padding:20px 0;">
          <div class="title">第{{ index1+1 }}次评估：</div>
          <div class="itemBox">
            <a-descriptions
              bordered
              size="small"
              :column="3"
            >
              <a-descriptions-item label="支付单号">
                <div v-if="item1.pays.length>0">
                  <span v-for="pay in item1.pays" :key="pay.id"><span v-if="pay.submitType=='PAY'">{{ pay.outTradeNo }}</span></span>
                </div>
                <div v-else>--</div>
              </a-descriptions-item>
              <a-descriptions-item label="支付时间">
                <span v-for="pay in item1.pays" :key="pay.id"><span v-if="pay.submitType=='PAY'">{{ pay.payTime | moment }}</span></span>
              </a-descriptions-item>
              <a-descriptions-item label="退款状态" v-if="item1.pays.length>0">
                <a-badge color="#f50" text="不支持退款" v-if="item1.pays[0].actualAmount===0 && item1.pays.length==1"/>
                <a-badge color="#bbb" text="无退款记录" v-else-if="item1.pays.length<=1"/>
                <a-badge color="#2db7f5" :text="`已退款`" v-else-if="item1.pays.length>1"/>
              </a-descriptions-item>
              <a-descriptions-item label="状态" v-else><a-badge color="#f50" :text="`无支付记录`"/></a-descriptions-item>
              <!-- <a-descriptions-item label="是否在保修期内">{{ item1.isOverWarranty?'是':'否' }}</a-descriptions-item> -->
              <a-descriptions-item label="折扣优惠">{{ item1.discount? item1.discount+'折':'无' }}</a-descriptions-item>
              <a-descriptions-item label="订单总金额">
                ￥{{ item1.totalCost }}
              </a-descriptions-item>
              <a-descriptions-item label="实际支付金额">
                <div v-if="item1.pays.length>0">
                  ￥<span v-for="pay in item1.pays" :key="pay.id"><span v-if="pay.submitType=='PAY'">{{ pay.actualAmount }}</span></span>
                </div>
                <div v-else>￥0</div>
              </a-descriptions-item>
              <a-descriptions-item label="退款历史记录" :span="3" v-if="item1.pays.length>1">
                <a-row style="font-weight:600;line-height:2">
                  <a-col :span="7">退款单号</a-col>
                  <a-col :span="4">退款金额</a-col>
                  <a-col :span="5">退款时间</a-col>
                  <a-col :span="7">备注</a-col>
                </a-row>
                <a-row v-for="(pay, index) in item1.pays" :key="index" class="rowActive">
                  <span v-if="pay.outRefundNo">
                    <a-col :span="7">{{ pay.outRefundNo }}</a-col>
                    <a-col :span="4">￥{{ pay.refundAmount /100 }}</a-col>
                    <a-col :span="5">{{ pay.refundTime | moment }}</a-col>
                    <a-col :span="7">{{ pay.refundReason }}</a-col>
                  </span>
                </a-row>
              </a-descriptions-item>
              <a-descriptions-item label="退件历史记录" :span="3" v-if="item1.returnParts.length>0">
                <a-row style="font-weight:600;line-height:2">
                  <a-col :span="5">退件名</a-col>
                  <a-col :span="2">单价</a-col>
                  <a-col :span="2">数量</a-col>
                  <a-col :span="2">金额</a-col>
                  <a-col :span="4">退件时间</a-col>
                  <a-col :span="4">退件单号</a-col>
                  <a-col :span="3">状态</a-col>
                  <a-col v-if="MyInfo.roleName === 'After_salesDirector' || MyInfo.roleName === 'After_salesManager'"><a @click="agreeReturn(item1)">同意退件</a></a-col>
                </a-row>
                <a-checkbox-group @change="changeReturn" style="width:100%;">
                  <a-row v-for="(part, index) in item1.returnParts" :key="index" class="rowActive">
                    <a-col :span="5">{{ part.returnName }}</a-col>
                    <a-col :span="2">{{ part.unitPrice }}</a-col>
                    <a-col :span="2">{{ part.returnNum }}</a-col>
                    <a-col :span="2">{{ part.totalPrice }}</a-col>
                    <a-col :span="4">{{ part.returnTime | moment }}</a-col>
                    <a-col :span="4">{{ part.returnNumber }}</a-col>
                    <a-col :span="3" v-if="part.returnStatus==='APPROVED'"><a>审批通过</a></a-col>
                    <a-col :span="3" v-else>待审批</a-col>
                    <a-checkbox v-if="MyInfo.roleName === 'After_salesDirector' || MyInfo.roleName === 'After_salesManager'" :value="part" :disabled="part.returnStatus==='APPROVED'"></a-checkbox>
                  </a-row>
                </a-checkbox-group>
              </a-descriptions-item>
              <a-descriptions-item label="选择退款退件数量" :span="2">
                <div v-if="item1.afterSaleExpresses.length>0">
                  <a-row style="font-weight:600;line-height:2">
                    <a-col :span="8">已发配件</a-col>
                    <a-col :span="4">单价</a-col>
                    <a-col :span="6">已发数量</a-col>
                    <a-col :span="6">选择数量</a-col>
                  </a-row>
                  <div v-for="(item2, index2) in item1.afterSaleExpresses" :key="index2">
                    <a-row>
                      <a-col :span="8">{{ item2.pieceName }}</a-col>
                      <a-col :span="4">{{ item2.piecePrice }}</a-col>
                      <a-col :span="6">{{ item2.pieceNum }}</a-col>
                      <a-col :span="6"><a-input-number :min="0" :max="item2.pieceNum" @change="value => accessoriesChange(item1.id,item2,value)"/></a-col>
                    </a-row>
                  </div>
                  <div v-if="item1.needVisit">
                    <a-row>
                      <a-col :span="8">师傅上门费</a-col>
                      <a-col :span="4">{{ item1.afterSaleVisit.technicalPrice }}</a-col>
                      <a-col :span="6">1</a-col>
                      <a-col :span="6">
                        <a-checkbox v-model="accessories.filter(i => i.processId === item1.id)[0].isVisit" :disabled="item1.returnParts.some(i => i.returnName === '师傅上门费')">
                          <!-- {{ accessories.filter(i => i.processId === item1.id)[0].isVisit }} -->
                        </a-checkbox>
                      </a-col>
                    </a-row>
                  </div>
                  <div v-for="total in totalRefund" :key="total.id">
                    <span v-if="total.id===item1.id" style="color:red;padding-top: 20px;">
                      <span v-if="item1.discount && item1.pays.length>0">
                        折扣：{{ item1.discount }}折
                        <span style="margin-left:100px;">本次预计退款：￥{{ total.totalNum * item1.discount / 10 }}</span>
                      </span>
                      <span v-else-if="item1.pays.length>0">本次预计退款：￥{{ total.totalNum }}</span>
                    </span>
                  </div>
                </div>
                <a v-else>无寄件信息</a>
              </a-descriptions-item>
              <a-descriptions-item label="申请操作">
                <a-button :disabled="item1.afterSaleExpresses.length>0?false:true" @click="returnPart(item1)">
                  <!-- 退件{{ item1.pays.length>0?'退款':'' }}申请 -->
                  提交申请
                </a-button>
                <!-- <a-button v-if="item1.pays.length>0" :disabled="item1.pays[0].actualAmount===0?true:false" @click="handRefund(item1)">退款</a-button> -->
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <!-- <div v-else>无付款记录</div> -->
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { saleRefund, processPay, getSaleRepair, updateStatus, updateProcess } from '@/api/afterSale'
import md5 from '../../utils/md5'
export default {
  props: {
    drawbackVisible: {
      type: Boolean,
      default: false
    },
    returnPartData: {
      type: Object,
      default: () => {
        return {}
      }
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
      returnNo: '',
      returnParts: [],
      returnList: [], // 选中同意退件的退件
      MyInfo: {}
    }
  },
  methods: {
    async agreeReturn (item1) {
      if (this.returnList.length === 0) {
        this.$message.warning('未选择任何退件')
        return
      }
      const payLoad = {}
      payLoad.returnParts = []
      item1.returnParts.map(item => {
        if (this.returnList.includes(item)) {
          payLoad.returnParts.push({ ...item, returnStatus: 'APPROVED' })
        } else {
          payLoad.returnParts.push(item)
        }
      })
      // payLoad.returnParts = this.returnList.map(item => {
      //   return { ...item, returnStatus: 'WAIT_APPROVAL' }
      // })
      if (item1.pays.length > 0) {
        this.$confirm({
          title: '该订单需要退款审批，是否同意？',
          content: (
            <div style="margin: 20px 10px;">
              <div style="margin-bottom: 12px;">请输入密码验证身份</div>
              <a-input-password placeholder="请输入密码" />
            </div>
          ),
          onOk: () => {
            this.updateProcess(this.saleId, item1.id, payLoad)
            this.handRefund(this.saleId, item1, this.returnList)
          },
          onCancel () {
            console.log('Cancel')
          }
        })
      } else {
        this.updateProcess(this.saleId, item1.id, payLoad)
      }
    },
    changeReturn (e) {
      this.returnList = e
    },
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
    async returnPart (item1) {
      console.log('this.accessories', this.accessories)
      const payLoad = {
        returnParts: item1.returnParts
      }
      let shouldUpdate = true
      const unadorned = item1.returnParts
      // 如果有师傅上门费则先申请师傅上门
      const isVisit = this.accessories.filter(i => i.processId === item1.id)[0].isVisit
      if (isVisit) {
        unadorned.map(item => {
          if (item.returnName === '师傅上门费') {
            this.$message.warning('请勿重复提交师傅上门费')
            shouldUpdate = false
          }
        })
        if (shouldUpdate) {
          payLoad.returnParts.push({
            returnName: '师傅上门费', returnNum: 1, returnTime: new Date(), unitPrice: item1.afterSaleVisit.technicalPrice, totalPrice: item1.afterSaleVisit.technicalPrice, returnStatus: 'WAIT_APPROVAL'
          })
          const res = await updateProcess(this.saleId, item1.id, payLoad)
          if (res.status === 200) {
            this.$message.success('师傅费用申请成功')
            this.accessories = this.accessories.map(item => {
              return { ...item, isVisit: false }
            })
            this.getSaleDate()
            // this.handRefund(item1)
          }
        }
        return
      }
      const returnParts = this.returnParts.filter(item => { return item.processId === item1.id })[0]?.parts.filter(part => { return part.num > 0 })
      if (returnParts.length === 0 && !isVisit) {
        this.$message.warning('退件数不可为空')
        return
      }
      payLoad.returnParts = returnParts.map(item => {
        const totalPrice = item1.discount ? item.num * item.piecePrice * item1.discount / 10 : item.num * item.piecePrice * 10 / 10
        return { returnNumber: this.returnNo, returnName: item.accessoryName, returnNum: item.num, returnTime: new Date(), unitPrice: item.piecePrice, totalPrice, returnStatus: 'WAIT_APPROVAL' }
      }).concat(unadorned)
      item1.afterSaleExpresses.map(sendItem => {
        var num = 0
        payLoad.returnParts.map(item => {
          if (item.returnName === sendItem.pieceName) {
            num = num + item.returnNum
          }
        })
        if (num > sendItem.pieceNum) {
          this.$message.error('【' + sendItem.pieceName + '】退件总数超出寄件总数')
          shouldUpdate = false
        }
      })
      if (shouldUpdate) {
        const restlt = await this.handReturnNo()
        if (restlt !== 'error') {
          const res = await updateProcess(this.saleId, item1.id, payLoad)
          if (res.status === 200) {
            this.$message.success('退件成功')
            this.getSaleDate()
            // this.handRefund(item1)
          }
        }
      }
      console.log('退件payLoad', payLoad, item1.afterSaleExpresses)
    },
    async updateProcess (saleId, processId, payLoad) {
      const res = await updateProcess(saleId, processId, payLoad)
      if (res.status === 200) {
        this.$message.success('审核成功')
        this.getSaleDate()
      }
    },
    handRefund (saleId, item1, agreeReturnParts) {
      if (item1.pays.length === 0) {
        return
      }
      // if (item1.afterSaleExpresses.length < 1) {
      //   this.$message.warning('请先退件再退款')
      //   return
      // }
      const myDate = Date.parse(new Date())
      // const myYear = myDate.getFullYear()
      // const myMonth = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      // const myToday = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
      // const myHour = myDate.getHours()
      const outRefundNo = 'TK' + myDate + saleId + item1.id
      // 退款金额
      // const refundFee = this.totalRefund.filter(item => {
      //   return item.id === item1.id
      // })
      var refundFee = 0
      agreeReturnParts.map(item => {
        refundFee = refundFee + item.totalPrice
      })
      var refundReason = ''
      // this.accessories.map(item => {
      //   if (item.processId === item1.id) {
      //     item.parts.map(part => {
      //       refundReason = refundReason + part.accessoryName + '(' + part.num + '件)；'
      //     })
      //   }
      // })
      agreeReturnParts.map(item => {
        refundReason = refundReason + item.returnName + '(' + item.returnNum + '件)；'
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
        notifyUrl: 'https://hms.yootane.com/api/pay/notify/order', // 微信支付结果通知的回调地址
        totalFee: item1.pays[0].actualAmount * 100, // 订单金额  item1.pays[0].actualAmount
        // refundFee: item1.discount ? refundFee[0].totalNum * item1.discount / 10 * 100 : refundFee[0].totalNum * 100,
        refundFee: refundFee * 100,
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
      this.returnParts = a
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
    },
    async handReturnNo () {
      if (this.returnNo) {
        const data = {}
        data.returnsNumber = this.drawbackData.returnsNumber
        data.returnsNumber.push(this.returnNo)
        const res = await updateStatus(this.drawbackData.id, data)
        console.log(res)
        if (res.status === 200) {
          this.$message.success('添加成功')
        }
      } else {
        this.$message.warning('请填写退件单号')
        return 'error'
      }
    }
  },
  created () {
  },
  mounted () {
    console.log('挂载时')
    // this.getSaleDate()
  },
  watch: {
    drawbackVisible (newVal, oldVal) {
      if (newVal) {
        this.drawbackData = this.returnPartData
        this.MyInfo = JSON.parse(localStorage.getItem('MyInfo'))
        this.accessories = this.returnPartData.processes.map(item => {
          // const isVisit = item.returnParts.some(i => i.returnName === '师傅上门费')
          return { processId: item.id, parts: [], isVisit: false }
        })
        this.returnList = []
        this.returnNo = ''
      }
    }
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
