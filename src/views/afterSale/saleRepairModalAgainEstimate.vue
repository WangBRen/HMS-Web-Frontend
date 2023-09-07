<template>
  <div>
    <a-modal
      title="填写原因"
      :width="600"
      :visible="estimateVisible"
      v-if="estimateVisible"
      @cancel="handleCancel"
      :footer="null"
      :maskClosable="false"
    >
      <div style="text-align:center;">
        <!-- <a-input v-model="text" placeholder="请输入原因"></a-input> -->
        <a-textarea
          v-model="text"
          placeholder="请输入原因"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
        <a-popconfirm :title="`${modalIndex==='3' ? '确定用户已支付？':'确定售后问题没有解决？'}`" @confirm="handleOk">
          <a-button style="margin-top: 10px;" type="primary">确定</a-button>
        </a-popconfirm>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { updateStatus as apiUpdateStatus, updateProcess as apiUpdateProcess } from '@/api/afterSale'
// import { updateProcess as apiUpdateProcess } from '@/api/afterSale'
import { getUserInfo as apiGetUserInfo } from '@/api/login'
export default {
  props: {
    estimateVisible: {
      type: Boolean,
      default: false
    },
    transferData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    modalIndex: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      text: ''
    }
  },
  methods: {
    handleOk () {
      if (this.text) {
        // console.log(this.modalIndex, this.text, this.transferData)
        const id = this.transferData.id
        const process = this.transferData.processes[this.transferData.processes.length - 1]
        const processId = process.id
        if (this.modalIndex === '1') {
          // console.log('再评估')
          // 获取登录用户
          apiGetUserInfo().then(res => {
            if (res.status === 200) {
              const changeData = {
                isInvalid: false,
                againEstimateName: res.data.userInfo.name,
                againEstimateReason: this.text
              }
              // console.log(id, processId, changeData)
              // 改变流程里的状态
              apiUpdateProcess(id, processId, changeData).then(res => {
                if (res.status === 200) {
                  // this.$message.success('状态改变成功')
                  // 改变大状态
                  const changeStatus = { status: 'WAIT_EVALUATE' }
                  apiUpdateStatus(id, changeStatus).then(res => {
                    if (res.status === 200) {
                      this.$message.success('成功')
                      this.handleCancel()
                      this.$parent.closeRepairModals()
                    } else {
                      this.$message.error(res.message)
                    }
                  })
                } else {
                  this.$message.error(res.message)
                }
              })
            }
          })
        } else if (this.modalIndex === '2') {
          // console.log('未解决')
          apiGetUserInfo().then(res => {
            if (res.status === 200) {
              const changeData = {
                unresolvedName: res.data.userInfo.name,
                unresolvedReason: this.text,
                feedbackTime: new Date()
              }
              // console.log(id, processId, changeData)
              // 改变流程里的状态
              apiUpdateProcess(id, processId, changeData).then(res => {
                if (res.status === 200) {
                  // this.$message.success('状态改变成功')
                  const changeStatus = { status: 'WAIT_EVALUATE' }
                  // console.log(id, changeStatus)
                  apiUpdateStatus(id, changeStatus).then(res => {
                    if (res.status === 200) {
                      this.$message.success('成功')
                      this.handleCancel()
                      this.$parent.getParentSaleData()
                      this.$parent.closeRepairModals()
                    } else {
                      this.$message.error(res.message)
                    }
                  })
                } else {
                  this.$message.error(res.message)
                }
              })
            }
          })
        } else if (this.modalIndex === '3') {
              const changeData = {
                otherPayReason: this.text,
                payResult: true
              }
              apiUpdateProcess(id, processId, changeData).then(res => {
                if (res.status === 200) {
                  // this.$message.success('状态改变成功')
                  let changeStatus = {}
                  // 判断是否需要寄件
                  if (process.needPieceSend === false && process.needVisit === false) {
                    // 不需寄件 不需上门
                    changeStatus = { status: 'WAIT_VISIT' }
                  } else if (process.needPieceSend === false && process.needVisit === true) {
                    // 不需寄件 需上门
                    changeStatus = { status: 'RECEIVED' }
                  } else if (process.needPieceSend === true) {
                    // 需寄件
                    changeStatus = { status: 'PAID' }
                  }
                  apiUpdateStatus(id, changeStatus).then(res => {
                    if (res.status === 200) {
                      this.$message.success('成功')
                      this.handleCancel()
                      this.$parent.getParentSaleData()
                      this.$parent.closeRepairModals()
                    } else {
                      this.$message.error(res.message)
                    }
                  })
                } else {
                  this.$message.error(res.message)
                }
              })
        }
      } else {
        this.$message.error('请填写原因')
      }
    },
    handleCancel () {
      this.text = ''
      this.$emit('closeEstimate')
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
