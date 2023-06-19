<template>
  <div>
    <a-modal
      forceRender
      destroyOnClose
      :width="1200"
      :footer="null"
      :visible="openHealthvisible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      :ok-button-props="{ style: { display: 'none' } }"
      :scroll="{ x: true }"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item>
                <a-input-search
                  placeholder="请输入关键字"
                  enter-button="查询"
                  :loading="confirmLoading"
                  v-model="wordValue"
                  @search="findCustomerHealthReports"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" />
            <a-col :md="4" :sm="24" :pull="1">
              <span class="table-page-search-submitButtons">
                <a-button type="primary " @click="handOpenHealthAdd" style="margin-left: 8px">新建</a-button>
                <a-button :disabled="selectReport.length ? false : true" type="primary " @click="printerOpen(selectReport[0])" style="margin-left: 8px">打印</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :rowKey="(record,index)=> record.id"
        :row-selection="rowSelection"
        :pagination="pagination">
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewingTheTeportForm(record)">查看报告单</a>
          <!-- <a-icon @click="printerOpen(record)" type="printer" /> -->
          <!-- <a-popconfirm title="你确定要删除吗" @confirm="confirm($event,action)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm> -->
        </span>
        <span slot="tags" slot-scope="text, record">
          <a-tag
            v-for="item in record.projects"
            :key="item"
            :color=" 'geekblue'"
          >{{ item }}</a-tag>
          <span v-if="record.symptom.length > 0">
            <a-tooltip placement="top">
              <template slot="title">
                {{ record.symptom }}
              </template>
              <a-tag :color=" 'orange'">用户症状</a-tag>
            </a-tooltip>
          </span>
          <span v-if="record.disease">
            <a-tooltip placement="top">
              <template slot="title">
                {{ record.disease.title }}
              </template>
              <a-tag :color=" 'volcano'">用户诊断</a-tag>
            </a-tooltip>
          </span>
        </span>
        <!-- <span slot="updatedAt" slot-scope="text, record">
          {{ record.updatedAt ? moment(record?.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '' }}
        </span> -->
      </a-table>
    </a-modal>

    <a-modal
      :visible="printeVisible"
      @cancel="printCancel"
      :width="1100"
    >
      <div id="printArea">
        <div>
          <a-row class="msg_top">
            <a-col class="msg_title" :span="6" :push="1">
              <span >健康信息记录</span>
            </a-col>
            <a-col :span="4" :push="13">
              <span>
                <img class="msg_picture" src="@/assets/printLogo.png">
              </span>
            </a-col>
          </a-row>
          <div class="msg_user">
            <a-row>
              <a-col :span="7" :offset="1">
                <a-row>
                  <a-col :span="8" class="msg_label">姓名</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.customer.baseInfo.name">
                    </a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7" >
                <a-row>
                  <a-col :span="8" class="msg_label">性别</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.customer.baseInfo.gender"></a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7">
                <a-row>
                  <a-col :span="8" class="msg_label">年龄</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.customer.baseInfo.birthDate"></a-input>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7" :offset="1">
                <a-row>
                  <a-col :span="8" class="msg_label">血型</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.customer.baseInfo.aboBloodType">
                    </a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7" >
                <a-row>
                  <a-col :span="8" class="msg_label">Rh血型</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.customer.baseInfo.rhBloodType"></a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7">
                <a-row>
                  <a-col :span="8" class="msg_label">联系方式</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.customer.baseInfo.phoneNumber"></a-input>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="7" :offset="1">
                <a-row>
                  <a-col :span="8" class="msg_label">健康师</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.printName">
                    </a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7" >
                <a-row>
                  <a-col :span="8" class="msg_label">打印日期</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.nowDate"></a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="7">
                <a-row>
                  <a-col :span="8" class="msg_label">开始日期</a-col>
                  <a-col :span="14">
                    <a-input size="small" v-model="printdata.startDate"></a-input>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
          <div class="diagnosis_msg" v-if="diagnosisData.length">
            <a-row>
              <span style="font-size: 16px;font-weight: 1000">诊断信息</span>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-table
                  :columns="diaColumns"
                  :data-source="diagnosisData"
                  size="small"
                  :rowKey="(record, index) => index"
                  bordered
                  :pagination="false">
                  <span slot="diseaseAt" slot-scope="text, record">
                    {{ record.diseaseAt | getMoment }}
                  </span>
                </a-table>
              </a-col>
            </a-row>
          </div>
          <div class="symptom_msg" v-if="symptomData.length">
            <a-row>
              <span style="font-size: 16px;font-weight: 1000">症状信息</span>
            </a-row>
            <a-row >
              <a-col :span="24">
                <a-table
                  :columns="symColumns"
                  :data-source="symptomData"
                  size="small"
                  :rowKey="(record, index) => index"
                  bordered
                  :pagination="false">
                  <span slot="symTime" slot-scope="text, record">
                    {{ record.symTime | getMoment }}
                  </span>
                </a-table>
              </a-col>
            </a-row>
          </div>
          <a-row v-if="indexEndData.length">
            <span style="font-size: 16px;font-weight: 1000">指标信息</span>
          </a-row>
          <div class="index_msg" v-for="(item, index) in indexEndData" :key="index">
            <a-row>
              <a-col :span="12">
                健康项目：{{ item.indexProjectName }}
              </a-col>
              <a-col :span="7">
                记录时间：{{ item.createdAt | getMoment }}
              </a-col>
              <a-col :span="5">
                记录健康师：{{ item.indexRecorder }}
              </a-col>
            </a-row>
            <a-row class="index_msg_body">
              <!-- <a-col class="table_title" :span="2">指标信息</a-col> -->
              <a-col :span="24">
                <a-table
                  :columns="indexColumns"
                  :rowKey="(record, index) => index"
                  :data-source="item.indexGroup"
                  size="small"
                  bordered
                  :pagination="false">
                  <span slot="createdAt" slot-scope="text, record">
                    {{ record.createdAt | getMoment }}
                  </span>
                </a-table>
                <a-row>
                  <a-col v-if="item.mark > 0" style="text-align: left;font-size: 14px;">
                    <b>异常指标小结：</b>
                  </a-col>
                  <a-col style="font-size: 12px;">
                    <div v-for="indexItem in item.indexGroup" :key="indexItem.index">
                      <div v-if="indexItem.abnormalGroup !== null">
                        <b>{{ indexItem.indexName }}</b> : {{ indexItem.abnormalGroup }}
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" v-print="print">打印</a-button>
        <a-button @click="printCancel">取消</a-button>
        <!-- <button v-print="print">打印</button> -->
      </template>
    </a-modal>
    <HealthReportSee ref="seeReport" />
    <HealthReportAdd ref="addReport" @successCreatReport="RefreshReport"/>
  </div>
</template>
<script>
import moment from 'moment'
import HealthReportSee from './HealthReportSee.vue'
import HealthReportAdd from './HealthReportAdd.vue'
import { getHealthReport as apiGetHealthReports, getHealthCustomerReport } from '@/api/health'
import { getUserInfo } from '@/api/login'
// import { calcAge } from '@/utils/age'
// import { getIndexColumns as apiGetIndexColumns } from '@/api/healthIndexes'

const dataSource = []

export default {
   components: {
    HealthReportSee,
    HealthReportAdd
  },
  props: {
    openHealthvisible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: -1
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
  data () {
    return {
      custId: '',
      userInfo: [], // 保存用户信息
      reportId: '',
      // eslint-disable-next-line no-undef
      dataSource,
      columns: [
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          align: 'center',
          width: 260,
          customRender: (text, record, index) => {
            return record ? moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
          }
        },
        {
          title: '创建人',
          dataIndex: 'createdBy',
          key: 'createdBy',
          align: 'center',
          width: 260,
          customRender: (text, record) => {
            return record.createdBy ? record.createdBy.nickname : ''
          }
        },
        {
          title: '健康项目名称',
          dataIndex: 'projects',
          key: 'projects',
          align: 'center',
          scopedSlots: { customRender: 'tags' },
          filters: [{ text: '用户诊断', value: 'disease' },
                    { text: '用户症状', value: 'symptom' },
                    { text: '其他指标', value: 'projects' }],
          onFilter: (value, record) => {
            if (value === 'disease' && record.disease !== null) { return true }
            if (value === 'symptom' && record.symptom.length > 0) { return true }
            if (value === 'projects' && record.projects.length !== 0) { return true }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 230
        }
      ],
      diaColumns: [
        {
          title: '记录时间',
          dataIndex: 'diseaseAt',
          align: 'center',
          key: 'diseaseAt',
          scopedSlots: { customRender: 'diseaseAt' }
        },
        {
          title: '记录健康师',
          dataIndex: 'disRecorder',
          align: 'center',
          key: 'disRecorder'
        },
        {
          title: '诊断结果',
          dataIndex: 'disTitle',
          align: 'center',
          key: 'disTitle'
        },
        {
          title: '诊断文件名',
          dataIndex: 'disFiles',
          align: 'center',
          key: 'disFiles'
        }
      ],
      symColumns: [
        {
          title: '记录时间',
          dataIndex: 'symTime',
          align: 'center',
          key: 'symTime',
          scopedSlots: { customRender: 'symTime' }
        },
        {
          title: '记录健康师',
          dataIndex: 'recorder',
          align: 'center',
          key: 'recorder'
        },
        {
          title: '症状信息',
          dataIndex: 'splData',
          align: 'center',
          key: 'splData'
        }
      ],
      indexColumns: [
        {
          title: '指标名称',
          dataIndex: 'indexName',
          align: 'center',
          key: 'indexName',
          customHeaderCell: () => {
            return {
              style: {
                'min-width': '80px'
              }
            }
          }
        },
        {
          title: '检查值',
          dataIndex: 'indexValue',
          align: 'center',
          key: 'indexValue'
        },
        {
          title: '参考范围',
          dataIndex: 'indexRange',
          align: 'center',
          key: 'indexRange'
        },
        {
          title: '检查结果',
          dataIndex: 'indexResult',
          align: 'center',
          key: 'indexResult'
        }
      ],
      confirmLoading: false,
      filtersVisible: false,
      saveTableTitle: [],
      wordValue: '',
      pages: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      printeVisible: false,
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
      printdata: {
        nowDate: '',
        startDate: '',
        printName: '',
        createdBy: {
          nickname: ''
        },
        customer: {
          baseInfo: {
            name: '',
            gender: '',
            birthDate: '',
            aboBloodType: '',
            rhBloodType: '',
            phoneNumber: ''
          }
        }
      },
      symptomData: [],
      diagnosisData: [],
      indexEndData: [],
      selectReport: []
    }
  },
  mounted () {
    if (this.custId) {
      this.findCustomerHealthReports()
    }
  },
  methods: {
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
    moment,
    setCustomerId (customersId, userInfo) {
      this.custId = customersId
      this.userInfo = userInfo
    },
    /**
     * 查找用户自己的指标
     */
    findCustomerHealthReports (value) {
      this.loadingShow = true
      // this.dataSource = []
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      apiGetHealthReports(this.custId, value, pages).then(res => {
      if (res.status === 200) {
        this.loadingShow = false
        this.dataSource = res.data.content || []
        this.pagination.total = res.data.totalElements
      } else {
        this.dataSource = []
      }
      // console.log('this.dataSource', this.dataSource)
      })
    },
    onPageChange (page, _pageSize) {
      this.pagination.current = page
      this.findCustomerHealthReports(this.wordValue)
    },
    onSizeChange (_current, pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.findCustomerHealthReports(this.wordValue)
    },
    // 点击了取消
    handleCancel () {
      this.$emit('handleCancel')
      this.selectReport = []
      this.filtersVisible = false
    },
    // 新建报告单
    handOpenHealthAdd () {
      // 在这传custmoerId
      const cusmId = this.custId
      const userInfo = this.userInfo
      this.$refs.addReport.openAddModal(userInfo)
      this.$refs.addReport.openADDmodalCustId(cusmId)
    },
    // 查看报告单
    handleViewingTheTeportForm (data) {
      const cusmId = this.custId // 存customerId
      const reportId = data.id // 存reportId
      // console.log('cusmId', cusmId)
      // console.log('报告单', reportId)
      getHealthCustomerReport(cusmId, reportId).then((res) => {
        if (res.status === 200) {
          // console.log('接口查报告单', res.data)
          this.$refs.seeReport.openSeeModal()
          this.$refs.seeReport.seeReportCom(res.data)
        } else {
          this.$message.error(res.message || '查看报告单出错')
        }
      })
    },
    printerOpen (data) {
      this.printeVisible = true
      // 获取登陆账号，定义打印健康师
      getUserInfo().then(res => {
        if (res.status === 200) {
          // console.log('loginname', res.data.nickname)
          this.printdata.printName = res.data.nickname
          this.$forceUpdate() // 强刷，没这行代码，打印用户症状和用户诊断时不显示打印健康师
        }
      })
      this.printdata = JSON.parse(JSON.stringify(data))
      this.printdata.customer.baseInfo.birthDate = this.filterAge(this.printdata.customer.baseInfo.birthDate)
      const nowDate = new Date()
      const date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate()
      }
      const newmonth = date.month > 9 ? date.month : '0' + date.month
      const day = date.date > 9 ? date.date : '0' + date.date
      this.printdata.nowDate = date.year + '.' + newmonth + '.' + day
      // console.log('打印-个人信息', this.printdata)
      const testData = this.selectReport
      // console.log('表单信息testData', testData)
      const midData = testData.map((item) => {
        const hhh = {}
        if (item.projects.length) {
          hhh.index = {
            id: item.id,
            indexRecorder: item.createdBy.nickname
          }
        } else {
          hhh.index = null
        }
        if (item.diseaseAt) {
          hhh.dis = {
            disease: item.disease,
            diseaseFiles: item.diseaseFiles,
            diseaseAt: item.diseaseAt,
            disRecorder: item.createdBy.nickname
          }
        } else {
          hhh.dis = null
        }
        if (item.symptom.length) {
          hhh.sym = item.symptom
          hhh.symTime = item.symptomAt
          hhh.recorder = item.createdBy.nickname
        } else {
          hhh.symTime = null
        }
        return hhh
      })
      // console.log('midData', midData)

      // 处理症状
      let symData = midData.map((item) => {
        if (item.symTime !== null) {
          const stmData = {
            symTime: item.symTime,
            sym: item.sym,
            recorder: item.recorder
          }
          return stmData
        }
      }).filter(item2 => item2 !== undefined)
      symData = symData.map((item) => {
        let splData = ''
        for (let i = 0; i < item.sym.length; i++) {
          if (i + 1 !== item.sym.length) {
            splData = splData + item.sym[i] + '、'
          } else {
            splData += item.sym[i]
          }
        }
        const endStm = {
          splData: splData,
          symTime: item.symTime,
          recorder: item.recorder
        }
        return endStm
      })
      this.symptomData = symData
      // console.log('symData', symData)

      // 处理诊断
      const disData = midData.map((item) => {
        if (item.dis) {
          let Files = ''
          if (item.dis.diseaseFiles !== null) {
            for (let i = 0; i < item.dis.diseaseFiles.length; i++) {
              if (i + 1 === item.dis.diseaseFiles.length) {
                Files += item.dis.diseaseFiles[i].fileName
              } else {
                Files += item.dis.diseaseFiles[i].fileName + '、'
              }
            }
          }
          const dis = {
            disRecorder: item.dis.disRecorder,
            disTitle: item.dis.disease.title,
            diseaseAt: item.dis.diseaseAt,
            // disFiles: item.dis.diseaseFiles
            disFiles: Files || '---'
            // disFiles: item.diseaseFiles.map((item) => {
            //   Files += item.fileName
            // })
          }
          // console.log(dis)
          return dis
        }
      }).filter(item2 => item2 !== undefined)
      this.diagnosisData = disData
      // console.log('disData', disData)
      this.indexEndData = []
      // 处理指标
      midData.map((item) => {
        if (item.index) {
          getHealthCustomerReport(this.printdata.customer.id, item.index.id).then((res) => {
            if (res.status === 200) {
              // console.log('指标数据', res.data.projects)
              const projects = res.data.projects
              for (let i = 0; i < projects.length; i++) {
                const aaa = {
                  createdAt: projects[i].createdAt,
                  indexRecorder: item.index.indexRecorder,
                  indexProjectName: projects[i].indexProjectName,
                  indexGroup: [],
                  mark: 0
                }
                for (let j = 0; j < projects[i].items.length; j++) {
                  const output = {
                    indexName: projects[i].items[j].healthIndexItem.name,
                    indexResult: projects[i].items[j].result || '---',
                    abnormalGroup: null
                  }
                  // 判断值
                  if (projects[i].items[j].healthIndexItem.type === 'Report') {
                    output.indexValue = JSON.parse(projects[i].items[j].value)[0].fileName || '---'
                  } else {
                    // if (projects[i].items[j].value !== '' && projects[i].items[j].value !== null) {
                    //   output.indexValue = projects[i].items[j].value + (projects[i].items[j].healthIndexItem.unit || '') || '---'
                    // }
                    output.indexValue = projects[i].items[j].value + (projects[i].items[j].healthIndexItem.unit || '') || '---'
                  }
                  // 判断范围
                  if (projects[i].items[j].healthIndexItem.min === null && projects[i].items[j].healthIndexItem.max === null) {
                    output.indexRange = '---'
                  } else {
                    output.indexRange = projects[i].items[j].healthIndexItem.min + '~' + projects[i].items[j].healthIndexItem.max
                  }
                  // 判断异常
                  // if (projects[i].items[j].healthIndexItem.type === 'Report' || projects[i].items[j].healthIndexItem.type === 'Text' || projects[i].items[j].healthIndexItem.type === 'Integer') {
                  if (projects[i].items[j].result !== null) {
                    for (let k = 0; k < projects[i].items[j].healthIndexItem.result.length; k++) {
                      if ((projects[i].items[j].result === projects[i].items[j].healthIndexItem.result[k].name) && projects[i].items[j].healthIndexItem.result[k].remark !== null && projects[i].items[j].healthIndexItem.result[k].remark !== '') {
                        // console.log(projects[i].items[j].result, projects[i].items[j].healthIndexItem.result[k].remark)
                        output.abnormalGroup = projects[i].items[j].healthIndexItem.result[k].remark
                      }
                    }
                  } else {
                    output.abnormalGroup = null
                  }
                  if (output.abnormalGroup !== null) {
                    aaa.mark++
                  }
                  aaa.indexGroup.push(output)
                }
                this.indexEndData.push(aaa)
              }
            } else {
              this.$message.error(res.message || '查看报告单出错')
            }
          })
        }
      }).filter(item2 => item2 !== undefined)
      // console.log('indexEndData', this.indexEndData)

      // 计算开始时间
      const startTime = testData.map(item => {
        return item.createdAt
      })
      const startDate = new Date(startTime.reduce((a, b) => a > b ? b : a))
      const date1 = {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        date: startDate.getDate(),
        hour: startDate.getHours(),
        min: startDate.getMinutes()
      }
      const newmonth1 = date1.month > 9 ? date1.month : '0' + date1.month
      const day1 = date1.date > 9 ? date1.date : '0' + date1.date
      const min1 = date1.min > 9 ? date1.min : '0' + date1.min
      this.printdata.startDate = date1.year + '.' + newmonth1 + '.' + day1 + '-' + date1.hour + ':' + min1
      // console.log('startDate', this.printdata.startDate)
      // console.log('this.printdata', this.printdata)
    },
    printCancel () {
      this.printeVisible = false
    },
    // 创建报告单成功后刷新
    RefreshReport () {
      this.findCustomerHealthReports()
    },
    // 单选触发
    onSelect (record, selected, selectedRows, nativeEvent) {
      if (selected) {
        this.selectReport.push(record)
      } else {
        const delIndex = this.selectReport.findIndex((val) => {
          return val.id === record.id
        })
        this.selectReport.splice(delIndex, 1)
      }
      // console.log('selectReport', this.selectReport)
    },
    // 多选触发
    onSelectAll (selected, selectedRows, changeRows) {
      if (selected) {
        this.selectReport = this.selectReport.concat(changeRows)
      }
      if (!selected) {
        let selectReport = JSON.parse(JSON.stringify(this.selectReport))
        const delIndex = []
        selectReport.forEach((item, index) => {
          changeRows.forEach((val, itemIndex) => {
            if (item.id === val.id) {
              delIndex.push(index)
            }
          })
        })
        delIndex.forEach((item) => {
          delete selectReport[item]
        })
        selectReport = selectReport.filter((item) => {
          return item !== undefined
        })
        this.selectReport = selectReport
      }
      // console.log('selectReport', this.selectReport)
    }
  },
  computed: {
    rowSelection () {
      return {
        // columnTitle: ' ',
        hideDefaultSelections: true, // 全选
        onSelect: this.onSelect,
        onSelectAll: this.onSelectAll,
        getCheckboxProps: record => ({
          props: {
            // disabled: record.createdBy === this.selectReport[0].nickname // Column configuration not to be checked
          }
        })
      }
    }
  },
  watch: {
    openHealthvisible (newVal, oldVal) {
      if (oldVal) {
        this.pagination.current = 1
      }
      // console.log('newVal, oldVal', newVal, oldVal)
    }
  }
}
</script>
<style lang="less" scoped>
.msg_title{
  font-size: 26px;
  /* margin-left: 3%; */
  color:white;
  align-self:center;
}
.msg_top{
  /* padding-top: 15px; */
  /* border-style:solid; */
  border-width: 1px;
  // background-color: #299B96
  background-color: #31ADA9;
  display: flex;
}
.msg_picture{
  width: 160px;
  object-fit: contain;
  float: right;
}
.msg_label{
  text-align: right;
  // margin-top: 5px;
  margin-right: 2px;
}
.msg_user{
  padding: 5px;
  background-color: #F2F2F2;
}

.table_title{
  font-size: 20px;
  text-align: center;
  position: relative;
  top: 50%;
  transform: translateY(50%);
  font-size: 1px;
}
.diagnosis_msg{
  margin-top: 1%;
  // background-color: #DAEEF3;
  /deep/ .ant-table-body{
    background-color: white;
    font-size: 1px;
    line-height: 12px;
    margin: 0px;
  }
}
.symptom_msg{
  margin-top: 1%;
  // background-color: #DAEEF3;
  /deep/ .ant-table-body{
    background-color: white;
    font-size: 1px;
    line-height: 12px;
    margin: 0px;
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
.index_msg_body{
  background-color: #DAEEF3;
}
</style>
