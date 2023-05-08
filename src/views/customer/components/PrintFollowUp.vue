<template>
  <div>
    <a-modal
      :visible="visible"
      @cancel="closePrintModal"
      :width="1100"
    >
      <div>
        <div id="printArea">
          <div class="msg">
            <a-row class="msg_top">
              <a-col class="msg_title" :span="6" :push="1">
                <span >随访信息记录</span>
              </a-col>
              <a-col :span="4" :push="13">
                <span>
                  <img class="msg_picture" src="@/assets/printLogo.png">
                </span>
              </a-col>
            </a-row>
          </div>
          <div class="user_msg">
            <a-row>
              <a-col :span="7" :offset="1">
                <a-row>
                  <a-col :span="8" class="msg_label">姓名</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.name">
                    </a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7" >
                <a-row>
                  <a-col :span="8" class="msg_label">性别</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.gender"></a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7">
                <a-row>
                  <a-col :span="8" class="msg_label">年龄</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.age"></a-input>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7" :offset="1">
                <a-row>
                  <a-col :span="8" class="msg_label">血型</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.aboBloodType">
                    </a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7" >
                <a-row>
                  <a-col :span="8" class="msg_label">本人电话</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.phoneNumber"></a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7">
                <a-row>
                  <a-col :span="8" class="msg_label">家人电话</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.contactNumber"></a-input>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7" :offset="1">
                <a-row>
                  <a-col :span="8" class="msg_label">创建日期</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.createdAt">
                    </a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7" >
                <a-row>
                  <a-col :span="8" class="msg_label">发送时间</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.sendAt"></a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7">
                <a-row>
                  <a-col :span="8" class="msg_label">回收时间</a-col>
                  <a-col :span="15">
                    <a-input size="small" v-model="userData.receivedAt"></a-input>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
          <div class="tip_msg" v-if="hintsData">
            <a-card size="small" title="填写提示" class="card">
              <div style="font-size: 12px;">{{ hintsData }}</div>
            </a-card>
          </div>
          <div class="index_msg" v-if="indexData.length">
            <a-row>
              <a-col>
                <span style="font-size: 16px;font-weight: 1000">指标信息</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col>
                检查项目：
                <span v-for="indexTitle in projects" :key="indexTitle.id">
                  {{ indexTitle.name }}
                </span>
              </a-col>
            </a-row>
            <a-row>
              <a-col>
                <a-table
                  :data-source="indexData"
                  :rowKey="(record, index) => index"
                  :columns="indexColumns"
                  size="small"
                  bordered
                  :pagination="false"
                >

                </a-table>
              </a-col>
            </a-row>
          </div>
          <div class="symptom_msg" v-if="symptomData.length">
            <a-card size="small" title="用户症状" class="card">
              <div style="font-size: 12px;"></div>
            </a-card>
          </div>
          <div class="medicine_msg" v-if="medicineData.length">
            <a-row>
              <a-col>
                <span style="font-size: 16px;font-weight: 1000">用药情况</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col>
                <a-table
                  :columns="medicineColumns"
                  size="small"
                  bordered
                  :pagination="false"
                >

                </a-table>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" v-print="print">打印</a-button>
        <a-button @click="closePrintModal">取消</a-button>
        <!-- <button v-print="print">打印</button> -->
      </template>
    </a-modal>
  </div>
