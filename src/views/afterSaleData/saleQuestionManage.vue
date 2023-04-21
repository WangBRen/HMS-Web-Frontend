<template>
  <div>
    <a-card>
      <a-button style="margin-right: 10px;" type="primary" @click="openModal('add', 'first')">新建问题标题</a-button>
      <a-button style="margin-right: 10px;" @click="openModal('edit', 'first')">编辑【{{ getFirstName() }}】名称</a-button>
      <a-button style="float: right;" type="primary" @click="editQusetion('', 'add')">【{{ getFirstName() }}】新建问题</a-button>
      <a-popconfirm title="确定删除？" @confirm="delFirst()">
        <a-button>删除【{{ getFirstName() }}】</a-button>
      </a-popconfirm>
      <a-tabs v-model="firstTabKey">
        <a-tab-pane v-for="tab in questData" :key="tab.id" :tab="tab.name">
          <!-- <a-button style="margin-right: 10px;" type="primary" @click="openModal('add', 'second')">新建异常现象二级</a-button>
          <a-button style="margin-right: 10px;" @click="openModal('edit', 'second')">编辑【{{ getSecondName() }}】名称</a-button>
          <a-popconfirm title="确定删除？" @confirm="delSecond()">
            <a-button style="margin-right: 10px;">删除【{{ getSecondName() }}】</a-button>
          </a-popconfirm> -->
          <!-- <a-tabs style="padding: 10px;" v-model="secondTabKey"> -->
          <!-- <a-tab-pane v-for="secondTab in tab.children" :key="secondTab.id" :tab="secondTab.name"> -->
          <a-table
            :columns="columns"
            :data-source="tab.guides"
            :pagination="pagination"
            row-key="id"
          >
            <span slot="locationWay" slot-scope="text">
              <a-tooltip :overlayStyle="{maxWidth:'300px'}">
                <template slot="title">
                  <span>{{ text }}</span>
                </template>
                <span class="locationWay">{{ text }}</span>
              </a-tooltip>
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="editQusetion(record, 'edit')">编辑</a> |
              <a-popconfirm title="确定删除？" @confirm="delQuestion(record)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>
          <!-- </a-tab-pane> -->
          <!-- </a-tabs> -->
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal
      :visible="nameVisible"
      v-if="nameVisible"
      :title="transferData.index === 'edit' ? '编辑' : '新建'"
      @ok="changeName"
      @cancel="handleCancelName"
      :width="700"
    >
      <a-row>
        <a-col v-if="transferData.type === 'first'" :span="4" style="text-align: right;line-height: 30px;">
          异常现象:&nbsp;
        </a-col>
        <a-col v-else :span="4" style="text-align: right;line-height: 30px;">
          二级异常现象:&nbsp;
        </a-col>
        <a-col :span="20">
          <a-input v-model="transferData.name" placeholder="输入异常现象" ></a-input>
        </a-col>
      </a-row>
    </a-modal>
    <saleQuestionEdit
      :editVisible="editVisible"
      :editData="editData"
      :mode="mode"
      @closeEditModal="closeEditModal"
    />
  </div>
