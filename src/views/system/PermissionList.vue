<template>
  <div>
    <a-row>
      <a-col>
        <a-button type="primary" @click="showAddModal">新建</a-button>
      </a-col>
    </a-row>

    <a-table :columns="columns" :row-key="record => record.id" :data-source="data" style="background-color:white">
      <!-- <a slot="displayName" slot-scope="displayName">{{ displayName }}</a> -->
      <span slot="permissions" slot-scope="permissions">
        <a-tag
          v-for="tag in permissions"
          :key="tag.permission"
        >
          <a-tooltip>
            <template slot="title">
              {{ tag.describe }}
            </template>
            {{ tag.permission }}
          </a-tooltip>
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showEditModal(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="showDelModal(record)">删除</a>
      </span>
    </a-table>

    <!-- 新建窗口 -->
    <a-modal destroyOnClose title="新建窗口" :visible="addVisible" @ok="addOk" @cancel="addCancel">
      <div style="display: flex; flex-direction: column;">
        <!-- <h1>我是新建</h1> -->
        <p> 角色名:<a-input v-model="addData.displayName" style="width: 100%;" placeholder="输入角色名" @change="onChange" @blur.native.capture="myFunction()"></a-input></p>
        <p> 英文:<a-input v-model="addData.name" style="width: 100%;" placeholder="输入角色名" @change="onChange" @blur.native.capture="myFunction()"></a-input></p>
        <p>描述:<a-textarea v-model="addData.description" placeholder="输入描述" allow-clear /></p>
        <a-table :data-source="addData.permissions" :columns="addColumns" :row-key="record => record.permission">
          <span slot="canCreate" slot-scope="text, record">
            <a-checkbox v-model="record.canCreate" :defaultChecked="record.canCreate" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canDelete" slot-scope="text, record">
            <a-checkbox v-model="record.canDelete" :defaultChecked="record.canDelete" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canView" slot-scope="text, record">
            <a-checkbox v-model="record.canView" :defaultChecked="record.canView" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canEdit" slot-scope="text, record">
            <a-checkbox v-model="record.canEdit" :defaultChecked="record.canEdit" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="all" slot-scope="text, record">
            <a @click="onCheckAll(record)">全选</a>
          </span>
        </a-table>
      </div>
    </a-modal>

    <!-- 编辑窗口 -->
    <a-modal
      destroyOnClose
      title="编辑窗口"
      :visible="editVisible"
      @ok="editOk"
      @cancel="editCancel">
      <div class="editModal">
        <p>角色名：<a-input placeholder="输入角色名" v-model="editData.displayName "></a-input></p>
        <p>描述：<a-textarea v-model="editData.description" placeholder="描述"/></p>
        <a-table :data-source="editTabData" :columns="editColumns" :row-key="record => record.permission">
          <span slot="canCreate" slot-scope="text, record">
            <a-checkbox v-model="record.canCreate" :defaultChecked="record.canCreate" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canDelete" slot-scope="text, record">
            <a-checkbox v-model="record.canDelete" :defaultChecked="record.canDelete" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canView" slot-scope="text, record">
            <a-checkbox v-model="record.canView" :defaultChecked="record.canView" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canEdit" slot-scope="text, record">
            <a-checkbox v-model="record.canEdit" :defaultChecked="record.canEdit" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="all" slot-scope="text, record">
            <a @click="onCheckAll(record)">全选</a>
          </span>
        </a-table>
      </div>
    </a-modal>
    <!-- 删除窗口 -->
    <a-modal
      class="delModal"
      title="删除窗口"
      :visible="delVisible"
      @ok="delOk"
      @cancel="delCancel">
      <div>
        <span>你确定要删除<span style="color:red">{{ this.delData.name }}</span>这个角色吗</span>
      </div>
    </a-modal>
  </div>
</template>
<script>

import { GetPermissionRoles, GetPermissionPermissions, EditPermission, AddPermission, DelPermission } from '@/api/permission'

export default {
  data () {
    return {
      haha: [],
      // 权限表数据
      data: [
        // {
        //   id: '1',
        //   displayName: '超级管理员',
        //   name: 'suproot',
        //   description: '我是超级管理员的描述',
        //   permissions: [
        //     { permission: '主页', describe: '我是介绍1', canView: true, canEdit: true, canCreate: true, canDelete: true },
        //     { permission: '其他页1', describe: '我是介绍2', canView: false, canEdit: true, canCreate: true, canDelete: false },
        //     { permission: '其他页2', describe: '我是介绍3', canView: true, canEdit: false, canCreate: false, canDelete: true },
        //     { permission: '其他页3', describe: '我是介绍4', canView: false, canEdit: false, canCreate: true, canDelete: true }
        //   ]
        // }
      ],
      // 权限表列属性
      columns: [
        {
          dataIndex: 'displayName',
          key: 'displayName',
          // slots: { title: 'customTitle' },
          title: '角色',
          scopedSlots: { customRender: 'displayName' }
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '权限',
          key: 'permissions',
          dataIndex: 'permissions',
          scopedSlots: { customRender: 'permissions' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      addVisible: false,
      editVisible: false,
      delVisible: false,
      editData: {
        displayName: '',
        description: '',
        permissions: []
      },
      // 初始化编辑权限表
      editPerTab: [
      ],
      editTabData: [
      ],
      editColumns: [
            {
              title: '',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: '增',
              key: 'canCreate',
              scopedSlots: { customRender: 'canCreate' }
            },
            {
              title: '删',
              key: 'canDelete',
              dataIndex: 'canDelete',
              scopedSlots: { customRender: 'canDelete' }
            },
            {
              title: '查',
              key: 'canView',
              dataIndex: 'canView',
              scopedSlots: { customRender: 'canView' }
            },
            {
              title: '改',
              key: 'canEdit',
              scopedSlots: { customRender: 'canEdit' }
            },
            {
              title: 'All',
              key: 'all',
              scopedSlots: { customRender: 'all' }
            }
      ],
      addData: {
          name: '',
          displayName: '',
          description: '',
          permissions: []
      },
      addColumns: [
        {
              title: '',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: '增',
              key: 'canCreate',
              scopedSlots: { customRender: 'canCreate' }
            },
            {
              title: '删',
              key: 'canDelete',
              dataIndex: 'canDelete',
              scopedSlots: { customRender: 'canDelete' }
            },
            {
              title: '查',
              key: 'canView',
              dataIndex: 'canView',
              scopedSlots: { customRender: 'canView' }
            },
            {
              title: '改',
              key: 'canEdit',
              scopedSlots: { customRender: 'canEdit' }
            },
            {
              title: 'All',
              key: 'all',
              scopedSlots: { customRender: 'all' }
            }
      ],
      delData: {
        name: ''
      }
    }
  },
  mounted () {
    // 获取表格初始数据
    GetPermissionRoles().then(res => {
      if (res.status === 200) {
        // 最终输出数据
        var PerRolesData = res.data
        // this.data = PerRolesData
        console.log('用户权限', PerRolesData)
        GetPermissionPermissions().then(res => {
          const editPerResTab = res.data
          // console.log('权限基础表', editPerResTab)
          const editPerTab = []
          const editPerTemTab = { canView: false, canEdit: false, canCreate: false, canDelete: false }
          for (var arr1 of editPerResTab) {
            editPerTab.push(Object.assign(arr1, editPerTemTab))
          }
          console.log('拼接好的表 ，所以用户从这开始', editPerTab)
          // const editPerTab2 = JSON.parse(JSON.stringify(editPerTab))
          for (var arr2 of PerRolesData) {
            const editPerTab2 = JSON.parse(JSON.stringify(editPerTab))
            for (var arr3 of arr2.permissions) {
              for (var arr4 of editPerTab2) {
                if (arr3.permission === arr4.permission) {
                  arr4.canCreate = arr3.canCreate
                  arr4.canDelete = arr3.canDelete
                  arr4.canEdit = arr3.canEdit
                  arr4.canView = arr3.canView
                }
              }
            }
            arr2.permissions = JSON.parse(JSON.stringify(editPerTab2))
            // console.log(arr2.name, JSON.parse(JSON.stringify(editPerTab2)))
          }
          this.data = JSON.parse(JSON.stringify(PerRolesData))
          this.haha = JSON.parse(JSON.stringify(editPerTab))
          // this.addTabData = JSON.parse(JSON.stringify(editPerTab))
          console.log('权限基础表arr4', this.haha)
          console.log('最终表arr2', PerRolesData)
        })
      }
    })
  },
  methods: {
    myFunction () {
      console.log('1')
    },
    onChange (e) {
      console.log('========')
    },
    // 全选
    onCheckAll (e) {
      if (e.canCreate && e.canDelete && e.canEdit && e.canView) {
        // console.log('全不选')
        e.canCreate = false
        e.canDelete = false
        e.canEdit = false
        e.canView = false
        // console.log('选择后', this.editTabData)
      } else {
        // console.log('全选')
        e.canCreate = true
        e.canDelete = true
        e.canEdit = true
        e.canView = true
        // console.log('选择后', this.editTabData)
      }
    },
    showEditModal (record) {
      console.log('传入修改的数据', record)
      this.editVisible = true
      this.editData = record
      this.editTabData = record.permissions
      // this.editData.name = record.name
      // this.editTabData = this.editPerTab
      // console.log('传入修改的数据', this.editData)
      // console.log('表格数据', this.editTabData)
      // console.log('表格数据', editData)
    },
    showDelModal (delData) {
      this.delVisible = true
      this.delData = delData
      console.log('删除的数据', delData)
    },
    showAddModal () {
      this.addVisible = true
      // this.addData.displayName = ''
      // this.addData.description = ''
      this.addData.permissions = JSON.parse(JSON.stringify(this.haha))
      console.log(this.addData)
    },
    addOk () {
      console.log(this.addData)
      const addData2 = JSON.parse(JSON.stringify(this.addData))
      AddPermission(addData2).then(res => {
        if (res.status === 200) {
          console.log('添加成功')
        }
      })
      this.addVisible = false
    },
    addCancel () {
      this.addVisible = false
    },
    editOk () {
      console.log('编辑接口进入,传入后端数据为', this.editData)
      EditPermission(this.editData).then(res => {
        if (res.status === 200) {
          console.log('编辑成功', res)
          this.$forceUpdate()
        }
      })
      console.log('点击确定修改', this.editData)
      this.editVisible = false
    },
    // 点击取消编辑，数据还原
    editCancel () {
      this.editVisible = false
    },
    delOk () {
      console.log('1', this.delData.name)
      const delData2 = this.delData.name
      DelPermission(delData2).then(res => {
        if (res.status === 200) {
          console.log('删除成功')
        }
      })
      this.delVisible = false
    },
    delCancel () {
      this.delVisible = false
    }
  },
  computed: {
  }
}
</script>

<style>
.editModal{
  /* text-align: center; */
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
}
.delModal{
  text-align: center;
}
</style>