</template>
<script>
import { showFollowForm as apiShowFollowForm } from '@/api/followUpForm'
import { getHealthIndex } from '@/api/health'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closePrint: {
      type: Function,
      default: function () {
        return null
      }
    },
    printData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      indexColumns: [
        {
          title: '指标名称',
          dataIndex: 'indexName',
          align: 'center',
          key: 'indexName'
        },
        {
          title: '指标值',
          dataIndex: 'indexValue',
          align: 'center',
          key: 'indexValue'
        },
        {
          title: '指标单位',
          dataIndex: 'indexUnit',
          align: 'center',
          key: 'indexUnit'
        },
        {
          title: '指标备注',
          dataIndex: 'indexRemark',
          align: 'center',
          key: 'indexRemark'
        }
      ],
      medicineColumns: [
        {
          title: '指标名称',
          dataIndex: 'medicineName',
          align: 'center',
          key: 'medicineName'
        },
        {
          title: '指标名称',
          dataIndex: 'medicineDose',
          align: 'center',
          key: 'medicineDose'
        }
      ],
      indexData: [],
      medicineData: [],
      userData: {
        name: '',
        gender: '',
        age: '',
        aboBloodType: '',
        phoneNumber: '',
        contactNumber: '',
        createdAt: '',
        sendAt: '',
        receivedAt: ''
      },
      symptomData: [],
      hintsData: '',
      print: {
        id: 'printArea',
        popTitle: '患者健康信息表', // 打印配置页上方的标题
        // extraHead: '', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
        preview: false, // 是否启动预览模式，默认是false
        previewTitle: '预览的标题', // 打印预览的标题
        previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
        zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
        // previewBeforeOpenCallback () { console.log('正在加载预览窗口！'); console.log(this) }, // 预览窗口打开之前的callback
        // previewOpenCallback () { console.log('已经加载完预览窗口，预览打开了！') }, // 预览窗口打开时的callback
        // beforeOpenCallback () { console.log('开始打印之前！') }, // 开始打印之前的callback
        // openCallback () { console.log('执行打印了！') }, // 调用打印时的callback
        // closeCallback () { console.log('关闭了打印工具！') }, // 关闭打印的callback(无法区分确认or取消)
        // clickMounted () { console.log('点击v-print绑定的按钮了！') },
        // url: 'http://localhost:8080/', // 打印指定的URL，确保同源策略相同
        // asyncUrl (reslove) {
        //   setTimeout(() => {
        //     reslove('http://localhost:8080/')
        //   }, 2000)
        // },
        standard: '',
        extarCss: ''
      },
      projects: [], // 指标对应的项目
      itemData: []
    }
  },
  methods: {
    closePrintModal () {
      this.$emit('closePrint')
    },
    filterAge (value) {
      const userYear = new Date(value).getFullYear()
      const userMonth = new Date(value).getMonth() + 1
      const userDay = new Date(value).getDay()
      const nowDate = new Date()
      const nowMonth = nowDate.getMonth() + 1
      const nowDay = nowDate.getDate
      let age = nowDate.getFullYear() - userYear
      if (nowMonth < userMonth || (userMonth === nowMonth && nowDay < userDay)) {
        return age-- + '岁'
      } else {
        return age + '岁'
      }
    },
    filterTime (value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let min = date.getMinutes()
      min = min < 10 ? ('0' + min) : min
      const time = y + '-' + m + '-' + d + ' ' + h + ':' + min
      return time
    },
    loadData () {
      this.getHealthIndex()
      // console.log('printData', this.printData)
      const printData = this.printData
      const userData = this.userData
      userData.name = printData.customer.baseInfo.name
      userData.gender = printData.customer.baseInfo.gender
      userData.age = this.filterAge(printData.customer.baseInfo.birthDate)
      userData.aboBloodType = printData.customer.baseInfo.aboBloodType || '---'
      userData.phoneNumber = printData.customer.baseInfo.phoneNumber || '---'
      userData.contactNumber = printData.customer.baseInfo.contactNumber || '---'
      userData.createdAt = printData.createdAt ? this.filterTime(printData.createdAt) : '---'
      userData.sendAt = printData.sendAt ? this.filterTime(printData.sendAt) : '---'
      userData.receivedAt = printData.receivedAt ? this.filterTime(printData.receivedAt) : '---'
      // if (printData.receivedAt) {
      //   userData.receivedAt = this.filterTime(printData.receivedAt)
      // } else {
      //   userData.receivedAt = '---'
      // }
      const custId = this.printData.customerId
      const followupId = this.printData.id
      apiShowFollowForm(custId, followupId).then((res) => {
        if (res.status === 200) {
          // console.log('apiprintData', res.data)
          // 填写提示
          this.hintsData = res.data.hints
          // 指标
          this.itemData = res.data.items
          const indexMsg = res.data.items
          for (let i = 0; i < indexMsg.length; i++) {
            // console.log(indexMsg[i].name)
            const addIndex = {
              indexName: indexMsg[i].name,
              indexValue: indexMsg[i].value || '---',
              indexRemark: indexMsg[i].remark || '---',
              indexUnit: indexMsg[i].indexItem.unit || '---'
            }
            this.indexData.push(addIndex)
          }
        }
      })
    },
    // 获取指标项目名
    async getHealthIndex () {
      const res = await getHealthIndex()
      // console.log(this.itemData)
      const items = this.itemData.filter(item => { if (item.indexItem !== null) return true })
      if (res.status === 200) {
        this.projects = (res.data || []).filter(project => {
          for (var index of project.items) {
            for (var i of items) {
              if (i.indexItem.id === index.id) {
                return true
              }
            }
          }
        })
        // console.log(this.projects)
      }
    }
  },
  created () {
  },
  mounted () {
    this.loadData()
  }
}
</script>
<style lang="less" scoped>
.msg_top{
  /* padding-top: 15px; */
  /* border-style:solid; */
  border-width: 1px;
  // background-color: #299B96
  background-color: #31ADA9;
  display: flex;
}
.msg_title{
  font-size: 26px;
  /* margin-left: 3%; */
  color:white;
  align-self:center;
}
.msg_picture{
  width: 160px;
  object-fit: contain;
  float: right;
}
.user_msg {
  padding: 5px;
  background-color: #F2F2F2;
}
.msg_label{
  text-align: right;
  // margin-top: 5px;
  margin-right: 2px;
}
.card {
  margin-bottom: 24px;
}
.tip_msg{
  margin-top: 1%;
  /deep/ .ant-card-head-title{
    font-size: 16px;
    // font-weight: 1000
  }
}
.symptom_msg{
  margin-top: 1%;

  /deep/ .ant-card-head-title{
    font-size: 16px;
    // font-weight: 1000
  }
}
.index_msg{
  margin-top: 1%;
  /deep/ .ant-table-body{
    background-color: white;
    font-size: 1px;
    line-height: 12px;
    margin: 0px;
  }
}
</style>
