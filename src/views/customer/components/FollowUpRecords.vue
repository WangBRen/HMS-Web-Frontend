<template>
  <div>
    <a-table
      :columns="recordColumns"
      :data-source="recordData"
      :pagination="pagination"
      :rowKey="(record,index)=>{return index}">
      <span slot="HealthSpecialistRender" slot-scope="text,scope">
        <span v-if="scope.createdBy !== null">{{ scope.createdBy.nickname }}</span>
        <span v-else>-</span>
      </span>
      <span slot="level" slot-scope="text,scope">
        <!-- {{ scope.level }} -->
        <span v-if="scope.status!=='success'">-</span>
        <span v-else-if="scope.level===null">待判定</span>
        <span v-else>
          {{ scope.level.level }}级
        </span>
      </span>
      <span slot="result" slot-scope="text, record" rowkey="">
        <!-- <a-tag
          :color="scope.status==='success' ? 'geekblue' : scope.status==='pending' ? '#DEE1E6' : 'orange'">
          <span v-if="scope.status==='pending'">回收中</span>
          <span v-else-if="scope.status==='success'">已回收</span>
          <span v-else>超时</span>
        </a-tag> -->
        <a-tag v-if="record.status==='created'" color="#ccc">已创建</a-tag>
        <a-tag v-if="record.status==='pending'" color="#999">回收中</a-tag>
        <a-tag v-if="record.status==='success'" color="geekblue">已回收</a-tag>
        <a-tag v-if="record.status==='failure'" color="orange">超时</a-tag>
      </span>
      <span slot="receivedAt" slot-scope="text, scope">
        <span v-if="scope.status==='success'">{{ scope.receivedAt | moment }}</span>
        <span v-else> - </span>
      </span>
      <span slot="action" slot-scope="text, scope">
        <span v-if="scope.status!=='success'">
          <a @click="retransmission(text, scope)">重发</a> |
          <a @click="ViewFollowUpTable(text, scope)">查看随访表</a>
        </span>
        <a v-else-if="scope.level===null" @click="startLevel(text, scope)">分级</a>
        <a v-else @click="ViewFollowUpTable(text, scope)">查看随访表</a>
      </span>
    </a-table>
    <a-button v-if="createButtonVisible" class="follow-start-button" type="primary" @click="showFollowUpSheet">开始随访</a-button>
    <SeeFollowUpSheet
      v-if="currentSelectedForm.visible"
      :formId="currentSelectedForm.id"
      :customerId="customerId"
      :diseaseId="diseaseId"
      :visible="currentSelectedForm.visible"
      @onclose="closeFollowUpFormModal"
      @grandFatherMethod="handleSuccessLevel"/>
    <FollowUpFormSend
      v-if="sendModelVisible"
      @onMessageSendSuccess="handleOnMessageSendSuccess"
      :sendVisible="sendModelVisible"
      :customerId="customerId"
      :formId="formId"
      @onclose="closeFollowSend"/>
  </div>
</template>