</template>
<script>
import saleQuestionEdit from './saleQuestionEdit.vue'
import { getGuide as apiGetGuide, addGuideLevel as apiAddGuideLevel, editGuideLevel as apiEditGuideLevel, delGuide as apiDelGuide, delGuideLevel as apiDelGuideLevel } from '@/api/afterSale'
export default {
  components: {
    saleQuestionEdit
  },
  data () {
    return {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: total => `共 ${total} 个`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      questData: [
        {
          id: 1,
          name: '漏水1',
          children: [
            {
              id: 2,
              name: '漏水11',
              guides: [
                {
                  id: 3,
                  name: '漏水111',
                  locationWay: '定位方法',
                  solution: '解决方案',
                  remark: '备注',
                  description: '描述',
                  files: [
                    {
                      url: 'string'
                    }
                  ]
                }
              ]
            },
            {
              id: 7,
              name: '漏水12',
              guides: [
                {
                  id: 8,
                  name: '漏水112',
                  locationWay: '定位方法',
                  solution: '解决方案',
                  remark: '备注',
                  description: '描述',
                  files: [
                    {
                      url: 'string'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 4,
          name: '漏水2',
          children: [
            {
              id: 5,
              name: '漏水21',
              guides: [
                {
                  id: 6,
                  name: '漏水211',
                  locationWay: '定位方法',
                  solution: '解决方案',
                  remark: '备注',
                  description: '描述',
                  files: [
                    {
                      url: 'string'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      columns: [
        {
          title: '问题详细',
          dataIndex: 'name',
          align: 'center',
          width: '200px'
        },
        {
          title: '定位方法',
          dataIndex: 'locationWay',
          align: 'center',
          scopedSlots: { customRender: 'locationWay' },
          width: '25%'
        },
        {
          title: '解决方法',
          dataIndex: 'solution',
          align: 'center',
          width: '25%'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: '100px'
        }
      ],
      firstTabKey: null,
      secondTabKey: null,
      nameVisible: false,
      editVisible: false,
      editData: null,
      mode: null,
      transferData: {
        name: null,
        index: null, // add,edit
        type: null // first,second
      }
    }
  },
  methods: {
    getFirstName () {
      const project = (this.questData || []).find(tab => tab.id === this.firstTabKey)
      if (project) {
        return project.name
      } else {
        return ''
      }
    },
    getSecondName () {
      let testData = []
      this.questData.filter(item => {
        if (item.id === this.firstTabKey) {
          testData = item.children
        }
      })
      const project = (testData || []).find(tab => tab.id === this.secondTabKey)
      if (project) {
        return project.name
      } else {
        return ''
      }
    },
    delQuestion (data) {
      // console.log(data)
      const id = data.id
      apiDelGuide(id).then(res => {
        if (res.status === 200) {
          this.$message.success('删除成功')
          this.moveGetGuide()
        } else {
          this.$message.error(res.message)
        }
      })
      // console.log(id)
    },
    editQusetion (data, index) {
      switch (index) {
        case 'add':
          this.mode = 'add'
          this.editData = {
            type_id: this.firstTabKey,
            segment_id: null,
            name: '',
            locationWay: '',
            solution: '',
            remark: '',
            description: '',
            files: []
          }
          this.editVisible = true
          break
        case 'edit':
          this.mode = 'edit'
          if (data.files === null) {
            data.files = []
          }
          this.editData = JSON.parse(JSON.stringify(data))
          this.editVisible = true
          break
      }
    },
    closeEditModal () {
      this.editVisible = false
    },
    openModal (index, type) {
      switch (index) {
        case 'add':
          this.transferData.name = ''
          this.transferData.index = 'add'
          this.transferData.type = type
          this.nameVisible = true
          break
        case 'edit':
          if (type === 'first') {
            this.transferData.name = this.getFirstName()
          } else {
            this.transferData.name = this.getSecondName()
          }
          this.transferData.index = 'edit'
          this.transferData.type = type
          this.nameVisible = true
          break
      }
    },
    // 新建 or 编辑
    changeName () {
      switch (this.transferData.index) {
        case 'add':
          if (this.transferData.type === 'first') {
            const apiData = { name: this.transferData.name }
            apiAddGuideLevel(apiData).then(res => {
              if (res.status === 201) {
                this.moveGetGuide()
                this.nameVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            const apiData = { name: this.transferData.name, parentId: this.firstTabKey }
            apiAddGuideLevel(apiData).then(res => {
              if (res.status === 201) {
                this.moveGetGuide()
                this.nameVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          }
          break
        case 'edit':
          if (this.transferData.type === 'first') {
            const apiData = { name: this.transferData.name }
            const id = this.firstTabKey
            apiEditGuideLevel(id, apiData).then(res => {
              if (res.status === 200) {
                this.moveGetGuide()
                this.nameVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            const apiData = { name: this.transferData.name, parentId: this.firstTabKey }
            const id = this.secondTabKey
            apiEditGuideLevel(id, apiData).then(res => {
              if (res.status === 200) {
                this.moveGetGuide()
                this.nameVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          }
          break
      }
    },
    handleCancelName () {
      this.nameVisible = false
    },
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSize = pageSize
      // this.getChronic()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      // this.getChronic()
    },
    // 归位
    getGuide () {
      apiGetGuide().then(res => {
        if (res.status === 200) {
          console.log(res.data)
          this.questData = res.data
          if (this.questData.length !== 0) {
            this.firstTabKey = this.questData[0].id
            if (this.questData[0].children.length !== 0) {
              this.secondTabKey = this.questData[0].children[0].id
            }
          }
        }
      })
    },
    // 不归位
    moveGetGuide () {
      apiGetGuide().then(res => {
        if (res.status === 200) {
          // console.log(res.data)
          this.questData = res.data
        }
      })
    },
    delFirst () {
      for (let i = 0; i < this.questData.length; i++) {
        if (this.questData[i].id === this.firstTabKey) {
          if (this.questData[i].children.length === 0) {
            this.$message.info('可以删除')
            apiDelGuideLevel(this.firstTabKey).then(res => {
              if (res.status === 200) {
                this.$message.success('删除成功')
                this.getGuide()
              }
            })
          } else {
            this.$message.info('无法删除，该现象下数据不为空')
          }
        }
      }
    },
    delSecond () {
      let test = 0
      for (let i = 0; i < this.questData.length; i++) {
        if (this.questData[i].id === this.firstTabKey) {
          for (let j = 0; j < this.questData[i].children.length; j++) {
            if (this.questData[i].children[j].id === this.secondTabKey) {
              test = this.questData[i].children[j].guides.length
              if (test) {
                this.$message.info('无法删除，该现象下数据不为空')
              } else {
                this.$message.info('可以删除')
                apiDelGuideLevel(this.secondTabKey).then(res => {
                  if (res.status === 200) {
                    this.$message.success('删除成功')
                    this.moveGetGuide()
                  }
                })
              }
            }
          }
        }
      }
    }
  },
  created () {
  },
  mounted () {
    this.getGuide()
  },
  watch: {
    firstTabKey (newData, oldData) {
      let testData = []
      this.questData.filter(item => {
        if (item.id === newData) {
          testData = item.children
          if (testData.length !== 0) {
            this.secondTabKey = testData[0].id
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.locationWay{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