<script>
import moment from 'moment'
import { getFollowRecords as apiFollowUpRecords } from '@/api/followUpForm'
import SeeFollowUpSheet from './SeeFollowUpSheet.vue'
import FollowUpFormSend from './FollowUpFormSend.vue'
export default {
  name: 'FollowUpRecords',
  components: {
    SeeFollowUpSheet,
    FollowUpFormSend
  },
  props: {
    diseaseId: {
      type: Number,
      default: 0
    },
    customerId: {
      type: Number,
      default: 0
    },
    diseaseObj: {
      type: Object,
      default: function () {
        return {}
        }
    },
    createButtonVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      recordColumns: [
        {
          title: '发送日期',
          dataIndex: 'sendAt',
          key: 'a',
          align: 'center',
          customRender: (text, record, index) => {
            return record.sendAt ? moment(record.sendAt).format('YYYY-MM-DD HH:mm:ss') : '-'
          }
        },
        {
          title: '创建人',
          dataIndex: 'createdBy',
          key: 'b',
          align: 'center',
          scopedSlots: { customRender: 'HealthSpecialistRender' }
        },
        {
          title: '判定级别',
          dataIndex: 'level',
          key: 'c',
          align: 'center',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '回收结果',
          dataIndex: 'result',
          key: 'd',
          align: 'center',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '回收日期',
          dataIndex: 'receivedAt',
          key: 'e',
          align: 'center',
          scopedSlots: { customRender: 'receivedAt' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'f',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      recordData: [],
      pages: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ['5', '10', '20'], // 每页数量选项
        showTotal: total => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      currentSelectedForm: {
        id: -1,
        visible: false
      },
      sendModelVisible: false,
      formId: null
    }
  },
  // filters: {
  //   fliterStatus (status) {
  //     switch (status) {
  //       case 'created': return '已创建'
  //       case 'pending': return '回收中'
  //       case 'success': return '已回收'
  //       case 'failure': return '回收失败（超时）'
  //     }
  //   }
  // },
  created () {
    // this.$setPageDataLoader(this.onSearch)
    this.onSearch()
    // this.$setPageDataLoader(() => {
    //   const pages = {
    //     page: this.pagination.current,
    //     size: this.pagination.pageSize
    //   }
    //   apiFollowUpRecords(this.customerId, this.diseaseId, pages).then(res => {
    //     if (res.status === 200) {
    //       this.recordData = res.data.content || []
    //       this.pagination.total = res.data.totalElements
    //     } else {
    //       this.recordData = []
    //     }
    //   })
    // })
    // this.$reload()
  },
  methods: {
    onPageChange (page, _pageSize) {
      this.pagination.current = page
      this.onSearch()
      // this.$reload()
    },
    onSizeChange (_current, pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.onSearch()
        // this.$reload()
    },
    async onSearch () {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      apiFollowUpRecords(this.customerId, this.diseaseId, pages).then(res => {
        if (res.status === 200) {
          this.recordData = res.data.content || []
          this.pagination.total = res.data.totalElements
        } else {
          this.recordData = []
        }
      })
    },
    // 重发随访单
    retransmission (_text, formData) {
      this.formId = formData.id
      this.sendModelVisible = true
      // this.$refs.Visit.openVisit(formData)
      this.onSearch()
    },
    // 随访单分级
    startLevel (text, grecord) {
      this.openFollowUpFormModal(grecord.id)
    },
    // 查看随访单
    ViewFollowUpTable (text, grecord) {
      // this.$refs.SeeFollowUpSheetRef.openFollowUpSheet(grecord)
      // this.currentSelectedForm.id = grecord.id
      // this.currentSelectedForm.visible = true
      // this.currentSelectedForm = {
      //   id: grecord.id,
      //   visible: true
      // }
      this.openFollowUpFormModal(grecord.id)
    },
    openFollowUpFormModal (formId) {
      this.currentSelectedForm.id = formId
      this.currentSelectedForm.visible = true
    },
    closeFollowUpFormModal () {
      this.currentSelectedForm.id = -1
      this.currentSelectedForm.visible = false
    },
    closeFollowSend () {
      this.sendModelVisible = false
    },
        // 点击创建随访单
    showFollowUpSheet () {
      // bus.$emit('sendChroName', this.diseaseObj, this.totalChronicDiseases)
      this.$emit('addNewDisease', this.diseaseId)
    },
    handleOnMessageSendSuccess (data) {
      this.$message.success('发送成功')
      this.sendModelVisible = false
      this.onSearch()
      // this.$reload()
    },
    handleSuccessLevel () {
      this.currentSelectedForm.visible = false
      this.onSearch()
      // this.$reload()
    }
  }
}
</script>

<style>
.follow-start-button {
  width: 260px;
  top: -36px;
  z-index: 999;
}
</style>
